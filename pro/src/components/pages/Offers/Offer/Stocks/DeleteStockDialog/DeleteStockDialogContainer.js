/*
* @debt complexity "Gaël: file nested too deep in directory structure"
* @debt standard "Gaël: prefer useSelector hook vs connect for redux (https://react-redux.js.org/api/hooks)"
*/

import { connect } from 'react-redux'

import DeleteStockDialog from 'components/pages/Offers/Offer/Stocks/DeleteStockDialog/DeleteStockDialog'
import { showNotification } from 'store/reducers/notificationReducer'

const mapDispatchToProps = dispatch => ({
  notifyDeletionSuccess: () =>
    dispatch(
      showNotification({
        type: 'success',
        text: 'Le stock a été supprimé.',
      })
    ),
  notifyDeletionError: () =>
    dispatch(
      showNotification({
        type: 'error',
        text: 'Une erreur est survenue lors de la suppression du stock.',
      })
    ),
})

export default connect(null, mapDispatchToProps)(DeleteStockDialog)
