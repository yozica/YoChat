<script lang="ts" setup>
import { NButton, NIcon, NButtonGroup } from "naive-ui";
import { ChevronUp, Folder } from "@vicons/ionicons5";
import socket from "@/socket";
import { useChatroomStore } from "@/store";
import { timeFormat } from "@/utils/timeFormat";

const chatroomStore = useChatroomStore();

const mini = defineModel<boolean>("mini");
const curVideo = defineModel<string>("curVideo");

defineProps<{
  show: boolean;
}>();

const selectVideo = () => {
  const fileIpt = document.createElement("input");
  fileIpt.type = "file";
  fileIpt.accept = "video/*";
  fileIpt.onchange = () => {
    if (fileIpt.files) {
      curVideo.value && URL.revokeObjectURL(curVideo.value);
      const file = fileIpt.files[0];
      chatroomStore.sending = true;
      socket.emit("onClientSendMessage", {
        message: `在观影室中选择了视频 ${file.name}`,
        type: "userAction"
      });
      chatroomStore.chatCache.push({
        id: Number.MAX_VALUE,
        clientId: chatroomStore.userInfo.clientId,
        nickname: chatroomStore.userInfo.nickname,
        type: "userAction",
        data: `在观影室中选择了视频 ${file.name}`,
        time: timeFormat(new Date().getTime(), "YYYY-MM-DD hh:mm:ss")
      });
      curVideo.value = URL.createObjectURL(file);
    }
  };
  fileIpt.click();
};
</script>

<template>
  <div
    class="chat-video-pe"
    :style="`--video-height: ${show ? (mini ? '20px' : 'calc(56.25vw + 20px)') : '0'}`"
  >
    <div class="video-container" :style="`flex: ${mini ? '0' : '1'}`">
      <slot></slot>
    </div>
    <n-button-group>
      <n-button class="buttons" @click="selectVideo">
        <n-icon>
          <Folder />
        </n-icon>
      </n-button>
      <n-button class="buttons" @click="mini = !mini">
        <n-icon
          :style="`transition: transform 0.3s; transform: ${mini ? 'rotate(180deg)' : 'rotate(0)'}`"
        >
          <ChevronUp />
        </n-icon>
      </n-button>
    </n-button-group>
  </div>
</template>

<style lang="scss" scoped>
.chat-video-pe {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100vw;
  height: 0;
  transition: height 0.3s;
  overflow: hidden;

  .video-container {
    width: 100%;
    flex: 1;
    background-color: #000;
    transition: flex 0.3s;
    overflow: hidden;
  }

  .buttons {
    width: 50vw;
    height: 20px;
    background-color: #fff;
  }
}

@media (max-width: 500px) {
  .chat-video-pe {
    height: var(--video-height);
  }
}
</style>
