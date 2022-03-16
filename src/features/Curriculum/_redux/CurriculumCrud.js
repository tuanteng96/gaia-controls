import axiosClient from "../../../redux/axioClient";

const GET_ALL_URL = "/api/v3/content?cmd=pgs&type=WowScheduleEnt";
const ADD_EDIT_URL = "/api/v3/content?cmd=edit&type=WowScheduleEnt";
const DELETE_URL = "/api/v3/content?cmd=delete&type=WowScheduleEnt";

const getAll = (data) => {
    return axiosClient.post(GET_ALL_URL, JSON.stringify(data));
};
const addEdit = (data) => {
    return axiosClient.post(ADD_EDIT_URL, JSON.stringify(data));
};
const Delete = (data) => {
    return axiosClient.post(DELETE_URL, JSON.stringify(data));
};


const CurriculumCrud = {
    getAll,
    addEdit,
    Delete,
};
export default CurriculumCrud;