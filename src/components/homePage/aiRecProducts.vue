<template>
  <div class="aiRecProducts bg-c_white">
    <div v-if="fourteenShopData && fourteenShopData.length > 0" class="menu bg-c_white z-[1] sticky top-[60px] left-0">
      <ul ref="menuBar" class="w-full px-5 overflow-auto whitespace-nowrap mb-[10px] shadow">
        <li v-for="(item, index) in fourteenShopData" :key="item.main.cateId"
          :class="`p-[10px] text-base inline-block ${index === nowCategoryIndex ? 'text-c_red border-b-2 border-solid border-c_red' : 'text-c_mine_shaft'}`"
          @click="(e) => changeBarActive(e, index)" ref="catProductDom">
          {{ item.main.cateName }}
        </li>
      </ul>
    </div>
    <div class="products" v-if="fourteenShopData && fourteenShopData.length > 0">
      <ul>
        <li v-for="item in fourteenShopData" :key="item.main.cateId" ref="productDom" class="mb-[10px] last-of-type:mb-[70px]">
          <p class="flex items-center justify-between mx-2 px-3 py-4 bg-c_swirl">
            <p class="text-c_mine_shaft font-bold text-base">{{ item.main.cateName }}</p>
            <a v-if="item.main.cateId !== 9999" class="text-c_blue text-sm no-underline" :href="'/category/' + item.main.cateId + '/list'">看更深</a>
          </p>
          <div v-if="item.mainSub && item.mainSub.length > 0" class="main flex justify-between px-2 pb-2 mx-2 bg-c_swirl">
            <div class="w-3/5 bg-c_white flex flex-col items-center font-bold" @click="(e) => tools.goProductPage(e, item.main.pid, item.main)">
              <div class="relative w-full h-0 pb-[100%]">
                <img class="absolute w-full h-full object-cover" :src="item.main.image_url" />
              </div>
              <p class="w-[95%] mt-2 line-clamp-2 text-sm text-c_mine_shaft">{{ item.main.name }}</p>
              <p v-if="item.main.price !== null" class="text-c_red text-xl before:content-['$'] before:mr-[2px] mt-2">
                {{ tools.priceFormat(item.main.price) }}
              </p>
            </div>
            <div class="w-[37%] flex flex-col font-bold justify-between">
              <div class="bg-c_white first-of-type:mb-2" v-for="p in item.mainSub" :key="p.cateId" @click="(e) => tools.goProductPage(e, p.pid, p)">
                <div class="relative w-full h-0 pb-[100%] mx-auto">
                  <img class="inline-block absolute w-full h-full object-cover" :src="p.image_url" />
                </div>
                <p v-if="p.price !== null" class="text-c_red text-xl before:content-['$'] before:mr-[2px] flex justify-center items-center">
                  {{ tools.priceFormat(p.price) }}
                </p>
              </div>
            </div>
          </div>
          <div class="other bg-c_white pt-4">
            <ul class="flex flex-wrap">
              <li class="w-1/3" v-for="s in item.sub" :key="s.cateId" @click="(e) => tools.goProductPage(e, s.pid, s)">
                <div class="relative w-[85%] h-0 mx-auto pb-[85%] border border-solid border-c_ghost rounded-lg">
                  <img class="absolute w-full h-full object-cover rounded-lg" :src="s.image_url" />
                </div>
                <p class="pt-2 w-[85%] line-clamp-2 mx-auto text-sm">{{ s.name }}</p>
                <p v-if="s.price !== null" class="text-c_red before:content-['$'] before:mr-[2px] w-[85%] flex items-center mx-auto text-base">
                  {{ tools.priceFormat(s.price) }}
                </p>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup name="aiRecProducts">
import { nextTick, ref, watch } from 'vue';
import { type mixProduct } from '@/types/mixProducts';
import tools from '@/util/tools';
import api from '@/apis/api';


const fourteenShopData = ref<any>(null)
const scatteredData = ref(null)
const nowCategoryIndex = ref(0)
const productDom = ref<any>([]); //product區塊dom
const menuBar = ref<any>(null) //category Bar dom 
const catProductDom = ref<any>([]); //category Bar中每個category區塊dom
const props = defineProps<{ windowY: number }>()

const getProducts = async () => {
  let postData: any = {
    type: "2",
    q1_x: 0.5,
    supplier_y: 0,
    list_num: 500,
  };

  postData.filter = { k: "0000", v: ["", "", "", ""] };
  const data = await api.ai.getAiData("getwlist", postData) as mixProduct[]

  if (data && data.length > 0) {
    parseData(data)
  }
}

const parseData = async (data: mixProduct[]) => {
  if (!data) return false;
  let tempData: any = {};
  data.forEach((v: any) => {
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

  const groupData: any[] = [];

  Object.values(tempData).forEach((v: any) => {
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

  // groupData.push({
  //   main: {
  //     cateId: 9999,
  //     cateName: "暢銷夯品推薦",
  //   },
  //   mainSub: [],
  //   sub: [],
  // });

  fourteenShopData.value = groupData;
  nowCategoryIndex.value = 0;
  // getHotRecommendation();

  await nextTick()
  fourteenShopData.value = fourteenShopData.value.map((ele: any, index: number) => {
    if(!productDom.value[index]) return 
    const productBlockHeight =
      productDom.value[index].offsetTop;
    return {
      ...ele,
      productBlockHeight,
    };
  })
}

const changeBarActive = (e: any, index: number) => {
  //點擊的category滾動到bar中間
  if (!e) {
    nowCategoryIndex.value = index;
    const mBar = menuBar.value;
    const catEle = catProductDom.value[index];
    const catEleLeft =
      catEle.offsetLeft - (window.innerWidth - catEle.offsetWidth) / 2;
    mBar.scrollTo({
      left: catEleLeft,
    });
  }
  //滾動到對應product
  else {
    const productBlockHeight = productDom.value[index].offsetTop;
    window.scrollTo({
      top: productBlockHeight - 115,
      behavior: "smooth",
    });
  }
}
watch(() => props.windowY, (newVal) => {
  if (!fourteenShopData.value) return
  //scroll時product區塊連動category區塊
  fourteenShopData.value.forEach((item: any, index: number) => {
    if (newVal >= item.productBlockHeight - 115) {
      changeBarActive(null, index);
    }
  })
})
const init = async () => {
  await getProducts()
}

init()

</script>