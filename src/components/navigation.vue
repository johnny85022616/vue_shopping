<template>
  <div class="navigation">
    <div v-if="siteData" class="redBg isBsite"
      :style="{ backgroundColor: `${siteData.headerColor ? siteData.headerColor : '#ddd5cc'}` }">
      <div class="mini-logo" @click="(evt)=>openBsiteSite(evt)">
        <img :src="siteData.logoMobile" />
      </div>
      <!-- <div class="subSiteName" v-if="siteData && siteData.b2Info && siteData.b2Info.subSiteName">
        <p>{{ siteData.b2Info.subSiteName }}</p>
      </div>
      <div class="new-search" @click="showSearchInput">
        <div :class="[{ grayb: isBsite }]">
          <input v-model="inputTerms" @keydown="goSearchByEnter" ref="input" />
          <img src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg" @click="goSearch" />
        </div>
      </div> -->
    </div>
    <div :class="['redBg']" :style="{ backgroundColor: '#f5281e' }">
      <div div class="mini-logo" @click="openFridaySite">
        <img src="../assets/icons/friday_logo.svg" />
      </div>
      <div class="new-search">
        <div>
          <input @keydown="goSearchByEnter" ref="searchInput" />
          <img src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg" @click="goSearch" />
        </div>
      </div>
      <!-- <div class="downLoadBtn">
        <appDownload />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts" name="Homepage">
  import { ref, type Ref } from 'vue';
  import { useBsiteStore } from '../stores/bsiteStore';
  import { storeToRefs } from 'pinia';
import type { siteData } from '@/types/apiWeb';
import { computed } from '@vue/reactivity';


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
    if(siteData.value){
      window.location.href = "/" + siteData.value.urlSuffix;
    }
  }
  async function goSearch() {
    let keyword
    if (searchInput.value) {
      keyword = searchInput.value.value
    }

    console.log('######', keyword);
    // const { urlSuffix } = this.siteData || {};
    // // 自然搜尋判斷全站
    // if (/^([0-9]{5,10})$/i.test(keyword)) {
    //   const pidInfo = await this.tools.getPidsInfo([keyword]);
    //   if (pidInfo && pidInfo[keyword]) {
    //     if (this.isBsite) {
    //       window.location.href = `${
    //         urlSuffix ? `/${urlSuffix}` : ""
    //       }/product/${keyword}`;
    //       return false;
    //     }
    //     window.location.href = `${
    //       urlSuffix ? `/${urlSuffix}` : ""
    //     }/product?pid=${keyword}`;
    //     return false;
    //   }
    // }
    // if (keyword !== "") {
    //   window.location.href = `${
    //     urlSuffix ? `/${urlSuffix}` : ""
    //   }/aisearch?keyword=${encodeURIComponent(keyword)}&bw=1`;
    // }
  }
</script>

<style lang='scss' scoped>
  @import '../style/color';

  .navigation {
    position: relative;
    height: 60px;
    margin: 0;

    .redBg {
      width: 100%;
      height: 60px; // this.logoHeight
      display: flex;
      z-index: 2;
      position: fixed;
      will-change: transform;
      padding: 0 20px;
      box-sizing: border-box;

      &.haBack {
        padding: 0 20px 0 10px;

        .mini-logo {
          flex: 1 1 20%;
        }
      }

      .back {
        i {
          display: inline-block;
          width: 25px;
          height: 25px;
          background-image: url(../../images/icons/index_arrow.png);
          background-repeat: no-repeat;
          background-position-x: 50%;
          background-position-y: 8%;
          background-size: 85%;
        }
      }

      &.isBsite {
        .mini-logo img {
          width: auto;
          // max-height: 42px;
          max-height: 35px;
          margin-right: 15px;
        }

        .new-search input {
          border: 3px solid $gallery !important;
        }
      }

      >div {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mini-logo {
        flex: 1 1 30%;

        img {
          width: 100px;
          margin: 0 auto !important;
        }

        &.fetnet {
          img {
            width: 55px;
          }
        }
      }

      .subSiteName {
        flex: 1 1 20%;
        font-size: 16px;

        p {
          color: $white;
          background-color: rgba($color: $black, $alpha: 0.2);
          line-height: 35px;
          letter-spacing: 1px;
          border: 1px solid $white;
          border-radius: 5px;
          padding: 0 4px;
          box-sizing: border-box;
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
