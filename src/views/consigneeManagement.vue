<template>
  <div class="consigneeManagement">
    <navigation :windowY="200"></navigation>
    <consigneeList v-if="consigneeData && consigneeData.length !== 0" :consigneeData="consigneeData"
      @getConsignee="getConsignee" @updateDefaultConsignee="updateDefaultConsignee"></consigneeList>
  </div>
</template>

<script lang="ts" setup name="consigneeManagement">
import navigation from '@/components/common/navigation.vue';
import consigneeList from '@/components/consignee/consigneeList.vue';
import useConsignee from '@/hooks/useConsignee';

const { consigneeData, getConsignee , updateDefaultConsignee } = useConsignee();

const init = async () => {
  getConsignee();
};



init();
</script>
