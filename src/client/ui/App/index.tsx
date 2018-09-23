import React, { Component } from 'react';
import { Transition } from 'react-spring';

import { Router, Link, Location } from 'packages/Router';
import Page from '@/ui/components/Page';

import generateLazyComponent from '@/ui/components/LazyComponent';

import './App.scss';

const Home = generateLazyComponent(() => import('@/ui/pages/Home'));
const Dashboard = generateLazyComponent(() => import('@/ui/pages/Dashboard'));
const NotFound = generateLazyComponent(() => import('@/ui/pages/NotFound'));
const SignIn = generateLazyComponent(() => import('@/ui/pages/Auth/SignIn'));
const SignUp = generateLazyComponent(() => import('@/ui/pages/Auth/SignUp'));

const TransitionRouter = props => (
  <Location>
    {({ location }) => (
      <Transition
        keys={location.pathname}
        from={{ opacity: 0, transform: 'scale3d(0.5,0.5,0.5)' }}
        enter={{ opacity: 1, transform: 'scale3d(1,1,1)' }}
        leave={{ opacity: 0, transform: 'scale3d(0.5,0.5,0.5)' }}
      >
        {styles => (
          <Router location={location} style={styles}>
            {props.children}
          </Router>
        )}
      </Transition>
    )}
  </Location>
);

class Nav extends Component {
  constructor(props) {
    super(props);
  }

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

/**
 * @description CURRENT CODE SPLITTING IMPLEMENTATION SPLITS
 * AT THE TOP LEVEL, BUT IT CAN BE DONE LOWER DOWN IN THE TREE
 * AS WELL OR ON AN INDIVIDUAL COMPONENT LEVEL.
 */
class App extends Component {
  constructor(props) {
    super(props);
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
export default App;
