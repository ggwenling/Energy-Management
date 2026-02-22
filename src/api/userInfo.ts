import {get, post} from "@/utils/https.ts"
import  type {RowType} from "@/types/charge/tabe.ts";


// @ts-ignore
enum Api{
    Login= "/login",
    chartData = "/chartData",
    chartData3 = "/chartData3",
    chartData2 = "/chartData2",
    stationList= "/stationList",
    EditList = "/station/edit",
    DeleteList = "/station/delete",
    revenueChart= "/revenueChart",
    revenueList= "/revenueList",
    currentList = '/currentList',
    mapList = "/mapList",
    orderList ='orderList',
    batchDelete ='batchDelete',
    cityList ='cityList',
    alarmList= 'alarmList',
    memberList = 'member',
    documentList ='document',
    getPermissionList = 'permissionList',
    getUserAuth = 'userAuth'
}
interface LoginParams {
    username: string,
    password: string
}
interface ListType{
    page:number,
    pageSize:number,
    name?:string,
    id?:string,
    status:number
}

interface RevenueType{
    page:number,
    pageSize:number,
    name:string
}
export const login =(data:LoginParams):Promise<any> =>{
    return post(Api.Login,data)
}

export const getChart2 = ():Promise<any> =>{

    return get(Api.chartData)
}

export const getChart3 = ():Promise<any> =>{
    return get(Api.chartData3)
}
export const getChart4 = ():Promise<any> =>{
    return get(Api.chartData2)
}
export const getStationList = (data:ListType):Promise<any> =>{
    return post(Api.stationList,data)
}

export const editStationList = (data:RowType):Promise<any> =>{

   return post(Api.EditList,data)
}
export const deleteStationList = (id:string):Promise<any>=>{
    return post(Api.DeleteList,{id:id})
}

export const getRevenueData = () =>{
    return get(Api.revenueChart)
}

export const getRevenueList = (data:RevenueType) =>{
    return post(Api.revenueList,data)
}
export const getCurrentList = (data?:any):Promise<any> =>{
    return  post(Api.currentList,data)
}

export const getMapList = () =>{
    // @ts-ignore
    return post(Api.mapList)
}

export const getOrderList = (data:any):Promise<any> =>{

    return post(Api.orderList,data)
}
export const batchDelete = (order:string[]) =>{
    return post(Api.batchDelete,{order})
}

export const getCityList  = ():Promise<any> =>{

    return get(Api.cityList)
}

export const getAlarmList = () =>{
    return get(Api.alarmList)
}

export const getMemberList  = (data:any) =>{
    return post(Api.memberList,data)
}

export const getDocumentList = () =>{
    return get(Api.documentList)
}
export const getPermissionList =(data:any) =>{
    return post(Api.getPermissionList,data)
}

export const getAuthData = (data:any)=>{
    return post(Api.getUserAuth,data)
}

