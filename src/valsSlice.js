import { createSlice } from '@reduxjs/toolkit'
import {DOMINO_KEYS_TO_VALS} from "./consts"

export const valsSlice = createSlice({
  name: 'vals',
  initialState: {
    vals: DOMINO_KEYS_TO_VALS,
  },
  reducers: {
    modifyDominoVals: (state, args) => {
      state.vals = args.payload
    },
    resetVals: (state) => {
      state.vals = DOMINO_KEYS_TO_VALS
    },
  },
})

export const { modifyDominoVals, resetVals } = valsSlice.actions

export default valsSlice.reducer