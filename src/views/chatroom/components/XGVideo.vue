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
  () => {
    nextTick(() => {
      player.value = new Player({
        id: "mse",
        url: props.curVideo,
        height: "100%",
        width: "100%",
        lang: "zh",
        cssFullscreen: false,
        volume: 1,
      });
    });
  }
);
</script>

<template>
  <div class="video_box1">
    <div class="video_box2">
      <div class="video" id="mse" v-if="curVideo"></div>
      <div class="video" id="block" v-else>请先选择视频</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video_box1 {
  width: 65%;
}

.video_box2 {
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
  position: relative;
  box-sizing: border-box;

  .video {
    position: absolute;
    left: 0;
    top: 0;
  }

  #block {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: #000;
    width: 100%;
    height: 100%;
  }
}

@media (max-width: 500px) {
  .video_box1 {
    width: 100%;
  }
}
</style>
