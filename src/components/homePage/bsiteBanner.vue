<template>
  <div class="bsiteBanner w-full flex items-center justify-around">
    <carousel class="custom-carousel" :autoplay="3000" :loop="true" :autoplayTimeout="3000">
      <slide :class="['wrap-item',{noPadding: item.img}]" v-for="(item, index) of itemList" :style="[{ 'background-image': item.bgurl ? `url(${item.bgurl})` : '' }]" :key="index">
        <div class="banner-item">
          <a class="relative w-[48%] flex justify-center" v-for="(v, i) in item.data" :key="i" :href="v.link">
            <img :src="v.image_url" />
            <div class="absolute flex bottom-0 justify-between w-[90%] h-[35px] items-center bg-c_black_transparent py-[2px] px-2">
              <span>{{ v.name }}</span>
              <span>{{ tools.priceFormat(v.price) }}</span>
            </div>
          </a>
        </div>
      </slide>
    </carousel>
  </div>
</template>

<script setup lang="ts" name="bsiteBanner">
import { reactive, ref, toRefs } from 'vue';
import {useBsiteStore} from '@/stores/bsiteStore';
import api from '@/apis/api';
import tools from '@/util/tools';
import { storeToRefs } from 'pinia';
import type { mixProduct } from '@/types/mixProducts';
import type { aiProduct } from '@/types/aiProducts';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
const bsiteStore = useBsiteStore();
const {siteData} = storeToRefs(bsiteStore)


  const itemList = reactive<any>([])

  const getData = async()=>{
    if(!siteData.value) return 
    const { siteType, isOthersExposeToMe } = toRefs(siteData.value)
    console.log(99 , siteType , isOthersExposeToMe);
    let postData:any = {
      type: "3",
      q1_x: 0.5,
      supplier_y:
        (siteType.value === "B1" || siteType.value === "b1") && isOthersExposeToMe?.value === "N"
          ? 1
          : 0.5, // 若為bSite 且沒有帶 catg=uni 就設定為 1,
      list_num: 100,
    };

    const sid = siteData.value.supplierId || "";
    postData.filter = {
      k: "1000",
      v: [sid, "", "", ""],
    };

    const data = await api.ai.getAiData("getalist", postData);
    if(data){
      parseData(data)
    }
  }

  const parseData = (data:mixProduct[] | aiProduct[]) =>{
      const { urlSuffix } = siteData.value || {};
      const temp:any = {};

      // 取L來歸類 一個L 2個PID
      const d = data as mixProduct[]
      d.forEach((v:mixProduct) => {
        if (!temp[v.auto_category_id_L]) {
          temp[v.auto_category_id_L] = {
            data: [],
          };
        }
        if (temp[v.auto_category_id_L].data.length < 2) {
          const { name, image_url, price, pid, supplier_id } = v;
          temp[v.auto_category_id_L].data.push({
            name,
            image_url,
            price,
            pid,
            supplier_id,
            link: `${urlSuffix ? `/${urlSuffix}` : ""}/product/` + pid,
          });
        }
      });

      const twoLayer = Object.values(temp).filter((v:any) => v.data.length == 2);
      let items = twoLayer;
      if (
        twoLayer &&
        twoLayer.length === 0 &&
        siteData.value && 
        ['B1','b1'].includes(siteData.value.siteType)
      ) {
        let arr:any[] = [];
        data.forEach((v) => {
          if (arr.length === 0 || arr[arr.length - 1].length === 2) {
            arr.push({ data: [] });
          }
          const { name, image_url, price, pid, supplier_id } = v;
          arr[arr.length - 1].data.push({
            name,
            image_url,
            price,
            pid,
            supplier_id,
            link: "/product/" + pid,
          });
        });
        items = arr.filter((v) => v.data.length == 2);
      }
      Object.assign(itemList , items)
    }

  const init = async () => {
    await getData ()
  }

  init()

</script>

<style lang='scss' scoped></style>
