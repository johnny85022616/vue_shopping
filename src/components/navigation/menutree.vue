<template>
  <div class="menutree">
  </div>
</template>

<script lang="ts" setup name="menutree">
import { ref } from 'vue';
import { useBsiteStore } from '@/stores/bsiteStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import tools from '@/util/tools';

  const bsiteStore = useBsiteStore()
  const {siteData} = storeToRefs(bsiteStore)
  const router = useRouter()

  const isBsite = ref(false)
  const bsiteShopItems = ref<any>(null)
  const shopItems = ref<any>(null)
  const bsiteShopItemsTitle = ref('全部分類')
  const shopItemsTitle = ref('全部分類')

  window.scrollTo(0, 0);
    if (siteData.value) {
      isBsite.value = true;

      const { siteType, siteId } = siteData.value || {};
      switch (siteType) {
        // case "B4":
        //   this.getBsiteCategorys(siteId);
        //   break;
        // case "B2":
        //   this.getBsiteCategorys();
        //   break;
        // default:
        //   this.bsiteShopItemsTitle = "本站商品分類";
        //   this.shopItemsTitle = "友商推薦商品分類";
        //   this.getBsiteCategorys(siteId);
      }
    } else {
      // this.getBsiteCategorys();
    }

    const goCategoryPage = (url:string, siteType = 1 /* 1 friDay本站 2 bSite本站 */)=> {
      if (siteData.value && siteType === 1) {
        url += "?catg=uni";
      }
      router.push(url)
    }

    const getBsiteCategorys = async(siteId = "-")=>{
      const findCache1 = tools.getCache(`ai_category_${siteId}_cache1`);
      if (findCache1) {
        parseBsiteCategorys(findCache1, 1);
      }
      const findCache2 = tools.getCache(`ai_category_${siteId}_cache2`);
      if (findCache2) {
        parseBsiteCategorys(findCache2, 2);
      }

      if (findCache1 || findCache2) return false;

      const data = await tools.getAiData("getvlist", {
        target: "pseudoid",
        list_fun: "allCategory",
        list_args: "content",
        list_remote: "b01",
        if_bWeb: "1",
        site_id: siteId,
      });

      const { catg1, catg2, groupings } = data;

      // 有供應商所產生的[本站的樹]
      if (catg1) {
        console.log("有供應商所產生的[本站的樹]", catg1);
        tools.setCache(`ai_category_${siteId}_cache1`, catg1, 300);
        parseBsiteCategorys(catg1, 1);
      }

      // 有供應商所產生的[聯合曝光的樹]
      if (catg2) {
        console.log("有供應商所產生的[聯合曝光的樹]", catg2);
        tools.setCache(`ai_category_${siteId}_cache2`, catg2, 300);
        parseBsiteCategorys(catg2, 2);
      }

      // 沒有供應商 catg1 & catg2 都是null 時,提供給網站使用的default 樹 (或者是site id 傳入"-")
      if (groupings) {
        console.log(
          "沒有供應商 catg1 & catg2 都是null 時,提供給網站使用的default 樹 ",
          groupings
        );
        parseBsiteCategorys(groupings);
        tools.setCache(`ai_category_${siteId}_cache`, groupings, 300);
      }
    }
    const parseBsiteCategorys = (data:any, block = 1 /* 1=bsiteShopItems, 2=shopItems */)=>{
      const grouping = Object.entries(data[0]).map((cat) => {
        const id = cat[0];
        const val:any = cat[1];
        const obj = getBottom(id, data[0]);
        const url = siteData.value
          ? `/${siteData.value.urlSuffix}/category/${id}`
          : `/category/${id}`;

        return {
          cid: val.id,
          name: val.name,
          url: url,
          img_url: obj.img_url,
        };
      });

      if (block === 1) {
        bsiteShopItems.value = grouping.filter((v) => v);
      } else {
        shopItems.value = grouping.filter((v) => v);
      }
    }
    
    //找到該目錄結構最底層(為了取圖片)
    const getBottom = (ca:any, tr:any)=> {
      if (!tr[ca]?.sub || Object.keys(tr[ca]?.sub).length === 0) {
        return tr[ca];
      }
      const newCa = Object.keys(tr[ca]?.sub)[0];
      const newTr = tr[ca].sub;

      return getBottom(newCa, newTr);
    }


</script>