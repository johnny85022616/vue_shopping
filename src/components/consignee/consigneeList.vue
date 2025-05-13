<template>
  <ul class="consigneeList bg-c_background min-h-[100vh] mb-[50px]">
    <li v-for="item in consigneeData" class="bg-c_white flex justify-between py-4 px-2 m-2 rounded-lg first:mt-0"
      :key="item.id">
      <div class="consigneeList__item-left">
        <div class="flex mb-2">
          <i :class="`${item.isDefaultBoolean ? 'bg-radio-active-icon' : 'bg-radio-icon'
            } w-5 h-5 mr-2 bg-center bg-100% bg-no-repeat`" @click="updateConsignee(item.id)"></i>
          <p class="text-sm font-bold text-c_black">{{ item.name }}</p>
          <p v-if="item.isDefault" class="text-sm font-bold text-c_black">(預設)</p>
        </div>
        <p class="text-sm mb-1 text-c_sliver font-bold">{{ item.mobile }}</p>
        <p class="text-sm text-c_sliver font-bold mb-2">{{ item.addr?.fullAddress }}</p>
      </div>
      <div class="consigneeList__item-right">
        <i @click="deleteConsignee(item.id)"
          class="inline-block bg-delete-icon w-5 h-5 mr-2 bg-center bg-100% bg-no-repeat"></i>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup name="consigneeList">
import type { consigneeConposable } from '@/hooks/useConsignee';
import type { consignee } from '@/types/consignee';
import { inject, toRefs } from 'vue';

const props = defineProps<{
  consigneeData: consignee[];
}>();
const { consigneeData } = toRefs(props);
const consignee = inject('consignee') as consigneeConposable;

const emit = defineEmits(['updateDefaultConsignee']);

init();

function init() { }

//變更預設收貨人
function updateConsignee(id: string) {
  consignee.updateDefaultConsignee(id);
}
//刪除聯絡人
async function deleteConsignee(id: string) {
  consignee.deleteConsignee(id);
}
</script>
