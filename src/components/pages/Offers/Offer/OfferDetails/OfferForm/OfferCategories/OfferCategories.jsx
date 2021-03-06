import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import Select, { buildSelectOptions } from 'components/layout/inputs/Select'

import { DEFAULT_FORM_VALUES } from '../_constants'

import { SubtypeSelects } from './SubtypeSelects'

const OfferCategories = ({
  isTypeOfflineButOnlyVirtualVenues,
  readOnlyFields,
  categoriesFormValues,
  updateCategoriesFormValues,
}) => {
  const categories = useSelector(state => state.offers.categories)
  const categoriesOptions = buildSelectOptions(
    'id',
    'proLabel',
    categories.categories.filter(category => category.isSelectable)
  )
  const [subCategoriesOptions, setSubCategoriesOptions] = useState(null)
  const [subCategoryConditionalFields, setSubCategoryConditionalFields] = useState([])

  useEffect(
    function onCategoryChange() {
      if (categoriesFormValues.categoryId !== DEFAULT_FORM_VALUES.categoryId) {
        const options = categories.subCategories.filter(
          subCategory => subCategory.categoryId === categoriesFormValues.categoryId
        )
        setSubCategoriesOptions(buildSelectOptions('id', 'proLabel', options))
      } else {
        setSubCategoriesOptions(null)
      }
    },
    [categoriesFormValues.categoryId, categories.subCategories, updateCategoriesFormValues]
  )

  useEffect(
    function onSubCategoryChange() {
      if (categoriesFormValues.subcategoryId !== DEFAULT_FORM_VALUES.subcategoryId) {
        const currentSubCategoryConditionalFields = categories.subCategories
          .find(subCategory => categoriesFormValues.subcategoryId === subCategory.id)
          .conditionalFields.filter(field => field === 'musicType' || field === 'showType')

        setSubCategoryConditionalFields(currentSubCategoryConditionalFields)
      } else {
        setSubCategoryConditionalFields([])
      }
    },
    [categoriesFormValues.subcategoryId, categories.subCategories]
  )

  const handleChange = useCallback(
    event => {
      const fieldName = event.target.name
      const fieldValue = event.target.value

      if (categoriesFormValues[fieldName] === fieldValue) {
        return
      }

      let newCategoriesFormValues = {}

      switch (fieldName) {
        case 'categoryId':
          newCategoriesFormValues = {
            categoryId: fieldValue,
            subcategoryId: DEFAULT_FORM_VALUES.subcategoryId,
            musicType: DEFAULT_FORM_VALUES.musicType,
            musicSubType: DEFAULT_FORM_VALUES.musicSubType,
            showType: DEFAULT_FORM_VALUES.showType,
            showSubType: DEFAULT_FORM_VALUES.showSubType,
          }
          break
        case 'subcategoryId':
          newCategoriesFormValues = {
            ...categoriesFormValues,
            subcategoryId: fieldValue,
            musicType: DEFAULT_FORM_VALUES.musicType,
            musicSubType: DEFAULT_FORM_VALUES.musicSubType,
            showType: DEFAULT_FORM_VALUES.showType,
            showSubType: DEFAULT_FORM_VALUES.showSubType,
          }
          break
        case 'musicType':
          newCategoriesFormValues = {
            ...categoriesFormValues,
            musicType: fieldValue,
            musicSubType: DEFAULT_FORM_VALUES.musicSubType,
            showType: DEFAULT_FORM_VALUES.showType,
            showSubType: DEFAULT_FORM_VALUES.showSubType,
          }
          break
        case 'showType':
          newCategoriesFormValues = {
            ...categoriesFormValues,
            musicType: DEFAULT_FORM_VALUES.musicType,
            musicSubType: DEFAULT_FORM_VALUES.musicSubType,
            showType: fieldValue,
            showSubType: DEFAULT_FORM_VALUES.showSubType,
          }
          break
        default:
          newCategoriesFormValues = {
            ...categoriesFormValues,
            [fieldName]: fieldValue,
          }
      }

      updateCategoriesFormValues(newCategoriesFormValues)
    },
    [categoriesFormValues, updateCategoriesFormValues]
  )

  return (
    <>
      <div className="form-row">
        <Select
          defaultOption={{
            displayName: `Choisir une catégorie`,
            id: DEFAULT_FORM_VALUES.categoryId,
          }}
          handleSelection={handleChange}
          isDisabled={readOnlyFields.includes('categoryId')}
          label="Catégorie"
          name="categoryId"
          options={categoriesOptions}
          required
          selectedValue={categoriesFormValues.categoryId || DEFAULT_FORM_VALUES.categoryId}
        />
      </div>

      {subCategoriesOptions && (
        <div className="form-row">
          <Select
            defaultOption={{
              displayName: `Choisir une sous-catégorie`,
              id: DEFAULT_FORM_VALUES.subcategoryId,
            }}
            handleSelection={handleChange}
            isDisabled={readOnlyFields.includes('subcategoryId')}
            label="Sous-catégorie"
            name="subcategoryId"
            options={subCategoriesOptions}
            required
            selectedValue={categoriesFormValues.subcategoryId || DEFAULT_FORM_VALUES.subcategoryId}
          />
        </div>
      )}

      {!isTypeOfflineButOnlyVirtualVenues && subCategoryConditionalFields.length > 0 && (
        <SubtypeSelects
          categoriesFormValues={categoriesFormValues}
          currentSubCategoryConditionalFields={subCategoryConditionalFields}
          handleSelection={handleChange}
          readOnlyFields={readOnlyFields}
        />
      )}
    </>
  )
}

OfferCategories.defaultProps = {
  isTypeOfflineButOnlyVirtualVenues: false,
}

OfferCategories.propTypes = {
  categoriesFormValues: PropTypes.shape({
    musicSubType: PropTypes.string,
    musicType: PropTypes.string,
    showSubType: PropTypes.string,
    showType: PropTypes.string,
    categoryId: PropTypes.string,
    subcategoryId: PropTypes.string,
  }).isRequired,
  isTypeOfflineButOnlyVirtualVenues: PropTypes.bool,
  readOnlyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateCategoriesFormValues: PropTypes.func.isRequired,
}

export default OfferCategories
