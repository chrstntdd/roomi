import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'unistore/react';

import { store } from '@/state/store';
import App from '@/ui/App';

import '@/styles/index.scss';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
