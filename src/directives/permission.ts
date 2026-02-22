import {useUserStore} from "@/store/user.ts";

export default {
    beforeMount(el:any,binding:any) {
        //binding是v-permission后面的值，el是挂载元素
        const userstore = useUserStore();
        const {roles} = userstore
        const requirePermission = binding.value
        if(roles.includes(requirePermission)){
            el.style.display = 'none';
        }

    }
}
