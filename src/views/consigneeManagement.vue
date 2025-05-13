<template>
  <div class="consigneeManagement">
    <navigation :windowY="200"></navigation>
    <div class="w-full h-[50px] text-center border-b border-solid border-c_alto relative flex items-center justify-between p-5">
      <i class="w-5 h-5 bg-nextArrow-icon bg-center bg-100% bg-no-repeat rotate-180 " @click="historyBack"></i>
      <p class="text-lg font-bold text-c_mine_shaft">收貨人通訊錄管理</p>
      <span @click="openCreateDialog">新增</span>
    </div>
    <consigneeList v-if="consigneeData && consigneeData.length !== 0" :consigneeData="consigneeData"></consigneeList>
  </div>
</template>

<script lang="ts" setup name="consigneeManagement">
import navigation from '@/components/common/navigation.vue';
import consigneeList from '@/components/consignee/consigneeList.vue';
import useConsignee from '@/hooks/useConsignee';
import { provide, toRefs } from 'vue';
import { useRouter } from 'vue-router';

const router  = useRouter()
const consignee = useConsignee(); //取得consignee composable
const { consigneeData } = toRefs(consignee)
provide('consignee', consignee)

async function init() {
  consignee.getConsignee();
};
function historyBack() {
  router.back()
}
function openCreateDialog(){
}

init();
</script>
