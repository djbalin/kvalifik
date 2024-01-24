'use client'

import { FC, useState } from 'react'
import {
  MdCheckCircle,
  MdOutlineDocumentScanner,
  MdPanoramaFishEye,
} from 'react-icons/md'
import {
  Button,
  ListItem as ChakraListItem,
  Container,
  Flex,
  ListIcon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { Modal } from '@chakra-ui/react'
// import Link from 'next/link'
import { Todo } from '@prisma/client'
import Link from 'next/link'
// import { completeTodo } from './lib/data'

type Props = {
  todo: Todo
  // completeTodo: (id: number) => Promise<Todo | null>
  toggleTodo: (id: number) => Promise<void>
}

// const ListItem: FC<Props> = ({ todo }) => {
const ListItem: FC<Props> = ({ todo, toggleTodo: toggleTodo }) => {
  // This feels like a somewhat ghetto solution: I keep track of the completion state of a todo item locally here, whereas
  // it should merely be managed in the database and dependent on the state therein.
  // For now, I use this method since I want to be able to provide instant feedback to the user, i.e. instant re-rendering
  // and UI update upon clicking an item (without having to wait for a re-fetch from the database). I find this a good
  // user experience, but, say the database call to toggle the status of an item fails - the state presented to the
  // user would then differ from the one stored in the database.
  const [isCompleted, setIsCompleted] = useState<boolean>(todo.completed)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const icon = isCompleted ? MdCheckCircle : MdPanoramaFishEye
  async function handleClickCompleted(id: number): Promise<void> {
    if (isCompleted) {
      onOpen()
    } else {
      await toggleTodo(id)
      setIsCompleted((prev) => !prev)
    }
  }

  return (
    <ChakraListItem>
      <Flex direction={'row'} placeItems={'center'}>
        <Container
          onClick={() => handleClickCompleted(todo.id)}
          display={'flex'}
          placeItems={'center'}
          cursor={'pointer'}
        >
          <ListIcon as={icon} color='green.500' />
          <Text>{todo.text}</Text>
        </Container>
        <Spacer></Spacer>
        <Link href={`/todo/${todo.id}`}>
          <MdOutlineDocumentScanner className='flex'></MdOutlineDocumentScanner>
        </Link>
      </Flex>
      {/* <div className='flex flex-row'>
      </div> */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Already completed</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            This will mark the TODO item as non-completed. Are you sure?
            {/* <Lorem count={2} /> */}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              No
            </Button>
            <Button
              variant='ghost'
              onClick={async () => {
                await toggleTodo(todo.id)
                setIsCompleted((prev) => !prev)
                onClose()
              }}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraListItem>
  )
}

// <Text>
//   {/* {todo.id} */}
// </Text>
export default ListItem
