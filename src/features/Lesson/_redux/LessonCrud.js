import axiosClient from "../../../redux/axioClient";

const GET_ALL_CATE_URL = "/api/v3/content?cmd=all&type=CategoryEnt";
const ADD_EDIT_CATE_URL = "/api/v3/content?cmd=edit&type=CategoryEnt";
const DELETE_CATE_URL = "/api/v3/content?cmd=delete&type=CategoryEnt";

const getAllCate = (data) => {
    return axiosClient.post(GET_ALL_CATE_URL, JSON.stringify(data));
};
const addEditCate = (data) => {
    return axiosClient.post(ADD_EDIT_CATE_URL, JSON.stringify(data));
};
const deleteCate = (data) => {
    return axiosClient.post(DELETE_CATE_URL, JSON.stringify(data));
};

const LessonCrud = {
    getAllCate,
    addEditCate,
    deleteCate,
};
export default LessonCrud;