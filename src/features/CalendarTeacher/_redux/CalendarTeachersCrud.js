import axiosClient from "../../../redux/axioClient";

const GET_ALL_URL = "/api/v3/content4?cmd=dayItemsGroupByTeacher";

const getAll = (data) => {
    return axiosClient.post(GET_ALL_URL, JSON.stringify(data));
};

const CalendarTeachersCrud = {
    getAll,
};
export default CalendarTeachersCrud;