import { createSlice } from '@reduxjs/toolkit'

const TeacherSlice = createSlice({
    name: "Teacher",
    initialState: {
        Status: [{
            value: 0,
            label: "Vô hiệu hóa"
        }, {
            value: 1,
            label: "Hoạt động"
        }]
    },
    reducers: {

    },
});

const { reducer } = TeacherSlice;
//export const {  } = actions;
export default reducer;