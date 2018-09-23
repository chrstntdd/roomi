/**
 * @description Check the environment
 */
const canUseDOM: boolean = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

/**
 * @description To wrap a history source
 */
const getLocation = source => {
  return {
    ...source.location,
    state: source.history.state,
    key: (source.history.state && source.history.state.key) || 'initial'
  };
};

const createHistory = (source, options?: any) => {
  let listeners = [];
  let location = getLocation(source);
  let transitioning = false;
  let resolveTransition = () => {};

  return {
    get location() {
      return location;
    },

    get transitioning() {
      return transitioning;
    },

    _onTransitionComplete() {
      transitioning = false;
      resolveTransition();
    },

    listen(listener) {
      listeners.push(listener);

      let popstateListener = () => {
        location = getLocation(source);
        listener({ location, action: 'POP' });
      };

      source.addEventListener('popstate', popstateListener);

      return () => {
        source.removeEventListener('popstate', popstateListener);
        listeners = listeners.filter(fn => fn !== listener);
      };
    },

    navigate(to, { state = {}, replace = false } = {}) {
      state = { ...state, key: Date.now().toString() };

      // try...catch iOS Safari limits to 100 pushState calls
      try {
        if (transitioning || replace) {
          source.history.replaceState(state, null, to);
        } else {
          source.history.pushState(state, null, to);
        }
      } catch (e) {
        source.location[replace ? 'replace' : 'assign'](to);
      }

      location = getLocation(source);
      transitioning = true;
      const transition = new Promise(res => (resolveTransition = res));
      listeners.forEach(listener => listener({ location, action: 'PUSH' }));
      return transition;
    }
  };
};

/**
 * @description Stores history entries in memory for testing or other platforms like Native
 */
const createMemorySource = (initialPathname = '/') => {
  const stack = [{ pathname: initialPathname, search: '' }];
  const states = [];
  let index = 0;

  return {
    get location() {
      return stack[index];
    },
    addEventListener(name, fn) {},
    removeEventListener(name, fn) {},
    history: {
      get entries() {
        return stack;
      },
      get index() {
        return index;
      },
      get state() {
        return states[index];
      },
      pushState(state, _, uri) {
        const [pathname, search = ''] = uri.split('?');
        index++;
        stack.push({ pathname, search });
        states.push(state);
      },
      replaceState(state, _, uri) {
        let [pathname, search = ''] = uri.split('?');
        stack[index] = { pathname, search };
        states[index] = state;
      }
    }
  };
};

/**
 * @description To retrieve a history source. Uses `window.history`
 * if available, but falls back to using a memory history that
 * mirrors the same API
 */
const getSource = () => (canUseDOM ? window : createMemorySource());

const globalHistory = createHistory(getSource());
const { navigate } = globalHistory;

export { globalHistory, navigate, createHistory, createMemorySource };
