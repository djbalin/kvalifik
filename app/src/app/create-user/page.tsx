'use client'

import React, { FC } from 'react'
import { useFormState } from 'react-dom'
// import { MdOutlineWarning } from 'react-icons/md'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Text } from '@chakra-ui/react'
import Input from '@/components/todo-list/formik/FormikInput'
import Button from '@/components/todo-list/formik/FormikButton'
import { createUser } from '@/lib/actions'
import { CreateCredentials } from '@/lib/definitions'
import BackLink from '@/components/common/BackLink'
// import bcrypt from 'bcrypt'

const LoginPage: FC = () => {
  const [message, formAction] = useFormState(createUser, undefined)

  // Quick and dirty implementation
  function validatePasswords(values: {
    name: string
    email: string
    password: string
    passwordRepeat: string
  }) {
    if (values.password !== values.passwordRepeat) {
      alert('Passwords do not match')
      return false
    }
    return true
    // throw new Error('Function not implemented.')
  }

  return (
    <>
      <BackLink />

      <Text fontSize='2em' mb={4}>
        Create user
      </Text>
      {message}
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          passwordRepeat: '',
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
          email: Yup.string().required('Required'),
          password: Yup.string().required('Required'),
        })}
        onSubmit={async (values: {
          name: string
          email: string
          password: string
          passwordRepeat: string
        }) => {
          if (validatePasswords(values)) {
            formAction({
              name: values.name,
              email: values.email,
              password: values.password,
            })
          }
        }}
      >
        <Form>
          <Input
            label='Name'
            placeholder='Type your name'
            name='name'
            required
          />
          <Input
            label='E-mail'
            placeholder='Input your e-mail'
            name='email'
            required
          />
          <Input
            type='password'
            label='Password'
            placeholder='Input your password'
            name='password'
            required
          />
          <Input
            type='password'
            label='passwordRepeat'
            placeholder='Repeat your password'
            name='passwordRepeat'
            required
          />
          <Button>Create user</Button>
        </Form>
      </Formik>
    </>
  )
}

export default LoginPage
