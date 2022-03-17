import { combineReducers } from "redux";
import authReducer from "../features/Auth/_redux/AuthSlice";
import lessonReducer from "../features/Lesson/_redux/LessonSlice";
import teacherReducer from "../features/Teacher/_redux/TeacherSlice";
import curriculumReducer from "../features/Curriculum/_redux/CurriculumSlice";

export const rootReducer = combineReducers({
    auth: authReducer,
    lesson: lessonReducer,
    teacher: teacherReducer,
    curriculum: curriculumReducer,
});