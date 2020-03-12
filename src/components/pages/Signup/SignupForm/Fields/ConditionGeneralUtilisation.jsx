import React from "react"

function ConditionGeneralUtilisation() {
  return (
    <div
      className="field field-checkbox cgu-field"
    >
      <label
        className="required"
        htmlFor="user-cgu_ok"
      >
        <input
          aria-describedby="user-cgu_ok-error"
          className="input"
          id="user-cgu_ok"
          name="cgu_ok"
          required=""
          type="checkbox"
          value=""
        />
        {'J’ai lu et j’accepte les '}
        <a
          href="https://docs.passculture.app/textes-normatifs"
          id="accept-cgu-link"
          rel="noopener noreferrer"
          target="_blank"
        >
          {'Conditions Générales d’Utilisation'}
        </a>
      </label>
    </div>
  )
}

export default ConditionGeneralUtilisation
