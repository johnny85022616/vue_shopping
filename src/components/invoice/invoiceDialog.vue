<template>
  <div class="invoiceDialog">
    <fullscreenDialog>
      <template v-slot:header>
        {{ invoiceItems?.[`type${currenType}`].typeName || '發票設定' }}
      </template>
      <template v-slot:body>
        <div v-if="currenType === 5" class="member-cloud-invoice-box mt-5">
          <div class="text-c_sliver">
            <div class="form-area">
              <p>如欲使用手機條碼載具，請於輸入框輸入驗證</p>
              <div class="input_wrapper mt-1 mb-10">
                <input
                  class="text-base py-2 px-4 mt-1 border border-solid border-c_black_haze text-c_mine_shaft rounded-[10px] w-full bg-c_black_haze"
                  type="text" placeholder="請輸入手機條碼" v-model="vehicle" maxlength="8">
                <span v-show="!isVehicleValid" class="error-msg text-c_red ">手機碼載具碼有誤，請重新輸入。</span>
              </div>
              <p class="text-c_sliver mt-5">・friDay購物已採用電子發票，開立後可至【訂單查詢】點選「發票資訊」，即可查詢發票圖像。</p>
              <p class="text-c_sliver mt-5">・電子發票會在開獎次日自動兌獎，如中獎會於次月5號以紙本寄送【掛號信】至會員地址(使用手機載具將由財政部自動兌獎)。</p>
              <p class="text-c_sliver mt-5">・依統一發票使用辦法規定：統一發票一經開立，不得任意更改或改開公司發票。(<a class="text-c_dodger_blue"
                  href="https://www.einvoice.nat.gov.tw/">財政部電子發票流程說明</a>)</p>
            </div>
          </div>
        </div>
        <div
          class="submit-area absolute bottom-0 left-0 w-full p-2 border-t border-solid border-c_alto text-center bg-c_white flex justify-between items-center">
          <button
            :class="`w-[49%] p-2 flex justify-center items-center text-base rounded-[10px] border border-solid ${isVehicleSetting ? 'border-c_red' : 'border-c_sliver'} ${isVehicleSetting ? 'text-c_red' : 'text-c_sliver'}`" @click="resetInvoice(currenType)">重置</button>
          <button
            class="w-[49%] p-2 flex justify-center items-center text-base text-c_white bg-c_red rounded-[10px] border border-solid border-c_red"
            @click="updateInvoice(currenType)">確認</button>
        </div>
      </template>
    </fullscreenDialog>
  </div>
</template>

<script lang="ts" setup name="invoiceDialog">
import fullscreenDialog from '@/components/common/fullscreenDialog.vue';
import { computed, inject, ref, toRefs, watch } from 'vue';
import api from '@/apis/api';
import usePopup from '@/hooks/usePopup';

const vehicle = ref("") // 手機條碼輸入框
const companyVat = ref("") //公司統一編號輸入框
const companyName = ref("") //公司名稱
const isVehicleValid = ref(true) // 驗證手機條碼載具是否正確

const props = withDefaults(defineProps<{originVehicle: string, oirginCompanyVat: string, originCompanyName: string, currenType: number, isVehicleSetting: boolean, isCompanySetting:boolean, invoiceItems: Record<string, { typeName: string; typeInfo: string; type: number }>|null }>(), {
  originVehicle: "", //之前設定的手機條碼載具
  oirginCompanyVat: "", //之前設定的統一編號
  originCompanyName: "", //之前設定的公司名稱
  isVehicleSetting: false,  //是否設定過手機條碼載具
  isCompanySetting: false, //是否設定過公司電子發票
  currenType: 0, // 開啟確認提示框時紀錄目前type
  invoiceItems: null
})
const {originVehicle, oirginCompanyVat, originCompanyName, isVehicleSetting, isCompanySetting, currenType, invoiceItems} = toRefs(props)

//重置button的字體顏色
const resetBtnTextColor = computed(() => {
  if (currenType.value === 5 || currenType.value === 7) {
    const isSetting = currenType.value === 5 ? isVehicleSetting.value : isCompanySetting.value;
    return isSetting ? "text-c_red" : "text-c_sliver";
  }
  return "text-c_sliver";
});

//重置button的border顏色
const resetBtnBorderColor = computed(() => {
  if (currenType.value === 5 || currenType.value === 7) {
    const isSetting = currenType.value === 5 ? isVehicleSetting.value : isCompanySetting.value;
    return isSetting ? "border-c_red" : "border-c_sliver";
  }
  return "border-c_sliver";
});

const emit = defineEmits(['getInvoiceList'])

const closeDialog:any = inject("closeDialog") //關閉dialog方法

const popup = usePopup(); //popup composable


init()
function init(){
  //設定前值
  vehicle.value = originVehicle.value
  companyVat.value = oirginCompanyVat.value
  companyName.value = originCompanyName.value
}

//修改發票資訊
async function updateInvoice(type: number) {
  let payload = {};
  switch (type) {
    case 5:
      //若沒修改則不需要檢查或打api
      if(vehicle.value && vehicle.value === originVehicle.value) {
        closeDialog()
        return
      }
      await verifyVehicle()
      if (!isVehicleValid.value) {
        return
      }
      payload = {
        invType: "5",
        isDefault: 'Y',
        vehicle: vehicle.value,
      }
      break;
  }
  api.invoice.updateInvoice(payload).then((isSuccess: boolean) => {
    if (!isSuccess) return
    closeDialog()
    emit("getInvoiceList")
  })
}

//重置發票資訊
async function resetInvoice(type: number){
  const confirm = await popup.confirm('是否將該筆發票資訊刪除');
  if (!confirm) return;
  await api.invoice.deleteInvoice(type)
  closeDialog()
  emit("getInvoiceList")
}

// 驗證手機載具
async function verifyVehicle() {
  //先驗證長度
  if(vehicle.value?.length<8) {
    isVehicleValid.value = false
    return 
  }
  const v = "/" + vehicle.value.replace(/[^0-9A-Z.+-]/g, "") //去除英數字.+-以外字元(開頭/也會被去掉所以要加回來)
  isVehicleValid.value = await api.invoice.verifyVehicle(v)
}

//自動轉大寫與過濾字元
watch(vehicle, (value) => {
  const formatted = value.toUpperCase();
  vehicle.value = formatted;
}, { immediate: true });

</script>

