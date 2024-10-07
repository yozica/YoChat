<script lang="ts" setup>
import { provide, ref } from "vue";
import { useParams } from "./utils/hooks";
import ChatHeader from "./components/ChatHeader.vue";
import ChatPanel from "./components/ChatPanel.vue";
import ChatFooter from "./components/ChatFooter.vue";
import ChatVideo from "./components/ChatVideo.vue";

const { params } = useParams();

const showVideo = ref(false);
provide("showVideo", {
  showVideo,
  switch() {
    showVideo.value = !showVideo.value;
  }
});

const showVideoLog = ref<boolean>((localStorage.getItem("showVideoLog") || "false") === "true");
provide("showVideoLog", {
  showVideoLog,
  show: () => {
    showVideoLog.value = true;
    localStorage.setItem("showVideoLog", "true");
  },
  close: () => {
    showVideoLog.value = false;
    localStorage.removeItem("showVideoLog");
  }
});
</script>

<template>
  <div class="chatroom_container">
    <ChatHeader :roomNumber="params.roomNumber" />
    <ChatVideo :show="showVideo" />
    <ChatPanel ref="chatPanelRef" />
    <ChatFooter />
  </div>
</template>

<style lang="scss" scoped>
.chatroom_container {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}
</style>
