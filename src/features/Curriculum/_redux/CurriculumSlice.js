import { createSlice } from '@reduxjs/toolkit';

const CurriculumSlice = createSlice({
    name: "Curriculum",
    initialState: {
        Status: [{
            value: 0,
            label: "Ngừng hoạt động"
        }, {
            value: 1,
            label: "Hoạt động"
        }],
    },
    reducers: {

    },
    extraReducers: {}
});

const { reducer } = CurriculumSlice;
//export const {  } = actions;
export default reducer;