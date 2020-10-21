import { API_URL } from 'utils/config'

import * as offers from './pcapi/offers'

function buildOptions(method, withCredentials = true) {
  const options = {
    headers: { 'Content-Type': 'application/json' },
    method: method,
  }
  if (withCredentials) {
    options.credentials = 'include'
  }
  return options
}
function buildUrl(path) {
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`
}

async function fetchWithErrorHandler(path, options) {
  const response = await fetch(buildUrl(path), options)
  if (!response.ok) {
    throw Error('HTTP error')
  }
  const results = response.statusText !== 'NO CONTENT' ? await response.json() : null
  return Promise.resolve(results)
}

export const client = {
  get: async (path, withCredentials = true) => {
    return await fetchWithErrorHandler(path, buildOptions('GET', withCredentials))
  },
  post: async (path, data, withCredentials = true) => {
    const options = {
      ...buildOptions('POST', withCredentials),
      body: JSON.stringify(data),
    }
    return await fetchWithErrorHandler(path, options)
  },
  patch: async (path, data, withCredentials = true) => {
    const options = {
      ...buildOptions('PATCH', withCredentials),
      body: JSON.stringify(data),
    }
    return await fetchWithErrorHandler(path, options)
  },
}

export default {
  offers,
}
