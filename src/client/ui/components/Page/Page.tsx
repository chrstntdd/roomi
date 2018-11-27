import React from 'react';

import './Page.scss';

/**
 * @description Wrapper that renders a page. The top-level <Page />
 * will render the main <Router /> component.
 */
export function Page(props) {
  return <div className="page-container">{props.children}</div>;
}

export default Page;
