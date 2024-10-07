<script lang="ts" setup>
import { ref, watch } from "vue";
import ChatVideoPcBox from "./ChatVideoPcBox.vue";
import ChatVideoPeBox from "./ChatVideoPeBox.vue";
import XGVideo from "./XGVideo.vue";

const props = defineProps<{
  show: boolean;
}>();

const mini = ref(false);
const curVideo = ref("");

// 当关闭观影室时卸载视频区域
watch(
  () => props.show,
  (newValue) => {
    if (!newValue) curVideo.value = "";
  },
  { immediate: true }
);
</script>

<template>
  <ChatVideoPeBox :show="show" v-model:mini="mini" v-model:cur-video="curVideo">
    <ChatVideoPcBox :show="show" v-model:mini="mini" v-model:cur-video="curVideo">
      <XGVideo :cur-video="curVideo" />
    </ChatVideoPcBox>
  </ChatVideoPeBox>
</template>

<style lang="scss" scoped></style>
