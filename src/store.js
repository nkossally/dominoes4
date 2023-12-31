import { configureStore } from '@reduxjs/toolkit'
import valsReducer from './valsSlice'

export default configureStore({
  reducer: {
    vals: valsReducer,
  },
})