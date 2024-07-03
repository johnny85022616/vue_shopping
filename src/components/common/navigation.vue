<template>
  <div class="navigation relative  h-[60px] m-0">
    <div v-if="siteData" class="redBg isBsite w-full h-[60px] flex z-2 fixed px-5"
      :style="{ backgroundColor: `${siteData.headerColor ? siteData.headerColor : '#ddd5cc'}` }">
      <div class="mini-logo flex justify-center items-center" @click="(evt) => openBsiteSite(evt)">
        <img class="w-auto max-h-[35px] mr-4" :src="siteData.logoMobile" />
      </div>
      <div class="subSiteName flex justify-center items-center w-[20%] text-base" v-if="siteData && siteData.b2Info && siteData.b2Info.subSiteName">
        <p class="text-customWhite bg-[rgba($color: $black, $alpha: 0.2)] leading-[35px] tracking-[1px] border-1 border-solid border-$white rounded-[5px]">{{ siteData.b2Info.subSiteName }}</p>
      </div>
      <div class="new-search flex justify-center items-center">
        <div class="grayb">
          <input @keydown="goSearchByEnter" ref="searchInput" />
          <img src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg" @click="goSearch" />
        </div>
      </div>
    </div>
    <div v-else class="redBg w-full h-[60px] flex z-2 fixed px-5" :style="{ backgroundColor: '#f5281e' }">
      <div div class="mini-logo w-[30%] mx-auto my-0 flex justify-center items-center" @click="openFridaySite">
        <img src="../assets/icons/friday_logo.svg" />
      </div>
      <div class="new-search flex justify-center items-center">
        <div>
          <input @keydown="goSearchByEnter" ref="searchInput" />
          <img src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg" @click="goSearch" />
        </div>
      </div>
    </div>
    <navigationBottom/>
  </div>
</template>

<script setup lang="ts" name="Homepage">
  import navigationBottom from '../navigation/navigationBottom.vue';
  import { ref, type Ref } from 'vue';
  import { useBsiteStore } from '../../stores/bsiteStore';
  import { storeToRefs } from 'pinia';
  import type { siteData } from '@/types/apiWeb';

  import tools from '@/util/tools';

  let searchInput: Ref<HTMLInputElement | null> = ref(null)
  const BsiteStore = useBsiteStore()
  const { siteData } = storeToRefs(BsiteStore)
  console.log(siteData.value?.urlSuffix);


  // 打開friDay主站
  function openFridaySite(evt: MouseEvent) {
    if (evt) evt.preventDefault();
    window.location.href = "/";
  }
  function goSearchByEnter(evt: KeyboardEvent) {
    if (evt && evt.keyCode === 13) {
      // evt.preventDefault();
      goSearch();
      evt.stopPropagation();
    }
  }
  // 打開bSite主站
  function openBsiteSite(evt: Event) {
    if (evt) evt.preventDefault();
    if (siteData.value) {
      window.location.href = "/" + siteData.value.urlSuffix;
    }
  }
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
      window.location.href = `${urlSuffix ? `/${urlSuffix}` : ""
        }/aisearch?keyword=${encodeURIComponent(keyword)}&bw=1`;
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../style/color';
  .navigation {
    .redBg {
      // width: 100%;
      // height: 60px; // this.logoHeight
      // display: flex;
      // z-index: 2;
      // position: fixed;
      // will-change: transform;
      // padding: 0 20px;
      // box-sizing: border-box

      // >div {
      //   display: flex;
      //   align-items: center;
      //   justify-content: center;
      // }

      

      // .subSiteName {
        

      //   p {
      //     color: $white;
      //     background-color: rgba($color: $black, $alpha: 0.2);
      //     line-height: 35px;
      //     letter-spacing: 1px;
      //     border: 1px solid $white;
      //     border-radius: 5px;
      //     padding: 0 4px;
      //     box-sizing: border-box;
      //   }
      // }

      .new-search {
        width: 50%;

        >div {
          position: relative;
          width: 90%;

          input {
            display: inline-flex;
            position: relative;
            align-items: center;
            box-sizing: border-box;
            width: 100%;
            height: 40px;
            border: 3px solid rgba(255, 0, 0, 0.5);
            border-radius: 10px;
            background-color: $white;
            padding-left: 10px;
            font-size: 1.5rem;

            &.grayb {
              border: 3px solid $gallery;
            }
          }
        }

        a {
          text-decoration: none;
        }

        span {
          color: $web_minor;
          font-size: 1.4rem;
          margin-left: 10px;
        }

        img {
          width: 20px;
          height: 20px;
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-10px);
        }
      }

      .new-search {
        flex: 1 1 50%;

        >div {
          position: relative;
          width: 90%;

          input {
            display: inline-flex;
            position: relative;
            align-items: center;
            box-sizing: border-box;
            width: 100%;
            height: 40px;
            border: 3px solid rgba(255, 0, 0, 0.5);
            border-radius: 10px;
            background-color: $white;
            padding-left: 10px;
            font-size: 1.5rem;

            &.grayb {
              border: 3px solid $gallery;
            }
          }
        }

        a {
          text-decoration: none;
        }

        span {
          color: $web_minor;
          font-size: 1.4rem;
          margin-left: 10px;
        }

        img {
          width: 20px;
          height: 20px;
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-10px);
        }
      }
    }
  }
</style>
