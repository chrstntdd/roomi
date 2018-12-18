import Cmd from '@/cmd'
import { sha256 } from '@/util'

import * as fetches from './'

jest.mock('@/cmd')
jest.mock('@/util', () => ({
  sha256: jest.fn(x => x)
}))

const mockToken = '3fc9b689459d738f8c88a3a48aa9e33542016b7a4052e001aaa536fca74813cb'
const mockErrorMessage = 'An error occurred'

describe('fetches', () => {
  afterEach(() => {
    ;(Cmd.mutation as jest.Mock).mockReset()
    ;(sha256 as jest.Mock).mockClear()
  })

  describe('signUp mutation', () => {
    const payload = { email: 'a', username: 'b', password: 'd' }

    describe('the success case', () => {
      it('should hash the password, make a mutation, and return a token', async () => {
        ;(Cmd.mutation as jest.Mock).mockImplementationOnce(() =>
          Promise.resolve({
            signUp: {
              token: mockToken
            }
          })
        )

        const response = await fetches.signUp(payload)

        expect(sha256).toHaveBeenCalledTimes(1)
        expect(Cmd.mutation).toHaveBeenCalledTimes(1)
        expect((Cmd.mutation as jest.Mock).mock.calls[0]).toMatchSnapshot()
        expect(response).toMatchSnapshot()
      })
    })

    describe('the failure case', () => {
      it('should return the message returned by the api', async () => {
        ;(Cmd.mutation as jest.Mock).mockImplementationOnce(() =>
          Promise.reject({
            message: mockErrorMessage
          })
        )

        const response = await fetches.signUp(payload)

        expect(sha256).toHaveBeenCalledTimes(1)
        expect(Cmd.mutation).toHaveBeenCalledTimes(1)
        expect(response).toMatchSnapshot()
      })
    })
  })

  describe('signIn mutation', () => {
    const payload = { username: 'b', password: 'd' }

    describe('the success case', () => {
      it('should hash the password, make a mutation, and return a token', async () => {
        ;(Cmd.mutation as jest.Mock).mockImplementationOnce(() =>
          Promise.resolve({
            signIn: {
              token: mockToken
            }
          })
        )

        const response = await fetches.signIn(payload)

        expect(sha256).toHaveBeenCalledTimes(1)
        expect(Cmd.mutation).toHaveBeenCalledTimes(1)
        expect((Cmd.mutation as jest.Mock).mock.calls[0]).toMatchSnapshot()
        expect(response).toMatchSnapshot()
      })
    })

    describe('the failure case', () => {
      it('should return the message returned by the api', async () => {
        ;(Cmd.mutation as jest.Mock).mockImplementationOnce(() =>
          Promise.reject({
            message: mockErrorMessage
          })
        )

        const response = await fetches.signIn(payload)

        expect(sha256).toHaveBeenCalledTimes(1)
        expect(Cmd.mutation).toHaveBeenCalledTimes(1)
        expect(response).toMatchSnapshot()
      })
    })
  })
})
