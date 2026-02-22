<script setup lang="ts">
import {getDocumentList} from "@/api/userInfo.ts";
import {onMounted, reactive, ref} from "vue";
import Editor from '@tinymce/tinymce-vue'
//tag标签数组类型
interface ListType {
  type: string[],
  important: string[],
  publish: string[]
}
//已选择标签数组类型
interface SelectType{
  name:string,
  index:number
}
//tag数组
const doumentList = reactive<ListType>({
  type: [],
  important: [],
  publish: []
})
onMounted(async () => {
  const {data: {data}} = await getDocumentList();
  Object.assign(doumentList, data);
  console.log(doumentList)
})

const currentIndex = ref<number[]>([-1, -1, -1])

//tag按钮功能，实现单个高亮

const setCurrentIndex = (num: number, index: number,name:string) => {


          const ind =  selectList.value.findIndex((item)=>item.index===index)
  if(ind===-1){
    selectList.value.push({name,index})
  }else{
    selectList.value[ind] = {name,index}
  }
  currentIndex.value[index] = num
}
const selectList = ref<SelectType[]>([])

//全部按钮功能

const setAllIndex = (index:number) =>{
  const ind = selectList.value.findIndex((item)=>item.index===index)
  selectList.value.splice(ind,1)
  currentIndex.value[index] =-1
}

//导出html功能

const editorContent=ref("");
const exportToHtml=()=>{
  const blob=new Blob([editorContent.value],{type:"text/html"})
  const link=document.createElement("a");
  link.href=URL.createObjectURL(blob);
  link.download="documnet.html";
  link.click();
  URL.revokeObjectURL(link.href)
}
</script>

<template>

<!--  tag标签功能选择区域-->

 <el-card class="custom-card mt-2">
   <div class="container mt-4 flex gap-4">
     <span class="text-xs text-teal-600">文章类型</span>
     <el-tag :type="currentIndex[0]===-1?'primary':'info'"  class="cursor-pointer" @click="setAllIndex(0)">全部
     </el-tag>
     <el-tag :type="currentIndex[0]===index?'primary':'info'" v-for="(item,index) in doumentList.important "
             class="cursor-pointer" @click="setCurrentIndex(index,0,item)" :key="item">{{ item }}
     </el-tag>
   </div>
   <div class="container mt-4 flex gap-4">
     <span class="text-xs text-teal-600">文章类型</span>
     <el-tag :type="currentIndex[1]===-1?'primary':'info'"  class="cursor-pointer" @click="setAllIndex(1)">全部
     </el-tag>
     <el-tag :type="currentIndex[1]===index?'primary':'info'" v-for="(item,index) in doumentList.publish "
             class="cursor-pointer" @click="setCurrentIndex(index,1,item) " key="item">{{ item }}
     </el-tag>
   </div>
   <div class="container mt-4 flex gap-4">
     <span class="text-xs text-teal-600"> 文章类型</span>
     <el-tag :type="currentIndex[2]===-1?'primary':'info'"  class="cursor-pointer" @click="setAllIndex(2)">全部
     </el-tag>
     <el-tag :type="currentIndex[2]===index?'primary':'info'" v-for="(item,index) in doumentList.type "
             class="cursor-pointer" @click="setCurrentIndex(index,2,item)" key="item">{{ item }}
     </el-tag>
   </div>
   <el-divider class="mt-4"/>
   <div class="container mt-4 flex gap-4">
     <span class="text-sky-400 text-sm">已选</span>
     <el-tag type="success" v-for="item in selectList">{{ item.name}}</el-tag>
   </div>
 </el-card>

  <el-card class="mt-2 custom-card">
    <div class="container flex justify-end mb-2">
      <el-button @click="exportToHtml" type="primary" round>导出</el-button>
    </div>

<!--富文本编辑器-->

    <Editor
        v-model="editorContent"
        id="<uid>"
        apiKey="k776z65gbjzhfqpwjx4jshfhhbnxj1ky0oouur5iu9wjat8d"
        :init="{
         language:'zh_CN',
         language_url:'/langs/zh_CN.js',
        plugins: 'advlist anchor autolink charmap code fullscreen help image insertdatetime link lists media preview searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        height: 500,
      }"
    />
  </el-card>
</template>

<style scoped lang="less">
.custom-card {
  border-radius: 20px;
  border: none;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.custom-card:hover{
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
}

</style>
