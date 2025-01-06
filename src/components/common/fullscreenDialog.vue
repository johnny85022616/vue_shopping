<template>
  <div class="dialog" :style="{ top: dialogHeight }">
    <div v-if="!isFullscreen" class="bg" :style="{ height: bgHeight }"></div>
    <div class="box" :style="{ height: boxHeight }">
      <div class="header">
        <i v-if="!useClose" @click="close" class="angle-left"></i>
        <slot name="header"></slot>
        <i v-if="useClose" @click="close" class="close"></i>
      </div>

      <div class="body" :style="{ height: bodyHeight, backgroundColor: backgroundColor }">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="product">
import { ref, toRefs } from 'vue';

const props = withDefaults(defineProps<{
  isFullscreen?: boolean,
  useClose?: boolean
  backgroundColor?: string
}>(), {
  isFullscreen: true,
  useClose: true
})

const emit = defineEmits(['closeDialog'])
const { isFullscreen } = toRefs(props)

const dialogready = ref(false)
const dialogHeight = ref(window.innerHeight + "px")
const bgHeight = ref("0px")
const boxHeight = ref(window.innerHeight + "px")
const bodyHeight = ref(window.innerHeight - 46 + "px")
const iframeHeight = ref(window.innerHeight - 46 + "px")
const bodyRef = ref<any>(null)

const calcuCntHeight = () => {
  dialogHeight.value = "0px"
  if (isFullscreen.value) {
    bgHeight.value = "0px";
    boxHeight.value = "100%";
  } else {
    bgHeight.value = window.innerHeight * 0.2 + "px";
    const boxH = window.innerHeight - window.innerHeight * 0.2;
    boxHeight.value = boxH + "px";
    bodyHeight.value = boxH - 56 + "px";
  }
  dialogready.value = true

  //check iframe ele and set iframe height
  const ifm: any = bodyRef.value?.querySelector(".body > iframe");
  if (ifm) {
    ifm.style.height = iframeHeight.value;
  }
}

const close = () => {
  emit('closeDialog')
}

const init = () => { }
init()
</script>