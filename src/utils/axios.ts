import axios, {type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError} from 'axios'
import {ElNotification} from "element-plus";

const request: AxiosInstance = axios.create({
    baseURL: 'https://www.demo.com/',//import.meta.env.VITE_API_URL
    timeout: 5000,
})
// 添加请求拦截器
request.interceptors.request.use(function (config: InternalAxiosRequestConfig) {
    // 在发送请求之前做些什么
    return config;
}, function (error: AxiosError) {
    // 对请求错误做些什么
    ElNotification({
        title: 'Error',
        message: error.message,
        type: 'error',
    })
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response: AxiosResponse):any {
    // 2xx 范围内的状态码都会触发该函数。
    if (response.data.code != 200) {
        ElNotification({
            title: "Error",
            message: response.data.message,
            type: 'error',
        });
    }
      return response;
}, function (error: AxiosError) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    ElNotification({
        title: "Error",
        message: error.message,
        type: 'error',
    });
    return Promise.reject(error);
});


export default request;
