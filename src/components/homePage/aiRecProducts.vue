<template>
  <div class="aiRecProducts">
    <!-- <div v-if="fourteenShopData && fourteenShopData.length > 0" class="fourteenShop__menu">
      <ul ref="menuBar">
        <li v-for="item in fourteenShopData" :key="item.main.cateId" :class="[{ active: item.main.cateId === nowCategory }]" @click="(e) => changeBarActive(e, item.main.cateId)" :ref="item.main.cateId">
          {{ item.main.cateName }}
        </li>
      </ul>
    </div>
    <div class="fourteenShop__products" v-if="fourteenShopData && fourteenShopData.length > 0">
      <ul class="fourteenShop__products__block-list">
        <li v-for="item in fourteenShopData" :key="item.main.cateId" :ref="`block${item.main.cateId}`">
          <p :class="['catName', { isMain: !item.mainSub }]">
            <font>{{ item.main.cateName }}</font>
            <a v-if="item.main.cateId !== 9999" :href="'/category/' + item.main.cateId + '/list'">看更深</a>
          </p>
          <div v-if="item.mainSub && item.mainSub.length > 0" class="fourteenShop__products-main">
            <div class="left" @click="tools.goProductPage(e, item.main.pid, item.main)">
              <div class="image">
                <img v-lazy="item.main.image_url" />
              </div>
              <p class="name">{{ item.main.name }}</p>
              <p v-if="item.main.price!==null" class="price mainLeftPrice">
                {{ tools.priceFormat(item.main.price) }}
              </p>
            </div>
            <div class="right">
              <div v-for="p in item.mainSub" :key="p.cateId" @click="tools.goProductPage(e, p.pid, p)">
                <div class="image">
                  <img v-lazy="p.image_url" />
                </div>
                <p v-if="p.price!==null" class="price mainRightPrice">
                  {{ tools.priceFormat(p.price) }}
                </p>
              </div>
            </div>
          </div>
          <div class="fourteenShop__products-other">
            <ul>
              <li v-for="s in item.sub" :key="s.cateId" @click="tools.goProductPage(e, s.pid, s)">
                <div class="image">
                  <img v-lazy="s.image_url" />
                </div>
                <p class="name">{{ s.name }}</p>
                <p v-if="s.price!==null" class="price otherProductPrice">
                  {{ tools.priceFormat(s.price) }}
                </p>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script lang="ts" setup name="aiRecProducts" >
import { ref } from 'vue';
import {type mixProduct} from '@/types/mixProducts';
import tools from '@/util/tools';
import api from '@/apis/api';
import config from '@/config/config';


const fourteenShopData = ref<any>(null)
const scatteredData = ref(null)
const nowCategory = ref(0)

const getProducts = async()=>{
  let postData:any = {
      type: "2",
      q1_x: 0.5,
      supplier_y: 0,
      list_num: 500,
    };

    postData.filter = { k: "0000", v: ["", "", "", ""] };
    const data = await api.ai.getAiData("getwlist", postData) as mixProduct[]
  
    if(data && data.length>0){
      parseData(data)
    }
}

const parseData = (data:mixProduct[])=>{
      if (!data) return false;
      let tempData:any = {};
      data.forEach((v:any) => {
        if (!tempData[v.auto_category_id_L]) {
          tempData[v.auto_category_id_L] = {
            main: {
              cateId: v.auto_category_id_L,
              cateName: v.auto_category_id_L_c,
              name: v.name,
              pid: v.pid,
              image_url: v.image_url,
              price: v.price ? tools.priceFormat(v.price) : null,
            },
            mainSub: [],
            sub: [],
          };
        } else if (tempData[v.auto_category_id_L].mainSub.length < 2) {
          tempData[v.auto_category_id_L].mainSub.push({
            name: v.name,
            pid: v.pid,
            image_url: v.image_url,
            price: v.price ? tools.priceFormat(v.price) : null,
          });
        } else {
          tempData[v.auto_category_id_L].sub.push({
            name: v.name,
            pid: v.pid,
            image_url: v.image_url,
            price: v.price ? tools.priceFormat(v.price) : null,
          });
        }
      });

      const groupData = [];

      Object.values(tempData).forEach((v:any) => {
        if (v.sub.length > 6) {
          let calcSubRows = Math.floor(v.sub.length / 3) * 3;
          calcSubRows = calcSubRows > 9 ? 9 : calcSubRows;
          groupData.push(
            Object.assign({}, v, {
              sub: v.sub.slice(0, calcSubRows),
            })
          );
        }
      });

      groupData.push({
        main: {
          cateId: 9999,
          cateName: "暢銷夯品推薦",
        },
        mainSub: [],
        sub: [],
      });

      fourteenShopData.value = groupData;

      nowCategory.value = groupData[0].main.cateId;
      getHotRecommendation();

      // this.$nextTick(() => {
      //   this.fourteenShopData = this.fourteenShopData.map((ele) => {
      //     const productBlockHeight =
      //       this.$refs[`block${ele.main.cateId}`][0].offsetTop;
      //     return {
      //       ...ele,
      //       productBlockHeight,
      //     };
      //   });
      // });
}
const getHotRecommendation= async()=>{
      const { getCache, setCache } = tools;
      const { aiApiPath } = config;

      const findCache = getCache("homepage_rec_cache");
      if (findCache) {
        fourteenShopData.value[fourteenShopData.value.length - 1].sub = findCache;
      } else {
        // this.axios({
        //   url: `${aiApiPath}api/getqlist`,
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   data: JSON.stringify({
        //     target: "pseudoid",
        //     list_args: "content",
        //     target_value: this.tools.aiUserId(),
        //     list_fun: "Q3s27",
        //     list_remote: "w",
        //   }),
        // }).then((res) => {
        //   const data = res.data;
        //   if (data && data[0] && data[0].pids) {
        //     const { pids } = data[0];
        //     const pidsData = pids.slice(0, 99);
        //     this.fourteenShopData[this.fourteenShopData.length - 1].sub =
        //       pidsData;
        //     setCache("homepage_rec_cache", pidsData, 600);
        //   }
        // });
      }
    }

const init = async()=>{
  getProducts()
}

init()
</script>