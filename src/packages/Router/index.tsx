import React, { useRef, useContext, useMemo } from 'react';
import { unstable_scheduleCallback as defer } from 'scheduler';

/* CLONE/FORK OF https://github.com/reach/router */

import {
  createNamedContext,
  insertParams,
  match,
  pick,
  resolve,
  Route,
  shouldNavigate,
  startsWith,
  stripSlashes
} from './helpers';
import { createHistory, createMemorySource, globalHistory, navigate } from './history';

// Sets baseuri and basepath for nested routers and links
let BaseContext = createNamedContext('Base', { baseuri: '/', basepath: '/' });

/**
 * @description Main Router component that connects the matched Component to
 * the contexts.
 */
let Router = props => {
  let baseContext = useContext(BaseContext);

  return (
    <Location>
      {locationContext => <RouterImpl {...baseContext} {...locationContext} {...props} />}
    </Location>
  );
};

interface PRouterImpl {
  basepath: any;
  baseuri: any;
  component: any;
  location: any;
  navigate: any;
  primary?: boolean;
}

let RouterImpl = (props: PRouterImpl) => {
  let {
    basepath,
    baseuri,
    children,
    component = 'div',
    location,
    navigate,
    primary = true,
    ...domProps
  } = props;

  let routes = React.Children.map(children, createRoute(basepath));

  let match = useMemo(() => pick(routes, location.pathname));

  if (match) {
    let {
      params,
      uri,
      route,
      route: { value: element }
    } = match;

    // remove the /* from the end for child routes relative paths
    basepath = route.default ? basepath : route.path.replace(/\*$/, '');

    let props = {
      ...params,
      uri,
      location,
      navigate: (to, options) => navigate(resolve(to, uri), options)
    };

    let clone = React.cloneElement(
      element,
      props,
      element.props.children ? (
        <Router primary={primary}>{element.props.children}</Router>
      ) : (
        undefined
      )
    );

    /* using 'div' for < 16.3 support */
    let FocusWrapper = primary ? FocusHandler : component;
    /* don't pass any props to 'div' */
    let wrapperProps = primary ? { uri, location, component, ...domProps } : domProps;

    return (
      <BaseContext.Provider value={{ baseuri: uri, basepath }}>
        <FocusWrapper {...wrapperProps}>{clone}</FocusWrapper>
      </BaseContext.Provider>
    );
  } else {
    return null;
  }
};

let FocusContext = createNamedContext('Focus');

let FocusHandler = ({ uri, location, component, ...domProps }) => {
  let requestFocus = useContext(FocusContext);

  return (
    <FocusHandlerImpl
      {...domProps}
      component={component}
      requestFocus={requestFocus}
      uri={uri}
      location={location}
    />
  );
};

interface PFocusHandlerImpl {
  component: any;
  requestFocus: (any) => void;
  uri: any;
  location: any;
  role?: string;
  style?: object;
}
interface SFocusHandlerImpl {
  shouldFocus?: boolean | null;
}
// don't focus on initial render
let initialRender = true;
let focusHandlerCount = 0;

class FocusHandlerImpl extends React.Component<PFocusHandlerImpl, SFocusHandlerImpl> {
  constructor(props) {
    super(props);
  }

  state = {
    shouldFocus: null
  };

  node = null;

  static getDerivedStateFromProps(nextProps, prevState) {
    let initial = !prevState.uri;

    if (initial) {
      return {
        shouldFocus: true,
        ...nextProps
      };
    } else {
      let uriHasChanged = nextProps.uri !== prevState.uri;
      let navigatedUpToMe =
        prevState.location.pathname !== nextProps.location.pathname &&
        nextProps.location.pathname === nextProps.uri;

      return {
        shouldFocus: uriHasChanged || navigatedUpToMe,
        ...nextProps
      };
    }
  }

  componentDidMount() {
    focusHandlerCount++;
    this.focus();
  }

  componentWillUnmount() {
    focusHandlerCount--;
    focusHandlerCount === 0 && (initialRender = true);
  }

  componentDidUpdate(prevProps) {
    prevProps.location !== this.props.location && this.state.shouldFocus && this.focus();
  }

  focus() {
    if (process.env.NODE_ENV === 'test') {
      // getting cannot read property focus of null in the tests
      // and that bit of global `initialRender` state causes problems
      // should probably figure it out!
      return;
    }

    let { requestFocus } = this.props;

    requestFocus
      ? requestFocus(this.node)
      : initialRender
        ? (initialRender = false)
        : !this.node.contains(document.activeElement) && this.node.focus();
  }

  requestFocus = node => {
    !this.state.shouldFocus && node.focus();
  };

  render() {
    let {
      children,
      component: Comp = 'div',
      location,
      requestFocus,
      role = 'group',
      style,
      uri,
      ...domProps
    } = this.props;

    return (
      <Comp
        ref={n => (this.node = n)}
        role={role}
        style={{ outline: 'none', ...style }}
        tabIndex="-1"
        {...domProps}
      >
        <FocusContext.Provider value={this.requestFocus}>
          {this.props.children}
        </FocusContext.Provider>
      </Comp>
    );
  }
}

let Match = ({ path, children }) => {
  let { baseuri } = useContext(BaseContext);

  return (
    <Location>
      {({ navigate, location }) => {
        let resolvedPath = resolve(path, baseuri);
        let result = match(resolvedPath, location.pathname);

        return children({
          navigate,
          location,
          match: result
            ? {
                ...result.params,
                uri: result.uri,
                path
              }
            : null
        });
      }}
    </Location>
  );
};

