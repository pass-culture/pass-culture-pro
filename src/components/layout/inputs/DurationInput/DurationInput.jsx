import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'

import InputError from '../Errors/InputError'

const getPaddedDigits = number => {
  if (number.toString().length === 1) {
    number = `0${number}`
  }
  return number
}

const DurationInput = ({
  disabled,
  error,
  label,
  name,
  onChange,
  required,
  subLabel,
  initialDurationInMinutes,
}) => {
  const [duration, setDuration] = useState(null)
  const [displayedDuration, setDisplayedDuration] = useState('')

  useEffect(() => {
    if (initialDurationInMinutes !== null) {
      const newDuration = moment.duration(initialDurationInMinutes, 'minutes')
      const hours = Math.floor(newDuration.asHours())
      const minutes = newDuration.minutes()
      setDuration(newDuration)
      setDisplayedDuration(`${hours}:${getPaddedDigits(minutes)}`)
    }
  }, [initialDurationInMinutes])

  useEffect(() => {
    if (duration) {
      const durationInMinutes = duration.asMinutes()
      if (durationInMinutes !== initialDurationInMinutes) {
        onChange(duration.asMinutes())
      }
    } else {
      onChange(null)
    }
  }, [duration, initialDurationInMinutes, onChange])

  // Add a pretty format when we leave the input.
  // 1:2 will become 1:02
  const onDurationBlur = useCallback(() => {
    const hours = Math.floor(duration.asHours())
    const minutes = duration.minutes()
    setDisplayedDuration(`${hours}:${getPaddedDigits(minutes)}`)
  }, [duration, setDisplayedDuration])

  const onDurationChange = useCallback(event => {
    // Handle empty value
    if (event.target.value === '') {
      setDuration(null)
      setDisplayedDuration('')
    }

    let newDisplayedValue = event.target.value
    const valueParts = newDisplayedValue.split(':')
    let [newHours, newMinutes] = valueParts

    // Ignore seconds or milliseconds by keeping hours and minutes only.
    if (valueParts.length > 2) {
      newDisplayedValue = `${newHours}:${newMinutes}`
    }
    // Use 0 as default minutes, when the user enter 1, we'll have hours: 1, minute: 0
    if (!newMinutes) {
      newMinutes = 0
    }
    // Do not update either duration or displayed duration if hours or minutes aren't numbers.
    const isValid = parseInt(newHours) == newHours && parseInt(newMinutes) == newMinutes
    if (!isValid) {
      return
    }
    // force maximum minutes value
    if (parseInt(newMinutes) > 59) {
      newMinutes = 59
      newDisplayedValue = `${newHours}:${newMinutes}`
    }

    setDisplayedDuration(newDisplayedValue)
    setDuration(
      moment.duration({
        hours: newHours,
        minutes: newMinutes,
      })
    )
  }, [])

  return (
    <label className="input-time">
      <div className="labels">
        {label}
        <span className="itime-sub-label">
          {subLabel}
        </span>
      </div>
      <span className={`itime-field-container ${error ? 'error' : ''}`}>
        <input
          className="itime-field"
          disabled={disabled}
          name={name}
          onBlur={onDurationBlur}
          onChange={onDurationChange}
          placeholder="HH:MM"
          required={required}
          type="text"
          value={displayedDuration}
        />
      </span>
      {error && (
        <InputError
          message={error}
          name={name}
        />
      )}
    </label>
  )
}

DurationInput.defaultProps = {
  disabled: false,
  error: null,
  initialDurationInMinutes: null,
  required: false,
  subLabel: '',
}

DurationInput.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.string,
  initialDurationInMinutes: PropTypes.number,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  subLabel: PropTypes.string,
}

export default DurationInput
