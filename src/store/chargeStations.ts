import {defineStore} from "pinia";
import type {RowType} from "@/types/charge/tabe.ts";
import {reactive} from "vue";

export const useStationStore = defineStore("charge", () => {

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

    const resetRuleForm = () => {
        ruleForm.name = ""
        ruleForm.id = ""
        ruleForm.city = "";
        ruleForm.fast = ""
        ruleForm.slow = "";
        ruleForm.status = 1;
        ruleForm.now = ""
        ruleForm.fault = ""
        ruleForm.person = ""
        ruleForm.tel = ""
    }
    const setRuleForm = (data: RowType) => {
        Object.assign(ruleForm, data)
    }
    return {ruleForm, setRuleForm,resetRuleForm}
})
