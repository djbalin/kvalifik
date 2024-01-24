import { Box, Text, SkeletonText } from '@chakra-ui/react'
import { FC, Suspense } from 'react'
import CreateItemModal from './CreateItemModal'
import TodoList from './TodoList'
import { auth } from '@/auth'
// import { useSession } from 'next-auth/react'
import getServerSession from 'next-auth'
import { authConfig } from '@/auth.config'
const Todos: FC = async () => {
  const session = await getServerSession(authConfig)
  // const session = await getServerSession(req, res, authOptions)
  // const { data: session } = useSession()
  return (
    <Box mb={10}>
      <Text fontSize='2em' mb={4}>
        Todo List
      </Text>
      {session ? <CreateItemModal /> : <span>Log in to create new items</span>}
      <Suspense
        fallback={
          <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='3'>
            A long todo item with a lot of texts
          </SkeletonText>
        }
      >
        <TodoList />
      </Suspense>
    </Box>
  )
}

export default Todos
