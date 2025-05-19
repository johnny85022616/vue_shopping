import { ref, type Ref } from 'vue';
import api from '@/apis/api';
import type { Addr, consignee, createConsigneePayload } from '@/types/consignee';
import type { OrNull } from '@/types/util';
import usePopup from '@/hooks/usePopup';

export interface consigneeConposable {
  consigneeData: Ref<OrNull<consignee[]>>;
  getConsignee: () => Promise<void>;
  updateDefaultConsignee: (id: string) => Promise<void>;
  deleteConsignee: (id: string) => Promise<void>;
  createConsignee: (payload: createConsigneePayload) => Promise<void>;
};


export default function useConsignee():consigneeConposable {
   const consigneeData = ref<OrNull<consignee[]>>(null); // 明確指定型別
  const popup = usePopup(); //popup composable

  //取得收貨人資料
  async function getConsignee() {
    api.member.getConsignee(true).then((data) => {
      if (data) {
        consigneeData.value = data;
      }
    });
  }
  //變更預設收貨人
  async function updateDefaultConsignee(id: string) {
    const pass = await api.member.updateDefaultConsignee(id);
    if (pass) getConsignee();
  }

  //刪除收貨人
  async function deleteConsignee(id: string) {
    const confirm = await popup.confirm('是否刪除此收貨人');
    if (!confirm) return;
    const pass = await api.member.deleteConsignee(id);
    if (pass) getConsignee();
  }

  //新增收貨人
  async function createConsignee(payload: createConsigneePayload) {
    const pass = await api.member.createConsignee(payload);
    if (pass) getConsignee();
  }

  return {
    consigneeData,
    getConsignee,
    updateDefaultConsignee,
    deleteConsignee,
    createConsignee,
  };
}
