import { Field } from 'formik'
import React, { useCallback, useState, useEffect } from 'react'

import { translateMinutesToHours } from './utils/translateMinutesToHours'

type DurationPickerProps = {
    onChange: (value: number | null) => void;
    name: string;
    value: number | null;
    className?: string;
}

const DurationPicker: React.FC<DurationPickerProps> = ({ onChange, name, value, className }) => {
  const [durationInHours, setDurationInHours] = useState(translateMinutesToHours(value))

  useEffect(() => {
    setDurationInHours(translateMinutesToHours(value))
  }, [value])
    
  const onDurationBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const updatedHoursDuration = event.target.value
    
      if (updatedHoursDuration !== '') {
        const [updatedHours, updatedMinutes] = updatedHoursDuration.split(':')
    
        const updatedDurationInMinutes =
                parseInt(updatedHours || '0') * 60 + parseInt(updatedMinutes || '0')
        setDurationInHours(translateMinutesToHours(updatedDurationInMinutes))
        onChange(updatedDurationInMinutes)
      } else {
        onChange(null)
      }
    },
    [onChange]
  )
    
  const onDurationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedHoursDuration = event.target.value
    let correctedHoursDuration
    
    const hasFinishedWritingHours = /[0-9]+:/.test(updatedHoursDuration)
    if (hasFinishedWritingHours) {
      correctedHoursDuration = updatedHoursDuration?.match(/[0-9]+:[0-5]?[0-9]?/)?.[0] || '0'
      setDurationInHours(correctedHoursDuration)
    } else {
      correctedHoursDuration = updatedHoursDuration?.match(/[0-9]*/)?.[0] || '0'
      setDurationInHours(correctedHoursDuration)
    }
  }, [])

  return (
    <Field
      className={className}
      name={name}
      onBlur={onDurationBlur}
      onChange={onDurationChange}
      placeholder="HH:MM"
      value={durationInHours}
    />
  )}

export default DurationPicker