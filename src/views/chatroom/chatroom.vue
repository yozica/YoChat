<script lang="ts" setup>
import { useParams } from "./utils/hooks";
import ChatHeader from "./components/ChatHeader.vue";
import ChatPanel from "./components/ChatPanel.vue";
import ChatFooter from "./components/ChatFooter.vue";

const { params } = useParams();
</script>

<template>
  <div class="chatroom_container">
    <ChatHeader :roomNumber="params.roomNumber" />
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
