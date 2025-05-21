<template>
  <div class="createDialog">
    <transition name="slide">
      <fullscreenDialog>
        <template v-slot:header>新增信用卡</template>
        <template v-slot:body>
          <div class="creditCardForm mt-2 mr-4 mb-20 ml-4">
            <div :class="['mb-5 group', { error: nameAlert.length > 0 }]">
              <p class="text-c_heavy-metal">*姓名</p>
              <input type="text" class="formInput group-[.error]:border-c_red" v-model="name" placeholder="請輸入姓名" />
              <span class="text-c_red">{{ nameAlert }}</span>
            </div>
          </div>
          <div
            class="consigneeForm__submitBtn w-full h-[60px] leading-[60px] fixed bottom-0 left-0 right-0 bg-c_white text-center border-t border-solid border-c_alto">
            <span class="inline-block w-[92%] h-[40px] bg-c_red text-c_white leading-[40px] text-center rounded-[10px]"
              @click="confirmClick">確認</span>
          </div>
        </template>
      </fullscreenDialog>
    </transition>
  </div>
</template>
<script lang="ts" setup name="createDialog">
import fullscreenDialog from '@/components/common/fullscreenDialog.vue';
import type { consigneeConposable } from '@/hooks/useConsignee';
import useMemberForm from '@/hooks/useMemberForm';
import { inject, ref, toRefs, watch } from 'vue';

const { memberForm, changeCity, phoneFormat, formCheck } = useMemberForm();
const consignee = inject('consignee') as consigneeConposable;
const closeDialog:any = inject('closeDialog')
const { name, phone, city, region, road, nameAlert, phoneAlert, addressAlert, cityArr, regionArr } = toRefs(memberForm);
const isDefault = ref(true);

//form檢查 ＆ 新增收貨人
function confirmClick() {
  const isPass = formCheck(['name', 'phone', 'address'])
  if (!isPass) return
  let postData = {
    data: {
      addr: road.value.replace(/\s*/g, ""),
      city: city.value,
      county: region.value,
      isDefault: isDefault.value ? "Y" : "N",
      mobile: phone.value,
      name: name.value,
    },
  };
  consignee.createConsignee(postData);
  closeDialog()
}

</script>
