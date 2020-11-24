import React, { useEffect, useState } from 'react'
import { Form, Field } from 'react-final-form'

import * as pcapi from 'repository/pcapi/pcapi'

import * as enums from './enums'

// import {
//   TypeField,
// } from './fields/TypeField'

const DEFAULT_FORM_VALUES = {
  type: null,
}

const OfferForm = (props) => {
  const {
    handleSubmit,
    offre,
  } = props

  const [typeOptions, setTypeOptions] = useState([])
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES)

  const subTypes

  useEffect(() => {
    // TODO generate initial form values from props.offer and others given informations
    const initialFormValues = DEFAULT_FORM_VALUES
    setFormValues(initialFormValues)
  }, [offer])

  // TODO useCallback
  const submitForm = () => {
    handleSubmit(formValues)
  }

  const submitFormButtonText = offer ? 'Enregistrer' : 'Enregistrer et passer au stocks'
  import { Field } from 'react-final-form'
  import TextAreaInput from 'components/layout/form/fields/TextAreaInput'

  import TitleField from './fields/TitleField'

  const TitleField = (props) => {

    return (
      <Field render={() => (
          <TextAreaInput
            // configure "Titre de l’offre" field
          />
        )}
      />
    )
  }
  const formLevelValidation = () => {
    // validation interchamps
  }
  const validationFunctions = {
    required: () => null,
    maxLength: () => null,
  }
  const handleOnChange = (value) => {
    setFormValues({value})
  }

  const handleOnChangeInput = () => {
    const required = () => null
    const maxLength = () => null
    if (!required(event.value)) {
      return error
    }
    /// validation

    setFormValues({value})
  }

  return (
    <Form
      className="offer-form"
      validation={formLevelValidation}
    >
      <section>
        <SelectInput
          onChange={handleOnChangeInput}
        />
        <TextField
          // ...
        />
        {/* select */}
        <Field
          validate={composeValidation(...validationFunctions)}
          onChange={handleOnChange}
          render={() => (
              <input
                // configure "Titre de l’offre" field
              />
            )}
        />


        <Field render={() => (
            <TextAreaInput
              // configure "Titre de l’offre" field
            />
          )}
        />


        <TitleField
          // configure "Titre de l’offre" field
        />


      </section>

      { formValues.type && (
        <ArtisticalInformationsSection
          type={formValues.type}
        />
      ) /* other fields from offer ...*/}
      { formValues.type && <PracticalInformationsSection /> /* venue offerer ...*/}

      <section>
        { offer ? <button type="button">{ 'Annuler' }</button> : null }
        <button
          type="button"
          click={submitForm}
        >{ submitFormButtonText }</button>
      </section>
    </Form>
    // <Form
    //   Tag={null}
    //   action={formApiPath}
    //   handleSuccess={this.onHandleFormSuccess}
    //   method={method}
    //   name="offer"
    //   patch={formInitialValues}
    //   readOnly={readOnly}
    // >
    //   <div className="field-group offer-form">
    //     <Field
    //       className="title-field"
    //       displayMaxLength
    //       isExpanded
    //       label="Titre de l’offre"
    //       maxLength={90}
    //       name="name"
    //       required
    //       type="textarea"
    //     />
    //     <Field
    //       label="Type"
    //       name="type"
    //       optionLabel="proLabel"
    //       optionValue="value"
    //       options={types}
    //       placeholder={
    //         get(formInitialValues, 'type') && !selectedOfferType
    //           ? get(formInitialValues, 'offerTypeValue')
    //           : 'Sélectionnez un type d’offre'
    //       }
    //       readOnly={offerId && selectedOfferType}
    //       required
    //       sublabel="Le type d’offre ne peut pas être modifié une fois l’offre enregistrée."
    //       type="select"
    //     />
    //     {this.hasConditionalField('musicType') && (
    //       <Fragment>
    //         <Field
    //           label="Genre musical"
    //           name="musicType"
    //           optionLabel="label"
    //           optionValue="code"
    //           options={musicOptions}
    //           setKey="extraData"
    //           type="select"
    //         />

    //         {get(musicSubOptions, 'length') > 0 && (
    //           <Field
    //             label="Sous genre"
    //             name="musicSubType"
    //             optionLabel="label"
    //             optionValue="code"
    //             options={musicSubOptions}
    //             setKey="extraData"
    //             type="select"
    //           />
    //         )}
    //       </Fragment>
    //     )}

    //     {this.hasConditionalField('showType') && (
    //       <Fragment>
    //         <Field
    //           label="Type de spectacle"
    //           name="showType"
    //           optionLabel="label"
    //           optionValue="code"
    //           options={showOptions}
    //           setKey="extraData"
    //           type="select"
    //         />

    //         {get(showSubOptions, 'length') > 0 && (
    //           <Field
    //             label="Sous type"
    //             name="showSubType"
    //             optionLabel="label"
    //             optionValue="code"
    //             options={showSubOptions}
    //             setKey="extraData"
    //             type="select"
    //           />
    //         )}
    //       </Fragment>
    //     )}
    //     {!isCreatedEntity && offer && (
    //       <div className="field is-horizontal field-text">
    //         <div className="field-label">
    //           <label
    //             className="label"
    //             htmlFor="input_offers_name"
    //           >
    //             <div className="subtitle">
    //               {isEventType ? 'Dates :' : 'Stocks :'}
    //             </div>
    //           </label>
    //         </div>
    //         <div className="field-body">
    //           <div
    //             className="control"
    //             style={{ paddingTop: '0.25rem' }}
    //           >
    //             <span
    //               className="nb-dates"
    //               style={{ paddingTop: '0.25rem' }}
    //             >
    //               {pluralize(get(stocks, 'length'), isEventType ? 'date' : 'stock')}
    //             </span>
    //             <button
    //               className="button is-primary is-outlined is-small manage-stock"
    //               disabled={offerFromNonEditableLocalProvider ? 'disabled' : ''}
    //               id="manage-stocks"
    //               onClick={this.handleOnClick(query)}
    //               type="button"
    //             >
    //               <span className="icon">
    //                 <Icon svg="ico-calendar-red" />
    //               </span>
    //               <span>
    //                 {isEventType ? 'Gérer les dates et les stocks' : 'Gérer les stocks'}
    //               </span>
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    //   {offerFromLocalProvider && offer && (
    //     <LocalProviderInformation
    //       offerId={offer.id}
    //       offererId={offererId}
    //       providerName={offer.lastProvider.name.toLowerCase()}
    //     />
    //   )}
    //   {!isCreatedEntity && offer && <MediationsManager offerId={offer.id} />}

    //   {showAllForm && (
    //     <div className="section">
    //       <h2 className="main-list-title">
    //         {'Infos pratiques'}
    //       </h2>
    //       <div className="field-group">
    //         <Field
    //           debug
    //           label="Structure"
    //           name="offererId"
    //           options={offerers}
    //           placeholder="Sélectionnez une structure"
    //           readOnly={isOffererSelectReadOnly}
    //           required
    //           type="select"
    //         />
    //         {offererHasNoPhysicalVenues && (
    //           <div className="field is-horizontal">
    //             <div className="field-label" />
    //             <div className="field-body">
    //               <p className="help is-danger">
    //                 {venue
    //                   ? 'Erreur dans les données : Le lieu rattaché à cette offre n’est pas compatible avec le type de l’offre'
    //                   : 'Il faut obligatoirement une structure avec un lieu.'}
    //                 <Field
    //                   name="__BLOCK_FORM__"
    //                   required
    //                   type="hidden"
    //                 />
    //               </p>
    //             </div>
    //           </div>
    //         )}
    //         <Field
    //           label="Lieu"
    //           name="venueId"
    //           options={this.replaceVenueNameByPublicName(venuesMatchingOfferType)}
    //           placeholder="Sélectionnez un lieu"
    //           readOnly={isVenueSelectReadOnly}
    //           required
    //           type="select"
    //         />
    //       </div>
    //       {displayDigitalOfferInformationMessage && (
    //         <div className="is-horizontal">
    //           <Insert className="yellow-insert">
    //             <p>
    //               {
    //                 "Cette offre numérique ne fera pas l'objet d'un remboursement. Pour plus d'informations sur les catégories éligibles au remboursement, merci de consulter les CGU."
    //               }
    //             </p>
    //             <div className="insert-action-link">
    //               <a
    //                 href={CGU_URL}
    //                 id="cgu-link"
    //                 rel="noopener noreferrer"
    //                 target="_blank"
    //               >
    //                 <Icon svg="ico-external-site" />
    //                 <p>
    //                   {"Consulter les Conditions Générales d'Utilisation"}
    //                 </p>
    //               </a>
    //             </div>
    //           </Insert>
    //         </div>
    //       )}
    //       <div className="field-group">
    //         {(get(venue, 'isVirtual') || url) && (
    //           <Field
    //             isExpanded
    //             label="URL"
    //             name="url"
    //             readOnly={offerFromLocalProvider}
    //             required
    //             sublabel={
    //               !readOnly &&
    //               'Vous pouvez inclure {token} {email} et {offerId} dans l’URL, qui seront remplacés respectivement par le code de la contremarque, l’e-mail de la personne ayant reservé et l’identifiant de l’offre'
    //             }
    //             type="text"
    //           />
    //         )}
    //         {currentUser.isAdmin && (
    //           <Field
    //             label="Rayonnement national"
    //             name="isNational"
    //             readOnly={offerFromLocalProvider}
    //             type="checkbox"
    //           />
    //         )}
    //         {isEventType && (
    //           <Field
    //             getDurationInHours={getDurationInHours}
    //             getDurationInMinutes={getDurationInMinutes}
    //             label="Durée"
    //             limitTimeInHours={DURATION_LIMIT_TIME}
    //             name="durationMinutes"
    //             placeholder="HH:MM"
    //             type="duration"
    //           />
    //         )}
    //         {isEventType && (
    //           <div className="select-duo-offer">
    //             <input
    //               checked={formInitialValues.isDuo}
    //               className="offer-duo-checkbox input"
    //               defaultChecked
    //               disabled={readOnly ? 'disabled' : ''}
    //               id="isDuo"
    //               onChange={this.handleCheckIsDuo}
    //               type="checkbox"
    //             />
    //             <label htmlFor="isDuo">
    //               {'Accepter les réservations '}
    //               <span className="duo-label-italic">
    //                 {'duo'}
    //               </span>
    //             </label>
    //             <span
    //               className="offer-tooltip"
    //               data-place="bottom"
    //               data-tip={
    //                 "En activant cette option, vous permettez au bénéficiaire du pass Culture de venir accompagné. La seconde place sera délivrée au même tarif que la première, quel que soit l'accompagnateur."
    //               }
    //               data-type="info"
    //             >
    //               <Icon
    //                 alt="image d’aide à l’information"
    //                 svg="picto-info"
    //               />
    //             </span>
    //           </div>
    //         )}

    //         <Field
    //           label="Email auquel envoyer les réservations"
    //           name="bookingEmail"
    //           readOnly={offerFromLocalProvider}
    //           sublabel="Merci de laisser ce champ vide si vous ne souhaitez pas recevoir d’email lors des réservations"
    //           type="email"
    //         />
    //       </div>
    //       <h2 className="main-list-title">
    //         {'Infos artistiques'}
    //       </h2>
    //       <div className="field-group large-labels">
    //         <Field
    //           displayMaxLength
    //           isExpanded
    //           label="Description"
    //           maxLength={1000}
    //           name="description"
    //           rows={readOnly ? 1 : 5}
    //           type="textarea"
    //         />

    //         {this.hasConditionalField('speaker') && (
    //           <Field
    //             label="Intervenant"
    //             name="speaker"
    //             readOnly={offerFromLocalProvider}
    //             setKey="extraData"
    //             type="text"
    //           />
    //         )}

    //         {this.hasConditionalField('author') && (
    //           <Field
    //             label="Auteur"
    //             name="author"
    //             readOnly={offerFromLocalProvider}
    //             setKey="extraData"
    //             type="text"
    //           />
    //         )}

    //         {this.hasConditionalField('visa') && (
    //           <Field
    //             isExpanded
    //             label="Visa d’exploitation"
    //             name="visa"
    //             readOnly={offerFromLocalProvider}
    //             setKey="extraData"
    //             sublabel="(obligatoire si applicable)"
    //             type="text"
    //           />
    //         )}

    //         {this.hasConditionalField('isbn') && (
    //           <Field
    //             isExpanded
    //             label="ISBN"
    //             name="isbn"
    //             readOnly={offerFromLocalProvider}
    //             setKey="extraData"
    //             sublabel="(obligatoire si applicable)"
    //             type="text"
    //           />
    //         )}

    //         {this.hasConditionalField('stageDirector') && (
    //           <Field
    //             isExpanded
    //             label="Metteur en scène"
    //             name="stageDirector"
    //             readOnly={offerFromLocalProvider}
    //             setKey="extraData"
    //           />
    //         )}

    //         {this.hasConditionalField('performer') && (
    //           <Field
    //             isExpanded
    //             label="Interprète"
    //             name="performer"
    //             readOnly={offerFromLocalProvider}
    //             setKey="extraData"
    //           />
    //         )}
    //       </div>

    //       <h2 className="main-list-title">
    //         {'Informations de retrait'}
    //       </h2>
    //       <div className="field-group large-labels">
    //         <Field
    //           displayMaxLength
    //           isExpanded
    //           label="Informations de retrait"
    //           maxLength={500}
    //           name="withdrawalDetails"
    //           rows={readOnly ? 1 : 5}
    //           type="textarea"
    //         />
    //       </div>
    //     </div>
    //   )}

    //   <hr />
    //   <div
    //     className="field is-grouped is-grouped-centered"
    //     style={{ justifyContent: 'space-between' }}
    //   >
    //     <div className="control">
    //       {readOnly && isEditableOffer && (
    //         <Link
    //           className="secondary-link"
    //           id="modify-offer-button"
    //           to={`/offres/${offerId}/edition`}
    //         >
    //           {'Modifier l’offre'}
    //         </Link>
    //       )}
    //     </div>
    //     <div className="control">
    //       {readOnly ? (
    //         <Link
    //           className="primary-link"
    //           to="/offres"
    //         >
    //           {'Terminer '}
    //           {isModifiedEntity && !isOfferActive && 'et activer'}
    //         </Link>
    //       ) : (
    //         showAllForm && (
    //           <SubmitButton className="primary-button">
    //             {'Enregistrer'}
    //             {isCreatedEntity && ' et passer ' + (isEventType ? 'aux dates' : 'aux stocks')}
    //           </SubmitButton>
    //         )
    //       )}
    //     </div>
    //   </div>
    // </Form>
  )
}

export default OfferForm
