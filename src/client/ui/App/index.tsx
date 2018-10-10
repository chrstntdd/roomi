import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { connect } from 'unistore/react';

import { Router, Link } from 'packages/Router';
import Page from '@/ui/components/Page';

import { actions } from '@/state/store';
import { throttle } from '@/util';

import './App.scss';

function Loading() {
  return <div>Loading...</div>;
}

const shared = { loading: Loading };

const Home = Loadable({ loader: () => import('@/ui/pages/Home'), ...shared });
const Dashboard = Loadable({ loader: () => import('@/ui/pages/Dashboard'), ...shared });
const NotFound = Loadable({ loader: () => import('@/ui/pages/NotFound'), ...shared });
const SignIn = Loadable({ loader: () => import('@/ui/pages/Auth/SignIn'), ...shared });
const SignUp = Loadable({ loader: () => import('@/ui/pages/Auth/SignUp'), ...shared });

// const TransitionRouter = props => (
//   <Location>
//     {({ location }) => (
//       <Transition
//         keys={location.pathname}
//         from={{ opacity: 0, transform: 'scale3d(0.5,0.5,0.5)' }}
//         enter={{ opacity: 1, transform: 'scale3d(1,1,1)' }}
//         leave={{ opacity: 0, transform: 'scale3d(0.5,0.5,0.5)' }}
//       >
//         {styles => (
//           <Router location={location} style={styles}>
//             {props.children}
//           </Router>
//         )}
//       </Transition>
//     )}
//   </Location>
// );

class Nav extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    navExpanded: false
  };

  render() {
    return (
      <nav className="siteNav">
        <Link className="navLinks" to="/">
          Home
        </Link>
        <Link className="navLinks" to="/dashboard">
          Dashboard
        </Link>
        <Link className="navLinks" to="/unknown">
          Unknown
        </Link>
        <Link className="navLinks" to="/sign-in">
          sign-in
        </Link>
        <Link className="navLinks" to="/sign-up">
          sign-up
        </Link>
      </nav>
    );
  }
}

interface PApp {
  setWindowWidth: ({ windowWidth: number }) => void;
}

interface SApp {}
/**
 * @description CURRENT CODE SPLITTING IMPLEMENTATION SPLITS
 * AT THE TOP LEVEL, BUT IT CAN BE DONE LOWER DOWN IN THE TREE
 * AS WELL OR ON AN INDIVIDUAL COMPONENT LEVEL.
 */
class App extends Component<PApp, SApp> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.addEventListener(
      'resize',
      throttle(200, () => {
        this.props.setWindowWidth({
          windowWidth: document.documentElement.clientWidth
        });
      })
    );
  }

  componentWillUnmount() {
    // @ts-ignore
    window.removeEventListener('resize', throttle);
  }

  render() {
    return (
      <Page>
        <Nav />
        <Router>
          <Home path="/" />
          <Dashboard path="/dashboard" />
          <SignIn path="/sign-in" />
          <SignUp path="/sign-up" />
          <NotFound default />
        </Router>
      </Page>
    );
  }
}

export default connect(
  '',
  actions
  // @ts-ignore
)(App);
