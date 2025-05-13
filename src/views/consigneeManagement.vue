<template>
  <div class="consigneeManagement">
    <navigation :windowY="200"></navigation>
    <consigneeList v-if="consigneeData && consigneeData.length !== 0" :consigneeData="consigneeData"
    ></consigneeList>
  </div>
</template>

<script lang="ts" setup name="consigneeManagement">
import navigation from '@/components/common/navigation.vue';
import consigneeList from '@/components/consignee/consigneeList.vue';
import useConsignee from '@/hooks/useConsignee';
import { provide, toRefs } from 'vue';

const consignee = useConsignee(); //取得consignee composable
const {consigneeData} = toRefs(consignee)
provide('consignee', consignee)

const init = async () => {
  consignee.getConsignee();
};


init();
</script>
