import { createSlice } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const auth = createSlice({
    name: "auth",
    initialState: {
        Token: window.Token
    },
    reducers: {
        setToken: (state, action) => {
            return {
                ...state,
                Token: action.payload
            }
        }
    }
});

const persistConfig = {
    key: 'auth',
    storage: storage,
    //blacklist: ['user']
};

const { reducer, actions } = auth;
export const { setToken } = actions;
export default persistReducer(persistConfig, reducer);