<template>
  <div class="invoiceManagement">
    發票
  </div>
</template>
<script lang="ts" setup name="invoiceManagement">
import api from '@/apis/api';
import type { invoice } from '@/types/invoice';
import { ref } from 'vue';


const invoiceItems = ref([
  {
    typeName: "個人電子發票",
    typeInfo: "手機條碼載具 尚未設定",
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
const companyVat = ref('') // 統一編號
const companyName = ref('') // 公司名稱
const vehicle = ref('') // 手機條碼載具
const isVehicleValid = ref(false) // 驗證手機條碼載具是否正確
const isformChecked = ref(false) // 表單驗證
const isVehicleSetting = ref(false) // 是否設定手機條碼載具
const isCompanySetting = ref(false) // 是否設定公司電子發票
const isApiOk = ref(true)
const isDialogShow = ref(false) // 是否顯示確認提示框
const currenType = ref(0) // 開啟確認提示框時紀錄目前type

init();
async function init() {
  getInvoiceList()
}

// 取得發票資訊
function getInvoiceList() {
  api.invoice.getInvoice().then((res: any) => {
    const invoiceInfo = res ? res : null;
    if (invoiceInfo) {
      invoiceInfo.forEach((v:invoice) => {
        invoiceItems.value.forEach(item => {
          // 1: 發票捐贈, 2: 個人紙本發票, 3: 公司用郵寄, 4: 會員載具(個人電子發票), 5: 手機條碼載具(個人電子發票), 7: 公司用線上列印
          if (v.type === item.type) {
            switch(v.type) {
              case 1: 
                item.typeInfo = v.name|| '伊甸基金會'; ;
                break;
              case 5:
                if(v.vehicle) {
                  item.typeInfo = v.vehicle;
                  vehicle.value = v.vehicle.replace(/\//g, ''); // 去除載具開頭的斜線
                  isVehicleSetting.value = true;
                }
                break;
              case 7:
                if(v.vatNumber && v.companyName){
                  item.typeInfo = `${v.vatNumber} ${v.companyName}`;
                  companyVat.value = v.vatNumber;
                  companyName.value = v.companyName;
                  isCompanySetting.value = true;
                }
                break;
            }
          }
        })
      })
    }
    isApiOk.value = true;
  })
}

</script>
