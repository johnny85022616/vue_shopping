import { ref } from "vue";
import api from '@/apis/api';
import type { consignee } from "@/types/consignee";
import type { OrNull } from "@/types/util";

export default function(){
  const consigneeData = ref<OrNull<consignee[]>>(null); //收貨人資料

  //取得收貨人資料
async function getConsignee() {
  api.member.getConsignee(true).then((data) => {
    if (data) {
      consigneeData.value = data
    }
  });
}
return {
  consigneeData,
  getConsignee
}
}