<template>
  <Teleport to="body">
    <!-- <div class="textPopup"></div> -->
    <div v-if="visible" class="textPopup fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <p class="mb-6 text-gray-800">{{ message }}</p>
        <div class="flex justify-center gap-4">
          <button @click="onCancel" class="px-4 py-1 bg-c_white text-c_red border border-solid border-c_red rounded">取消</button>
          <button @click="onConfirm" class="px-4 py-1 bg-c_red text-white border border-solid border-c_red rounded">確認</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
let resolveFn = null

const show = (msg) => {
  message.value = msg
  visible.value = true
  return new Promise((resolve) => {
    resolveFn = resolve
  })
}

const onConfirm = () => {
  resolveFn?.(true)
  visible.value = false
}
const onCancel = () => {
  resolveFn?.(false)
  visible.value = false
}

defineExpose({ show })
</script>
