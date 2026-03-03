<template>
  <div class="date-time-picker grid gap-3">
    <div class="grid gap-1">
      <label class="text-sm">開始時間</label>
      <input
        v-model="localStartInput"
        type="datetime-local"
        class="border border-c_alto rounded px-2 py-1"
        @change="onStartChange"
      />
    </div>
    <div class="grid gap-1">
      <label class="text-sm">結束時間</label>
      <input
        v-model="localEndInput"
        type="datetime-local"
        class="border border-c_alto rounded px-2 py-1"
        @change="onEndChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

export interface DateTimeRangeState {
  startTime: Date | null;
  endTime: Date | null;
}

const props = withDefaults(
  defineProps<{
    startTime?: Date | null;
    endTime?: Date | null;
  }>(),
  {
    startTime: null,
    endTime: null,
  },
);

const emit = defineEmits<{
  (event: 'update:startTime', value: Date | null): void;
  (event: 'update:endTime', value: Date | null): void;
}>();

const localStartInput = ref<string>(toInputValue(props.startTime));
const localEndInput = ref<string>(toInputValue(props.endTime));

watch(
  () => props.startTime,
  (value) => {
    localStartInput.value = toInputValue(value);
  },
);

watch(
  () => props.endTime,
  (value) => {
    localEndInput.value = toInputValue(value);
  },
);

function toInputValue(value: Date | null): string {
  if (!value) return '';
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hour = String(value.getHours()).padStart(2, '0');
  const minute = String(value.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function parseInputValue(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function onStartChange() {
  emit('update:startTime', parseInputValue(localStartInput.value));
}

function onEndChange() {
  emit('update:endTime', parseInputValue(localEndInput.value));
}

function getDateTimeState(): DateTimeRangeState {
  let startTime = parseInputValue(localStartInput.value);
  let endTime = parseInputValue(localEndInput.value);

  if (endTime && !startTime) {
    startTime = new Date(0);
  }

  if (startTime && !endTime) {
    endTime = new Date();
  }

  if (startTime && endTime && endTime.getTime() < startTime.getTime()) {
    endTime = new Date();
  }

  localStartInput.value = toInputValue(startTime);
  localEndInput.value = toInputValue(endTime);

  emit('update:startTime', startTime);
  emit('update:endTime', endTime);

  return {
    startTime,
    endTime,
  };
}

defineExpose({
  getDateTimeState,
});
</script>
