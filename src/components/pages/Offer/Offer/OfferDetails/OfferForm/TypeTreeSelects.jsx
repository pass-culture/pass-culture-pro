import PropTypes from 'prop-types'
import React, { Fragment, useCallback, useEffect, useState } from 'react'

import Select, { buildSelectOptions } from 'components/layout/inputs/Select'
import { SubtypeSelects } from 'components/pages/Offer/Offer/OfferDetails/OfferForm/SubtypeSelects'

import { musicOptionsTree, showOptionsTree } from '../subTypes'

import { DEFAULT_FORM_VALUES } from './_constants'

const TypeTreeSelects = props => {
  const { areSubtypesVisible, isReadOnly, onTypeChange, onSubTypeChange, types, typeValues } = props

  const typeOptions = buildSelectOptions('value', 'proLabel', types)
  const [subTypeOptions, setSubTypeOptions] = useState({
    musicType: [],
    musicSubType: [],
    showType: [],
    showSubType: [],
  })

  const hasConditionalField = useCallback(
    (typeValue, fieldName) => {
      if (!typeValue || !typeValue.length) {
        return false
      }

      const selectedType = types.find(type => type.value === typeValue)
      if (!selectedType) return false

      return selectedType.conditionalFields.includes(fieldName)
    },
    [types]
  )

  const buildTreeSelectOptions = useCallback(
    fieldName => {
      if (
        isReadOnly &&
        (!typeValues[fieldName] || typeValues[fieldName] === DEFAULT_FORM_VALUES[fieldName])
      ) {
        return []
      }

      if (fieldName === 'type') {
        return buildSelectOptions('value', 'proLabel', types)
      }

      if (typeValues.type !== DEFAULT_FORM_VALUES.type) {
        switch (fieldName) {
          case 'musicType': {
            if (hasConditionalField(typeValues.type, 'musicType')) {
              return buildSelectOptions('code', 'label', musicOptionsTree)
            }
            break
          }
          case 'showType': {
            if (hasConditionalField(typeValues.type, 'showType')) {
              return buildSelectOptions('code', 'label', showOptionsTree)
            }
            break
          }
          case 'musicSubType': {
            if (
              typeValues.musicType !== undefined &&
              typeValues.musicType !== DEFAULT_FORM_VALUES.musicType &&
              hasConditionalField(typeValues.type, 'musicType')
            ) {
              const musicType = musicOptionsTree.find(
                musicType => musicType.code === parseInt(typeValues.musicType)
              )
              return buildSelectOptions('code', 'label', musicType.children)
            }
            break
          }
          case 'showSubType': {
            if (
              typeValues.showType !== undefined &&
              typeValues.showType !== DEFAULT_FORM_VALUES.musicType &&
              hasConditionalField(typeValues.type, 'showType')
            ) {
              const showType = showOptionsTree.find(
                showType => showType.code === parseInt(typeValues.showType)
              )
              return buildSelectOptions('code', 'label', showType.children)
            }
            break
          }
        }
      }

      return []
    },
    [hasConditionalField, isReadOnly, types, typeValues]
  )

  useEffect(() => {
    setSubTypeOptions({
      musicType: buildTreeSelectOptions('musicType'),
      musicSubType: buildTreeSelectOptions('musicSubType'),
      showType: buildTreeSelectOptions('showType'),
      showSubType: buildTreeSelectOptions('showSubType'),
    })
  }, [buildTreeSelectOptions])

  const handleChange = useCallback(
    event => {
      const fieldName = event.target.name
      const fieldValue = event.target.value
      let newTypeValues = {
        ...typeValues,
        [fieldName]: fieldValue,
      }

      if (typeValues[fieldName] === newTypeValues[fieldName]) {
        return
      }

      const resetFieldsByChangedField = {
        type: ['musicType', 'musicSubType', 'showType', 'showSubType'],
        musicType: ['musicSubType', 'showType', 'showSubType'],
        musicSubType: [],
        showType: ['musicType', 'musicSubType', 'showSubType'],
        showSubType: [],
      }
      resetFieldsByChangedField[fieldName].forEach(fieldName => {
        newTypeValues[fieldName] = DEFAULT_FORM_VALUES[fieldName]
      })

      onTypeChange(newTypeValues.type)
      delete newTypeValues.type
      onSubTypeChange(newTypeValues)
    },
    [onTypeChange, onSubTypeChange, typeValues]
  )

  return (
    <Fragment>
      <div className="form-row">
        <Select
          defaultOption={{
            displayName: 'Choisir un type',
            id: DEFAULT_FORM_VALUES.type,
          }}
          handleSelection={handleChange}
          isDisabled={isReadOnly}
          label="Type"
          name="type"
          options={typeOptions}
          required
          selectedValue={typeValues.type || DEFAULT_FORM_VALUES.type}
        />
      </div>
      <SubtypeSelects
        areSubtypesVisible={areSubtypesVisible}
        disabled={isReadOnly}
        handleSelection={handleChange}
        subTypeOptions={subTypeOptions}
        typeValues={typeValues}
      />
    </Fragment>
  )
}

TypeTreeSelects.propTypes = {
  areSubtypesVisible: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  onSubTypeChange: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  typeValues: PropTypes.shape().isRequired,
  types: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default TypeTreeSelects
