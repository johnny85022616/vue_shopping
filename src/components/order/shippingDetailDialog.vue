<template>
  <div class="shippingDetailDialog">
    <div class="shippingDetailDialog">
      <transition name="slide">
        <fullscreenDialog :closeKey="'closeShippingDetailDialog'">
          <template v-slot:header>貨態進度</template>
          <template v-slot:body>
            <section class="shippingDetail">
              <p class="title text-base flex justify-center my-5">{{ product.logisticName }} 運貨單：<span><a
                    v-if="product.deliveryNo && product.logisticUrl" class="copyArea px-2 text-c_dodger_blue underline"
                    @click.prevent="goLogisticUrl(product.deliveryNo, product.logisticUrl)" href="" target="_blank">{{
                      product.deliveryNo }}</a>
                  <p class="text-c_sliver text-xs">(點擊連結複製貨運單號)</p>
                </span></p>
              <div v-if="shippingDetailData?.history" class="detail mt-10 ">
                <ul class="px-2">
                  <li v-for="(item, idx) in shippingDetailData?.history" :key="idx"
                    :class="['flex items-stretch', { last: idx === 0 }]">
                    <div class="left w-1/2 flex items-center py-5 border-r border-solid border-r-c_special relative">
                      <div
                        class="circle w-[9px] h-[9px] bg-c_special rounded-[50%] absolute top-1/2 -translate-y-1/2 -right-[5px]">
                      </div>
                      {{ item.formatDate }}
                    </div>
                    <div class="right w-1/2 flex items-center justify-between py-5 pl-[17vw]">
                      {{ item.status }}
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </template>
        </fullscreenDialog>
      </transition>
    </div>
  </div>
</template>


<script lang="ts" setup name="shippingDetailDialog">
import fullscreenDialog from '@/components/common/fullscreenDialog.vue';
import api from '@/apis/api';
import type { deliverTrack, orderProduct } from '@/types/order';
import { ref, toRefs } from 'vue';

const shippingDetailData = ref<deliverTrack | null>(null)

const props = defineProps<{ product: orderProduct }>()
const { product } = toRefs(props);
const emit = defineEmits(['closeShippingDetailDialog'])

function init() {
  getDeliverTrack()
}

//複製運貨單單號
function goLogisticUrl(num: string, url: string) {
  copyNumber(num);
  window.open(url);
}
//複製
function copyNumber(content: string) {
  navigator.clipboard.writeText(content).then(() => {
    alert(`已複製${content}至剪貼簿`);
  });
}

//取得貨態明細
async function getDeliverTrack() {
  const { deliveryNo, logisticName, timestamp } = product.value;

  shippingDetailData.value = await api.order.getDeliverTrack(
    deliveryNo,
    logisticName,
    timestamp.shipConfirmDate
  );
}

init()
</script>

<style lang="scss" scoped>
@import "../../style/color.scss";
.last {
  font-weight: bold;

  .left {
    .circle {
      width: 19px;
      height: 19px;
      background-color: $special;
      right: -10px;

      &::after {
        position: absolute;
        content: "✓";
        color: $white;
        width: 19px;
        height: 19px;
        z-index: 1;
        top: 45%;
        transform: translateY(-50%);
        right: -3px;
        font-size: 15px;
      }
    }
  }
}
</style>