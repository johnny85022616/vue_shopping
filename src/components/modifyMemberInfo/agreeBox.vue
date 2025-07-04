<template>
  <div class="agreeBox py-5 bg-c_white mx-4">
    <div class="mb-2 flex justify-start items-start">
      <i class="bg-checkbox-icon w-5 h-5 bg-center bg-100% bg-no-repeat inline-block mr-1"
        @click="setCheckboxStatus('isFridayMemberAgree')"
        :class="{ 'bg-checkbox-icon-active': boxData.isFridayMemberAgree }"></i>
      <div>
        <p>我已閱讀並同意</p>
        <p class="dialogBtn">《<span @click="openAgreeDialog(1)">服務條款</span>》及《<span
            @click="openAgreeDialog(2)">隱私權政策</span>》</p>
      </div>
    </div>
    <div class="mb-2 flex justify-start items-start">
      <i class="bg-checkbox-icon w-5 h-5 bg-center bg-100% bg-no-repeat inline-block mr-1"
        @click="setCheckboxStatus('isSendEdmAgree')" :class="{ 'bg-checkbox-icon-active': boxData.isSendEdmAgree }"></i>
      <p>我願意收到優惠訊息電子報 </p>
    </div>
    <div class="mb-2 flex justify-start items-start">
      <i class="bg-checkbox-icon w-5 h-5 bg-center bg-100% bg-no-repeat inline-block mr-1"
        @click="setCheckboxStatus('isSendSmsAgree')" :class="{ 'bg-checkbox-icon-active': boxData.isSendSmsAgree }"></i>
      <p>我願意收到各項簡訊及電話通知</p>
    </div>
    <fullscreenDialog v-if="isAgreeDialogOpen" @closeDialog="closeAgreeDialog">
      <template v-slot:body>
          <ecTerms v-if="dialogType === 1" />
      </template>
    </fullscreenDialog>
  </div>
</template>

<script lang="ts" setup name="agreeBox">
import { provide, reactive, ref, toRefs } from 'vue';
import fullscreenDialog from '@/components/common/fullscreenDialog.vue';
import ecTerms from '@/components/website/ec_terms.vue';


//checkbox的狀態
const boxData = reactive({
  isFridayMemberAgree: true,
  isSendEdmAgree: true,
  isSendSmsAgree: true,
})

const isAgreeDialogOpen = ref(false);
const dialogType = ref(0); // 1: 服務條款, 2: 隱私權政策

const props = defineProps<{
  sendEdm: boolean;
  sendSms: boolean;
}>();

const { sendEdm, sendSms } = toRefs(props);

init()

function init() {
  setMemeberChose()
}

//展開條款彈跳視窗
function openAgreeDialog(type: number) {
  isAgreeDialogOpen.value = true
  dialogType.value = type
}

//關閉條款彈跳視窗
function closeAgreeDialog() {
  isAgreeDialogOpen.value = false
}

// 設定會員之前選擇同意狀態
function setMemeberChose() {
  boxData.isSendEdmAgree = sendEdm.value;
  boxData.isSendSmsAgree = sendSms.value;
}

// 切換checkbox狀態
function setCheckboxStatus(type: keyof typeof boxData) {
  // 切換checkbox狀態
  boxData[type] = !boxData[type];
}
  
provide('closeDialog',closeAgreeDialog)
</script>