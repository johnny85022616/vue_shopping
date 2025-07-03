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
  </div>
</template>

<script lang="ts" setup name="agreeBox">
import { reactive, toRefs } from 'vue';


const boxData = reactive({
  isFridayMemberAgree: true,
  isSendEdmAgree: true,
  isSendSmsAgree: true
})

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

}

function setMemeberChose() {
  console.log(11, sendEdm.value);
  boxData.isSendEdmAgree = sendEdm.value;
  boxData.isSendSmsAgree = sendSms.value;
  console.log(sendEdm.value);
  console.log(boxData);
}

// 切換checkbox狀態
function setCheckboxStatus(type: keyof typeof boxData) {
  // 切換checkbox狀態
  boxData[type] = !boxData[type];
}
</script>