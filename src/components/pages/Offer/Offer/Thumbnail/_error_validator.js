import { IMAGE_TYPE, MAX_IMAGE_SIZE, MIN_IMAGE_HEIGHT, MIN_IMAGE_WIDTH } from './_constants'

export const isOfPoorQualityURL = dimensions => {
  const { height, width } = dimensions
  return height < MIN_IMAGE_HEIGHT || width < MIN_IMAGE_WIDTH
}

const isNotAnImage = async image => !IMAGE_TYPE.includes(image.type)
const isTooBig = async image => image.size > MAX_IMAGE_SIZE
const isOfPoorQuality = async image => {
  const { height, width } = await createImageBitmap(image)
  return height < MIN_IMAGE_HEIGHT || width < MIN_IMAGE_WIDTH
}

export const constraints = [
  {
    id: 'format',
    description: 'Formats supportés : JPG, PNG',
    validator: isNotAnImage,
  },
  {
    id: 'size',
    description: 'Le poids du fichier ne doit pas dépasser 10 Mo',
    validator: isTooBig,
  },
  {
    id: 'dimensions',
    description: 'La taille de l’image doit être supérieure à 400 x 400px',
    validator: isOfPoorQuality,
  },
  {
    id: 'dimensionsURL',
    description: 'La taille de l’image doit être supérieure à 400 x 400px URL',
    validator: isOfPoorQualityURL,
  },
]
