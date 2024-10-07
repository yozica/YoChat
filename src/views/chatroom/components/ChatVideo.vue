<script lang="ts" setup>
import { ref, onUnmounted } from "vue";
import ChatVideoPcBox from "./ChatVideoPcBox.vue";
import ChatVideoPeBox from "./ChatVideoPeBox.vue";
import XGVideo from "./XGVideo.vue";

defineProps<{
  show: boolean;
}>();

const mini = ref(false);
const curVideo = ref("");

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
  <ChatVideoPeBox :show="show" v-model:mini="mini" v-model:cur-video="curVideo">
    <ChatVideoPcBox :show="show" v-model:mini="mini" v-model:cur-video="curVideo">
      <XGVideo :cur-video="curVideo" />
    </ChatVideoPcBox>
  </ChatVideoPeBox>
</template>

<style lang="scss" scoped></style>
