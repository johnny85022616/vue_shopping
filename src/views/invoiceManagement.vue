<template>
  <div class="invoiceManagement">
    <navigation></navigation>
    <div
      class="w-full h-[50px] text-center border-b border-solid border-c_alto relative flex items-center justify-center p-5">
      <i class="w-5 h-5 bg-nextArrow-icon bg-center bg-100% bg-no-repeat rotate-180 justify-self-start absolute left-2"
        @click="historyBack"></i>
      <p class="text-lg font-bold text-c_mine_shaft">發票管理</p>
    </div>
    <div class="invoiceList bg-c_background min-h-[100vh] py-5 px-2">
      <ul>
        <li v-for="(item, index) in invoiceItems" :key="index"
          class="flex items-center justify-between mb-5 p-5 bg-c_white rounded-lg shadow-md">
          <div class="flex flex-col">
            <p class="text-c_mine_shaft font-bold">{{ item.typeName }}</p>
            <p class="text-c_sliver text-sm mt-1">{{ item.typeInfo }}</p>
          </div>
          <span v-if="item.type !== 1 && isApiOk" class="cursor-pointer text-c_red hover:text-c_dark-red"
            @click="openDialog(item.type)">修改</span>
        </li>
      </ul>
    </div>
    <invoiceDialog v-if="isDialogShow" :originVehicle="originVehicle" :oirginCompanyVat="oirginCompanyVat"
      :originCompanyName="originCompanyName" :isVehicleSetting="isVehicleSetting" :isCompanySetting="isCompanySetting"
      :currenType="currenType" :invoiceItems="invoiceItems" @getInvoiceList="getInvoiceList"></invoiceDialog>
  </div>
</template>

<script lang="ts" setup name="invoiceManagement">
import api from '@/apis/api';
import type { invoice } from '@/types/invoice';
import { provide, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import navigation from '@/components/common/navigation.vue';
import fullscreenDialog from '@/components/common/fullscreenDialog.vue';
import invoiceDialog from '@/components/invoice/invoiceDialog.vue';

const router = useRouter();

const invoiceItems = ref<{ typeName: string; typeInfo: string; type: number }[]>([
  {
    typeName: "個人電子發票",
    typeInfo: "尚未設定",
    type: 5,
  },
  {
    typeName: "發票捐贈",
    typeInfo: "伊甸基金會",
    type: 1,
  },
  {
    typeName: "公司電子發票",
    typeInfo: "尚未設定",
    type: 7,
  },
])

const isEInvoiceFormShow = ref(false) // 是否顯示手機條碼載具輸入表單
const isCompanyFormShow = ref(false) // 是否顯示公司電子發票輸入表單
const oirginCompanyVat = ref('') // 之前設定的統一編號
const originCompanyName = ref('') //之前設定的公司名稱
const originVehicle = ref('') // 之前設定的手機條碼載具
const isVehicleSetting = ref(false) // 是否設定過手機條碼載具
const isCompanySetting = ref(false) // 是否設定過公司電子發票
const isApiOk = ref(true)
const isDialogShow = ref(false) //是否開啟設定視窗
const currenType = ref(0) // 開啟確認提示框時紀錄目前type

init();
async function init() {
  getInvoiceList()
}

function historyBack() {
  router.back();
}

// 取得發票資訊
function getInvoiceList() {
  api.invoice.getInvoice().then((res: invoice[]) => {
    const invoiceInfo = res ? res : null;
    console.log("invoiceInfo", invoiceInfo);
    if (invoiceInfo) {
      const invoiceMap = invoiceInfo.reduce((map: Record<number, invoice>, v: invoice) => {
        map[v.type] = v;
        return map;
      }, {});
      console.log("invoiceMap", invoiceMap);
      invoiceItems.value.forEach(v => {
        switch (v.type) {
          case 1:
            v.typeInfo = invoiceMap[1]?.name || "伊甸基金會"
            break
          case 5:
            const vehicle = invoiceMap[5]?.vehicle
            v.typeInfo = vehicle ? "手機條碼載具 " + vehicle : "尚未設定";
            originVehicle.value = vehicle || "";
            isVehicleSetting.value = vehicle ? true : false
            break
          case 7:
            const companyInfo = invoiceMap[7]
            v.typeInfo = companyInfo ? `${companyInfo.vatNumber} ${companyInfo.companyName}` : "尚未設定";
            oirginCompanyVat.value = companyInfo?.vatNumber || "";
            originCompanyName.value = companyInfo?.companyName || "";
            isCompanySetting.value = companyInfo ? true : false
            break
        }
      })
      // invoiceInfo.forEach((v: invoice) => {
      //   const obj = invoiceItems.value[`type${String(v.type)}`]
      //   switch (v.type) {
      //     case 1:
      //       obj.typeInfo = v.name || obj.typeInfo //沒值設為原本的伊甸園基金會
      //       break;
      //     case 5:
      //       obj.typeInfo = "手機條碼載具 " + v.vehicle || obj.typeInfo
      //       originVehicle.value = v.vehicle || ""; 
      //       isVehicleSetting.value = true
      //       break;
      //     case 7:
      //       obj.typeInfo = `${v.vatNumber} ${v.companyName}`;
      //       oirginCompanyVat.value = v.vatNumber || "";
      //       originCompanyName.value = v.companyName || "";
      //       isCompanySetting.value = true
      //       break;
      //   }
      // });
    }
    isApiOk.value = true;
  })
}
function resetAllState() {

}

//開啟設定視窗
function openDialog(type: number) {
  currenType.value = type
  isDialogShow.value = true;
}

//關閉設定視窗
function closeDialog() {
  isDialogShow.value = false;
}

provide('closeDialog', closeDialog)

</script>
