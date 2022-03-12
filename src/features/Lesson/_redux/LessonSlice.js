import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import LessonCrud from "./LessonCrud";

export const fetchCateList = createAsyncThunk(
    'lesson/fetchList',
    async(data) => {
        const { data: result } = await LessonCrud.getAllCate(data);
        return result
    });

const LessonSlice = createSlice({
    name: "Lesson",
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

const { reducer } = LessonSlice;
//export const {  } = actions;
export default reducer;