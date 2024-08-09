<template>
  <div class="discountAndHot w-full mt-10">
    <div class="w-full pt-11 pb-3 box-border bg-c_background rounded-lg relative">
      <div
        class="head flex items-center justify-between h-[46px] text-c_dune bg-c_white border-2 border-solid border-c_silver1 rounded-md mt-[-58px] mr-4 mb-2 ml-4 p-2">
        <div class="h-full inline-flex items-center whitespace-nowrap text-base mr-3 font-medium ">
          <i class="mr-2 inline-block w-5 h-5 bg-flash-Icon bg-no-repeat bg-100% bg-center"></i>
          熱銷商品推薦，10點更新
        </div>
        <div class="h-100 flex items-center text-c_mine_shaft">
          <div class="box-border rounded-2xl text-sm text-center">
            <a class="flex items-center text-c_dodger_blue no-underline"
              :href="'https://event.shopping.friday.tw/event/202111/20211122-lookmore/index.html?pids=' + promotionId"
              target="_blank">看更多
              <i class="bg-player-icon bg-center bg-no-repeat bg-100% ml-1 inline-block w-4 h-4"></i>
            </a>
          </div>
        </div>
      </div>
      <div class="prodcut-list grid grid-cols-2 gap-4 px-3">
        <a class="relative min-h-[210px] p-2 rounded-lg no-underline bg-c_white flex flex-col items-center"
          v-for="(item, index) of prodData" :key="index" href="" @click="e => tools.goProductPage(e, item.pid)">
          <img class="aspect-square" :src="item.image_url" :alt="item.name">
          <div class="reactive w-full flex justify-end items-baseline mt-2">
            <span v-if="item.discount"
              class="absolute left-[-5px] top-[148px] p-[2px] text-c_white bg-c_fcoin text-sm text-center min-w-10 max-w-[50px] flex items-center justify-center rounded-lg ">
              {{ formatDiscount(item.discount) }}<p class="text-xs">折</p>
            </span>
            <p class="mr-1 text-c_sliver text-xs line-through">{{ item.list_price }}</p>
            <p class="text-c_red text-xl">{{ item.cheapest }}</p>
          </div>
          <span class="text-sm line-clamp-2 mt-2">
            {{ item.name }}
          </span>
          <span class="homepage-promotion-timer__label">
            {{ item.promotion }}
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="discountAndHot">
  import api from '@/apis/api';
  import tools from '@/util/tools';
  import { reactive, ref } from 'vue';
  const prodData = reactive<any>([])
  const promotionId = ref("B23001813")

  const getPidsByPromotionId = async () => {
    const data = await api.web.getPromotionGatherApi(promotionId.value)
    if (!data) return [];
    const rawPids = data.value.split(',').splice(0, 6);
    return api.web.getProductBatchApi(rawPids);
  }
  const formatDiscount = (discount: number) => {
    if (discount) {
      return Math.floor(discount)
    }
    return 0
  }

  const init = async () => {
    const data = await getPidsByPromotionId()
    Object.assign(prodData, data)
  }
  init()
</script>
