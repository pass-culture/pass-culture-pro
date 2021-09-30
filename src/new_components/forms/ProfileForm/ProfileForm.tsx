import { Form, Formik, FormikHelpers } from 'formik'
import React from 'react'
import * as Yup from 'yup'

import { 
  Button,
  FieldText,
} from 'ui-kit'


interface Values {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
}

interface IProps {
  initialValues: Values,
  onSubmitSuccess: () => void,
  onSubmitError: () => void,
  onCancel: () => void,
}

const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  // phoneNumber: Yup.string().email('Invalid email').required('Required'),
})

const ProfileForm = ({ 
  initialValues,
  onSubmitSuccess,
  onSubmitError,
  onCancel,
}: IProps): JSX.Element => {
  const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2))
      onSubmitSuccess()
      onSubmitError() // if error
      setSubmitting(false)
    }, 400)
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={ProfileSchema}
    >
      {() => (
        <Form>     
          <FieldText 
            label="Nom"
            name="lastName" 
          />
          <FieldText 
            label="Prénom"
            name="firstName" 
          />
          <FieldText 
            label="Email"
            name="email" 
          />
          {/* <FieldText name="phoneNumber" /> */}

          {/* <ButtonGroup> */}
          <Button 
            buttonStyle="secondary" 
            onClick={onCancel}
            text="Annuler"
          />
          <Button 
            text="Enregistrer"
            type="submit" 
          />
          {/* </ButtonGroup> */}
        </Form>
      )}
    </Formik>
  )
}

export default ProfileForm