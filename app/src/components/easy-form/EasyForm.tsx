/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikContextType, FormikHelpers, useFormik } from 'formik'
import {
  FocusEventHandler,
  HTMLInputTypeAttribute,
  ReactNode,
  useEffect,
} from 'react'
import * as Yup from 'yup'
import {
  ArraySchema,
  BooleanSchema,
  DateSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
} from 'yup'
import {
  Box,
  Button,
  Input,
  HStack,
  Textarea,
  Checkbox,
  Select,
  RadioGroup,
  Radio,
  Stack,
  StackProps,
  CheckboxGroup,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Badge,
  Text,
  Icon,
} from '@chakra-ui/react'
import { MdClose } from 'react-icons/md'

export type EasyFormConfig<T> = Partial<
  Record<KeyOf<T>, FieldSettingsFalsable<T>>
>
export type EasyFormYup<T> = Partial<
  Record<
    KeyOf<T>,
    | BooleanSchema
    | StringSchema
    | NumberSchema
    | DateSchema
    | ArraySchema<any>
    | ObjectSchema<any>
  >
>

export type EasyFormProps<T> = {
  /**
   * A "large" configuration object for defining the fields in the form.
   *
   * keys in this config object must match fields in the type of object the form is constructing.
   *
   * You don't have to add all keys of the object.
   *
   * The ordering in this config will equal the order of the fields in the UI.
   */
  config: EasyFormConfig<T>
  initialValues?: Partial<T>
  onSubmit: (
    validatedValues: Partial<T>,
    formikHelpers?: FormikHelpers<Partial<T>>,
  ) => void
  onCancel?: () => void
  onBack?: () => void
  onChange?: (formValues: Partial<T>) => void
  cancelButtonText?: string
  submitButtonText?: string
  yupSchema?: EasyFormYup<T>
  loading: boolean // Required since it reminds the developer to disable submit button while communicating with the backend
  enableReinitialize?: boolean
  centerButtons?: boolean
}

/**
 * Common base type for all kinds of fields.
 */
type FieldBase<TKind> = {
  /**
   * The different kinds of fields you can add to the EasyForm. There are many common ones,
   * and the kind 'custom' is for defining your own field easily.
   */
  kind: TKind
  label?: string
  description?: string
  helpText?: string
  optional?: boolean
}

/**
 * Types for text-entry-based fields.
 */
type TextEntry = {
  placeholder?: string
  type?: HTMLInputTypeAttribute
  body?: string
}

/**
 * Types for fields that make use of a list of strings. Eg. select, radio, multiple checkboxes
 */
type HasOptions = {
  options: string[]
  optionLabels?: string[]
}

/**
 * Some fields show a list of something. This can enable changing the direction to a row if it's desirable.
 */
type Directional = {
  direction?: StackProps['direction']
}

/**
 * Settings for a common input field.
 */
export type InputField = FieldBase<'input'> & TextEntry
/**
 * Settings for a common textarea.
 */
export type TextareaField = FieldBase<'textarea'> & TextEntry
/**
 * Settings for a common select.
 */
export type SelectField = FieldBase<'select'> & HasOptions
/**
 * Settings for a select where you pick multiple options.
 */
export type SelectMultiField = FieldBase<'select_multi'> & HasOptions
/**
 * Settings for a radio election group.
 */
export type RadioGroupField = FieldBase<'radio'> & HasOptions & Directional
/**
 * Settings for a single checkbox.
 */
export type CheckboxField = FieldBase<'checkbox'>
/**
 * Settings for a section with multiple checkboxes.
 */
export type CheckboxGroupField = Omit<FieldBase<'checkbox_multi'>, 'optional'> &
  HasOptions &
  Directional

/**
 * This union type represents all the kinds of common fields in EasyForm.
 */
type CommonFieldSettings =
  | InputField
  | TextareaField
  | SelectField
  | SelectMultiField
  | RadioGroupField
  | CheckboxGroupField
  | CheckboxField

/**
 * This is the custom type for making complex field UI. Anything goes,
 * since you simply define a renderFn with the formik context available.
 */
type CustomFieldSettings<T> = {
  kind: 'custom'
  renderFn: (formik: FormikContextType<T>) => ReactNode
}

type Hideable<T> = {
  hidden?: (formik: FormikContextType<T>) => boolean
}

export type FieldSettings<T> = (CommonFieldSettings | CustomFieldSettings<T>) &
  Hideable<T>

/**
 * To enable the user doing conditional objects in their config, we allow false, null, and undefined as settings.
 * These will simply be skipped when rendering the form.
 */
export type FieldSettingsFalsable<T> =
  | FieldSettings<T>
  // Below types help conditionally adding things, as these will be ignored
  | false
  | null
  | undefined
  | FieldSettings<T>['kind']

type KeyOf<T> = Extract<keyof T, string>

