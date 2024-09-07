// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//     positions: {x:0,y:0,z:0},
//     score:0,
//     forwardObject:true
// }

// export const positionSlice = createSlice({
//   name: 'position',
//   initialState,
//   reducers: {
//     giveOut: (state,payload) => {
//       state.positions=payload
//     },
//     score:(state,{payload})=>{
       
//           state.score+=payload
//     },
//     isForward:(state)=>{
//           state.forwardObject= !(state.forwardObject)
//     }
//   },
// })


// export const { giveOut,score ,isForward } = positionSlice.actions

// export default positionSlice.reducer


import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  positions: { x: 0, y: 0, z: 0 },
  score: 0,
  forwardObject: true
};

export const positionSlice = createSlice({
  name: 'position',
  initialState,
  reducers: {
    giveOut: (state, { payload }) => {
      state.positions = payload;
    },
    score: (state, { payload }) => {
      state.score += payload;
    },
    isForward: (state) => {
      state.forwardObject = !state.forwardObject;
    },
    resetGame: (state) => {
      state.positions = { x: 0, y: 0, z: 0 };
      state.score = 0;
      state.forwardObject = true;
    }
  },
});

export const { giveOut, score, isForward, resetGame } = positionSlice.actions;

export default positionSlice.reducer;
