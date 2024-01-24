'use server'

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
// import bcrypt from 'bcrypt'

type TodoCreateBody = Prisma.Args<typeof prisma.todo, 'create'>['data']

export async function createTodo(
  prevState: string | undefined,
  data: TodoCreateBody,
) {
  const newTodo = await prisma.todo.create({ data })

  revalidatePath('/')
  redirect(`/todo/${newTodo.id}`)
}
