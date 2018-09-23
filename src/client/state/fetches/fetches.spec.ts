import { store } from '@/state/store';
import Cmd from '@/cmd';
import { sha256 } from '@/util';

import fetches from './';

jest.mock('@/cmd');
jest.mock('@/util', () => ({
  sha256: jest.fn(x => x)
}));

const _ = undefined;

describe('fetches', () => {
  afterEach(() => {
    Cmd.mutation.mockReset();
    sha256.mockClear();
  });

  describe('signUp mutation', () => {
    describe('the success case', () => {
      it('should hash the password, make a mutation, and set a token', async () => {
        const mockToken = '3fc9b689459d738f8c88a3a48aa9e33542016b7a4052e001aaa536fca74813cb';
        Cmd.mutation.mockImplementationOnce(() =>
          Promise.resolve({
            signUp: {
              token: mockToken
            }
          })
        );

        await fetches(store).signUp(_, { email: 'a', username: 'b', password: 'd' });

        expect(sha256).toHaveBeenCalledTimes(1);
        expect(Cmd.mutation).toHaveBeenCalledTimes(1);
        expect(Cmd.mutation.mock.calls[0]).toMatchSnapshot();
        expect(store.getState().jwt).toEqual(mockToken);
      });
    });
  });

  describe('signIn mutation', () => {
    describe('the success case', () => {
      it('should hash the password, make a mutation, and set a token', async () => {
        const mockToken = '3fc9b689459d738f8c88a3a48aa9e33542016b7a4052e001aaa536fca74813cb';
        Cmd.mutation.mockImplementationOnce(() =>
          Promise.resolve({
            signIn: {
              token: mockToken
            }
          })
        );

        await fetches(store).signIn(_, { username: 'b', password: 'd' });

        expect(sha256).toHaveBeenCalledTimes(1);
        expect(Cmd.mutation).toHaveBeenCalledTimes(1);
        expect(Cmd.mutation.mock.calls[0]).toMatchSnapshot();
        expect(store.getState().jwt).toEqual(mockToken);
      });
    });
  });
});
