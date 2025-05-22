<template>
  <div class="consigneeManagement">
    <navigation :windowY="200"></navigation>
    <div class="w-full h-[50px] text-center border-b border-solid border-c_alto relative flex items-center justify-between p-5">
      <i class="w-5 h-5 bg-nextArrow-icon bg-center bg-100% bg-no-repeat rotate-180 " @click="historyBack"></i>
      <p class="text-lg font-bold text-c_mine_shaft">收貨人通訊錄管理</p>
      <span @click="openCreateDialog">新增</span>
    </div>
    <template v-if="isInitDataLoaded">
      <consigneeList v-if="consigneeData && consigneeData.length !== 0" :consigneeData="consigneeData"></consigneeList>
      <div v-else class="noConsignee text-center">
        <i class="inline-block bg-consignee-icon w-[335px] h-[180px] bg-center bg-100% bg-no-repeat my-5"/>
        <p class="text-base text-c_sliver">你沒有任何已儲存的收貨人資訊</p>
      </div>
      <createDialog v-if="isCreateDialogOpen"></createDialog>
    </template>
  </div>
</template>

<script lang="ts" setup name="consigneeManagement">
import navigation from '@/components/common/navigation.vue';
import consigneeList from '@/components/consignee/consigneeList.vue';
import createDialog from '@/components/consignee/createDialog.vue';
import useConsignee from '@/hooks/useConsignee';
import { provide, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';

const router  = useRouter()
const consignee = useConsignee(); //取得consignee composable
const { isInitDataLoaded, consigneeData } = toRefs(consignee)
const isCreateDialogOpen = ref(false); //是否開啟新增收貨人視窗
provide('consignee', consignee)
provide('closeDialog', closeCreateDialog)

async function init() {
  consignee.getConsignee();
};
function historyBack() {
  router.back()
}
function openCreateDialog(){
  isCreateDialogOpen.value = true;
}
function closeCreateDialog(){
  isCreateDialogOpen.value = false;
}

init();
</script>
