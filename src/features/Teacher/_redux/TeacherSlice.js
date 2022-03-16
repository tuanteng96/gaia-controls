import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SchoolManageCrud from '../../SchoolManage/_redux/SchoolManageCrud';

export const fetchLevelSchool = createAsyncThunk(
    'school/levels',
    async(data) => {
        const { data: result } = await SchoolManageCrud.getAllLevel(data);
        return result
    });

const TeacherSlice = createSlice({
    name: "Teacher",
    initialState: {
        Status: [{
            value: 0,
            label: "Vô hiệu hóa"
        }, {
            value: 1,
            label: "Hoạt động"
        }],
        loading: {
            fetchLevels: false
        },
        error: {
            fetchLevels: ""
        },
        listLevels: [],
    },
    reducers: {

    },
    extraReducers: {
        [fetchLevelSchool.pending]: (state) => {
            state.loading.fetchLevels = true;
        },
        [fetchLevelSchool.rejected]: (state, { payload }) => {
            state.loading.fetchLevels = false;
            state.error.fetchLevels = payload;
        },
        [fetchLevelSchool.fulfilled]: (state, { payload }) => {
            state.loading.fetchLevels = false;
            state.listLevels = payload;
        }
    }
});

const { reducer } = TeacherSlice;
//export const {  } = actions;
export default reducer;