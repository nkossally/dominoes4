import { createSlice } from '@reduxjs/toolkit'

export const handSlice = createSlice({
  name: 'hand',
  initialState: {
    hand: [],
  },
  reducers: {
   
    modifyHand:(state, args) =>{
      state.hand = args.payload;
    }
  },
})

export const { modifyHand } = handSlice.actions

export default handSlice.reducer