import React from 'react'

const NEW_LINE = `
`

async function fetchCSVAndTestImports() {
  const response = await fetch('/thumb_upload_logs.csv')
  const reader = response.body.getReader()
  const file = await reader.read()

  const decoder = new TextDecoder('utf-8')
  const csv = decoder.decode(file.value)

  const urls = csv.split(NEW_LINE).map(line => line.split(',')[3])
  urls.shift()
  urls.pop()

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
