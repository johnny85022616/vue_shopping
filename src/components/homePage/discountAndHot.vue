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
              href="/campaign/DO_241004094023093"
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
          <div class="reactive w-full flex items-baseline mt-2">
            <p class="text-c_red text-xl text-left">${{ tools.priceFormat(item.price) }}</p>
          </div>
          <span class="text-sm line-clamp-2 mt-2">
            {{ item.name }}
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="discountAndHot">
  import api from '@/apis/api';
import type { product } from '@/types/product';
  import tools from '@/util/tools';
  import { reactive, ref } from 'vue';
  const prodData = ref<product[] | null>([])

  const init = async () => {
    const campaignInfo = await fetchCampaignInfo();
    console.log(1111,campaignInfo);
      return parseCampaignProducts(campaignInfo);
  }

   async function fetchCampaignInfo(): Promise<campaignInfo[]> {
      return await api.campaign.getCampaignDetail(["DO_241004094023093"]);
    }
    async function parseCampaignProducts(campaignInfo: campaignInfo[]) {
      if (!campaignInfo || !campaignInfo[0]) return [];
      if (!campaignInfo[0].campaignRange?.v[9]) return [];

      const pids = campaignInfo[0].campaignRange.v[9].split(",").splice(0, 6);
      const products = await api.product.getProducts(pids);
      console.log(products);
      const etlData = pids.map((v:string) => products?.[v]);
      prodData.value = etlData
    }
  init()
</script>
