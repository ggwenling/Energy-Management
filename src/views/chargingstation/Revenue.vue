<script lang="ts" setup>
import {useEcharts} from "@/hooks/useEcharts.ts";
import {getRevenueData, getRevenueList} from "@/api/userInfo.ts";
import {FormateThousands} from "@/utils/FormateThousands.ts";
import {onMounted, reactive, ref} from "vue";
import {Search} from "@element-plus/icons-vue";


const chart = ref(null)
const Format = (num: number) => {
  return FormateThousands(num)
}

export interface RevenueItem {

  city: string;

  count: number;

  day: number;

  electricity: number;

  id: string;

  member: number;

  month: number;
  mpercent: number;
  name: string;
  parkingFee: number;
  percent: number;
  serviceFee: number;
}

//获取营收chart数据
const setRevenueChart = async () => {

  const chartOptions = reactive({
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: [] as any[]
    },
    xAxis: {
      type: 'category',
      data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月']
    },
    yAxis: [
      {
        type: 'value',
        name: '销售',
        position: 'left'
      },
      {
        type: 'value',
        name: '访问量',
        position: 'right'
      }
    ],
    series: [
      {
        name: '',
        type: 'bar',
        data: [],
        yAxisIndex: 0,
        itemStyle: {
          color: '#409eff'
        }
      },
      {
        name: '',
        type: 'line',
        data: [],
        yAxisIndex: 1,
        itemStyle: {
          color: '#409eff'
        },
        smooth: true
      }
    ]
  });
  const {data: {data: {list}}} = await getRevenueData()

  chartOptions.legend.data.push(list[0].name, list[1].name)

  for (let i = 0; i < list.length; i++) {

    chartOptions.series[i]!.data = list[i].data
    chartOptions.series[i]!.name = list[i].name
  }

  return chartOptions
}


//默认分页
const pageInfo = reactive({
  page: 1,
  pageSize: 10
})

//获取表格数据
const tabeData = ref<RevenueItem[]>([])
const totals = ref<number>(0)

const loading = ref<boolean>(false)

const loadList = async () => {
  loading.value = true
  const res = await getRevenueList({...pageInfo, name: inputVal.value})
  totals.value = res.data.data.total
  tabeData.value = res.data.data.list.map((item: any) => ({
   ...item,
   day: item.electricity + item.parkingFee + item.serviceFee + item.member
 }))
  loading.value = false
  console.log(tabeData.value)

}
//表单收集区域
const inputVal = ref<string>("")

const search =() => {
  loadList()
}

const handleSizeChange = (pageSize:number) =>{
  pageInfo.pageSize = pageSize
  loadList()

}

const handleCurrentChange = (page:number) =>{
  pageInfo.page = page
  loadList()
}
onMounted(() => {
  loadList()

})



useEcharts(chart, setRevenueChart)
</script>


