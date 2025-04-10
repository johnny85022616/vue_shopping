<template>
  <div class="statusBar flex text-sm text-c_sliver p-2 break-keep">
    <div v-for="(item, idx) of product.deliverProcess" :key="idx"
      :class="['group basis-1/4 flex-grow text-center', { last: (item?.active) && (!(product.deliverProcess[idx + 1]?.active)) }]">
      <div :class="['group', { act: item?.active }]">
        <div class="status flex items-center h-5">
          <div
            :class="['leftline w-[calc((100%-10px)/2)] h-[1px] bg-c_sliver group-[.act]:bg-c_special', { 'opacity-0': idx === 0 }]">
          </div>
          <div
            :class="`circle w-[10px] h-[10px] rounded-[50%] bg-c_sliver flex flex-shrink-0 relative group-[.act]:bg-c_special`">
          </div>
          <div
            :class="['leftline w-[calc((100%-10px)/2)] h-[1px] bg-c_sliver group-[.act]:bg-c_special', { 'opacity-0': idx === product.deliverProcess.length - 1 }]">
          </div>
        </div>
        <p class="`statusText mt-[10px] group-[.act]:text-c_mine_shaft group-[.last]:font-bold">{{ item?.text }}<br>{{ item?.time || "" }}</p>
        <template v-if="needLookShippingDetail">
          <div
            v-if="!isNegative(order?.dealId) && product.isShowShippingDetail && product.isIntangible === '0' && item?.text === '已出貨'"
            class="lookShippingDetail text-c_dodger_blue underline"><a @click.prevent="lookShippingDetail(product)" href="">看進度</a></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="statusBar">
import type { DeliverProcess, order, orderProduct } from '@/types/order';
import { ref, toRefs } from 'vue';

const props = defineProps<{ order: order, product: orderProduct, needLookShippingDetail: boolean }>()
const { order, product, needLookShippingDetail } = toRefs(props)

const emit = defineEmits(['lookShippingDetail'])

function isNegative(dealId: string) {
  return /^R/i.test(dealId);
}

function lookShippingDetail(product: orderProduct) {
  emit("lookShippingDetail", product);
}

//是否為最後一個點
function isLast(deliverProcessArr: (DeliverProcess | null)[], item: DeliverProcess | null, idx: number) {
  if (!item) return false
  else return (item?.active) && (!(deliverProcessArr[idx + 1]?.active))
}

</script>

<style lang="scss" scoped>
.last {
  .circle {
    width: 18px;
    height: 18px;
    &::after {
      position: absolute;
      content: "✓";
      color: white;
      width: 18px;
      height: 18px;
      z-index: 1;
      left: 0px;
      top: -1px;
      font-size: 15px;
    }
  }
  .status {
    >div {
      &:first-of-type {
        @apply w-[calc((100%-18px)/2)];
      }
    }
  }
}
</style>