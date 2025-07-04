// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';


export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Types globaux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
