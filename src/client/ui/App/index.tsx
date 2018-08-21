import React, { Component } from 'react';

import { Router, Link } from 'packages/Router';
import Page from '@/ui/components/Page';

import generateLazyComponent from '@/ui/components/LazyComponent';

import './App.scss';

const Home = generateLazyComponent(() => import('@/ui/pages/Home'));
const Dashboard = generateLazyComponent(() => import('@/ui/pages/Dashboard'));
const NotFound = generateLazyComponent(() => import('@/ui/pages/NotFound'));
const SignIn = generateLazyComponent(() => import('@/ui/pages/Auth/SignIn'));
const SignUp = generateLazyComponent(() => import('@/ui/pages/Auth/SignUp'));

/**
 * @description CURRENT CODE SPLITTING IMPLEMENTATION SPLITS
 * AT THE TOP LEVEL, BUT IT CAN BE DONE LOWER DOWN IN THE TREE
 * AS WELL OR ON AN INDIVIDUAL COMPONENT LEVEL.
 */
class App extends Component {
  render() {
    return (
      <Page>
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
