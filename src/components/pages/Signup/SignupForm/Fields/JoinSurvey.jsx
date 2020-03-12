import React from "react"

function JoinSurvey() {
  return (
    <div className="field field-checkbox">
      <label
        className=""
        htmlFor="user-contact_ok"
      >
        <input
          aria-describedby="user-contact_ok-error"
          className="input"
          id="user-contact_ok"
          name="contact_ok"
          type="checkbox"
          value=""
        />
        {'J’accepte d\'être contacté par e-mail pour donner mon avis sur le pass Culture'}
      </label>
    </div>
  )
}

export default JoinSurvey
