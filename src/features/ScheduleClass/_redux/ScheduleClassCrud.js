import axiosClient from "../../../redux/axioClient";

const GET_ALL_URL = "/api/v3/content?cmd=pgs&type=WowCalendarEnt";
const ADD_EDIT_URL = "/api/v3/content?cmd=edit&type=WowCalendarEnt";
const DELETE_URL = "/api/v3/content?cmd=delete&type=WowCalendarEnt";
const DELETE_TIME_URL = "/api/v3/content4?cmd=dayItemsDeleteByTimes";

const getAll = (data) => {
    const newData = {...data };
    delete newData.query;
    return axiosClient.post(`${GET_ALL_URL}${data.query ? data.query : ""}`, JSON.stringify(newData));
};
const addEdit = (data) => {
    return axiosClient.post(ADD_EDIT_URL, JSON.stringify(data));
};
const Delete = (data) => {
    return axiosClient.post(DELETE_URL, JSON.stringify(data));
};
const DeleteTime = (data) => {
    return axiosClient.post(DELETE_TIME_URL, JSON.stringify(data));
}

const ScheduleClassCrud = {
    getAll,
    addEdit,
    Delete,
    DeleteTime
};
export default ScheduleClassCrud;