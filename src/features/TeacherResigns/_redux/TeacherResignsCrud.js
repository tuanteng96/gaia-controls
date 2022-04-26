import axiosClient from "../../../redux/axioClient";

const GET_ALL_TEACHER_URL = "/api/v3/content?cmd=pgs&type=WowOffDayEnt";
const FINISH_TEACHER_URL = "/api/v3/content4?cmd=offday_confirm";

const getAllTeacher = (data) => {
    return axiosClient.post(GET_ALL_TEACHER_URL, JSON.stringify(data));
};
const onFinish = (data) => {
    return axiosClient.post(FINISH_TEACHER_URL, JSON.stringify(data));
}

const TeacherResignsCrud = {
    getAllTeacher,
    onFinish
};
export default TeacherResignsCrud;