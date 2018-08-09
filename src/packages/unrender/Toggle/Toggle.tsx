import React from 'react';

import { noop } from '@/util';
import State from 'packages/unrender/State';
import { set, composeOnChange } from 'packages/unrender/helpers';

interface PToggle {
  initial?: boolean;
  onChange?: (any) => any;
  children: (any) => any;
}

function Toggle({ initial = false, onChange = noop, ...props }): React.ReactElement<PToggle> {
  return (
    <State initial={{ on: initial }} onChange={composeOnChange(onChange, 'on')}>
      {({ state, setState }) =>
        props.children({
          on: state.on,
          toggle: () => setState(s => ({ on: !s.on })),
          set: value => setState(s => ({ on: set(value, s.on) }))
        })
      }
    </State>
  );
}

export default Toggle;