<template>
  <el-row :gutter="20" class="mt-4">
    <el-col :span="4">
      <el-card>
        <div class="title">
          <div class="round">
            <el-icon>
              <Document/>
            </el-icon>
          </div>
          <h4>今日总收入（元）</h4>

        </div>
        <div class="total mt">
          <h1 class="mt-2">{{ Format(2222) }}</h1>
          <div class="percent">-21%</div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <div class="title">
          <div class="round">
            <el-icon>
              <Document/>
            </el-icon>
          </div>
          <h4>本月总收入 (万元)</h4>
        </div>
        <div class="total mt">
          <h1 class="mt-2">{{ Format(2924) }}</h1>
          <div class="percent">-21%</div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <div class="title">
          <div class="round">
            <el-icon>
              <Document/>
            </el-icon>
          </div>
          <h4>会员卡储值金额 (元)</h4>
        </div>
        <div class="total mt">
          <h1 class="mt-2">239,824</h1>
          <div class="percent">-16%</div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <div class="title">
          <div class="round">
            <el-icon>
              <Document/>
            </el-icon>
          </div>
          <h4>服务费总金额 (元)</h4>
        </div>
        <div class="total mt">
          <h1 class="mt-2">{{ Format(16824) }}</h1>
          <div class="percent">-7%</div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <div class="title">
          <div class="round">
            <el-icon>
              <Document/>
            </el-icon>
          </div>
          <h4>停车费总金额 (元)</h4>
        </div>
        <div class="total mt">
          <h1 class="mt-2">{{ Format(9687) }}</h1>
          <div class="percent">-4%</div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <div class="title">
          <div class="round">
            <el-icon>
              <Document/>
            </el-icon>
          </div>
          <h4>电费总金额 (元)</h4>
        </div>
        <div class="total mt">
          <h1 class="mt-2">{{ Format(223674) }}</h1>
          <div class="percent">-19%</div>
        </div>

      </el-card>

    </el-col>
  </el-row>

  <el-row class="mt-2">
    <el-col :span="24">
      <el-card>
        <div ref="chart" style="width: 100%;height: 300px"></div>
      </el-card>
    </el-col>

  </el-row>

    <el-card>
      <el-input
          v-model="inputVal"
          style="max-width: 600px"
          placeholder="输入站点名称筛选"
          class="input-with-select"
      >

        <template #append>
          <el-button :icon="Search"  @click="search"/>
        </template>
      </el-input>
      <el-table :data="tabeData" style="width: 100%" v-loading="loading">
        <el-table-column type="index" width="60" label="序号"/>
        <el-table-column prop="name" width="150" label="充站点名称"/>
        <el-table-column prop="id"   label="冲站点ID"/>
        <el-table-column prop="city"   label="所属城市"/>
        <el-table-column prop="count"   label="充电桩数量"/>
        <el-table-column prop="day" width="150"  label="单日收入(元)" sortable>
          <template #default="scope">
            <div class="flex gap-2 justify-end">
              <span>{{scope.row.day}}</span>
              <el-tag :type="scope.row.percent>=0?'success':'danger'" class="w-14 text-center">
                {{ scope.row.percent >= 0?`+${scope.row.percent}` : scope.row.percent}}
                %</el-tag>
            </div>
          </template>
          </el-table-column>
        <el-table-column prop="month"   width="150" label="月总收入(元)">
          <template #default="scope">
            <div class="flex gap-2 justify-end">
              <span>{{scope.row.month}}</span>
              <el-tag :type="scope.row.mpercent>=0?'success':'danger'" class="w-14 text-center">
                {{ scope.row.mpercent >= 0?`+${scope.row.mpercent}` : scope.row.mpercent}}
                %</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="electricity" label="电费营收(元)"/>
        <el-table-column prop="parkingFee"  label="停车费营收(元)"/>
        <el-table-column prop="serviceFee"  label="服务费营收(元)"/>
        <el-table-column prop="member" label="会员储值金(元)"/>

      </el-table>
     <div class="flex justify-end mt-4"> <el-pagination
         class="fr mt mb"
         v-model:current-page="pageInfo.page"
         v-model:page-size="pageInfo.pageSize"
         :page-sizes="[10, 20, 30, 40]"
         layout="sizes, prev, pager, next, jumper,total"
         :total="totals"
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         background
     /></div>
    </el-card>
</template>

<style scoped lang="less">
.title {
  display: flex;
  align-items: center;

  .round {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgb(235, 236, 245);
    text-align: center;
    line-height: 30px;
    margin-right: 20px;
  }

  h4 {
    color: #666;
    font-size: 12px;
    font-weight: bold;
  }
}

.total {
  display: flex;
  align-items: center;

  h1 {
    font-size: 25px;
    margin-right: 20px;
  }

  .percent {
    display: inline-block;
    padding: 3px 5px;
    height: 20px;
    font-size: 12px;
    background-color: rgb(235, 247, 239);
    border-radius: 2px;
    color: green;
    line-height: 20px;
  }
}
:deep(.cell){
  text-align: center;
}
</style>
