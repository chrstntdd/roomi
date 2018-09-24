import { store, initialState } from '@/state/store';
import Cmd from '@/cmd';
import { sha256 } from '@/util';

import fetches from './';

jest.mock('@/cmd');
jest.mock('@/util', () => ({
  sha256: jest.fn(x => x)
}));

const _ = initialState;
const mockToken = '3fc9b689459d738f8c88a3a48aa9e33542016b7a4052e001aaa536fca74813cb';
const mockErrorMessage = 'An error occurred';

describe('fetches', () => {
  afterEach(() => {
    (Cmd.mutation as jest.Mock).mockReset();
    (sha256 as jest.Mock).mockClear();
  });

  describe('signUp mutation', () => {
    const payload = { email: 'a', username: 'b', password: 'd' };

    describe('the success case', () => {
      it('should hash the password, make a mutation, and set a token', async () => {
        (Cmd.mutation as jest.Mock).mockImplementationOnce(() =>
          Promise.resolve({
            signUp: {
              token: mockToken
            }
          })
        );

        await fetches(store).signUp(_, payload);

        expect(sha256).toHaveBeenCalledTimes(1);
        expect(Cmd.mutation).toHaveBeenCalledTimes(1);
        expect((Cmd.mutation as jest.Mock).mock.calls[0]).toMatchSnapshot();
        expect(store.getState().jwt).toEqual(mockToken);
      });
    });

    describe('the failure case', () => {
      it('should set the message returned by the api', async () => {
        (Cmd.mutation as jest.Mock).mockImplementationOnce(() =>
          Promise.reject({
            message: mockErrorMessage
          })
        );

        await fetches(store).signUp(_, payload);

        expect(sha256).toHaveBeenCalledTimes(1);
        expect(Cmd.mutation).toHaveBeenCalledTimes(1);
        expect(store.getState().graphQlErrorMsg).toEqual(mockErrorMessage);
      });
    });
  });

  describe('signIn mutation', () => {
    const payload = { username: 'b', password: 'd' };

    describe('the success case', () => {
      it('should hash the password, make a mutation, and set a token', async () => {
        (Cmd.mutation as jest.Mock).mockImplementationOnce(() =>
          Promise.resolve({
            signIn: {
              token: mockToken
            }
          })
        );

        await fetches(store).signIn(_, payload);

        expect(sha256).toHaveBeenCalledTimes(1);
        expect(Cmd.mutation).toHaveBeenCalledTimes(1);
        expect((Cmd.mutation as jest.Mock).mock.calls[0]).toMatchSnapshot();
        expect(store.getState().jwt).toEqual(mockToken);
      });
    });

    describe('the failure case', () => {
      it('should set the message returned by the api', async () => {
        (Cmd.mutation as jest.Mock).mockImplementationOnce(() =>
          Promise.reject({
            message: mockErrorMessage
          })
        );

        await fetches(store).signIn(_, payload);

        expect(sha256).toHaveBeenCalledTimes(1);
        expect(Cmd.mutation).toHaveBeenCalledTimes(1);
        expect(store.getState().graphQlErrorMsg).toEqual(mockErrorMessage);
      });
    });
  });
});