/**
 * Location START
 */

// Location Context/Provider
let LocationContext = createNamedContext('Location');

// sets up a listener if there isn't one already so apps don't need to be
// wrapped in some top level provider
let Location = ({ children }) => {
  let locationContext = useContext(LocationContext);

  return locationContext ? (
    children(locationContext)
  ) : (
    <LocationProvider>{children}</LocationProvider>
  );
};

interface PLocationProvider {
  history?: any;
  children: (any) => React.ReactNode;
}
interface SLocationProvider {
  context: {
    navigate: any;
    location: any;
  };
  refs: {
    unlisten: any;
  };
}

class LocationProvider extends React.Component<PLocationProvider, SLocationProvider> {
  constructor(props) {
    super(props);
  }

  public static defaultProps = {
    history: globalHistory
  };

  state = {
    context: this.getContext(),
    refs: { unlisten: null }
  };

  unmounted: boolean | null = null;

  componentDidMount() {
    this.state.refs.unlisten = this.props.history.listen(() => {
      Promise.resolve().then(() => {
        defer(() => {
          if (!this.unmounted) {
            this.setState(() => ({ context: this.getContext() }));
          }
        });
      });
    });
  }

  componentDidCatch(error, info) {
    if (isRedirect(error)) {
      this.props.history.navigate(error.uri, { replace: true });
    } else {
      throw error;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.context.location !== this.state.context.location) {
      this.props.history._onTransitionComplete();
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.state.refs.unlisten();
  }

  getContext() {
    let {
      props: {
        history: { navigate, location }
      }
    } = this;

    return { navigate, location };
  }

  render() {
    let isChildFn = typeof this.props.children === 'function';

    return (
      <LocationContext.Provider value={this.state.context}>
        {isChildFn ? this.props.children(this.state.context) : this.props.children || null}
      </LocationContext.Provider>
    );
  }
}

/**
 *
 * @description When you render a <Redirect/> a redirect request is thrown,
 * preventing react from rendering the whole tree when we don’t want to do
 * that work anyway.
 *
 * To enable SSR, wrap the top level <App /> component with this component
 * and pass it the url that exists on the request object of whichever node
 * framework is being used.
 */
let ServerLocation = ({ url, children }) => (
  <LocationContext.Provider
    value={{
      location: { pathname: url },
      navigate: () => {
        throw new Error("You can't call navigate on the server.");
      }
    }}
  >
    {children}
  </LocationContext.Provider>
);

/**
 * Location END ////////////////////////////////////////////////
 */

/**
 * Redirect START ///////////////////////////////////////////////
 */

interface IRedirectRequest {
  uri: string;
}

function RedirectRequest(this: IRedirectRequest, uri: string) {
  this.uri = uri;
}

let isRedirect = o => o instanceof RedirectRequest;

let redirectTo = to => {
  throw new RedirectRequest(to);
};

interface PRedirectImpl {
  from: string;
  navigate: (toPath: string, state: { replace: boolean; state: object }) => any;
  noThrow: boolean;
  replace: boolean;
  state: any;
  to: string;
}

let RedirectImpl = (props: PRedirectImpl) => {
  let { navigate, to, from, replace, state, noThrow, ...restProps } = props;
  if (!noThrow) redirectTo(insertParams(to, restProps));

  return null;
};

let Redirect = props => {
  let locationContext = useContext(LocationContext);

  return <RedirectImpl {...locationContext} {...props} />;
};

interface LinkPropGetter {
  isCurrent: boolean;
  isPartiallyCurrent: boolean;
  href: string;
  location: any;
}

interface LinkProps {
  to: string;
  innerRef?: any;
  state?: any;
  replace?: () => any;
  getProps?: (x: LinkPropGetter) => any;
}

let Link: React.ComponentType<LinkProps & React.HTMLProps<HTMLAnchorElement>> = props => {
  let { basepath, baseuri } = useContext(BaseContext);
  let linkRef = useRef();

  return (
    <Location>
      {({ location, navigate }) => {
        let { to, state, replace, getProps = () => {}, ...anchorProps } = props;
        let href = resolve(to, baseuri);
        let isCurrent = location.pathname === href;
        let isPartiallyCurrent = startsWith(location.pathname, href);

        return (
          <a
            ref={linkRef}
            aria-current={isCurrent ? 'page' : undefined}
            {...anchorProps}
            {...getProps({ isCurrent, isPartiallyCurrent, href, location })}
            href={href}
            onClick={event => {
              if (anchorProps.onClick) anchorProps.onClick(event);
              if (shouldNavigate(event)) {
                event.preventDefault();
                navigate(href, { state, replace });
              }
            }}
          />
        );
      }}
    </Location>
  );
};

/**
 * Link END //////////////////////////////////////////////////////////////////
 */

/**
 * Extras
 */

let createRoute = basepath => (element): Route => {
  if (element.props.default) {
    return { value: element, default: true };
  }

  let elementPath = element.type === Redirect ? element.props.from : element.props.path;

  let path =
    elementPath === '/' ? basepath : `${stripSlashes(basepath)}/${stripSlashes(elementPath)}`;

  return {
    value: element,
    default: element.props.default,
    path: element.props.children ? `${stripSlashes(path)}/*` : path
  };
};

export {
  Location,
  LocationProvider,
  Match,
  Router,
  ServerLocation,
  createHistory,
  createMemorySource,
  navigate,
  BaseContext,
  Redirect,
  Link,
  globalHistory
};
