import router from "@/router/index.ts";
import {useUserStore} from "@/store/user.ts";


router.beforeEach((to) => {
    // ...
    // 返回 false 以取消导航
    const store = useUserStore();
    if(!store.token&&to.path!=='/login'){
        return{path:'/login',}
    }
    if(store.token&&to.path==='/login'){
        return {path:'/',}
    }
    //权限页面控制
    if(store.token){
        if(to.meta.needAuth&& !store.roles.some(role =>(to.meta.needAuth as string[]).includes(role) )){
            return {path:'/404'}
        }
    }

})
