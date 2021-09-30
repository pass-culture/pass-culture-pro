import React from 'react'

interface IProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  text: string,
  buttonStyle?: 'primary' | 'secondary',
  type?: 'button' | 'submit',
}

const Button = ({ onClick, text, type = 'button', buttonStyle = 'primary' }: IProps): JSX.Element => {
  const buttonStyleClass = {
    primary: 'primary-button',
    secondary: 'secondary-button',
  }[buttonStyle]

  return (
    <button
      className={buttonStyleClass}
      onClick={onClick}
      type={type}
    >
      { text }
    </button>
  )
}

export default Button