import { createSlice } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const tokenFake = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJUb2tlbklEIjoiNTg1IiwibmJmIjoxNjQ3MTgxMTUxLCJleHAiOjE2Nzg3MTcxNTEsImlhdCI6MTY0NzE4MTE1MX0.jo3YvwXzk2AsutHG1QcHb3L92UQkJW4GWkWJqPpNYBk';

const auth = createSlice({
    name: "auth",
    initialState: {
        Token: window.Token || tokenFake
    },
    reducers: {
        setUser: (state, action) => {
            return {
                ...state,
                user: action.payload
            };
        },
        logoutUser: (state, action) => {
            localStorage.removeItem("_info_review");
            window.location.href = process.env.REACT_APP_API_URL + "/on-tap.aspx"
        }
    }
});

const persistConfig = {
    key: 'auth',
    storage: storage,
    //blacklist: ['user']
};

const { reducer, actions } = auth;
export const { setUser, logoutUser } = actions;
export default persistReducer(persistConfig, reducer);