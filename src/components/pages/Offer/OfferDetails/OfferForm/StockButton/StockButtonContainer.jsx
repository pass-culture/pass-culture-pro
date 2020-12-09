import { connect } from 'react-redux'

import StockButton from './StockButton'

const mapDispatchToProps = (dispatch) => {
  return { dispatch }
}

export default connect(null, mapDispatchToProps)(StockButton)
