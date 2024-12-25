<template>
  <div class="navigation relative  h-[60px] m-0">
    <div v-if="siteData" class="redBg isBsite w-full h-[60px] flex z-20 fixed px-5"
      :style="{ backgroundColor: `${siteData.headerColor ? siteData.headerColor : '#ddd5cc'}` }">
      <div class="mini-logo flex justify-center items-center" @click="(evt) => openBsiteSite(evt)">
        <img class="w-auto max-h-[35px] mr-4" :src="siteData.logoMobile" />
      </div>
      <div class="subSiteName flex justify-center items-center w-[20%] text-base"
        v-if="siteData && siteData.b2Info && siteData.b2Info.subSiteName">
        <p
          class="text-c_white bg-[rgba($color: $black, $alpha: 0.2)] leading-[35px] tracking-[1px] border border-solid border-c_white rounded-[5px] px-1 box-border">
          {{ siteData.b2Info.subSiteName }}</p>
      </div>
      <div class="new-search flex justify-center items-center w-1/2">
        <div class="relative w-[90%]">
          <input
            class="border border-solid border-c_gallery inline-flex items-center relative box-border w-full h-10 rounded-lg bg-c_white pl-[10px] text-base"
            @keydown="goSearchByEnter" ref="searchInput" />
          <img class="w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2 "
            src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg" @click="goSearch" />
        </div>
      </div>
    </div>
    <div v-else class="redBg w-full h-[60px] flex z-20 fixed px-5" :style="{ backgroundColor: '#f5281e' }">
      <div div class="mini-logo w-[30%] mx-auto my-0 flex justify-center items-center" @click="openFridaySite">
        <img src="../../assets/icons/friday_logo.svg" />
      </div>
      <div class="new-search flex justify-center items-center">
        <div class="relative w-[90%]">
          <input
            class="inline-flex items-center relative box-border w-full h-10 border border-solid border-[rgba(255, 0, 0, 0.5)] rounded-lg bg-c_white pl-[10px] text-base"
            @keydown="goSearchByEnter" ref="searchInput" />
          <img class="w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2 "
            src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg" @click="goSearch" />
        </div>
      </div>
    </div>
    <navigationBottom @controlPeopleLinksStatus="controlPeopleLinksStatus" @controlMenuStatus="controlMenuStatus" @resetAllLinkAreaStatus="resetAllLinkAreaStatus"/>
    <transition name="slide">
      <menutree v-if="isShowMenu" @controlMenuStatus="controlMenuStatus"/>
    </transition>
    <transition name="slide">
      <peoplelinks v-if="isShowPeopleLinks" />
    </transition>
  </div>
</template>

<script setup lang="ts" name="Homepage">
  import navigationBottom from '../navigation/navigationBottom.vue';
  import peoplelinks from '../navigation/peoplelinks.vue';
  import menutree from '../navigation/menutree.vue';
  import { ref, type Ref } from 'vue';
  import { useBsiteStore } from '../../stores/bsiteStore';
  import { storeToRefs } from 'pinia';
  import type { siteData } from '@/types/apiWeb';

  import tools from '@/util/tools';
import { useRouter } from 'vue-router';

  const BsiteStore = useBsiteStore()
  let searchInput: Ref<HTMLInputElement | null> = ref(null) // input值
  const { siteData } = storeToRefs(BsiteStore) //siteData
  const router = useRouter()


  const isShowMenu = ref(false)
  const isShowPeopleLinks = ref(false)


  // 打開friDay主站
  function openFridaySite(evt: MouseEvent) {
    if (evt) evt.preventDefault();
    window.location.href = "/";
  }
  // 打開bSite主站
  function openBsiteSite(evt: Event) {
    if (evt) evt.preventDefault();
    if (siteData.value) {
      window.location.href = "/" + siteData.value.urlSuffix;
    }
  }
  //搜尋框按下enter
  function goSearchByEnter(evt: KeyboardEvent) {
    if (evt && evt.keyCode === 13) {
      // evt.preventDefault();
      goSearch();
      evt.stopPropagation();
    }
  }
  //搜尋事件
  async function goSearch() {
    let keyword = ""
    if (searchInput.value) {
      keyword = searchInput.value.value
    }
    const { urlSuffix } = siteData.value || {};

    // 自然搜尋判斷全站
    if (/^([0-9]{5,10})$/i.test(keyword)) {

      const pidInfo: any = await tools.getPidsInfo([keyword]);
      console.log(pidInfo);
      if (pidInfo && pidInfo[keyword]) {
        if (siteData.value) {
          window.location.href = `${urlSuffix ? `/${urlSuffix}` : ""
            }/product/${keyword}`;
          return false;
        }
        window.location.href = `${urlSuffix ? `/${urlSuffix}` : ""
          }/product?pid=${keyword}`;
        return false;
      }
    }
    if (keyword !== "") {
      router.push({name: 'aisearch' , query: {keyword}})
    }
  }
  
  // peoplelinks開合控制
  function controlPeopleLinksStatus(){
    if(isShowPeopleLinks.value){
      closePeopleLinks()
      return 
    }
    closeShowMenu()
    openPeopleLinks()
  }

  function controlMenuStatus(){
    if(isShowMenu.value){
      closeShowMenu()
      return
    }
    closePeopleLinks()
    openShowMenu()
  }

  // 打開全分類選單
  function openShowMenu() {
    isShowMenu.value = true;
  }
  //關閉全分類選單
  function closeShowMenu() {
    isShowMenu.value = false;
  }
  //開啟我的選單
  function openPeopleLinks() {
    isShowPeopleLinks.value = true;
  }
  //關閉我的選單
  function closePeopleLinks(){
    isShowPeopleLinks.value = false;
  }

  //關閉所有navigationBottom展開的區塊
  function resetAllLinkAreaStatus() {
    isShowMenu.value = false;
    isShowPeopleLinks.value = false
  }
</script>

<style lang='scss' scoped></style>
