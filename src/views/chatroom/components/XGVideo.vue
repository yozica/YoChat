<script lang="ts" setup>
import { ref, nextTick, watch } from "vue";
import { useMessage } from "naive-ui";
import Player, { Events } from "xgplayer";
import "xgplayer/dist/index.min.css";
import InfoChangePlugin from "../utils/xgplayerPlugins/infoChangePlugin";
import "../utils/xgplayerPlugins/infoChangePlugin/index.css";

const message = useMessage();

let player = ref<Player>();

const props = defineProps<{
  curVideo?: string;
}>();

watch(
  () => props.curVideo,
  (newValue) => {
    if (newValue) {
      if (player.value) player.value.destroy();
      nextTick(() => {
        player.value = new Player({
          id: "mse",
          url: newValue,
          height: "100%",
          width: "100%",
          lang: "zh",
          cssFullscreen: false,
          volume: 1,
          plugins: [InfoChangePlugin]
        });
        playerListener(player.value);
      });
    } else {
      if (player.value) player.value.destroy();
    }
  },
  { immediate: true }
);

// 挂载player工具
const playerListener = (player: Player) => {
  player.on(Events.USER_ACTION, (e) => {
    message.success(e.action, {
      showIcon: false
    });
  });
};
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
