import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login } from "@/api/userInfo.ts";
import { ElNotification } from "element-plus";


interface LoginParams {

    username: string,
    password: string

}

interface menuObject {
    name: string,
    url: string,
    icon: string,
}

export const useUserStore = defineStore('userInfo', () => {

        //定义token和用户的基本属性

        const token = ref<string>('')
        const username = ref<string>('')
        const menulist = ref<Array<menuObject>>([])
        const roles = ref<Array<string>>([])

        const UserLogin = async (data: LoginParams, router: any) => {
            //try执行存放用户数据的操作
            try {
                const res = await login(data)
                if (res.data.code === 200) {
                    ElNotification({
                        title: 'Success',
                        message: '登录成功',
                        type: 'success',
                    })
                    console.log(res.data)
                    token.value = res.data.data.token
                    menulist.value = res.data.data.menulist
                    username.value = res.data.data.user.username
                    roles.value = res.data.data.user.roles
                    router.push('/')
                }

            } catch (err) {

            }


        }
        const clearUserInfo = (): void => {
            token.value = '',
                username.value = '',
                menulist.value = [],
                roles.value = []

        }

        //持久化储存菜单高亮选项
        // const activeShow = ref<string>('')
        // const changeActiveShow = (newValue: string): void => {
        //     activeShow.value = newValue
        // }

        return {token, username, roles, UserLogin, menulist,  clearUserInfo}
    },
    {persist: true})
