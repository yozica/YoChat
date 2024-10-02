<script setup lang="ts">
import { ref } from "vue";
import { useMessage } from "naive-ui";
import type { InputInst } from "naive-ui";
import { NTabs, NTabPane, NButton, NInput, NSpin } from "naive-ui";
import { useChatroomStore } from "@/store";
import socket from "@/socket";

const message = useMessage();
const chatroomStore = useChatroomStore();

const nickname = ref("");
const roomNumber = ref("");
const roomIptRef = ref<InputInst | null>(null);

const creatChat = () => {
  if (nickname.value.trim() === "") {
    message.error("请输入昵称");
    return;
  }
  socket.emit("onCreateRoom", {
    nickname: nickname.value
  });
};

const joinChat = () => {
  if (nickname.value.trim() === "") {
    message.error("请输入昵称");
    return;
  }
  if (!/^[1-9]\d{2}(-\d{3}){2}$/.test(roomNumber.value) && !/^[1-9]\d{8}$/.test(roomNumber.value)) {
    message.error("请输入正确的房间号格式");
    return;
  }
  if (/^[1-9]\d{8}$/.test(roomNumber.value)) {
    const room = roomNumber.value.split("");
    let res = "";
    for (let i = 0; i < room.length; i++) {
      if (i === 2 || i === 5) {
        res += room[i] + "-";
      } else {
        res += room[i];
      }
    }
    roomNumber.value = res;
  }
  socket.emit("onJoinRoom", {
    nickname: nickname.value,
    roomNumber: roomNumber.value
  });
};

const errorToReconnect = () => {
  chatroomStore.state.initState();
  socket.connect();
};
</script>

<template>
  <div class="home_container">
    <Transition>
      <div class="connect_true" v-if="chatroomStore.state.connected">
        <n-tabs
          class="card-tabs"
          default-value="signin"
          size="large"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <n-tab-pane name="signin" tab="创建">
            <n-input
              placeholder="定义一个昵称"
              v-model:value="nickname"
              style="margin-bottom: 10px"
              @keyup.enter="creatChat"
            />
            <n-button type="primary" style="width: 100%" @click="creatChat">创建聊天室</n-button>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="加入">
            <n-input
              placeholder="定义一个昵称"
              v-model:value="nickname"
              style="margin-bottom: 10px"
              @keyup.enter="() => roomIptRef?.focus()"
            />
            <n-input
              ref="roomIptRef"
              placeholder="你想加入哪个房间"
              v-model:value="roomNumber"
              style="margin-bottom: 10px"
              @keyup.enter="joinChat"
            />
            <n-button type="primary" style="width: 100%" @click="joinChat">加入聊天室</n-button>
          </n-tab-pane>
        </n-tabs>
      </div>
      <div class="connect_false" v-else>
        <n-spin
          v-if="!chatroomStore.state.connectTimeout"
          :description="
            chatroomStore.state.connectError
              ? `连接失败，正在尝试第 ${chatroomStore.state.errorToReconnectTimes} 次重连`
              : '正在与服务器建立连接'
          "
        ></n-spin>
        <div v-else>
          <div style="text-align: center; margin-bottom: 10px">连接超时</div>
          <n-button @click="errorToReconnect">重新连接</n-button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.home_container {
  position: relative;
  width: 100vw;
  height: 100vh;

  .connect_true {
    position: absolute;
    top: 30vh;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-width: 340px;
  }

  .connect_false {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
