import { store, initialState } from '@/state/store';

import actions from './';

const _ = initialState;

describe('actions', () => {
  describe('setWindowWidth', () => {
    it('should set the window width', () => {
      actions(store).setWindowWidth(_, { windowWidth: 42 });

      expect(store.getState()).toEqual(expect.objectContaining({ windowWidth: 42 }));
    });
  });
});
