import React, { useRef, useContext, useMemo, useState, useEffect, useRef } from 'react';
import invariant from 'invariant';
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
  stripSlashes,
  validateRedirect
} from './helpers';
import { createHistory, createMemorySource, globalHistory, navigate } from './history';

// Sets baseuri and basepath for nested routers and links
let BaseContext = createNamedContext('Base', { baseuri: '/', basepath: '/' });

/**
 * @description Main Router component that connects the matched Component to
 * the contexts.
 */
let Router = props => {
  console.log('new props: ', props);
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

  // let match = useMemo(() => pick(routes, location.pathname));
  // console.log('called');

  let match = useMemo(() => pick(routes, location.pathname), [routes, location.pathname]);

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

function FocusHandlerImpl(props: PFocusHandlerImpl) {
  const [state, setState] = useState({ shouldFocus: null });
  const compEl = useRef(null);

  // cDM && cWU
  useEffect(() => {
    focus();
    focusHandlerCount++;
    setState({ shouldFocus: true, ...props });

    // cleanup
    return () => {
      focusHandlerCount--;
      if (focusHandlerCount === 0) {
        initialRender = true;
      }
    };
  }, []);

  // cDU
  useEffect(
    () => {
      if (state.shouldFocus) {
        focus();
      }
    },
    [props.location]
  );

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   let initial = !prevState.uri;

  //   if (initial) {
  //     return {
  //       shouldFocus: true,
  //       ...nextProps
  //     };
  //   } else {
  //     let uriHasChanged = nextProps.uri !== prevState.uri;
  //     let navigatedUpToMe =
  //       prevState.location.pathname !== nextProps.location.pathname &&
  //       nextProps.location.pathname === nextProps.uri;

  //     return {
  //       shouldFocus: uriHasChanged || navigatedUpToMe,
  //       ...nextProps
  //     };
  //   }
  // }

  // componentDidMount() {
  //   focusHandlerCount++;
  //   this.focus();
  // }

  // componentWillUnmount() {
  //   focusHandlerCount--;
  //   focusHandlerCount === 0 && (initialRender = true);
  // }

  // componentDidUpdate(prevProps) {
  //   prevProps.location !== this.props.location && this.state.shouldFocus && this.focus();
  // }

  function focus() {
    if (process.env.NODE_ENV === 'test') {
      // getting cannot read property focus of null in the tests
      // and that bit of global `initialRender` state causes problems
      // should probably figure it out!
      return;
    }

    let { requestFocus } = props;

    requestFocus
      ? requestFocus(compEl.current)
      : initialRender
        ? (initialRender = false)
        : !compEl.current.contains(document.activeElement) && compEl.current.focus();
  }

  let internalRequestFocus = node => {
    !state.shouldFocus && node.focus();
  };

  let {
    children,
    component: Comp = 'div',
    location,
    requestFocus,
    role = 'group',
    style,
    uri,
    ...domProps
  } = props;

  return (
    <Comp
      ref={compEl}
      role={role}
      style={{ outline: 'none', ...style }}
      tabIndex="-1"
      {...domProps}
    >
      <FocusContext.Provider value={internalRequestFocus}>{props.children}</FocusContext.Provider>
    </Comp>
  );
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
  // console.log('in Location HOC');
  let locationContext = useContext(LocationContext);

  return locationContext ? (
    children(locationContext)
  ) : (
    <LocationProvider>{children}</LocationProvider>
  );
};

interface PLocationProvider {
  history?: any;
  children?: (any) => React.ReactNode;
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

LocationProvider.defaultProps = {
  history: globalHistory
};

function LocationProvider(props: PLocationProvider) {
  const [locationState, setLocationState] = useState({
    context: {
      navigate: props.history.navigate,
      location: props.history.location
    },
    refs: { unlisten: null }
  });

  let unmounted: boolean | null = null;

  useEffect(() => {
    locationState.refs.unlisten = props.history.listen(() => {
      Promise.resolve().then(() => {
        defer(() => {
          if (!unmounted) {
            setLocationState({ context: getContext() });
          }
        });
      });
    });

    return () => {
      unmounted = true;
      locationState.refs.unlisten();
    };
  }, []);

  // componentDidMount() {
  //   this.state.refs.unlisten = this.props.history.listen(() => {
  //     Promise.resolve().then(() => {
  //       defer(() => {
  //         if (!this.unmounted) {
  //           this.setState(() => ({ context: this.getContext() }));
  //         }
  //       });
  //     });
  //   });
  // }

  // componentDidCatch(error, info) {
  //   if (isRedirect(error)) {
  //     this.props.history.navigate(error.uri, { replace: true });
  //   } else {
  //     throw error;
  //   }
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.context.location !== this.state.context.location) {
  //     console.log('in CDU');
  //     this.props.history._onTransitionComplete();
  //   }
  // }

  // componentWillUnmount() {
  //   this.unmounted = true;
  //   this.state.refs.unlisten();
  // }

  function getContext() {
    let {
      history: { navigate, location }
    } = props;

    return { navigate, location };
  }

  return (
    <LocationContext.Provider value={locationState.context}>
      {typeof props.children === 'function'
        ? props.children(locationState.context)
        : props.children || null}
    </LocationContext.Provider>
  );
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
  let { baseuri } = useContext(BaseContext);
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
  if (!element) return null;

  if (process.env.NODE_ENV !== 'production') {
    invariant(
      element.props.path || element.props.default || element.type === Redirect,
      `<Router>: Children of <Router> must have a \`path\` or \`default\` prop, or be a \`<Redirect>\`. None found on element type \`${
        element.type
      }\``
    );

    invariant(
      !(element.type === Redirect && (!element.props.from || !element.props.to)),
      `<Redirect from="${element.props.from} to="${
        element.props.to
      }"/> requires both "from" and "to" props when inside a <Router>.`
    );

    invariant(
      !(element.type === Redirect && !validateRedirect(element.props.from, element.props.to)),
      `<Redirect from="${element.props.from} to="${
        element.props.to
      }"/> has mismatched dynamic segments, ensure both paths have the exact same dynamic segments.`
    );
  }

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
