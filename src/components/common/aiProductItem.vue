<template>
  <div class="aiProductItem">
    <!-- <div v-if="layoutType === 'one'" class="oneProductList">
      <ul>
        <li v-for="(item, index) in itemList" :key="index" @click="(e) => tools.goProductPage(e, item.pid, item, hrefTarget, searchDataCount, (isAiData ? index : aiDataCount + index))">
          <div class="item-img">
            <img v-lazy="item.img" />
            <span v-if="item.soldout" class="squaremask">
              <font>補貨中</font>
            </span>
          </div>
          <div class="items-info">
            <p class="pname" v-html="item.name"></p>
            <div class="iconArea">
              <span class="storeIcon" v-if="isShowStoreIcon && item.isStore === 1">超</span>
              <span v-if="showCampaignQtyIcon && item.campaignQty" class="campaignIcon">折({{item.campaignQty}})</span>
            </div>
            <div class="price-box">
              <div>
                <font v-if="item.price!==null" class="price">{{ productPrice(item.price) }}</font>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else :class="listClass">
      <template v-for="(item, index) in itemList">
        <div v-if="item.image_url && item.price" :class="itemClass" :key="index">
          <div class="items-wrap">
            <a href="" @click="(e) => tools.goProductPage(e, item.pid, item, hrefTarget, searchDataCount, (isAiData ? index : aiDataCount + index))" v-bind="trackingCode(item.name)">
              <div class="items-img">
                <img v-lazy="item.image_url" />
                <span v-if="item.soldout" class="squaremask">
                  <font>補貨中</font>
                </span>
              </div>
              <div class="items-txt">
                <span class="pname" v-html="item.name"></span>
                <span v-if="item.price!==null" class="price-box">
                  <template v-if="item.rewardPointInfo && item.rewardPointInfo.lifePartialPoint !== undefined">
                    <i class="fcoin"></i>
                    <font class="coin">{{ productPrice(item.rewardPointInfo.lifePartialPoint) }}</font> +
                    <font class="coin_price">{{ productPrice(item.rewardPointInfo.lifePartialPrice) }}</font>
                  </template>
<template v-else-if="item.rewardPointInfo && item.rewardPointInfo.lifeExchangePoint !== undefined">
                    <i class="fcoin"></i>
                    <font class="coin">{{ productPrice(item.rewardPointInfo.lifeExchangePoint) }}</font>
                  </template>
<template v-else>
                    <template v-if="isFromFetmcPromotion">
                      <i class="fcoin"></i>
                      <font class="coin">{{ productPrice(item.price) }}</font>
                    </template>
<span v-else class="price-box">
  <font class="price">{{ productPrice(item.price) }}</font>
  <font v-if="item.priceSuffix" class="priceSuffix">{{ item.priceSuffix }}</font>
</span>
</template>
<span v-if="showCampaignQtyIcon && item.campaignQty" class="campaignIcon">折({{item.campaignQty}})</span>
</span>
</div>
</a>
<div class="iconArea">
  <span class="storeIcon" v-if="isShowStoreIcon && item.isStore===1">超</span>
</div>
</div>
</div>
</template>
</div> -->
  </div>
</template>

<script lang="ts" setup name="aiProductItem">
  import type { mixProduct } from '@/types/mixProducts';
  import { computed, toRefs } from 'vue';
  import tools from '@/util/tools';

  const props = withDefaults(
    defineProps<{
      itemList: mixProduct[];
      layoutType: string;
      isTwoColumn: boolean;
      isAiData: boolean;
      aiDataCount: number;
      bwDataCount: number;
      noWrap: boolean;
      hrefTarget: string;
    }>(),
    {
      layoutType: 'two',
      isTwoColumn: false,
      searchKeyword: '',
      isAiData: false,
      aiDataCount: 0,
      bwDataCount: 0,
      noWrap: false,
      hrefTarget: '_self',
      isFromFetmcPromotion: false,
      isShowSoldout: false,
      isShowStoreIcon: false,
      showCampaignQtyIcon: false,
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
    isFromFetmcPromotion,
    isShowSoldout,
    isShowStoreIcon,
    showCampaignQtyIcon,
    searchKeyword,
  } = toRefs(props);

  function productPrice(price: number) {
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

  const itemClass = computed(()=>{
    return {
      item: true,
      square: true,
    }
  })

  
</script>

