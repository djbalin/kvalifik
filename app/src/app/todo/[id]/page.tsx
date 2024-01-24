import { Divider, Text } from '@chakra-ui/react'
import { fetchTodo } from '../../../components/todo-list/lib/data'
import { Metadata } from 'next'
import { FC } from 'react'
import BackLink from '@/components/common/BackLink'

export const metadata: Metadata = {
  title: 'Todo',
}

type Params = {
  params: {
    id: string
  }
}

const TodoPage: FC<Params> = async ({ params }) => {
  const todo = await fetchTodo(parseInt(params.id, 10))

  if (!todo) {
    return <div>Todo not found</div>
  }

  return (
    <>
      <BackLink />
      <Text fontSize='2em' mb={4}>
        {todo.text}
      </Text>
      <Text>Created date: {todo.createdAt.toUTCString()}</Text>
      <Text>Type: {todo.type}</Text>
      <Text>Completed: {todo.completed ? 'Yes' : 'No'}</Text>
      <Divider
        orientation='horizontal'
        height={'4px'}
        color={'black'}
        background={'black'}
        opacity={100}
      ></Divider>
      <Text fontSize={'1.5em'} mb={10}>
        {todo.description}
      </Text>
    </>
  )
}

export default TodoPage
