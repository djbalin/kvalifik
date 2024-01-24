import { signInUrlWithReturnParam } from './utils'

describe('name', () => {
  it('must return url without back param', async () => {
    expect(signInUrlWithReturnParam()).toEqual('/sign-in')
  })

  it('must return url with back param', async () => {
    expect(signInUrlWithReturnParam('this')).toEqual('/sign-in?back=this')
  })
})
