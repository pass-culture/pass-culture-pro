import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router'

import {
  MIN_IMAGE_HEIGHT,
  MIN_IMAGE_WIDTH,
} from 'components/pages/Offer/Offer/Thumbnail/_constants'
import ThumbnailDialog from 'components/pages/Offer/Offer/Thumbnail/ThumbnailDialog'

export const createImageFile = ({
  name = 'example.png',
  type = 'image/png',
  sizeInMB = 1,
  width = MIN_IMAGE_WIDTH,
  height = MIN_IMAGE_HEIGHT,
} = {}) => {
  const file = createFile({ name, type, sizeInMB })
  jest.spyOn(global, 'createImageBitmap').mockResolvedValue({ width, height })
  return file
}

export const createFile = ({
  name = 'example.json',
  type = 'application/json',
  sizeInMB = 1,
} = {}) => {
  const oneMB = 1024 * 1024
  const file = new File([''], name, { type })
  Object.defineProperty(file, 'size', { value: oneMB * sizeInMB })
  return file
}

export const renderThumbnail = ({
  setIsModalOpened = jest.fn(),
  setThumbnailInfo = jest.fn(),
} = {}) => {
  render(
    <MemoryRouter>
      <ThumbnailDialog
        setIsModalOpened={setIsModalOpened}
        setPreview={jest.fn()}
        setThumbnailInfo={setThumbnailInfo}
      />
    </MemoryRouter>
  )
}
