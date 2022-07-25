import { createSlice } from '@reduxjs/toolkit';

const CalendarTeachersSlice = createSlice({
  name: "Curriculum",
  initialState: {
    HourSchool: {
      HourMax: "17:30:00",
      HourMin: "07:15:00",
    },
  },
  reducers: {
    setHourTeachers: (state, { payload }) => {
      return {
        ...state,
        HourSchool: {
          HourMax: payload.HourMax ?? state.HourSchool.HourMax,
          HourMin: payload.HourMin ?? state.HourSchool.HourMin,
        },
      };
    },
  },
  extraReducers: {},
});

const { reducer, actions } = CalendarTeachersSlice;
export const { setHourTeachers } = actions;
export default reducer;