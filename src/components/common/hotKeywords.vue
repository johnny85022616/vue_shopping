<template>
  <div v-if="keywordList.length > 0" :class="`hot-keywords py-2 flex ${isBsite?'bg-c_swirl':'bg-c_emperor'}`">
    <label class="w-5 bg-hotKeyword-bg bg-contain bg-center bg-no-repeat writing-rl inline-block pt-2 pr-3 pb-2 pl-1 text-c_white text-sm">熱門關鍵字</label>
    <div class="w-full min-h-[85px]">
      <div class="category-keywords__items" :style="[{ width: keywordsBlockWidthPixels }]">
        <span v-for="(item, idx) in keywordList" :key="idx" @click="goSearchPage(item.kcontent)">
          {{ item.kcontent }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="hotKeywords">
import api from '@/apis/api';
import { useBsiteStore } from '@/stores/bsiteStore';
import tools from '@/util/tools';
import { storeToRefs } from 'pinia';
import { reactive, ref, toRefs } from 'vue';

const bsiteStore = useBsiteStore();
const { siteData } = storeToRefs(bsiteStore);
const props = defineProps<{ isBsite: boolean }>();
const { isBsite } = toRefs(props);
const keywordList = reactive<any[]>([]);
const keywordsBlockWidthPixels = ref('0px'); // 熱門關鍵字捲軸寬度計算

const getHotkeywords = async () => {
  let payloadData: any = {
    target: 'pseudoid',
    list_fun: 'K3s27',
    list_args: 'content',
    list_remote: 'm',
  };
  let sId = '';

  if (siteData.value) {
    payloadData.list_fun = 'KWSCloud';
    payloadData.list_remote = 'b01';
    payloadData.list_num = '20';
    payloadData.site_id = siteData.value.siteId;
  }

  const findCache = tools.getCache(`ai_keywords_${sId}_cache_bSite`);
  if (findCache) {
    parseHotKeywords(findCache);
    return;
  }
  const data: any = await api.ai.getAiData('getklist', payloadData);

  if (data && data.kids) {
    parseHotKeywords(data);
    tools.setCache(`ai_keywords_${sId}_cache_bSite`, data, 300);
  }
};

const parseHotKeywords = (data: any) => {
  const keywords = data.kids.slice(0, 30);
  const keywordsBlockWidth = keywords.reduce((p: any, v: any) => {
    return p + tools.strlen(v.kcontent);
  }, 0);

  keywordsBlockWidthPixels.value = (Math.floor(keywordsBlockWidth) * 8.6) / 2 + 'px';
  Object.assign(keywordList, keywords);
};

const goSearchPage = (keyword:string) => {
  const url = `/aisearch?keyword=${encodeURIComponent(keyword)}`;
  location.href = url;
};

const init = async () => {
  getHotkeywords();
};
init();
</script>

<style lang="scss" scoped>
@import '../../style/color';
</style>
