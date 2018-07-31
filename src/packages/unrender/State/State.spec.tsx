import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, waitForElement, fireEvent } from 'react-testing-library';

import State from './';

afterEach(cleanup);

test('child can use setState on an event handler when rendering', async () => {
  const buttonContents = 'initial';
  const { getByText, container, queryByText } = render(
    <State initial={{ key: buttonContents }}>
      {({ state, setState }) => (
        <button onClick={() => setState(_ => ({ key: 'second' }))}>{state.key}</button>
      )}
    </State>
  );

  fireEvent.click(getByText(buttonContents));

  await waitForElement(() => getByText('second'), { container });

  expect(getByText('second')).toBeInTheDocument();
  expect(queryByText(buttonContents)).toBeNull();
});

test('child can read state prop when rendering', async () => {
  const buttonContents = 'submit';
  const { getByText } = render(
    <State initial={{ key: buttonContents }}>{({ state }) => <button>{state.key}</button>}</State>
  );

  expect(getByText(buttonContents)).toBeInTheDocument();
});
