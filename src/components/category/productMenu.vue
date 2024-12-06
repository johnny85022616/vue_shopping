<template>
  <div class="productMenu mb-20">
    <ul>
      <li v-for="(item, idx) of processData" :key="idx">
        <div class="header p-2 text-base text-c_black bg-c_mercury">
          <p>{{ item.category.itemName }}</p>
        </div>
        <div class="list p-2">
          <aiProductItem :itemList="item.products" :showCampaignQtyIcon="true"/>
          <span class="inline-block w-full mt-4 text-c_brightblue text-sm text-right" v-if="data[idx].products.length >= 10" @click="gotoBPage(item.category.urlObj)">{{item.category.hasSub?'看更深...':'看更多...'}}</span>
        </div>
        <!-- 相關曝光活動 -->
        <div v-if="item.proLinks && item.proLinks.length" class="promotion-links w-full pt-[10px] pr-5 pb-[25px] pl-[25px] text-sm border-t border-dashed border-c_sliver box-border">
          <h3 class="text-sm mb-2">和「{{ item.category.itemName }}」的相關活動</h3>
          <ul class="flex flex-wrap">
            <li v-for="(obj, k) of item.proLinks" :key="k" class="list-none w-1/2 mb-2">
              <a :href="obj.campUrl" class="inline-block w-full text-c_blue no-underline whitespace-nowrap overflow-hidden text-ellipsis">
                {{ obj.campaignName }}》
              </a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div id="aiPromotionBottomLine"></div>
  </div>
</template>

<script lang="ts" setup name="productMenu">
import aiProductItem from '@/components/common/aiProductItem.vue';

import { computed, toRefs } from 'vue';
import { useRouter } from 'vue-router';
  const router = useRouter()

  const props = defineProps<{data:any[]}>()
  const {data} = toRefs(props)

  const gotoBPage = (urlObj: any) => {
   router.push(urlObj)
  }

  const processData = computed(()=>{
    return data.value.map(ele=>{
      const products = ele.products.slice(0, 9);
      return { category: ele.category, proLinks: ele.proLinks, products };
    })
  })
</script>
