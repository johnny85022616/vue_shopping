<template>
  <div class="createDialog">
    <transition name="slide">
      <fullscreenDialog>
        <template v-slot:header>新增信用卡</template>
        <template v-slot:body>
          <div class="creditCardForm mt-2 mr-4 mb-20 ml-4">
            <div :class="['mb-5 group', { error: nameAlert.length > 0 }]">
              <p class="text-c_heavy-metal">姓名</p>
              <input type="text" class="formInput group-[.error]:border-c_red" v-model="name" placeholder="請輸入姓名" />
              <span class="text-c_red">{{ nameAlert }}</span>
            </div>
            <div :class="['mb-5 group', { error: creditNumAlert.length > 0 }]">
              <p class="text-c_heavy-metal">信用卡號碼</p>
              <input type="text" class="formInput group-[.error]:border-c_red" v-model="creditNum"
                placeholder="XXXX XXXX XXXX XXXX" />
              <span class="text-c_red">{{ creditNumAlert }}</span>
            </div>
            <div :class="['mb-5 group', { error: expireAlert.length > 0 }]">
              <p class="text-c_heavy-metal">有效期限</p>
              <div class="flex">
                <input class="formInput mr-2 group-[.error]:border-c_red text-center" type="phone" v-model="expire.month"
                  @input="formatExpire('month')" placeholder="MM" ref="monthInput">
                <input class="formInput group-[.error]:border-c_red text-center" type="phone" v-model="expire.year"
                  @input="formatExpire('year')" placeholder="YY" ref="yearInput">
              </div>
              <span class="text-c_red">{{ expireAlert }}</span>
            </div>
            <p class="text-sm text-c_mine_shaft">按下確認即表示同意將本次收貨人資料紀錄於「信用卡管理｣中，節省下次結帳時間。</p>
          </div>
          <div
            class="submitBtn w-full h-[60px] leading-[60px] fixed bottom-0 left-0 right-0 bg-c_white text-center border-t border-solid border-c_alto">
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
import useMemberForm from '@/hooks/form/useMemberForm';
import { inject, ref, toRefs, watch } from 'vue';
import type { creditCardConposable } from '@/hooks/useCreditCard';
import useCreditCardForm from '@/hooks/form/useCreditCardForm';

const { memberForm, formCheck: checkMemeber } = useMemberForm();
const { creditCardForm, checkCreditCard } = useCreditCardForm();
const creditCard = inject('creditCard') as creditCardConposable;
const closeDialog: any = inject('closeDialog')
const { name, nameAlert } = toRefs(memberForm)
const { creditNum, creditNumAlert, expire, expireAlert } = toRefs(creditCardForm)
const yearInput = ref<HTMLElement | null>(null)
const monthInput = ref<HTMLElement | null>(null)

//信用卡有效期限行為
function formatExpire(type: 'month' | 'year') {
  const val = expire.value[type] = expire.value[type].slice(0, 2);
  if (type === 'month' && val.length === 2) yearInput.value?.focus();
  if (type === 'year' && val.length === 0) monthInput.value?.focus();
}

async function confirmClick() {
  const namePass = checkMemeber(['name']);
  const creditPass = checkCreditCard()
  const pass = namePass && creditPass
  if (!pass) return
  const insertInfo = {
    isDefault: "Y",
    name: name.value,
    number: creditNum.value.replace(/[\s]/g, ""),
    expiration: `20${expire.value.year}${expire.value.month}`,
    temp: false,
  };
  const added = await creditCard.addCreditCard(insertInfo)
  if (added) closeDialog()
}

</script>
