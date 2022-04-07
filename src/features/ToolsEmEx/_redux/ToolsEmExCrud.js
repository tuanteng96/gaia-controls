import axiosClient from "../../../redux/axioClient";

const GET_ALL_EX_URL = "/api/v3/content?cmd=pgs&type=WowTeachingItemIOEnt";
const ADD_EDIT_EX_URL = "/api/v3/content?cmd=edit&type=WowTeachingItemIOEnt";
const DELETE_EX_URL = "/api/v3/content?cmd=delete&type=WowTeachingItemIOEnt";
const RANDOM_CODE_URL = "/api/v3/content?cmd=generates&type=WowTeachingItemIOEnt";

const getAll = (data) => {
    return axiosClient.post(GET_ALL_EX_URL, JSON.stringify(data));
};
const addEdit = (data) => {
    return axiosClient.post(ADD_EDIT_EX_URL, JSON.stringify(data));
};
const onDelete = (data) => {
    return axiosClient.post(DELETE_EX_URL, JSON.stringify(data));
};

const randomCode = (data) => {
    return axiosClient.post(RANDOM_CODE_URL, JSON.stringify(data));
}

const ToolsEmExCrud = {
    getAll,
    addEdit,
    onDelete,
    randomCode
};
export default ToolsEmExCrud;