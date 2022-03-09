import { combineReducers } from "redux";
import authReducer from "../features/Auth/_redux/AuthSlice";
import lessonReducer from "../features/Lesson/_redux/LessonSlice";

export const rootReducer = combineReducers({
    auth: authReducer,
    lesson: lessonReducer
});