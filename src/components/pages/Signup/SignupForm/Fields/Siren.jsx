import { Field } from "react-final-form"
import React, { PureComponent } from "react"
import isRequired from '../validators/isRequired'
import { composeValidators, removeWhitespaces } from 'react-final-form-utils'
import formatSiren from '../../../Offerer/OffererCreation/Fields/Siren/formatSiren'
import getSirenInformation from '../../../Offerer/OffererCreation/decorators/getSirenInformation'

const mustHaveTheProperLength = value => {
  return value.length < 11 ? 'SIREN trop court' : undefined
}

const getOffererNameBySiren = async value => {
  value = removeWhitespaces(value)
  isRequired
  const sirenInformation = await getSirenInformation(value)


  if (!sirenInformation || sirenInformation.error) {
    return undefined
  }
  return sirenInformation.name
}

export const existsInINSEERegistry = async value => {
  value = removeWhitespaces(value)
  const sirenInformation = await getSirenInformation(value)

  if (sirenInformation.error)
    return 'Ce SIREN n\'est pas reconnu'
  return undefined
}

class Siren extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      fetchedName: null
    }
  }

  handleOnChange = event => {
    if (event.target.value.length === 11) {
      getOffererNameBySiren(event.target.value).then(fetchedName => {
        this.setState({
          fetchedName: fetchedName
        })
      })
    }
  }

  render() {
    return (
      <Field
        format={formatSiren}
        minLength={11}
        name="siren"
        validate={composeValidators(isRequired, mustHaveTheProperLength, existsInINSEERegistry)}
      >
        {({ input, meta, value }) => {
          const { fetchedName } = this.state
          const inputProps = {
            ...input,
            onChange: event => {
              input.onChange(event)
              this.handleOnChange(event)
            }
          }

          return (
            <div className="field field-siren with-subtitle">
              <label
                className="SIREN"
                htmlFor="user-siren"
              >
                <h3 className="required">
                  {'SIREN '}
                </h3>
                <p>
                  {' ... de la structure que vous représentez :'}
                </p>
              </label>
              <div className="control">

                <input
                  aria-describedby="user-siren-error"
                  className="input is-normal"
                  id="user-siren"
                  name="siren"
                  placeholder="123 456 789"
                  {...inputProps}
                />
              </div>
              {fetchedName ?
                <span className="display-name">
                  {fetchedName}
                </span>
                : value &&
                <button
                  className="button is-loading"
                  type="button"
                />}
              {meta.error && meta.touched && (
                <ul
                  className="help is-danger"
                  id="user-siren-error"
                >
                  <p
                    className="help is-danger columns"
                    id="user-siren-error"
                  >
                    <span className="column is-narrow is-vcentered">
                      <img
                        alt="Attention"
                        src="/icons/picto-warning.svg"
                      />
                    </span>
                    <span className="column is-paddingless is-narrow">
                      {meta.error}
                    </span>
                  </p>
                </ul>
              )}
            </div>
          )
        }}
      </Field>
    )
  }
}


export default Siren

