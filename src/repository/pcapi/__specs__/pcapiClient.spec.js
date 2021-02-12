import fetch from 'jest-fetch-mock'

import { client } from 'repository/pcapi/pcapiClient'

import { API_URL } from '../../../utils/config'

describe('pcapiClient', () => {
  beforeEach(() => {
    fetch.mockResponse(JSON.stringify({}), { status: 200 })
  })

  afterEach(() => {
    fetch.resetMocks()
  })

  describe('get', () => {
    it('should call API with given path and JSON Mime type and credentials by default and correct method', async () => {
      // Given
      const path = '/bookings/pro'

      // When
      await client.get(path)

      // Then
      expect(fetch).toHaveBeenCalledWith(`${API_URL}${path}`, {
        credentials: 'include',
        method: 'GET',
      })
    })

    it('should call API without credentials when not required', async () => {
      // Given
      const path = '/bookings/pro'

      // When
      await client.get(path, false)

      // Then
      expect(fetch).toHaveBeenCalledWith(`${API_URL}${path}`, {
        method: 'GET',
      })
    })

    it('should return json if return status is ok', async () => {
      // Given
      const oneBooking = {
        beneficiary: { email: 'user@example.com', firstname: 'First', lastname: 'Last' },
        booking_date: '2020-04-12T19:31:12Z',
        booking_is_duo: false,
        booking_status: 'reimbursed',
        booking_token: 'TOKEN',
        stock: { offer_name: 'My offer name' },
      }
      const paginatedBookingRecapReturned = {
        page: 1,
        pages: 1,
        total: 1,
        bookings_recap: [oneBooking],
      }
      fetch.mockResponseOnce(JSON.stringify(paginatedBookingRecapReturned), { status: 200 })

      // When
      const response = await client.get('/bookings/pro')

      // Then
      expect(response.bookings_recap).toHaveLength(1)
      expect(response).toStrictEqual(paginatedBookingRecapReturned)
    })

    it('should return promise if return status is not ok', async () => {
      // Given
      fetch.mockResponseOnce('Error happened', { status: 401 })

      // When
      const response = client.get('/bookings/pro')

      // Then
      await expect(response).toBe(response)
    })
  })

  describe('post', () => {
    it('should call API with given path and body and JSON Mime type and credentials by default and correct method', async () => {
      // Given
      const path = '/bookings/pro'
      const body = {
        key: 'value',
      }

      // When
      await client.post(path, body)

      // Then
      expect(fetch).toHaveBeenCalledWith(`${API_URL}${path}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"key":"value"}',
      })
    })

    it('should call API without credentials when not required', async () => {
      // Given
      const path = '/bookings/pro'
      const body = {
        key: 'value',
      }

      // When
      await client.post(path, body, false)

      // Then
      expect(fetch).toHaveBeenCalledWith(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"key":"value"}',
      })
    })
  })

  describe('postWithFormData', () => {
    it('should call API with given path and formData and credentials by default and correct method', async () => {
      // Given
      const path = '/mediations'
      const file = new File([''], 'myThumb.png')
      const body = new FormData()
      body.append('offerId', 'AA')
      body.append('offererId', 'BB')
      body.append('credit', 'Mon crédit')
      body.append('croppingRect[x]', '12')
      body.append('croppingRect[y]', '32')
      body.append('croppingRect[height]', '350')
      body.append('thumb', file)

      // When
      await client.postWithFormData(path, body)

      // Then
      expect(fetch).toHaveBeenCalledWith(`${API_URL}${path}`, {
        credentials: 'include',
        headers: { 'encode': 'multipart/form-data' },
        method: 'POST',
        body: body,
      })
    })

    it('should call API without credentials when not required', async () => {
      // Given
      const path = '/mediations'
      const file = new File([''], 'myThumb.png')
      const body = new FormData()
      body.append('offerId', 'AA')
      body.append('offererId', 'BB')
      body.append('credit', 'Mon crédit')
      body.append('croppingRect[x]', '12')
      body.append('croppingRect[y]', '32')
      body.append('croppingRect[height]', '350')
      body.append('thumb', file)

      // When
      await client.postWithFormData(path, body, false)

      // Then
      expect(fetch).toHaveBeenCalledWith(`${API_URL}${path}`, {
        headers: { 'encode': 'multipart/form-data' },
        method: 'POST',
        body: body,
      })
    })
  })

  describe('patch', () => {
    it('should call API with given path and body and JSON Mime type and credentials by default and correct method', async () => {
      // Given
      const path = '/bookings/pro'
      const body = {
        key: 'value',
      }

      // When
      await client.patch(path, body)

      // Then
      expect(fetch).toHaveBeenCalledWith(`${API_URL}${path}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
        body: '{"key":"value"}',
      })
    })

    it('should call API without credentials when not required', async () => {
      // Given
      const path = '/bookings/pro'
      const body = {
        key: 'value',
      }

      // When
      await client.patch(path, body, false)

      // Then
      expect(fetch).toHaveBeenCalledWith(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
        body: '{"key":"value"}',
      })
    })
  })

  describe('delete', () => {
    it('should call API with given path and JSON Mime type and credentials by default and correct method', async () => {
      // Given
      const path = '/stocks/123'

      // When
      await client.delete(path)

      // Then
      expect(fetch).toHaveBeenCalledWith(`${API_URL}${path}`, {
        credentials: 'include',
        method: 'DELETE',
      })
    })

    it('should call API without credentials when not required', async () => {
      // Given
      const path = '/stocks/123'

      // When
      await client.delete(path, false)

      // Then
      expect(fetch).toHaveBeenCalledWith(`${API_URL}${path}`, {
        method: 'DELETE',
      })
    })

    it('should return json if return status is ok', async () => {
      // Given
      fetch.mockResponseOnce(JSON.stringify({ id: '123' }), { status: 200 })

      // When
      const response = await client.delete('/stocks/123')

      // Then
      expect(response.id).toBe('123')
    })
  })
})
