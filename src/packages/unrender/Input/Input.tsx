import React from 'react';

import State from 'packages/unrender/State';
import { set, composeOnChange } from 'packages/unrender/helpers';

interface PInput {
  initial?: boolean;
  onChange?: (any) => any;
  children: (any) => any;
}

export function Input({ initial = '', onChange, ...props }): React.ReactElement<PInput> {
  return (
    <State initial={{ value: initial }} onChange={composeOnChange(onChange, 'value')}>
      {({ state, setState }) =>
        props.children({
          connect: {
            onChange: event => setState({ value: event.target.value }),
            value: state.value
          },
          value: state.value
        })
      }
    </State>
  );
}

export default Input;
