/*
* @debt rtl "Gaël: this file contains eslint error(s) based on eslint-testing-library plugin"
* @debt complexity "Gaël: file nested too deep in directory structure"
* @debt rtl "Gaël: bad use of act in testing library"
*/

import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'

import ActivationCodesUploadDialog from 'components/pages/Offers/Offer/Stocks/ActivationCodesUploadDialog/ActivationCodesUploadDialog'
import { configureTestStore } from 'store/testUtils'

const renderActivationCodesUploadDialog = async (store, props = {}) => {
  return await act(async () => {
    return render(
      <Provider store={store}>
        <ActivationCodesUploadDialog {...props} />
      </Provider>
    )
  })
}

describe('activationCodesUploadDialog', () => {
  describe('uI Tests', () => {
    let store

    beforeEach(() => {
      store = configureTestStore({
        data: {
          users: [
            {
              id: 'test_id',
              hasSeenProTutorials: true,
            },
          ],
        },
      })
    })

    it('should display an error when the file violates activation codes upload checks', async () => {
      // Given
      const props = {
        activationCodes: [],
        changeActivationCodesExpirationDatetime: jest.fn(),
        closeDialog: jest.fn(),
        setActivationCodes: jest.fn(),
        today: new Date(),
        validateActivationCodes: jest.fn(),
      }

      // When
      await renderActivationCodesUploadDialog(store, props)

      const uploadButton = screen.getByLabelText('Importer un fichier .csv depuis l’ordinateur')
      const file = new File(['ABH\nJHB\nJHB\nCEG\nCEG'], 'activation_codes.csv', {
        type: 'text/csv',
      })

      expect(screen.getByTestId('activation-codes-upload-icon-id')).toBeInTheDocument()

      fireEvent.change(uploadButton, {
        target: {
          files: [file],
        },
      })

      // Then
      expect(
        await screen.findByText(/Une erreur s’est produite lors de l’import de votre fichier/i)
      ).toBeInTheDocument()

      expect(
        await screen.findByText(
          'Plusieurs codes identiques ont été trouvés dans le fichier : JHB, CEG.'
        )
      ).toBeInTheDocument()

      expect(await screen.getByTestId('activation-codes-upload-error-icon-id')).toBeInTheDocument()
    })
  })
})
