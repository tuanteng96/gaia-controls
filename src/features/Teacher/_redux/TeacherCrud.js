import axiosClient from "../../../redux/axioClient";

const GET_ALL_TEACHER_URL = "/api/v3/content?cmd=pgs&type=UserEnt";
const ADD_EDIT_TEACHER_URL = "/api/v3/content?cmd=edit&type=CategoryEnt";
const DELETE_TEACHER_URL = "/api/v3/content?cmd=delete&type=UserEnt";
const GET_LEVELS_TEACHER_URL = "/api/v3/content?cmd=all&type=TeacherLevelEnt";
const GET_SUGGEST_USN_TEACHER_URL = "/api/v3/content?cmd=suggest&type=UserEnt";

const getAllTeacher = (data) => {
    return axiosClient.post(GET_ALL_TEACHER_URL, JSON.stringify(data));
};
const addEditTeacher = (data) => {
    return axiosClient.post(ADD_EDIT_TEACHER_URL, JSON.stringify(data));
};
const deleteTeacher = (data) => {
    return axiosClient.post(DELETE_TEACHER_URL, JSON.stringify(data));
};
const getLevelsTeacher = (data) => {
    return axiosClient.post(GET_LEVELS_TEACHER_URL, JSON.stringify(data));
};
const getSuggestUser = (data) => {
    return axiosClient.post(GET_SUGGEST_USN_TEACHER_URL, JSON.stringify(data));
};

const TeacherCrud = {
    getAllTeacher,
    addEditTeacher,
    deleteTeacher,
    getLevelsTeacher,
    getSuggestUser
};
export default TeacherCrud;