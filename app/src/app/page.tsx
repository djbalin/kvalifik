import FetchAPI from '@/components/common/FetchAPI'
import Todos from '../components/todo-list/Todos'
import { Box, Flex, Divider, Text, Button } from '@chakra-ui/react'
import { Metadata, NextPage } from 'next'
import Link from 'next/link'
import { FC } from 'react'
import {
  MdLogin,
  MdLockPerson,
  MdCreate,
  MdPersonAdd,
  MdLogout,
} from 'react-icons/md'
import { authConfig } from '@/auth.config'
import getServerSession from 'next-auth'
// import { signOut } from '@/auth'
// import Logout from '@/components/Logout'
export const metadata: Metadata = {
  title: 'Well hello!',
}

const HomePage: FC<NextPage> = () => {
  const session = getServerSession(authConfig)
  return (
    <Box>
      <Todos />
      <Divider />
      <Text mt={10} fontSize='20'>
        Menu
      </Text>
      <Flex alignItems='center'>
        <MdLogin style={{ marginRight: '5px' }} />(
        <Link href='/login' passHref>
          Login
        </Link>
        )
      </Flex>
      <Flex alignItems='center'>
        <MdPersonAdd style={{ marginRight: '5px' }} />
        {/* < */}
        <Link href='/create-user' passHref>
          Create user
        </Link>
      </Flex>
      <Flex alignItems='center'>
        <MdLockPerson style={{ marginRight: '5px' }} />
        <Link href='/protected-page' passHref>
          Protected Page
        </Link>
        {session ? (
          <Link href='/logout' passHref>
            Log out
          </Link>
        ) : (
          <></>
        )}
      </Flex>
      <Flex alignItems='center' mb={10}>
        <MdLogout style={{ marginRight: '5px' }} />
        {session ? (
          <Link href='/logout' passHref>
            Log out (not working)
          </Link>
        ) : (
          <></>
        )}
      </Flex>
      <FetchAPI />
    </Box>
  )
}

export default HomePage
