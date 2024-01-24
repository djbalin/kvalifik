'use client'

import { FC, useState } from 'react'
import { useFormState } from 'react-dom'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
} from '@chakra-ui/react'
import EasyFormCreateItemForm from './easy-form/EasyFormCreateItemForm'
import FormikCreateItemForm from './formik/FormikCreateItemForm'
import { createTodo } from './lib/actions'

enum FormType {
  FORMIK,
  EASYFORM,
}

const CreateItemModal: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [type, setType] = useState<FormType>()
  const [code, action] = useFormState(createTodo, undefined)

  return (
    <>
      <Box mb={5}>
        <Button
          colorScheme='blue'
          onClick={() => {
            setType(FormType.EASYFORM)
            onOpen()
          }}
        >
          Create with EasyForm
        </Button>
        <Button
          colorScheme='blue'
          onClick={() => {
            setType(FormType.FORMIK)
            onOpen()
          }}
          ml={2}
        >
          Create with Formik
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pb={10}>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {type === FormType.FORMIK && (
              <FormikCreateItemForm onSave={action} />
            )}
            {type === FormType.EASYFORM && (
              <EasyFormCreateItemForm
                onSubmit={action}
                onCancel={() => {}}
                loading={false}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateItemModal
