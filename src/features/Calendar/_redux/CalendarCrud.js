import axiosClient from "../../../redux/axioClient";

const GET_ALL_URL = "/api/v3/content?cmd=pgs&type=WowCalendarEnt&bll=Calendar1";
const ADD_TEACHER_URL = "/api/v3/content?cmd=edit&type=CalendarItem";

const getAll = (data) => {
    return axiosClient.post(GET_ALL_URL, JSON.stringify(data));
};

const addTeacher = (data) => {
    return axiosClient.post(ADD_TEACHER_URL, JSON.stringify(data));
};

const CalendarCrud = {
    getAll,
    addTeacher,
};
export default CalendarCrud;