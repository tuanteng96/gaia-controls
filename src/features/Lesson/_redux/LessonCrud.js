import axiosClient from "../../../redux/axioClient";

const GET_ALL_CATE_URL = "/api/v3/content?cmd=all&type=CategoryEnt";
const ADD_EDIT_CATE_URL = "/api/v3/content?cmd=edit&type=CategoryEnt";
const DELETE_CATE_URL = "/api/v3/content?cmd=delete&type=CategoryEnt";
const UPLOAD_FILE_URL = "/services/Uploader/up.ashx";
const DELETE_FILE_URL = "/services/Uploader/Del.ashx";
const GET_ROOT_URL = "/api/v3/content?cmd=files&root=";
const GET_LIST_LESSON_URL = "/api/v3/content?cmd=pgs&type=ProductEnt";
const ADD_EDIT_LESSON_URL = "/api/v3/content?cmd=edit&type=ProductEnt";
const DELETE_LESSON_URL = "/api/v3/content?cmd=delete&type=ProductEnt";

const getAllCate = (data) => {
    return axiosClient.post(GET_ALL_CATE_URL, JSON.stringify(data));
};
const addEditCate = (data) => {
    return axiosClient.post(ADD_EDIT_CATE_URL, JSON.stringify(data));
};
const deleteCate = (data) => {
    return axiosClient.post(DELETE_CATE_URL, JSON.stringify(data));
};
const uploadFile = (name, data) => {
    return axiosClient.post(`${UPLOAD_FILE_URL}?filename=${name}`, data, {
        headers: {
            'Content-Type': 'image/png'
        }
    });
}
const deleteFile = (name) => {
    return axiosClient.post(`${DELETE_FILE_URL}?q=${name}&value=false&type=ProductEnt`)
}
const getRootFile = (root = "Upload/data/") => {
    return axiosClient.get(`${GET_ROOT_URL}${root}`);
}
const addEditLesson = (data) => {
    return axiosClient.post(ADD_EDIT_LESSON_URL, JSON.stringify(data));
}
const getListLesson = (data) => {
    return axiosClient.post(GET_LIST_LESSON_URL, JSON.stringify(data));
}
const deleteLesson = (data) => {
    return axiosClient.post(DELETE_LESSON_URL, JSON.stringify(data));
}

const LessonCrud = {
    getAllCate,
    addEditCate,
    deleteCate,
    uploadFile,
    deleteFile,
    getRootFile,
    getListLesson,
    addEditLesson,
    deleteLesson
};
export default LessonCrud;