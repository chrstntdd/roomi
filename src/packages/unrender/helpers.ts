import { noop } from '@/util';

function set(updater, arg) {
  return typeof updater === 'function' ? updater(arg) : updater;
}

function composeOnChange(originalOnChange, propName) {
  !originalOnChange && (originalOnChange = noop);
  return function(state) {
    originalOnChange(state[propName]);
  };
}

export { set, composeOnChange };
