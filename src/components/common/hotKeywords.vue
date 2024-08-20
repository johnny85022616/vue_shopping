<template>
  <div v-if="keywordList.length > 0" :class="`hot-keywords py-2 flex ${isBsite?'bg-c_swirl':'bg-c_emperor'}`">
    <p :class="`bg-hotKeyword-bg bg-100% bg-center bg-no-repeat writing-rl text-c_white text-sm flex items-center pl-[5px] pr-3 pt-2 ${siteData?'bg-hotKeywordBsite-bg':'bg-hotKeyword-bg'}`">熱門關鍵字</p>
    <div class="w-full min-h-[85px] my-auto pt-1 pl-1 overflow-x-auto overflow-y-hidden" style="max-height: calc((1.3rem + 18px) * 2);">
      <div class="relative w-full pr-5 text-sm" :style="[{ width: keywordsBlockWidthPixels }]">
        <span v-for="(item, idx) in keywordList" class="inline-block leading-[30px] bg-c_white text-c_mine_shaft rounded-3xl mr-1 mb-4 px-2" :key="idx" @click="goSearchPage(item.kcontent)">
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
