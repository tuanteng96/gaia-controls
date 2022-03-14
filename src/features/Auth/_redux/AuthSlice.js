import { createSlice } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const tokenFake = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJUb2tlbklEIjoiNTg4IiwibmJmIjoxNjQ3MjI0ODk0LCJleHAiOjE2Nzg3NjA4OTQsImlhdCI6MTY0NzIyNDg5NH0.E70WFM_UAq9-TOPVkTaZCPyLXqP1xdbGYBpGK-mbrDQ';

const auth = createSlice({
    name: "auth",
    initialState: {
        Token: window.Token || tokenFake
    },
    reducers: {
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