import createStore from 'unistore';
import devtools from 'unistore/devtools';

const store =
  process.env.NODE_ENV === 'production'
    ? createStore({ count: 0 })
    : devtools(createStore({ count: 0 }));

const actions = store => ({
  increment: ({ count }) => ({ count: count + 1 }),
  decrement: ({ count }) => ({ count: count - 1 })
});

export { store, actions };
