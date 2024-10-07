<script lang="ts" setup>
import { ref, nextTick, watch } from "vue";
import Player from "xgplayer";
import "xgplayer/dist/index.min.css";

let player = ref<Player>();

const props = defineProps<{
  curVideo?: string;
}>();

watch(
  () => props.curVideo,
  (newValue) => {
    if (newValue) {
      nextTick(() => {
        player.value = new Player({
          id: "mse",
          url: newValue,
          height: "100%",
          width: "100%",
          lang: "zh",
          cssFullscreen: false,
          volume: 1
        });
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="video" id="mse" v-if="curVideo"></div>
  <div class="video" id="block" v-else>请先选择视频</div>
</template>

<style lang="scss" scoped>
#block {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: #000;
  width: 100%;
  height: 100%;
}
</style>
