import axiosClient from "../../../redux/axioClient";

const GET_ALL_URL = "/api/v3/content4?cmd=DayItemsTable";
const GET_ALL_SKILLS_URL = "/api/gl/select2?cmd=skill&&_type=query&q=";
const ADD_BOOKS_URL = "/api/v3/content4?cmd=adddayitems";
const DELETE_BOOKS_URL = "/api/v3/content4?cmd=dayItemsDeleteByIDs";
const ADD_SCHEDULE_CLASS = '/api/v3/DayItems@Add';
const DELETE_SCHEDULE_CLASS = '/api/v3/DayItems@RemoveClass';

const getAll = (data) => {
    return axiosClient.post(GET_ALL_URL, JSON.stringify(data));
};

const getAllSkills = (key) => {
    return axiosClient.get(`${GET_ALL_SKILLS_URL}${key}`);
};

const addBooks = (data) => {
    return axiosClient.post(ADD_BOOKS_URL, JSON.stringify(data));
};

const getAllTeachers = (data) => {
    return axiosClient.post(GET_ALL_URL, JSON.stringify(data));
};

const deleteBooks = (data) => {
    return axiosClient.post(DELETE_BOOKS_URL, JSON.stringify(data));
};

const addScheduleClass = (data) => {
    return axiosClient.post(ADD_SCHEDULE_CLASS, JSON.stringify(data));
}

const deleteScheduleClass = (data) => {
    return axiosClient.post(DELETE_SCHEDULE_CLASS, JSON.stringify(data));
}

const CalendarSchoolCrud = {
    getAll,
    getAllSkills,
    addBooks,
    deleteBooks,
    getAllTeachers,
    addScheduleClass,
    deleteScheduleClass
};
export default CalendarSchoolCrud;