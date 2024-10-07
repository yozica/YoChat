<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";
import { NInputGroup, NInput, NButton, useMessage } from "naive-ui";
import { useChatroomStore } from "@/store";
import { timeFormat } from "@/utils/timeFormat";
import type { InputInst } from "naive-ui";
import socket from "@/socket";
import ChatPanel from "./ChatPanel.vue";

const props = defineProps<{
  chatPanelRef?: InstanceType<typeof ChatPanel> | null;
}>();

const message = useMessage();
const chatroomStore = useChatroomStore();

const inputValue = ref("");
const inputRef = useTemplateRef<InputInst>("inputRef");

const sendMessage = () => {
  if (inputValue.value.trim() === "") {
    inputRef.value?.focus(); // 让输入框保持聚焦
    message.error("不能发送空消息");
    return;
  }
  chatroomStore.sending = true;
  socket.emit("onClientSendMessage", {
    message: inputValue.value
  });
  chatroomStore.chatCache.push({
    id: Number.MAX_VALUE,
    clientId: chatroomStore.userInfo.clientId,
    nickname: chatroomStore.userInfo.nickname,
    type: "text",
    data: inputValue.value,
    time: timeFormat(new Date().getTime(), "YYYY-MM-DD hh:mm:ss")
  });
  inputValue.value = "";
  inputRef.value?.focus(); // 让输入框保持聚焦
  props.chatPanelRef?.scrollToBottom(); // 滚动到聊天底部
};
</script>

<template>
  <div class="chat-footer">
    <n-input-group>
      <n-input
        v-model:value="inputValue"
        clearable
        placeholder=""
        ref="inputRef"
        @keyup.enter="sendMessage"
      />
      <n-button type="primary" @click="sendMessage" :loading="chatroomStore.sending">
        发送
      </n-button>
    </n-input-group>
  </div>
</template>

<style lang="scss" scoped>
.chat-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 50px;
  border-top: 1px solid #ccc;
}
</style>
