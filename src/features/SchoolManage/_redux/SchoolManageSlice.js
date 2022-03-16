import { createSlice } from '@reduxjs/toolkit'

const SchoolManageSlice = createSlice({
    name: "SchoolManage",
    initialState: {
        Levels: []
    },
    reducers: {

    },
});

const { reducer } = SchoolManageSlice;
//export const {  } = actions;
export default reducer;