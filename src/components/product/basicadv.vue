<template>
  <div>
    <div class="basicadv">
      <div class="">
        <div class="w-full h-[44px] leading-[44px] text-c_sliver text-center bg-c_background" data-tab="詳情">
          －商品詳情－
        </div>
        <div class="px-2">
          <div class="relative py-2 px-5">
            <label class="w-1/5 bg-c_sliver"></label>
            <span></span>
            <span class="inline-block absolute right-[10px] w-5 h-5" @click="copyNumber(nowBrowserUrl)">&nbsp;</span>
          </div>
          <div v-html="productDescriptionFilters" ref="productDescriptionFilters" class="html-content"></div>
        </div>
      </div>
    </div>
    <div class="gap-line"></div>
  </div>
</template>

<script lang="ts" setup name="basicadv">
import { computed, ref, toRefs } from 'vue';
import api from '@/apis/api';
import tools from '@/util/tools';

const props = defineProps<{ pid: string }>()
const { pid } = toRefs(props)
const productDescription = ref<string | null>(null)


const copyNumber = (content: string) => {
  navigator.clipboard.writeText(content).then(() => {
    alert(`已複製${content}至剪貼簿`);
  });
}

const productDescriptionFilters = computed(() => {
  let content = productDescription.value;
  if (content) {
    content = tools.replaceTplImagePath(content);
    content = tools.replaceWidthAndHeight(content);
    content = tools.figureToIframe(content);
  }
  return content;
})

const nowBrowserUrl = computed(() => {
  const isSuperApp = /super-app/i.test(document.cookie);
  return '【' + window.location.href + '】【' + navigator.userAgent + '】【isSuperApp:' + isSuperApp + '】';
})

// 取得簡介
const getProductDescription = async () => {
  productDescription.value = await api.product.getProductDescription(pid.value)
}

const init = async()=>{
  getProductDescription();
}

init()

</script>