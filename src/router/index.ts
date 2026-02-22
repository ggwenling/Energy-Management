import {createWebHistory, createRouter, type RouteRecordRaw }  from 'vue-router'

// 使用 webpackChunkName 魔法注释，为每个路由生成独立的 chunk
const routes: RouteRecordRaw[] = [
    {
        path:"/",
        name:"Home",
        component:()=>import(/* webpackChunkName: "layout" */ "@/views/Layout.vue"),
        redirect:"/dashboard",
        children:[
            {
                path:"/dashboard",
                name:"dashboard",
                component:()=>import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/Dashboard.vue"),
            },
            {
                path:"/chargingstation/monitor",
                name:"monitor",
                component:()=>import(/* webpackChunkName: "charging-monitor" */ "@/views/chargingstation/Charge.vue")
            },
            {
                path:"/chargingstation/revenue",
                name:"revenue",
                component:()=>import(/* webpackChunkName: "charging-revenue" */ "@/views/chargingstation/Revenue.vue"),
            },
            {
                path:"/chargingstation/fault",
                name:"chargingPile",
                component:()=>import(/* webpackChunkName: "charging-pile" */ "@/views/chargingstation/chargingPile.vue")
            },
            {
                path:"/map",
                name:"map",
                component:()=>import(/* webpackChunkName: "map" */ "@/views/map/ElectionMap.vue")
            },
            {
                path:"/operations/orders",
                name:"orders",
                component:()=>import(/* webpackChunkName: "operations-orders" */ "@/views/operations/Order.vue"),
                meta:{
                    keepAlive:true
                }
            },
            {
                path:"/operations/detail/:id?",
                name:"detail",
                component:()=>import(/* webpackChunkName: "operations-detail" */ "@/views/operations/Detail.vue")
            },
            {
                path:"/operations/total",
                name:"total",
                component:()=>import(/* webpackChunkName: "operations-total" */ "@/views/operations/Total.vue")
            },
            {
                path:"/alarm",
                name:"alarm",
                component:()=>import(/* webpackChunkName: "alarm" */ "@/views/alarm/Alarm.vue")
            },
            {
                path:"/equipment",
                name:"equipment",
                component:()=>import(/* webpackChunkName: "equipment" */ "@/views/equipment/Equipment.vue"),
            },
            {
                path:"/document",
                name:"document",
                component:()=>import(/* webpackChunkName: "document" */ "@/views/documnet/Document.vue"),
                meta:{
                    needAuth:["admin","manager"]
                }
            },
            {
                path:"/system",
                name:"system",
                component:()=>import(/* webpackChunkName: "system" */ "@/views/system/System.vue"),
                meta:{
                    needAuth:["admin"]
                }
            },
            {
                path:"/personal",
                name:"personal",
                component:()=>import(/* webpackChunkName: "personal" */ "@/views/User/User.vue")
            },
        ]
    },
    {
        path:"/login",
        name:"login",
        component:() =>import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    },
    {
        path:"/:PathMatch(.*)*",
        name:"NotFount",
        component:() =>import(/* webpackChunkName: "not-found" */ '@/views/NotFound.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
