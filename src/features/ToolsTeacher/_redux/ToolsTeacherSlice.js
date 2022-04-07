import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import ToolsTeacherCrud from './ToolsTeacherCrud';

export const fetchCateList = createAsyncThunk(
    'tools-teacher/fetchList',
    async(data) => {
        const { data: result } = await ToolsTeacherCrud.getAllCate(data);
        return result
    });

const ToolsTeacherSlice = createSlice({
    name: "ToolsTeacher",
    initialState: {
        loading: {
            fetchCate: false
        },
        error: {
            fetchCate: ""
        },
        listCate: [],
    },
    reducers: {

    },
    extraReducers: {
        [fetchCateList.pending]: (state) => {
            state.loading.fetchCate = true;
        },
        [fetchCateList.rejected]: (state, { payload }) => {
            state.loading.fetchCate = false;
            state.error.fetchCate = payload;
        },
        [fetchCateList.fulfilled]: (state, { payload }) => {
            state.loading.fetchCate = false;
            state.listCate = payload;
        }
    }
});

const { reducer } = ToolsTeacherSlice;
//export const {  } = actions;
export default reducer;