function EasyForm<T>(p: EasyFormProps<T>) {
  // Convert to a list, filtering out the values that are undefined
  const fieldsList = Object.entries(p.config).filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, v]) => v !== undefined,
  ) as [KeyOf<T>, FieldSettingsFalsable<T>][]

  const formik = useFormik<Partial<T>>({
    validateOnMount: true,
    enableReinitialize:
      p.enableReinitialize === undefined ? true : p.enableReinitialize,
    initialValues: p.initialValues ?? {},
    validationSchema: Yup.object().shape(p.yupSchema as any),
    onSubmit: p.onSubmit,
  })

  const onChange = p.onChange
  const values = formik.values
  useEffect(() => {
    onChange?.(values)
  }, [values, onChange])

  return (
    <form className='mt-6' onSubmit={formik.handleSubmit}>
      {fieldsList.filter(fieldIsDefined).map(([name, optionsOrStr], idx) => {
        const options =
          typeof optionsOrStr === 'string'
            ? ({ kind: optionsOrStr } as any)
            : optionsOrStr

        if (options.hidden?.(formik)) return null

        if (options.kind === 'custom') {
          return (
            <Box key={name} mb={6}>
              {options.renderFn(formik as any)}
            </Box>
          )
        }

        const commonProps = {
          formik,
          name,
          autoFocus: idx === 0,
        }

        switch (options.kind) {
          case 'input':
            return (
              <InputInternal key={name} {...commonProps} options={options} />
            )
          case 'textarea':
            return (
              <TextAreaInternal key={name} {...commonProps} options={options} />
            )
          case 'select':
            return (
              <SelectInternal key={name} {...commonProps} options={options} />
            )
          case 'select_multi':
            return (
              <SelectMultiInternal
                key={name}
                {...commonProps}
                options={options}
              />
            )
          case 'radio':
            return (
              <RadioGroupInternal
                key={name}
                {...commonProps}
                options={options}
              />
            )
          case 'checkbox':
            return (
              <CheckboxInternal key={name} {...commonProps} options={options} />
            )
          case 'checkbox_multi':
            return (
              <CheckboxGroupInternal
                key={name}
                {...commonProps}
                options={options}
              />
            )
        }
      })}
      <HStack>
        {p.onCancel && (
          <Button
            variant='outline'
            type='button'
            visibility={p.loading ? 'hidden' : 'visible'}
            disabled={p.loading}
            onClick={p.onCancel}
          >
            {p.cancelButtonText ?? 'Cancel'}
          </Button>
        )}
        <Button variant='solid' type='submit' isLoading={p.loading}>
          {p.submitButtonText ?? 'Submit'}
        </Button>
      </HStack>
    </form>
  )
}

function fieldIsDefined<T>(
  field: [KeyOf<T>, FieldSettingsFalsable<T>] | KeyOf<T>,
): field is [KeyOf<T>, FieldSettings<T>] | KeyOf<T> {
  return typeof field[1] === 'object' || typeof field[1] === 'string'
}

type FormControlProps<
  T,
  TSettings extends CommonFieldSettings = CommonFieldSettings,
> = {
  formik: FormikContextType<Partial<T>>
  name: KeyOf<T>
  options: TSettings
  autoFocus?: boolean
}

function InputInternal<T>(props: FormControlProps<T, InputField>) {
  return (
    <Control<T, string> {...props}>
      {(childProps) => (
        <Input
          {...childProps}
          onChange={(e) => childProps.onChange(e.target.value)}
        />
      )}
    </Control>
  )
}

function TextAreaInternal<T>(props: FormControlProps<T, TextareaField>) {
  return (
    <Control<T, string> {...props}>
      {(childProps) => (
        <Textarea
          {...childProps}
          onChange={(e) => childProps.onChange(e.target.value)}
        />
      )}
    </Control>
  )
}

function CheckboxInternal<T>(props: FormControlProps<T, CheckboxField>) {
  const { name, options, formik } = props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = formik.touched[name] && (formik.errors[name] as any)

  const toggle = () => formik.setFieldValue(name, !formik.values[name])

  return (
    <FormControl isRequired={!options.optional} isInvalid={!!error} my={10}>
      <FormLabel
        mb={3}
        htmlFor={name}
        lineHeight='100%'
        fontWeight='normal'
        display='flex'
        alignItems='center'
      >
        <Checkbox
          isChecked={formik.values[name] as any}
          onChange={toggle}
          mr={3}
        />
        <Box display='inline' onClick={toggle} cursor='pointer'>
          {options.label ?? labelFromName(name)}
        </Box>
      </FormLabel>
      <FormHelperText>{props.options.helpText}</FormHelperText>
      <ErrorMsg error={error} />
    </FormControl>
  )
}

