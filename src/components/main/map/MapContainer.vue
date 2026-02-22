<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import {getMapList} from "@/api/userInfo.ts";
import icon from '@/assets/flashIcon.png'

const mapData = ref<any>([])
let map: any = null;

onMounted(() => {

  AMapLoader.load({
    key: "f3d70d479e8700ab3aa3128a5ec9845b", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  }).then(async (AMap) => {
    map = new AMap.Map("container", {
      // 设置地图容器id
      viewMode: "3D", // 是否为3D地图模式
      zoom: 5, // 初始化地图级别
      center: [112.55, 37.87], // 初始化地图中心点位置

    });
    //信息窗体
    var infoWindow = new AMap.InfoWindow({
      content: '', //传入字符串拼接的 DOM 元素
      anchor: "top-left",
    });

    //自定义添加标记点
    const {data: {data}} = await getMapList();
    mapData.value = data
    mapData.value.forEach((item: any) => {
      const marker = new AMap.Marker({
        position: item.position,

        icon:  icon, //添加 icon 图标 URL
        title: "北京",

      });
      marker.on("click",  () => {
        infoWindow.setContent(`
             <div class="container flex justify-between gap-2">
     <div class="flex-1 mt-2">
       <img src="/src/assets/station.jpg" alt="" width="100px" height="90px" class="rounded-xl">
     </div>
        <div class="flex-1 ">
          <h1 class="text-base">${item.title}</h1>
          <p class="text-xs text-gray-600">
            充电桩数量:${item.count}
          </p>
          <p class="text-xs text-gray-600">
            充电桩状态: <span class="text-teal-400"> ${item.status==1?'使用中':'维护中'}</span>
          </p>
        </div>
      </div>`);
        infoWindow.open(map, marker.getPosition());
      })
      map.add(marker);
    })


  })
      .catch((e) => {
        console.log(e);
      });
  console.log(mapData.value)
});

onUnmounted(() => {
  map?.destroy();
});
</script>


<template>
  <div id="container"></div>
</template>

<style scoped lang="less">
#container {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 80vh;
}
</style>
