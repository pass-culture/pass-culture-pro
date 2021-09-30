import React from 'react'
import { Field, FieldProps } from 'formik';

import TextInput from 'components/layout/inputs/TextInput'


interface IProps {
  disabled?: boolean,
  inputRef?: HTMLInputElement,
  label: string,
  maxLength?: number | null,
  name: string,
  placeholder?: string,
  required?: boolean,
  subLabel?: string,
  type?: 'text' | 'email',
}

const FieldText = ({ 
  disabled = false,
  inputRef,
  label, 
  maxLength = null,
  name, 
  placeholder = '', 
  required = false,
  subLabel = '', 
  type = 'text',
}: IProps): JSX.Element => {
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <TextInput
          label={label}
          subLabel={subLabel}
          disabled={disabled}
          error={meta.touched && meta.error || ''}
          maxLength={maxLength}
          name={field.name}
          onBlur={field.onBlur}
          onChange={field.onChange}
          placeholder={placeholder}
          inputRef={inputRef}
          required={required}
          type={type}
          value={field.value}
        />
      )}
    </Field>
  )
}

export default FieldText
