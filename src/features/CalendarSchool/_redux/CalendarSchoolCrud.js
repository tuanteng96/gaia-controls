import axiosClient from "../../../redux/axioClient";

const GET_ALL_URL = "/api/v3/content4?cmd=DayItemsTable";
const GET_ALL_SKILLS_URL = "/api/gl/select2?cmd=skill&&_type=query&q=";
const ADD_BOOKS_URL = "/api/v3/content4?cmd=adddayitems";
const DELETE_BOOKS_URL = "/api/v3/content4?cmd=dayItemsDeleteByIDs";
const PREVIEW_SCHEDULE_CLASS_URL = '/api/v3/DayItems@Preview';
const ADD_SCHEDULE_CLASS_URL = '/api/v3/DayItems@Add';
const DELETE_SCHEDULE_CLASS_URL = '/api/v3/DayItems@Remove';
const TAKE_SCHEDULE_OFF_URL = '/api/v3/DayItems@RemoveClass';
const PREVIEW_TAKE_BREAK_URL = '/api/v3/DayItems@OffPreview';
const CHANGE_TEACHERS_URL = '/api/v3/DayItems@ChangeTeaches';
const PRIVIEW_CHANGE_TEACHERS_URL = '/api/v3/DayItems@ReplaceTeacherPreview';
const TRANFER_TEACHERS_URL = '/api/v3/DayItems@ReplaceTeacher';

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

const previewScheduleClass = (data) => {
    return axiosClient.post(PREVIEW_SCHEDULE_CLASS_URL, JSON.stringify(data));
}

const addScheduleClass = (data) => {
    return axiosClient.post(ADD_SCHEDULE_CLASS_URL, JSON.stringify(data));
}

const deleteScheduleClass = (data) => {
    return axiosClient.post(DELETE_SCHEDULE_CLASS_URL, JSON.stringify(data));
}

const takeScheduleOff = (data) => {
    return axiosClient.post(TAKE_SCHEDULE_OFF_URL, JSON.stringify(data));
}

const previewTakeBreak = (data) => {
    return axiosClient.post(PREVIEW_TAKE_BREAK_URL, JSON.stringify(data));
}

const ChangeTeaches = (data) => {
    return axiosClient.post(CHANGE_TEACHERS_URL, JSON.stringify(data));
}

const previewChangesTeacher = (data) => {
    return axiosClient.post(PRIVIEW_CHANGE_TEACHERS_URL, JSON.stringify(data));
}

const tranferTeacher = (data) => {
    return axiosClient.post(TRANFER_TEACHERS_URL, JSON.stringify(data));
}

const CalendarSchoolCrud = {
    getAll,
    getAllSkills,
    addBooks,
    deleteBooks,
    getAllTeachers,
    addScheduleClass,
    deleteScheduleClass,
    takeScheduleOff,
    previewScheduleClass,
    previewTakeBreak,
    ChangeTeaches,
    previewChangesTeacher,
    tranferTeacher
};
export default CalendarSchoolCrud;