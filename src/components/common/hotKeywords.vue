<template>
  <!-- <div v-if="keywords.length > 0" :class="['category-keywords', { isBsite: isBsite }]">
    <label :class="`${isBsite ? 'hotKey_light' : ''}`">熱門關鍵字</label>
    <div class="category-keywords__container">
      <div class="category-keywords__items" :style="[{ width: keywordsBlockWidthPixels }]">
        <span v-for="(item, idx) in keywords" :key="idx" @click="goSearchPage(item.kcontent)">
          {{ item.kcontent }}
        </span>
      </div>
    </div>
  </div> -->
</template>

<script lang="ts" setup name="hotKeywords">
import api from '@/apis/api';
import { useBsiteStore } from '@/stores/bsiteStore';
import tools from '@/util/tools';
import { storeToRefs } from 'pinia';
import { reactive, toRefs } from 'vue';

  const bsiteStore = useBsiteStore()
  const {siteData} = storeToRefs(bsiteStore)
  const props = defineProps<{isBsite: boolean}>()
  const {isBsite} = toRefs(props)
  const keywords = reactive([])

  const getHotkeywords = async()=>{
    let payloadData:any= {
        target: "pseudoid",
        list_fun: "K3s27",
        list_args: "content",
        list_remote: "m",
      };
      let sId = "";

      if(siteData.value){
        payloadData.list_fun = "KWSCloud";
        payloadData.list_remote = "b01";
        payloadData.list_num = "20";
        payloadData.site_id = siteData.value.siteId;
      }

      const findCache = tools.getCache(`ai_keywords_${sId}_cache_bSite`);
      if (findCache) {
        parseHotKeywords(findCache)
        return;
      }
      const data:any = await api.ai.getAiData('getklist', payloadData)


      if (data && data.kids) {
        parseHotKeywords(data);
        tools.setCache(`ai_keywords_${sId}_cache_bSite`, data, 300);
      }
  }

  const parseHotKeywords = (data:any)=>{

  }

  const init = ()=>{

  }
  init()


</script>

<style lang="scss" scoped>
@import "../../style/color";

</style>
