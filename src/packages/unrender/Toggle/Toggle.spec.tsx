import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, waitForElement, fireEvent } from 'react-testing-library';

import Toggle from './';

afterEach(cleanup);

test('child can make a toggle by reading the on state and using the toggle callback', async () => {
  const { getByText, container } = render(
    <Toggle>
      {({ on, toggle }) => (on ? <div onClick={toggle}>On</div> : <div onClick={toggle}>Off</div>)}
    </Toggle>
  );

  expect(getByText('Off')).toBeInTheDocument();

  fireEvent.click(getByText('Off'));

  await waitForElement(() => getByText('On'), { container });

  expect(getByText('On')).toBeInTheDocument();

  fireEvent.click(getByText('On'));

  await waitForElement(() => getByText('Off'), { container });

  expect(getByText('Off')).toBeInTheDocument();
});

test('child can set a value into `on` state to control the toggle', async () => {
  const { getByText, container } = render(
    <Toggle>
      {({ on, set }) =>
        on === 'newValue1' ? (
          <div onClick={() => set('newValue2')}>On</div>
        ) : (
          <div onClick={() => set('newValue1')}>Off</div>
        )
      }
    </Toggle>
  );

  fireEvent.click(getByText('Off'));

  await waitForElement(() => getByText('On'), { container });

  expect(getByText('On')).toBeInTheDocument();
});
