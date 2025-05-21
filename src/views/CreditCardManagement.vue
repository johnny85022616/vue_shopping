<template>
  <div class="creditCardManagement">
    <navigation :windowY="200"></navigation>
    <div
      class="w-full h-[50px] text-center border-b border-solid border-c_alto relative flex items-center justify-between p-5">
      <i class="w-5 h-5 bg-nextArrow-icon bg-center bg-100% bg-no-repeat rotate-180 " @click="historyBack"></i>
      <p class="text-lg font-bold text-c_mine_shaft">信用卡管理</p>
      <span @click="openCreateDialog">新增</span>
    </div>
    <creditCardList v-if="creditCardData && creditCardData.length !== 0" :creditCardData="creditCardData">
    </creditCardList>
    <createDialog v-if="isCreateDialogOpen"></createDialog>
  </div>
</template>
<script lang="ts" setup name="creditCardManagement">
import navigation from '@/components/common/navigation.vue';
import creditCardList from '@/components/creditCard/creditCardList.vue';
import createDialog from '@/components/creditCard/createDialog.vue';
import useCreditCard from '@/hooks/useCreditCard';
import { provide, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const creditCard = useCreditCard(); //取得creditCard composable
provide('creditCard', creditCard)
const { creditCardData } = toRefs(creditCard)
const isCreateDialogOpen = ref(false); //是否開啟新增信用卡視窗
provide('closeDialog', closeCreateDialog)

init()

async function init() {
  creditCard.getCreditCardData();
}

function historyBack() {
  router.back()
}
// 開啟新增信用卡視窗
function openCreateDialog() {
  isCreateDialogOpen.value = true;
}
// 關閉新增信用卡視窗
function closeCreateDialog() {
  isCreateDialogOpen.value = false;
}
</script>