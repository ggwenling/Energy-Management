<template>
  <el-dialog
      :model-value="props.dialogVisible"
      :title="title"
      @close="handleCancel"
      destroy-on-close
      ref="formRef"
  >
    <el-form
        label-width="120"
        :rules="rules"
        :model="ruleForm"
        ref="formRef"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="站点名称:" prop="name">
            <el-input v-model="ruleForm.name"/>
          </el-form-item>
          <el-form-item label="站点id:" prop="id">
            <el-input v-model="ruleForm.id" :disabled="disabled"/>
          </el-form-item>
          <el-form-item label="所属城市：" prop="city">
            <el-input v-model="ruleForm.city"/>
          </el-form-item>
          <el-form-item label="站点负责人：" prop="person">
            <el-input v-model="ruleForm.person"/>
          </el-form-item>
          <el-form-item label="负责人电话：" prop="tel">
            <el-input v-model="ruleForm.tel"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="快充数：" prop="fast">
            <el-input v-model="ruleForm.fast"/>
          </el-form-item>
          <el-form-item label="慢充数：" prop="slow">
            <el-input v-model="ruleForm.slow"/>
          </el-form-item>
          <el-form-item label="充电站状态：" prop="status">
            <el-select placeholder="充电站状态" v-model="ruleForm.status" :disabled="disabled">
              <el-option label="全部" :value="1"></el-option>
              <el-option label="使用中" :value="2"></el-option>
              <el-option label="空闲中" :value="3"></el-option>
              <el-option label="维护中" :value="4"></el-option>
              <el-option label="待维修" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="正在充电：" prop="now">
            <el-input v-model="ruleForm.now" :disabled="disabled"/>
          </el-form-item>
          <el-form-item label="故障数：" prop="fault">
            <el-input v-model="ruleForm.fault" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm(formRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, reactive, watch} from "vue"
import {ElMessage, type FormInstance, type FormRules} from "element-plus";
import type {RowType} from "@/types/charge/tabe.ts"
import {useStationStore} from "@/store/chargeStations.ts";
import {editStationList} from "@/api/userInfo.ts";

const  formRef = ref<FormInstance>()
const store = useStationStore()

const title = ref('')

const disabled = ref(false)
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(["close", "reload"])
const ruleForm = reactive<RowType>({
  name: "",
  id: "",
  city: "",
  fast: "",
  slow: "",
  status: 1,
  now: "",
  fault: "",
  person: "",
  tel: ""
})

const rules = reactive<FormRules<RowType>>({
  name: [
    {required: true, message: "站点名称不能为空", trigger: "blur"}
  ],
  id: [
    {required: true, message: '站点id不能为空', trigger: 'blur'},
  ],
  city: [
    {required: true, message: '所属城市不能为空', trigger: 'blur'},
  ],
  person: [
    {required: true, message: '站点负责人不能为空', trigger: 'blur'},
  ],
  tel: [
    {required: true, message: '负责人电话不能为空', trigger: 'blur'},
  ],
  fast: [
    {required: true, message: '快充数不能为空', trigger: 'blur'},
  ],
  slow: [
    {required: true, message: '慢充数不能为空', trigger: 'blur'},
  ],
  status: [
    {required: true, message: '充电站状态不能为空', trigger: 'blur'},
  ],
  now: [
    {required: true, message: '正在充电数不能为空', trigger: 'blur'},
  ],
  fault: [
    {required: true, message: '故障数量不能为空', trigger: 'blur'},
  ]
})

const handleCancel = () => {

  emit('close')
  store.resetRuleForm()
  disabled.value = false
  title.value='新增充电站信息'
}
watch(()=>props.dialogVisible,(newValue) => {

  if (newValue) {
    if(store.ruleForm.name !==''){
      disabled.value = true
      title.value='编辑充电站信息'
    }
   Object.assign(ruleForm,store.ruleForm)
  }
})

//表单校验功能
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate( async (valid) => {
    if (valid) {
      const res = await editStationList(ruleForm)

      if(res.data.code === 200) {
        ElMessage({
          message: '修改成功',
          type: 'success',
        })
        emit('reload')
        emit('close')
      }
    } else {
      ElMessage({
        message: '信息填写有误',
        type: 'warning',
      })

    }
  })
}
</script>
