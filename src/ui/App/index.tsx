import React, { Component } from 'react';

import { Router, Link } from '@/packages/Router';
import Page from '@/ui/components/Page';

import generateLazyComponent from '@/ui/components/LazyComponent';

import s from './App.css';

const Home = generateLazyComponent(() => import('@/ui/pages/Home'));
const Dashboard = generateLazyComponent(() => import('@/ui/pages/Dashboard'));
const NotFound = generateLazyComponent(() => import('@/ui/pages/NotFound'));
const Auth = generateLazyComponent(() => import('@/ui/pages/Auth'));

/**
 * @description CURRENT CODE SPLITTING IMPLEMENTATION SPLITS
 * AT THE TOP LEVEL, BUT IT CAN BE DONE LOWER DOWN IN THE TREE
 * AS WELL OR ON AN INDIVIDUAL COMPONENT LEVEL.
 */
class App extends Component {
  render() {
    return (
      <Page>
        <nav className={s.siteNav}>
          <Link className={s.navLinks} to="/">
            Home
          </Link>
          <Link className={s.navLinks} to="/dashboard">
            Dashboard
          </Link>
          <Link className={s.navLinks} to="/unknown">
            Unknown
          </Link>
          <Link className={s.navLinks} to="/sign-in">
            Sign In
          </Link>
          <Link className={s.navLinks} to="/sign-up">
            Sign Up
          </Link>
        </nav>
        <Router>
          <Home path="/" />
          <Dashboard path="/dashboard" />
          <Auth path="/sign-in" />
          <Auth path="/sign-up" />
          <NotFound default />
        </Router>
      </Page>
    );
  }
}
export default App;
