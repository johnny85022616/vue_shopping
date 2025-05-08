<template>
  <div class="consigneeManagement">
    <navigation :windowY="200"></navigation>
  </div>
</template>

<script lang="ts" setup name="consigneeManagement">
import navigation from '@/components/common/navigation.vue';
import useConsignee from '@/hooks/useConsignee';

const {consigneeData, getConsignee} = useConsignee();

const init = async () => {
  getConsignee();
};



init();
</script>
