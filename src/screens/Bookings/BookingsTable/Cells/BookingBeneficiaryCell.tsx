import React from 'react'

import styles from './Cells.module.scss'

interface IBeneficiaryCellProps {
  value: ITableBooking['beneficiary'];
}

const BeneficiaryCell = ({ value }: IBeneficiaryCellProps): JSX.Element => {
  const beneficiaryName = value.lastname.concat(' ', value.firstname)
  return (
    <div>
      <span>
        {beneficiaryName}
      </span>
      <br />
      <span className={styles['beneficiary-subtitle']}>
        {value.email}
      </span>
      <br />
      <span className={styles['beneficiary-subtitle']}>
        {value.phonenumber}
      </span>
    </div>
  )
}

export default BeneficiaryCell
