import React, { Component, lazy, unstable_Suspense as Suspense } from 'react';

import { Router, Link } from 'packages/Router';
import Page from '@/ui/components/Page';

import './App.scss';

function Loading() {
  return <div>Loading...</div>;
}

const Home = lazy(() => import('@/ui/pages/Home'));
const Dashboard = lazy(() => import('@/ui/pages/Dashboard'));
const NotFound = lazy(() => import('@/ui/pages/NotFound'));
const SignIn = lazy(() => import('@/ui/pages/Auth/SignIn'));
const SignUp = lazy(() => import('@/ui/pages/Auth/SignUp'));

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

interface PApp {}

interface SApp {}

class App extends Component<PApp, SApp> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Suspense maxDuration={2000} fallback={<Loading />}>
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
      </Suspense>
    );
  }
}

export default App;
