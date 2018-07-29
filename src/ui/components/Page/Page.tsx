import React, { Component } from 'react';

import s from './Page.css';

/**
 * @description Wrapper that renders a page. The top-level <Page />
 * will render the main <Router /> component.
 */
export class Page extends Component {
  render() {
    return <div className={s.pageContainer}>{this.props.children}</div>;
  }
}

export default Page;
