import React, { Component } from 'react';

import './Page.scss';

/**
 * @description Wrapper that renders a page. The top-level <Page />
 * will render the main <Router /> component.
 */
export class Page extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default Page;
