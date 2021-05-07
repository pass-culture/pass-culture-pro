import * as d3 from 'd3-fetch'
import React from 'react'

async function fetchCSVAndPrintUrls() {
  d3.csv('/thumb_upload_logs.csv').then(function (data) {
    console.log(JSON.stringify(data.map(record => record['jsonPayload.extra.url'])))
  })
}

const ConvertUrls = () => (
  <button
    onClick={fetchCSVAndPrintUrls}
    type="button"
  >
    {'Convert URLs'}
  </button>
)

export default ConvertUrls
