import React, { Component } from 'react';

import { Router, Link } from '@/packages/Router';
import Page from '@/ui/components/Page';

import generateLazyComponent from '@/ui/components/LazyComponent';

import './App.scss';

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
        <nav>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/unknown">Unknown</Link>
          <Link to="/sign-in">Sign In</Link>
          <Link to="/sign-up">Sign Up</Link>
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
