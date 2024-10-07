<script lang="ts" setup>
import { ref, nextTick, watch, onUnmounted } from "vue";
import Player, { Events } from "xgplayer";
import "xgplayer/dist/index.min.css";
import InfoChangePlugin from "../utils/xgplayerPlugins/infoChangePlugin";
import "../utils/xgplayerPlugins/infoChangePlugin/index.css";
import socket from "@/socket";
import { useChatroomStore } from "@/store";
import { timeFormat } from "@/utils/timeFormat";

const chatroomStore = useChatroomStore();

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
type PlayerCB =
  | {
      action: "switch_play_pause";
      currentTime: number;
      from: boolean;
      to: boolean;
    }
  | {
      action: "change_rate";
      props: { playbackRate: { from: number; to: number } }[];
    }
  | {
      action: "click";
      pluginName: string;
      seekTime: number;
    }
  | {
      action: "dragend";
      pluginName: string;
      seekTime: number;
    };
const playerListener = (player: Player) => {
  player.on(Events.USER_ACTION, (e: PlayerCB) => {
    switch (e.action) {
      case "switch_play_pause":
        sendMessage(`${e.to ? "暂停" : "播放"}-${e.currentTime}`);
        break;
      case "change_rate":
        sendMessage(`倍速-${e.props[0].playbackRate.to}`);
        break;
      case "click":
        if (e.pluginName === "progress") {
          sendMessage(`进度-${e.seekTime}`);
        }
        break;
      case "dragend":
        if (e.pluginName === "progress") {
          sendMessage(`进度-${e.seekTime}`);
        }
        break;
      default:
        break;
    }
  });
};

watch(
  () => chatroomStore.chatCache,
  (newValue) => {
    const last = newValue[newValue.length - 1];
    if (!player.value) return;
    if (last.type === "videoAction" && last.id !== Number.MAX_VALUE) {
      const info = last.data.split("-");
      switch (info[0]) {
        case "播放":
          player.value.currentTime = info[1];
          player.value.play();
          break;
        case "暂停":
          player.value.currentTime = info[1];
          player.value.pause();
          break;
        case "倍速":
          player.value.playbackRate = Number(info[1]);
          break;
        case "进度":
          player.value.currentTime = info[1];
          player.value.play();
          break;
        default:
          break;
      }
    }
  },
  { deep: true }
);

const sendMessage = (message: string) => {
  if (message.trim() === "") {
    return;
  }
  chatroomStore.sending = true;
  socket.emit("onClientSendMessage", {
    message: message,
    type: "videoAction"
  });
  chatroomStore.chatCache.push({
    id: Number.MAX_VALUE,
    clientId: chatroomStore.userInfo.clientId,
    nickname: chatroomStore.userInfo.nickname,
    type: "videoAction",
    data: message,
    time: timeFormat(new Date().getTime(), "YYYY-MM-DD hh:mm:ss")
  });
  message = "";
};

onUnmounted(() => {
  if (player.value) player.value.destroy();
});
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
