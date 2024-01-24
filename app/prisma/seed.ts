import { TodoType } from '../src/components/todo-list/lib/definitions'
import { Prisma, PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

type TodoCreateBody = Prisma.Args<typeof prisma.todo, 'create'>['data']

async function main() {
  const password = await bcrypt.hashSync('admin', 10)
  const email = 'admin@kvalifik.dk'

  await prisma.user.upsert({
    where: { email: email },
    update: {},
    create: {
      email: email,
      name: 'Kvalifik Admin',
      password,
    },
  })

  await prisma.todo.create({
    data: {
      text: 'Implement TODO functionality',
      description: 'Implement TODO functionality',
      type: TodoType.WORK,
    }
  })

  await prisma.todo.create({
    data: {
      text: 'Create specific link to TODO page',
      description: 'Each TODO item in the TODO list must have a direct link to it\'s description page.',
      type: TodoType.WORK,
    }
  })

  await prisma.todo.create({
    data: {
      text: 'Extend "view todo" page',
      description: 'The TODO page should be extended with more information, such as the type of todo, when it was created and whether it has been completed.',
      type: TodoType.WORK,
    }
  })

  await prisma.todo.create({
    data: {
      text: 'Create Create user page',
      description: 'Before the menu item Login, there should be a link to a Create user page. At this page you should be able to create new users.',
      type: TodoType.WORK,
    }
  })

  await prisma.todo.create({
    data: {
      text: 'Hide "Create TODO buttons" for unauthenticated users',
      description: 'If you are not authenticated, it should not be possible to create new TODO items.',
      type: TodoType.WORK,
    }
  })

  await prisma.todo.create({
    data: {
      text: 'Hand-in assignment',
      description: 'Three hours after receiving the assignment, pack it up in a zip-file or tarball and send it to kristian@kvalifik.dk',
      type: TodoType.PRIVATE,
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
