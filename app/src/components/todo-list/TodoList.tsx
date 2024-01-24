import { FC } from 'react'
// import { fetchTodos } from './lib/data'
import { fetchTodos, toggleTodo } from './lib/data'
import { List } from '@chakra-ui/react'
import ListItem from './ListItem'
import { revalidatePath } from 'next/cache'

const TodoList: FC = async () => {
  const todos = await fetchTodos()

  async function handleTickTodo(id: number): Promise<void> {
    'use server'
    await toggleTodo(id)
    revalidatePath('/')
  }

  return (
    <List spacing={3}>
      {todos.map((todo) => (
        <ListItem key={todo.id} toggleTodo={handleTickTodo} todo={todo} />
        // <ListItem key={todo.id} todo={todo} />
      ))}
    </List>
  )
}

export default TodoList
