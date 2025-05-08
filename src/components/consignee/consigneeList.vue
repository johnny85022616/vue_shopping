<template>
 <ul class="consigneeList bg-c_background min-h-full py-2 mb-[60px]">
      <li v-for="item in consigneeData" class="bg-c_white flex justify-between py-4 px-2 m-2 rounded-lg first:mt-0" :key="item.id">
        <div class="consigneeList__item-left">
          <div class="flex mb-1">
            <radioButton :isActive="item.isDefault" :callBack="() => updateDefaultConsignee(item.id)" />
            <p class="text-sm font-bold text-c_black">{{item.name}}</p>
            <p v-if="item.isDefault" class="text-sm font-bold text-c_black">(預設)</p>
          </div>
          <p class="text-sm mb-1 text-c_sliver font-bold">{{item.mobile}}</p>
          <p class="text-sm text-c_sliver font-bold mb-2">{{item.addr?.fullAddress}}</p>
        </div>
        <div class="consigneeList__item-right">
          <i @click="openCenterDialog(item.id)"></i>
        </div>
      </li>
    </ul>
</template>

<script lang="ts" setup name="consigneeList">
import type { consignee } from '@/types/consignee';
import { toRefs } from 'vue';


const props = defineProps<{
  consigneeData: consignee[];
}>();
const {consigneeData} = toRefs(props);

function updateDefaultConsignee(id: string){}

function openCenterDialog(id: string){}

</script>