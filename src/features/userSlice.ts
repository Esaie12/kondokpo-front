// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from '../models/UserType';

const initialState: UserState = {
    user: null,
    connected: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart(state) {
            state.connected = false;
            state.error = null;
        },
        loginSuccess(state, action: PayloadAction<User>) {
            state.connected = true;
            state.user = action.payload;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.connected = false;
            state.error = action.payload;
        },
        logout(state) {
            state.user = null;
            state.connected = false;
            state.error = null;
        },
        /*setActifShop(state, action: PayloadAction<number>) {
          if (state.user) {
            state.user.actif_boutique_id = action.payload;
          }
        },*/
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;
export default userSlice.reducer;
