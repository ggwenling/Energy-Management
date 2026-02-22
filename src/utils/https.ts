import request from "./axios.ts"


interface ResponseData {
    code:number,
    data:any,
    message:string
}


export function get(url: string, params?: any, ):Promise<ResponseData> {
    return request.get(url,{params:params});
}

export function post(url:string, data:any):Promise<ResponseData>{
    return request.post(url,data);
}


