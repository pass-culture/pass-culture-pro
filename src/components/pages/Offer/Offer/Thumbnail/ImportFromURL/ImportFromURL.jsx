import React, { Fragment, useCallback, useState } from 'react'

import TextInput from 'components/layout/inputs/TextInput/TextInput'
import { ReactComponent as ThumbnailSampleIcon } from 'components/pages/Offer/Offer/Thumbnail/assets/thumbnail-sample.svg'
import {constraints} from "../_error_validator";
import Icon from "../../../../../layout/Icon";


const loadImageURL = (imageURL) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.crossOrigin = ''
    image.src = imageURL
  })
}


const ImportFromURL = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [height, setHeight] = useState('')
  const [width, setWidth] = useState('')
  const [error, setError] = useState('')

  const getError = async file => {
    for (const constraint of constraints) {
      if (await constraint.validator(file)) return Promise.resolve(constraint.id)
    }
    return Promise.resolve('')
  }

  const fileConstraint = () =>
    constraints.map(constraint => {
      let description = constraint.description

      if (error === constraint.id) {
        description = (
          <strong
            aria-live="assertive"
            aria-relevant="all"
          >
            <Icon svg="ico-notification-error-red" />
            {description}
          </strong>
        )
      }

      return (
        <li key={constraint.id}>
          {description}
        </li>
      )
    })

  const checkUrl = useCallback(event => {
    const url = event.target.value

    setIsButtonDisabled(url === '')
    setUrl(url)
  }, [])


  const validateImage = useCallback(event => {
    event.preventDefault()

    loadImageURL(url).then((e) => {
      setImage(e)
      setWidth(e.width)
      setHeight(e.height)
      // const error = getError(e)
      // setError(error)
      console.log('On est dans loadImageURL')
    }).catch(
      (imageCreationError) => {
        setError('format')
        console.log(imageCreationError)
      }
    )


    setUrl(url)
  }, [url],
  )

  return (
    <Fragment>
      <form className="tnf-form">
        <ThumbnailSampleIcon/>
        <p className="tnf-info">
          {'Utilisez de préférence un visuel en orientation portrait'}
        </p>
        <TextInput
          label="URL de l’image"
          name="url"
          onChange={checkUrl}
          placeholder="Ex : http://..."
          type="url"
          value={url}
        />
        <button
          className="primary-button tnf-url-button"
          disabled={isButtonDisabled}
          onClick={validateImage}
          type="submit"
        >
          {'Valider'}
        </button>
      </form>
      {error && (
        <ul>
          {fileConstraint()}
        </ul>
      )
      }

    </Fragment>
  )

}
export default ImportFromURL
