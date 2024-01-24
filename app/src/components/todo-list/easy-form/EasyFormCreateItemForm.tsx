import { FC } from 'react'
import * as Yup from 'yup'
import EasyForm, { EasyFormConfig, EasyFormYup } from '../../easy-form/EasyForm'
import { TodoType } from '../lib/definitions'
import { Todo } from '@prisma/client'

interface Props {
  initialValues?: Partial<Todo>
  onSubmit: (x: Todo) => void
  onCancel: () => void
  loading: boolean
  edit?: boolean
}

const EasyFormCreateItemForm: FC<Props> = (p) => {
  const init = {
    text: '',
    description: '',
  }

  const yupSchema: EasyFormYup<Todo> = {
    text: Yup.string().required('You must provide a text for what to do'),
    description: Yup.string(),
  }

  const config: EasyFormConfig<Todo> = {
    text: {
      kind: 'input',
      label: 'Todo',
      placeholder: 'Write what you need to do',
    },
    type: {
      label: 'Select type of to do',
      kind: 'select',
      optionLabels: ['Private', 'Work Related'],
      options: [TodoType.PRIVATE, TodoType.WORK],
    },
    description: {
      kind: 'textarea',
      label: 'Description',
      placeholder: 'Write an extended description of how to complete the to do',
      optional: true,
    },
    completed: {
      kind: 'checkbox',
      label: 'Completed',
      optional: true,
    },
  }

  return (
    <EasyForm<Todo>
      loading={p.loading}
      config={config}
      yupSchema={yupSchema}
      initialValues={init}
      onSubmit={p.onSubmit}
      submitButtonText={p.edit ? 'Save' : 'Create TODO item'}
    />
  )
}

export default EasyFormCreateItemForm
