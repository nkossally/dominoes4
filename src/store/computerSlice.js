import { createSlice } from '@reduxjs/toolkit'

export const computerSlice = createSlice({
  name: 'computerHand',
  initialState: {
    computerHand: [],
  },
  reducers: {

    modifyComputerHand: (state, args) =>{
      state.computerHand = args.payload;
    },

  },
})

export const { modifyComputerHand } = computerSlice.actions

export default computerSlice.reducer