import { createSlice } from '@reduxjs/toolkit';

const CalendarSchoolSlice = createSlice({
    name: "Curriculum",
    initialState: {
        HourSchool: {
            HourMax: "17:30:00",
            HourMin: "07:15:00"
        }
    },
    reducers: {
        setHourSchool: (state, { payload }) => {
            return {
                ...state,
                HourSchool: {
                    HourMax: payload.HourMax ?? state.HourSchool.HourMax,
                    HourMin: payload.HourMin ?? state.HourSchool.HourMin
                }
            }
        }
    },
    extraReducers: {}
});

const { reducer, actions } = CalendarSchoolSlice;
export const { setHourSchool } = actions;
export default reducer;