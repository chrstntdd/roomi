import { of } from 'folktale/concurrency/task';

import { store } from '@/state/store';
import { post } from 'packages/cmd';

import fetches from './';

jest.mock('packages/cmd', () => ({ post: jest.fn() }));

const _ = undefined;

test('signUp', async () => {
  const mockToken = '3fc9b689459d738f8c88a3a48aa9e33542016b7a4052e001aaa536fca74813cb';
  post.mockImplementationOnce(() => of({ data: { signUp: { token: mockToken } } }));

  await fetches(store).signUp(_, { email: 'a', username: 'b', password: 'd' });

  expect(post).toHaveBeenCalledTimes(1);
  expect(post.mock.calls[0]).toMatchSnapshot();
  expect(store.getState().jwt).toEqual(mockToken);
});
