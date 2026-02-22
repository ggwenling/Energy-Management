import {onMounted, onUnmounted, reactive, ref, toValue} from "vue"
import {post} from "@/utils/https"

export function useHttp<T>(url:string, initialParams:any){
    const dataList=ref<T[]>([]); //用来存表格的
    const loading=ref<boolean>(false);
    const totals=ref<number>(0);
    const pageInfo=reactive({
        page:1,
        pageSize:10
    })
    
    // 用于取消请求的 AbortController
    let abortController: AbortController | null = null;
    
    const loadData = async () => {
        // 如果有正在进行的请求，先取消它
        if (abortController) {
            abortController.abort();
        }
        
        // 创建新的 AbortController
        abortController = new AbortController();
        
        loading.value = true
        try {
            // 正确：toValue 会递归解 ref
            const params = {
                ...toValue(initialParams),  // 解 ref 对象
                ...pageInfo
            }
            const response = await post(url, params)
            
            // 修正：response 本身就是 { code, data, message }
            // 所以应该从 response.data 中获取 list 和 total
            if (response.data) {
                dataList.value = response.data.list || []
                totals.value = response.data.total || 0
            }
        } catch (error: any) {
            // 如果是取消请求的错误，不需要处理
            if (error.name === 'AbortError' || error.message === 'canceled') {
                console.log('请求已取消')
                return
            }
            console.log('Error:', error)
            // 错误时清空数据
            dataList.value = []
            totals.value = 0
        } finally {
            loading.value = false
            abortController = null
        }
    }
    
    // 防抖函数
    let debounceTimer: number | null = null;
    const debouncedLoadData = () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = window.setTimeout(() => {
            loadData();
        }, 300); // 300ms 防抖
    }
    
    onMounted(()=>{
        loadData()
    })
    
    // 组件卸载时取消请求和清理定时器
    onUnmounted(() => {
        if (abortController) {
            abortController.abort();
        }
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
    })

    const handleSizeChange=(size:number)=>{
        pageInfo.pageSize=size;
        pageInfo.page=1; // 改变每页条数时，重置到第一页
        debouncedLoadData()
    }
    const handleCurrentChange=(page:number)=>{
        pageInfo.page=page;
        debouncedLoadData()
    }
    const resetPagination=()=>{
        pageInfo.page=1;
        pageInfo.pageSize=10;
        loadData()
    }
    return {
        dataList,
        loading,
        totals,
        pageInfo,
        loadData,
        handleSizeChange,
        handleCurrentChange,
        resetPagination
    }

}


