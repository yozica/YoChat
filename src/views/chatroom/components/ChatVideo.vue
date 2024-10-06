<script lang="ts" setup>
import { ref, onUnmounted } from "vue";
import ChatVideoPcBox from "./ChatVideoPcBox.vue";
import ChatVideoPeBox from "./ChatVideoPeBox.vue";

defineProps<{
  show: boolean;
}>();

const mini = ref(false);

// 根据当前屏幕宽度切换视频区域样式
const showPE = ref(true);
const resizeObserver = new ResizeObserver((entry) => {
  if (entry[0].contentRect.width <= 500) {
    showPE.value = true;
  } else {
    showPE.value = false;
  }
});
resizeObserver.observe(document.body);
onUnmounted(() => {
  resizeObserver.disconnect();
});
</script>

<template>
  <ChatVideoPeBox v-if="showPE" :show="show" v-model:mini="mini"></ChatVideoPeBox>
  <ChatVideoPcBox v-else :show="show" v-model:mini="mini"></ChatVideoPcBox>
</template>

<style lang="scss" scoped></style>
