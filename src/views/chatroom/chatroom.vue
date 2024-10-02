<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
import { NInputGroup, NInput, NButton, NScrollbar, useMessage } from "naive-ui";
import lzString from "lz-string";
import { useRouter } from "vue-router";
import { useChatroomStore } from "@/store";
import socket from "@/socket";
import { timeFormat } from "@/utils/timeFormat";
import type { InputInst, ScrollbarInst } from "naive-ui";

const router = useRouter();
const message = useMessage();
const chatroomStore = useChatroomStore();

const userinfo = sessionStorage.getItem("userinfo") || "";
const params = (JSON.parse(lzString.decompressFromBase64(userinfo)) as {
  nickname: string;
  roomNumber: string;
}) || {
  nickname: "",
  roomNumber: ""
};

if (params.roomNumber === "") {
  router.replace("/");
}

watch(
  () => chatroomStore.state.connected,
  (newValue) => {
    if (newValue) {
      socket.emit("onJoinRoom", {
        nickname: params.nickname,
        roomNumber: params.roomNumber
      });
    }
  }
);

const inputRef = ref<InputInst | null>(null);
const scrollBarRef = ref<ScrollbarInst | null>(null);
const inputValue = ref("");

const scrollDom = ref<HTMLElement | null>(null);
const contentDom = ref<HTMLElement | null>(null);
const autoScroll = ref(true);
nextTick(() => {
  if (scrollBarRef.value) {
    scrollDom.value = (scrollBarRef.value as any).$el.nextElementSibling.firstElementChild;
    contentDom.value = scrollDom.value?.firstElementChild as HTMLElement;
  }
});

watch(
  () => chatroomStore.chatCache,
  () => {
    if (autoScroll.value) {
      nextTick(() => {
        const y = contentDom.value?.offsetHeight || 0 - (scrollDom.value?.offsetHeight || 0);
        scrollBarRef.value?.scrollBy({
          left: 0,
          top: y,
          behavior: "smooth"
        });
      });
    }
  },
  { immediate: true, deep: true }
);

const sendMessage = () => {
  if (inputValue.value.trim() === "") {
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
  inputRef.value?.focus();
  nextTick(() => {
    const y = contentDom.value?.offsetHeight || 0 - (scrollDom.value?.offsetHeight || 0);
    scrollBarRef.value?.scrollBy({
      left: 0,
      top: y,
      behavior: "smooth"
    });
  });
};

const onScroll = (e: Event) => {
  const scrollBar = e.target as HTMLElement;
  console.dir(scrollBar.scrollTop + scrollBar.offsetHeight);
  console.dir(contentDom.value?.offsetHeight);
  const content = scrollBar.firstElementChild as HTMLElement;
  if (scrollBar.scrollTop + scrollBar.offsetHeight + 20 < content.offsetHeight) {
    autoScroll.value = false;
  } else {
    autoScroll.value = true;
  }
};
</script>

<template>
  <div class="chatroom_container">
    <div class="header">
      <div class="header-left"></div>
      <div class="title">{{ params.roomNumber }}</div>
      <div class="header-right"></div>
    </div>
    <div class="main">
      <n-scrollbar
        ref="scrollBarRef"
        style="height: calc(100vh - 100px); padding: 10px 20px"
        :onScroll="
          (e) => {
            onScroll(e);
          }
        "
      >
        <div class="item" v-for="(item, index) in chatroomStore.chatCache" :key="index">
          <div v-if="item.type === 'userAction'" class="user-action">
            {{ item.nickname + " " + item.data }}
          </div>
          <div
            v-if="item.type === 'text'"
            class="text"
            :class="
              item.clientId === chatroomStore.userInfo.clientId ||
              item.nickname === chatroomStore.userInfo.nickname
                ? 'myself'
                : ''
            "
          >
            <div class="name">{{ item.nickname }}</div>
            <div class="message">
              {{ item.data }}
            </div>
            <div class="time">{{ item.time }}</div>
          </div>
        </div>
      </n-scrollbar>
    </div>
    <div class="footer">
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

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #ccc;
    padding: 0 20px;

    .header-left,
    .header-right {
      width: 30px;
      height: 30px;
    }

    .header-left {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title {
      font-weight: 700;
    }
  }

  .main {
    width: 100%;
    flex: 1;

    .item + .item {
      margin-top: 10px;
    }

    .user-action {
      width: 100%;
      text-align: center;
      color: #777;
      font-size: 14px;
    }

    .text {
      width: 80%;

      &.myself {
        margin-left: auto;

        .name {
          text-align: right;
        }

        .message {
          margin-left: auto;
        }

        .time {
          text-align: right;
        }
      }

      .name {
        font-size: 12px;
      }

      .message {
        width: fit-content;
        border-radius: 5px;
        padding: 5px 10px;
        background-color: #fff;
      }

      .time {
        color: #777;
        font-size: 12px;
      }
    }
  }

  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    width: 100%;
    height: 50px;
    border-top: 1px solid #ccc;
  }
}
</style>
