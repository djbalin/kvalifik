'use server'

import prisma from '@/lib/prisma'
import { User } from '@prisma/client'
import { signIn } from '@/auth'
import { CreateCredentials, Credentials } from '@/lib/definitions'
import bcrypt from 'bcrypt'

export async function authenticate(
  prevState: string | undefined,
  data: Credentials,
) {
  try {
    await signIn('credentials', { ...data, callbackUrl: '/protected-page' })
  } catch (error) {
    if ((error as Error).message.includes('CredentialsSignin')) {
      return 'CredentialsSignin'
    }
    throw error
  }
}

export async function getUser(email: string): Promise<User | null> {
  try {
    return await prisma.user.findFirst({
      where: {
        email,
      },
    })
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}

export async function getAllUsers() {
  try {
    return await prisma.user.findMany()
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw new Error('Failed to fetch users.')
  }
}

export async function createUser(
  prevState: string | undefined,
  data: CreateCredentials,
) {
  // const password = await bcrypt.hashSync('admin', 10)
  // const email = 'admin@kvalifik.dk'
  const password = await bcrypt.hashSync(data.password, 10)
  try {
    const emailExists = await getUser(data.email)
    if (emailExists) {
      throw new Error('User with that email already exists')
    } else {
      console.log('Creating user')

      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: password,
        },
      })
      await signIn('credentials', {
        ...data,
        // callbackUrl: '/protected-page',
        callbackUrl: '/',
      })
      // authenticate()
      console.log(user)
    }
  } catch (error) {
    if ((error as Error).message.includes('CreateError')) {
      return 'CreateError'
    }
    throw error
  }
}
