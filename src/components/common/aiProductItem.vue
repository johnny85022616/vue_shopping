<template>
  <div class="aiProductItem">
    <div v-if="layoutType === 'one'" class="oneProductList">
      <ul v-if="itemList" class="list-none"> 
        <li v-for="(item, index) in itemList" :key="index" class="flex justify-between mb-6 border-b border-solid border-c_alto pb-4"
          @click="(e) => tools.goProductPage(e, item.pid, item, hrefTarget, searchDataCount, (isAiData ? index : aiDataCount + index))">
          <div class="item-img relative w-1/4 h-0 pb-1/4">
            <img :src="item.img" class="absolute w-full h-full object-cover aspect-square" />
            <span v-if="item.soldout" class="squaremask absolute flex justify-center items-center opacity-95 right-0 left-0 bottom-0 w-full h=5 text-white text-center bg-c_sliver">
              <p class="inline-block w-1/2 text-xs">補貨中</p>
            </span>
          </div>
          <div class="items-info flex flex-col justify-between w-[70%] ">
            <p class="overflow-hidden line-clamp-2 text-ellipsis text-sm" v-html="item.name"></p>
            <div class="iconArea text-left mt-1">
              <span class="storeIcon bg-c_olivine box-border text-c_white rounded-md px-1 mt-1 mr-1 text-xs" v-if="isShowStoreIcon && item.isStore === 1">超</span>
              <span v-if="showCampaignQtyIcon && item.campaignQty" class="campaignIcon bg-c_red box-border text-c_white rounded px-1 text-xs">折({{ item.campaignQty }})</span>
            </div>
            <div class="price-box flex items-center justify-between text-sm">
              <div>
                <p v-if="item.price !== null" class="price text-c_pomegranate text-3xl before:content-['$'] before:text-c_red before:text-sm">{{ productPrice(item.price) }}</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else :class="['product-list w-full grid gap-y-6 gap-x-2', `${isTwoColumn? 'grid-cols-2': 'grid-cols-3' }`]">
      <template v-for="(item, index) in itemList">
        <div v-if="item.image_url && item.price" :key="index">
          <div class="items-wrap align-top text-right">
            <a href=""
              @click="(e) => tools.goProductPage(e, item.pid, item, hrefTarget, searchDataCount, (isAiData ? index : aiDataCount + index))" class="block no-underline">
              <div class="items-img w-full aspect-square border border-solid border-c_silver1 rounded-lg overflow-hidden">
                <img :src="item.image_url" class="w-full h-full object-cover"/>
                <span v-if="item.soldout" class="squaremask absolute flex justify-center items-center opacity-95 right-0 left-0 bottom-0 w-full h=5 text-white text-center bg-c_sliver">
                  <p class="inline-block w-1/2 text-xs">補貨中</p>
                </span>
              </div>
              <div class="items-txt">
                <span class="pname text-c_mine_shaft text-sm overflow-hidden text-left line-clamp-2 text-ellipsis min-h-10" v-html="item.name"></span>
                <span v-if="item.price !== null" class="price-box flex justify-between items-center text-sm">
                  <template>
                    <span class="price-box relative w-2/3 ">
                      <p class="price text-c_pomegranate text-xl before:content-['$'] before:text-sm before:text-c_red">{{ productPrice(item.price) }}</p>
                      <p v-if="item.priceSuffix" class="priceSuffix absolute bottom-[-10px] left-2 text-c_special text-2">{{ item.priceSuffix }}</p>
                    </span>
                  </template>
                  <span v-if="showCampaignQtyIcon && item.campaignQty"
                    class="campaignIcon bg-c_red text-c_white rounded-md px-1 text-xs">折({{ item.campaignQty }})</span>
                </span>
              </div>
            </a>
            <div class="iconArea text-left mt-2">
              <span class="storeIcon bg-c_olivine text-c_white rounded-md mt-2 mr-2 text-xs" v-if="isShowStoreIcon && item.isStore === 1">超</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup name="aiProductItem">
import type { mixProduct } from '@/types/mixProducts';
import { computed, toRefs } from 'vue';
import tools from '@/util/tools';

const props = withDefaults(
  defineProps<{
    itemList: mixProduct[],
    layoutType?: string,
    isTwoColumn?: boolean,
    isAiData?: boolean,
    aiDataCount?: number,
    bwDataCount?: number,
    noWrap?: boolean,
    hrefTarget?: string,
    isShowStoreIcon?: boolean,
    showCampaignQtyIcon?: boolean,
  }>(),
  {
    layoutType: 'two',
    isTwoColumn: false,
    isAiData: false,
    aiDataCount: 0,
    bwDataCount: 0,
    noWrap: false,
    hrefTarget: '_self',
    isShowStoreIcon: false,
    showCampaignQtyIcon: false
  }
);

const {
  itemList,
  layoutType,
  isTwoColumn,
  isAiData,
  aiDataCount,
  bwDataCount,
  noWrap,
  hrefTarget,
  isShowStoreIcon,
  showCampaignQtyIcon,
} = toRefs(props);

function productPrice(price: number | undefined) {
  return tools.priceFormat(price);
}

const searchDataCount = computed(() => {
  return aiDataCount.value + bwDataCount.value;
});

const listClass = computed(() => {
  return {
    'product-list': true,
    'two-column': isTwoColumn.value,
    square: true,
    noWrap: noWrap.value,
  };
});

const itemClass = computed(() => {
  return {
    item: true,
    square: true,
  }
})


</script>
