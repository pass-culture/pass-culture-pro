import React, { useCallback, useState } from 'react'

import TextInput from 'components/layout/inputs/TextInput/TextInput'
import { ReactComponent as ThumbnailSampleIcon } from 'components/pages/Offer/Offer/Thumbnail/assets/thumbnail-sample.svg'

import Icon from '../../../../../layout/Icon'
import { constraints, isOfPoorQualityURL } from '../_error_validator'

const loadImageURL = async (imageURL, crossOrigin) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    if (crossOrigin) {
      image.crossOrigin = crossOrigin
    }
    image.src = imageURL
  })
}

const ImportFromURL = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

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

  const validateImage = useCallback(
    async event => {
      event.preventDefault()
      setError('')

      try {
        const image = await loadImageURL(url, '')
        const dimensions = {
          width: image.width,
          height: image.height,
        }
        if (isOfPoorQualityURL(dimensions)) {
          setError('dimensionsURL')
          return
        }
      } catch {
        setError('format')
      }
      console.log('no error yolo')
      setUrl(url)
    },
    [url]
  )

  return (
    <form className="tnf-form">
      <ThumbnailSampleIcon />
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
      {error && (
        <ul className="tnf-mandatory">
          {fileConstraint()}
        </ul>
      )}
    </form>
  )
}
export default ImportFromURL
