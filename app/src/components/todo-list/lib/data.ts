'use server'
import prisma from '@/lib/prisma'
import { Todo } from '@prisma/client'

export async function fetchTodos(): Promise<Todo[]> {
  return await prisma.todo.findMany()
}

export async function fetchTodo(id: number): Promise<Todo | null> {
  return await prisma.todo.findUnique({ where: { id } })
}

export async function toggleTodo(id: number): Promise<Todo | null> {
  'use server'
  console.log('Updatetodo')

  const todo = await fetchTodo(id)
  if (todo?.completed) {
    return await prisma.todo.update({
      where: {
        id,
      },
      data: {
        completed: false,
      },
    })
  } else {
    return await prisma.todo.update({
      where: {
        id,
      },
      data: {
        completed: true,
      },
    })
  }
}
