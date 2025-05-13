import { ref } from "vue";
import api from '@/apis/api';
import type { consignee } from "@/types/consignee";
import type { OrNull } from "@/types/util";
import usePopup from '@/hooks/usePopup';

export default function useConsignee(){
  const consigneeData = ref<OrNull<consignee[]>>(null); //收貨人資料
  const popup = usePopup() //popup composable

  //取得收貨人資料
async function getConsignee() {
  api.member.getConsignee(true).then((data) => {
    if (data) {
      consigneeData.value = data
    }
  });
}
//變更預設收貨人
async function updateDefaultConsignee(id: string){
  const pass = await api.member.updateDefaultConsignee(id);
  if(pass) getConsignee()
}

//刪除收貨人
async function deleteConsignee(id: string){
  const confirm = await popup.confirm('是否刪除此收貨人')
  if(!confirm) return 
  const pass = await api.member.deleteConsignee(id);
  if(pass) getConsignee()
}

return {
  consigneeData,
  getConsignee,
  updateDefaultConsignee,
  deleteConsignee
}
}