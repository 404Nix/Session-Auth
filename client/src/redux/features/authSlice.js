import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    isLoading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccesstoken: (state, action) => {
            state.accessToken = action.payload;
        },
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setAccesstoken, setCredentials, logout, setLoading } =
    authSlice.actions;

export default authSlice.reducer;
