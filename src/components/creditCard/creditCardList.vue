<template>
  <ul class="consigneeList bg-c_background min-h-[100vh] mb-[50px] py-3">
    <li v-for="(item , idx) in creditCardData" class="bg-c_white flex py-4 px-2 m-2 rounded-lg first:mt-0"
      :key="idx">
      <div class="left">
          <i :class="`${item.isChose ? 'bg-radio-active-icon' : 'bg-radio-icon'} inline-block w-5 h-5 mr-2 bg-center bg-100% bg-no-repeat`"></i>
      </div>
      <div class="middle flex-1">
        <div class="flex items-center mb-1">
          <p class="text-sm font-bold text-c_black mr-2">{{ item.bankName }}</p>
          <p v-if="item.isChose" class="text-sm text-c_red">[預設]</p>
        </div>
        <div class="flex items-center mb-1">
          <p class="text-sm text-c_sliver mr-2">**** {{item.lastFourDigits}} {{item.expiration.slice(4,6)}}/{{item.expiration.slice(2,4)}}</p>
          <i
            class="inline-block w-6 h-4 mr-2 bg-center bg-100% bg-no-repeat"
            :class="{
              'bg-visa-icon': item.creditCardType === 1,
              'bg-mastercard-icon': item.creditCardType === 2,
              'bg-jcb-icon': item.creditCardType === 3
            }"
          ></i>
        </div>
        <p class="text-sm text-c_sliver">{{ item.name }}</p>
      </div>
      <div class="right">
        <i class="inline-block bg-delete-icon w-5 h-5 mr-2 bg-center bg-100% bg-no-repeat"></i>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup name="consigneeList">;
import type { creditCardConposable } from '@/hooks/useCreditCard';
import type { creditCard } from '@/types/creditCard';
import { inject, toRefs } from 'vue';

const props = defineProps<{
  creditCardData: creditCard[];
}>();
const { creditCardData } = toRefs(props);
const creditCard = inject('creditCard') as creditCardConposable;

init();

function init() { }

</script>
