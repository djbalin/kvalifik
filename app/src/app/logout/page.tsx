import { signOut } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  async function logout() {
    'use server'
    signOut()
    redirect('/')
  }
  return (
    <form action={logout}>
      <button type='submit'>Logout</button>
    </form>
  )
}