function SelectInternal<T>(props: FormControlProps<T, SelectField>) {
  return (
    <Control<T, string> {...props}>
      {(childProps) => (
        <Select
          {...childProps}
          placeholder='Select option'
          onChange={(e) => childProps.onChange(e.target.value)}
        >
          {props.options.options.map((opt, idx) => (
            <option key={opt} value={opt}>
              {props.options.optionLabels?.[idx] ?? labelFromName(opt)}
            </option>
          ))}
        </Select>
      )}
    </Control>
  )
}

// TODO: fix bug where you cannot select the last option if ALL other options have been selected.
function SelectMultiInternal<T>(props: FormControlProps<T, SelectMultiField>) {
  return (
    <Control<T, string[]> {...props}>
      {(childProps) => {
        const selection = childProps.value ?? []
        const remainder = props.options.options.filter(
          (x) => !selection.includes(x),
        )

        const textFor = (opt: string) =>
          props.options.optionLabels?.[props.options.options.indexOf(opt)] ??
          labelFromName(opt)
        return (
          <>
            <Select
              {...childProps}
              value={undefined}
              onChange={(e) =>
                childProps.onChange([...selection, e.target.value])
              }
            >
              {remainder.map((opt) => (
                <option key={opt} value={opt}>
                  {textFor(opt)}
                </option>
              ))}
            </Select>
            {selection.length > 0 && (
              <HStack mt={6}>
                {selection.map((opt) => (
                  <Badge
                    variant='solid'
                    key={opt}
                    display='flex'
                    alignItems='center'
                  >
                    <span>{textFor(opt)}</span>
                    <Icon
                      as={MdClose}
                      ml={3}
                      cursor='pointer'
                      onClick={() => {
                        childProps.onChange(selection.filter((x) => x !== opt))
                      }}
                    />
                  </Badge>
                ))}
              </HStack>
            )}
          </>
        )
      }}
    </Control>
  )
}

function RadioGroupInternal<T>(props: FormControlProps<T, RadioGroupField>) {
  return (
    <Control<T, string> {...props}>
      {({ isInvalid, ...childProps }) => (
        <RadioGroup {...childProps}>
          <Stack direction={props.options.direction ?? 'column'}>
            {props.options.options.map((opt, idx) => (
              <Radio
                borderColor='black'
                borderWidth='1px'
                isInvalid={isInvalid}
                key={opt}
                value={opt}
              >
                <Box as='span' color='black'>
                  {props.options.optionLabels?.[idx] ?? labelFromName(opt)}
                </Box>
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      )}
    </Control>
  )
}

function CheckboxGroupInternal<T>(
  props: FormControlProps<T, CheckboxGroupField>,
) {
  return (
    <Control<T, string[]> {...props}>
      {({ isInvalid, ...childProps }) => (
        <CheckboxGroup {...childProps}>
          <Stack direction={props.options.direction ?? 'column'}>
            {props.options.options.map((opt, idx) => (
              <Checkbox isInvalid={isInvalid} key={opt} value={opt}>
                <Box as='span' color='gray.400'>
                  {props.options.optionLabels?.[idx] ?? labelFromName(opt)}
                </Box>
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      )}
    </Control>
  )
}

type ControlChildProps<T> = {
  name: string
  isInvalid?: boolean
  onChange: (value: T) => void
  onBlur: FocusEventHandler
  value: T
  placeholder?: string
  autoFocus?: boolean
}

type ControlProps<T, TVal> = FormControlProps<T> & {
  children: (props: ControlChildProps<TVal>) => ReactNode
}

function Control<T, TVal>(props: ControlProps<T, TVal>) {
  const { autoFocus, name, options, formik, children } = props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = formik.touched[name] && (formik.errors[name] as any)

  const isRequired =
    options.kind === 'checkbox_multi' ? false : !options.optional

  return (
    <FormControl isRequired={isRequired} isInvalid={!!error} my={10}>
      <FormLabel mb={3} htmlFor={name}>
        <b>{options.label ?? labelFromName(name)}</b>
      </FormLabel>
      {options.description && <Text mb={6}>{options.description}</Text>}
      {children({
        name,
        isInvalid: !!error,
        onChange: (value) => formik.setFieldValue(name, value),
        onBlur: (e) => formik.handleBlur(e),
        value: formik.values[name] as unknown as TVal,
        placeholder: 'placeholder' in options ? options.placeholder : undefined,
        autoFocus,
      })}
      <FormHelperText>{props.options.helpText}</FormHelperText>
      <ErrorMsg error={error} />
    </FormControl>
  )
}

function ErrorMsg({ error }: { error: null | false | string | string[] }) {
  return error ? (
    <FormErrorMessage
      style={{
        whiteSpace: 'pre-line',
      }}
    >
      {typeof error === 'string'
        ? error
        : error.join('.\n').replace(/\.\.\n/, '.\n')}
    </FormErrorMessage>
  ) : null
}

function labelFromName(x: string) {
  const withSpaces = x.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  return withSpaces[0].toLocaleUpperCase() + withSpaces.slice(1)
}

export default EasyForm
