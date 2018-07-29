import React, { Component } from 'react';

import { Router, Link } from '@/packages/Router';
import Page from '@/ui/components/Page';

import generateLazyComponent from '@/ui/components/LazyComponent';

import s from './App.css';

const Home = generateLazyComponent(() => import('@/ui/pages/Home'));
const Dashboard = generateLazyComponent(() => import('@/ui/pages/Dashboard'));
const NotFound = generateLazyComponent(() => import('@/ui/pages/NotFound'));

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
        </nav>
        <Router>
          <Home path="/" />
          <Dashboard path="/dashboard" />
          <NotFound default />
        </Router>
      </Page>
    );
  }
}
export default App;
