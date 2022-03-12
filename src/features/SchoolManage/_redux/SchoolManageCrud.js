import axiosClient from "../../../redux/axioClient";

const GET_ALL_CITY_URL = "/api/v3/content?cmd=all&type=RegionProvinceEnt";
const GET_DISTRICT__URL = "/api/v3/content?cmd=all&type=RegionDistrictEnt";
const GET_LEVEL_URL = "/api/v3/content?cmd=all&type=WowLevelEnt";
const GET_ALL_SCHOOL_URL = "/api/v3/content?cmd=pgs&type=WowSchoolEnt";
const ADD_EDIT_SCHOOL_URL = "/api/v3/content?cmd=edit&type=WowSchoolEnt";
const DELETE_SCHOOL_URL = "/api/v3/content?cmd=delete&type=WowSchoolEnt";
const ADD_EDIT_CLASS_URL = "/api/v3/content?cmd=edits&type=WowClassEnt";

const getAllCity = (data) => {
    return axiosClient.post(GET_ALL_CITY_URL, JSON.stringify(data));
};
const getAllDistrict = (data) => {
    return axiosClient.post(GET_DISTRICT__URL, JSON.stringify(data));
};
const getAllLevel = (data) => {
    return axiosClient.post(GET_LEVEL_URL, JSON.stringify(data));
};
const getAllSchool = (data) => {
    return axiosClient.post(GET_ALL_SCHOOL_URL, JSON.stringify(data));
}
const addEditSchool = (data) => {
    return axiosClient.post(ADD_EDIT_SCHOOL_URL, JSON.stringify(data));
};
const deleteSchool = (data) => {
    return axiosClient.post(DELETE_SCHOOL_URL, JSON.stringify(data));
};
const addEditClass = (data) => {
    return axiosClient.post(ADD_EDIT_CLASS_URL, JSON.stringify(data));
}

const SchoolManageCrud = {
    getAllCity,
    getAllDistrict,
    getAllLevel,
    addEditSchool,
    getAllSchool,
    deleteSchool,
    addEditClass
};
export default SchoolManageCrud;