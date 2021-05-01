import React from 'react'

import urls from './urls.json'

async function fetchCSVAndTestImports() {
  for await (const url of urls) {
    console.log(url)
    await fetch(url)
  }
}

const TestImport = () => (
  <button
    onClick={fetchCSVAndTestImports}
    type="button"
  >
    {'Test imort'}
  </button>
)

export default TestImport
