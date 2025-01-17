<template>
  <div class="campaign">

  </div>
</template>

<script lang="ts" setup name="campaign">
import type { productInfo } from '@/types/productInfo';
import { ref } from 'vue';

  const showDialog = ref(false)
  const isCampaignDialogOpen = ref(false)
  const campaignUI = ref<any|null>(null)
  const campaignPopupData = ref<any|null>(null)
  const isDiscountInputOpen = ref(false)
  const discountCode = ref("") 

  const props = defineProps<{pInfo: productInfo, bsiteLogin:boolean}>()
  
</script>