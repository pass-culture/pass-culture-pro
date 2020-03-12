import React from "react"

function Newsletter() {
  return (
    <div className="field field-checkbox">
      <label
        className=""
        htmlFor="user-newsletter_ok"
      >
        <input
          aria-describedby="user-newsletter_ok-error"
          className="input"
          id="user-newsletter_ok"
          name="newsletter_ok"
          type="checkbox"
          value=""
        />
        {'Je souhaite recevoir les actualités du pass Culture'}
      </label>
    </div>
  )
}

export default Newsletter
