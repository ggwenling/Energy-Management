import {defineStore} from 'pinia'
import {ref} from 'vue'


interface menuObject {
    name: string,
    url: string,
    icon: string,
}

export const useTabStore = defineStore('tab', () => {
        //标签数组
        const tabData = ref<menuObject[]>([{name: '数据看板', url: '/dashboard', icon: 'DataLine'}])
        //点击添加标签
        const addTab = (name: string, url: string, icon: string): void => {

            if (!tabData.value.some(tab => tab.url === url)) {
                tabData.value.push({name: name, url: url, icon: icon})
            }
        }
        const removeTab = (name: string,): void => {
            tabData.value = tabData.value.filter(item => item.name !== name)
        }
        const tabActive = ref<{ name: string, url: string }>({name: '数据看板', url: '/dashboard'})


        const setTabActive = (name: string, url: string): void => {
            tabActive.value.name = name
            tabActive.value.url = url
        }
        return {tabData, addTab, tabActive, setTabActive, removeTab}
    }, {
        persist: true,
    }
)
