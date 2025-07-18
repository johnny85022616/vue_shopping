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
          <span v-if="item.type !== 1" class="cursor-pointer text-c_red hover:text-c_dark-red"
            @click="openDialog(item.type)">修改</span>
        </li>
      </ul>
    </div>
    <fullscreenDialog v-if="isDialogShow">
      <template v-slot:header>
        {{ invoiceItems[`type${currenType}`].typeName }}
      </template>
      <template v-slot:body>
        <div v-if="currenType === 5" class="member-cloud-invoice-box mt-5">
            <div class="text-c_sliver">
              <div class="form-area">
                <p>如欲使用手機條碼載具，請於輸入框輸入驗證</p>
                <div class="input_wrapper mt-1 mb-10">
                  <input class="text-base py-2 px-4 mt-1 border border-solid border-c_black_haze text-c_mine_shaft rounded-[10px] w-full bg-c_black_haze" type="text" placeholder="請輸入手機條碼" v-model="vehicle" maxlength="8">
                  <span class="error-msg">手機條碼載具碼有誤，請重新輸入。</span>
                </div>
                <p class="text-c_sliver mt-5">・friDay購物已採用電子發票，開立後可至【訂單查詢】點選「發票資訊」，即可查詢發票圖像。</p>
                <p class="text-c_sliver mt-5">・電子發票會在開獎次日自動兌獎，如中獎會於次月5號以紙本寄送【掛號信】至會員地址(使用手機載具將由財政部自動兌獎)。</p>
                <p class="text-c_sliver mt-5">・依統一發票使用辦法規定：統一發票一經開立，不得任意更改或改開公司發票。(<a class="text-c_dodger_blue" href="https://www.einvoice.nat.gov.tw/">財政部電子發票流程說明</a>)</p>
              </div>
            </div>
          </div>
          <div class="submit-area absolute bottom-0 left-0 w-full p-2 border-t border-solid border-c_alto text-center bg-c_white flex justify-between items-center">
            <button class="w-[49%] p-2 flex justify-center items-center text-base rounded-[10px] border border-solid border-c_red text-c_red">重置</button>
            <button class="w-[49%] p-2 flex justify-center items-center text-base text-c_white bg-c_red rounded-[10px] border border-solid border-c_red">確認</button>
          </div>
      </template>
    </fullscreenDialog>
  </div>
</template>
<script lang="ts" setup name="invoiceManagement">
import api from '@/apis/api';
import type { invoice } from '@/types/invoice';
import { provide, ref } from 'vue';
import { useRouter } from 'vue-router';
import navigation from '@/components/common/navigation.vue';
import fullscreenDialog from '@/components/common/fullscreenDialog.vue';

const router = useRouter();

const invoiceItems = ref<Record<string, { typeName: string; typeInfo: string; type: number }>>({
  "type5": {
    typeName: "個人電子發票",
    typeInfo: "尚未設定",
    type: 5,
  },
  "type1": {
    typeName: "發票捐贈",
    typeInfo: "伊甸基金會",
    type: 1,
  },
  "type7": {
    typeName: "公司電子發票",
    typeInfo: "尚未設定",
    type: 7,
  },
})

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
      invoiceInfo.forEach((v: invoice) => {
        const obj = invoiceItems.value[`type${String(v.type)}`]
        switch (v.type) {
          case 1:
            obj.typeInfo = v.name || obj.typeInfo //沒值設為原本的伊甸園基金會
            break;
          case 5:
            obj.typeInfo = "手機條碼載具 " + v.vehicle || obj.typeInfo
            vehicle.value = v.vehicle || ""; // 去除載具開頭的斜線
            isVehicleSetting.value = true
            break;
          case 7:
            obj.typeInfo = `${v.vatNumber} ${v.companyName}`;
            companyVat.value = v.vatNumber || "";
            companyName.value = v.companyName || "";
            isCompanySetting.value = true
            break;
        }
      });
    }
    isApiOk.value = true;
  })
}

//開啟設定視窗
function openDialog(type: number){
  currenType.value = type 
  isDialogShow.value = true;
}

//關閉設定視窗
function closeDialog(){
  isDialogShow.value = false;
}

provide('closeDialog',closeDialog)

</script>
