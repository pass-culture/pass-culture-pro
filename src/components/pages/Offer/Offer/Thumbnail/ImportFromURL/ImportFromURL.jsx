import React, { Fragment, useCallback, useState } from 'react'
import loadImageURL from "react-avatar-editor/src/utils/load-image-url"

import TextInput from 'components/layout/inputs/TextInput/TextInput'
import { ReactComponent as ThumbnailSampleIcon } from 'components/pages/Offer/Offer/Thumbnail/assets/thumbnail-sample.svg'

const ImportFromURL = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [height, setHeight] = useState('')
  const [width, setWidth] = useState('')

  const checkUrl = useCallback(event => {
    const url = event.target.value

    setIsButtonDisabled(url === '')
    setUrl(url)
  }, [])


  const validateImage = useCallback(event => {
    event.preventDefault()

    loadImageURL(url, "").then((e) => {

      setImage(e)
      setWidth(e.width)
      setHeight(e.height)
    })

    setUrl(url)
  }, [url],
  )

  return (
    <Fragment>
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
      </form>
      {image && (
        <img
          alt=""
          height={height}
          src={url}
          width={width}
        />
      )}
    </Fragment>
  )

}
export default ImportFromURL
