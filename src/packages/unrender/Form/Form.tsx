import React from 'react';

import State from '@/packages/unrender/State';
import { set } from '@/packages/unrender/helpers';

function Form({ initial = {}, onChange, ...props }) {
  return (
    <State initial={{ ...initial }} onChange={onChange}>
      {({ state, setState }) =>
        props.children({
          values: { ...state },
          input: (id: string) => {
            const value = state[id] || '';
            const setValue = value => setState({ [id]: value });

            return {
              connect: {
                onChange: event => setValue(event.target.value),
                value
              },
              set: value => setState(s => ({ [id]: set(value, s.value) })),
              value
            };
          }
        })
      }
    </State>
  );
}

export default Form;
