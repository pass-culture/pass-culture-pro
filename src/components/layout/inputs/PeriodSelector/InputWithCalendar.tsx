/*
* @debt directory "Gaël: this file should be migrated within the new directory structure"
*/

import React, { forwardRef } from 'react'

type InputWithCalendarProps = { 
  customClass: string;
  ariaLabel?: string;
}
export type Ref = HTMLInputElement

const InputWithCalendar = forwardRef<Ref, InputWithCalendarProps>(
  ({ customClass, ariaLabel, ...inputProperties }, ref) =>(
    <div className={customClass}>
      <input
        aria-label={ariaLabel}
        {...inputProperties}
        ref={ref}
        type="text"
      />
    </div>
  )
)

InputWithCalendar.displayName= 'InputWithCalendar'

export default InputWithCalendar
