import axiosClient from "../../../redux/axioClient";

const GET_ALL_CATE_URL = "/api/v3/content?cmd=all&type=WowTeachingItemCategoryEnt";
const ADD_EDIT_CATE_URL = "/api/v3/content?cmd=edit&type=WowTeachingItemCategoryEnt";
const DELETE_CATE_URL = "/api/v3/content?cmd=delete&type=WowTeachingItemCategoryEnt";
const GET_ALL_TOOLS_URL = "/api/v3/content?cmd=pgs&type=WowTeachingItemEnt";
const ADD_EDIT_TOOLS_URL = "/api/v3/content?cmd=edit&type=WowTeachingItemEnt";
const DELETE_TOOLS_URL = "/api/v3/content?cmd=delete&type=WowTeachingItemEnt";

const getAllCate = (data) => {
    return axiosClient.post(GET_ALL_CATE_URL, JSON.stringify(data));
};
const addEditCate = (data) => {
    return axiosClient.post(ADD_EDIT_CATE_URL, JSON.stringify(data));
};
const deleteCate = (data) => {
    return axiosClient.post(DELETE_CATE_URL, JSON.stringify(data));
};
const getAllTools = (data) => {
    return axiosClient.post(GET_ALL_TOOLS_URL, JSON.stringify(data));
};
const addEditTools = (data) => {
    return axiosClient.post(ADD_EDIT_TOOLS_URL, JSON.stringify(data));
};
const deleteTools = (data) => {
    return axiosClient.post(DELETE_TOOLS_URL, JSON.stringify(data));
}

const ToolsTeacherCrud = {
    getAllCate,
    addEditCate,
    deleteCate,
    getAllTools,
    addEditTools,
    deleteTools
};
export default ToolsTeacherCrud;