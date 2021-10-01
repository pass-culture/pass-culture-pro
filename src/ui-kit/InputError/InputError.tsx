import React from 'react'

import Icon from 'components/layout/Icon'

import styles from './InputError.module.scss'


interface IProps {
  children: React.ReactNode,
  name?: string,
}

const InputError = ({ children, name = '' }: IProps): JSX.Element => {
  const inputErrorExtraProps = name
    ? {
        'data-testid': `input-error-field-${name}`,
      }
    : {}
  return (
    <span
      className={styles['it-errors']}
      {...inputErrorExtraProps}
    >
      <Icon
        alt="Une erreur est survenue"
        svg="ico-notification-error-red"
      />
      <pre>
        {children}
      </pre>
    </span>
  )
}

export default InputError
