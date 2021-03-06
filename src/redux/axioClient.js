import axios from 'axios';
import queryString from 'query-string';


const axiosClient = axios.create({
    baseURL: window.top.ServerDomain || process.env.REACT_APP_API_URL,
    headers: {
        'content-type': 'text/plain',
    },
    paramsSerializer: params => queryString.stringify(params),
});

export default axiosClient;