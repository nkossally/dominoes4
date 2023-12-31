import { configureStore } from '@reduxjs/toolkit'
import valsReducer from './valsSlice'
import computerHandReducer from './computerSlice'
import handReducer from './handSlice'

export default configureStore({
  reducer: {
    vals: valsReducer,
    hand: handReducer,
    computerHand: computerHandReducer,
  },
})