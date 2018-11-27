import { useState } from 'react';

function useToggle(initial: boolean) {
  let [on, setOn] = useState(initial);

  function toggle() {
    setOn(!on);
  }

  return [on, toggle];
}

function useForm(initialState = {}) {
  let [formState, setFormState] = useState(initialState);

  function input(id: string) {
    const value = formState[id];
    const setValue = value => setFormState(prevState => ({ ...prevState, [id]: value }));

    return {
      onChange: event => setValue(event.target.value),
      value
    };
  }

  return [formState, input];
}

export { useToggle, useForm };
