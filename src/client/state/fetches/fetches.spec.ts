import { store } from '@/state/store';
import Cmd from '@/cmd';

import fetches from './';

jest.mock('@/cmd');

const _ = undefined;

test('signUp', async () => {
  const mockToken = '3fc9b689459d738f8c88a3a48aa9e33542016b7a4052e001aaa536fca74813cb';
  Cmd.mutation.mockImplementationOnce(() =>
    Promise.resolve({
      signUp: {
        token: mockToken
      }
    })
  );

  await fetches(store).signUp(_, { email: 'a', username: 'b', password: 'd' });

  expect(Cmd.mutation).toHaveBeenCalledTimes(1);
  expect(Cmd.mutation.mock.calls[0]).toMatchSnapshot();
  expect(store.getState().jwt).toEqual(mockToken);
});
