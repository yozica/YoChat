<script lang="ts" setup>
import { ref, watch, nextTick, onUnmounted, inject, type Ref } from "vue";
import { NScrollbar } from "naive-ui";
import type { ScrollbarInst } from "naive-ui";
import { useChatroomStore } from "@/store";

const chatroomStore = useChatroomStore();

const showVideoLog = inject<{
  showVideoLog: Ref<boolean>;
  show: () => void;
  close: () => void;
}>("showVideoLog");

const scrollBarRef = ref<ScrollbarInst | null>(null);

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

const onScroll = (e: Event) => {
  const scrollBar = e.target as HTMLElement;
  const content = scrollBar.firstElementChild as HTMLElement;
  if (scrollBar.scrollTop + scrollBar.offsetHeight + 20 < content.offsetHeight) {
    autoScroll.value = false;
  } else {
    autoScroll.value = true;
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    const y = contentDom.value?.offsetHeight || 0 - (scrollDom.value?.offsetHeight || 0);
    scrollBarRef.value?.scrollBy({
      left: 0,
      top: y,
      behavior: "smooth"
    });
  });
};

// 监听聊天面板高度变化 - 让内层滚动区域高度与外层容器一致
const chatPanelHeight = ref(0);
const resizeObserver = new ResizeObserver((entry) => {
  chatPanelHeight.value = entry[0].contentRect.height;
});
nextTick(() => {
  resizeObserver.observe(document.querySelector(".chat-panel") as HTMLElement);
});
onUnmounted(() => {
  resizeObserver.disconnect();
});

defineExpose({
  scrollToBottom
});
</script>

<template>
  <div class="chat-panel">
    <n-scrollbar
      ref="scrollBarRef"
      class="n-scrollbar-style"
      :style="`height:${chatPanelHeight}px`"
      :onScroll="
        (e) => {
          onScroll(e);
        }
      "
    >
      <div class="item" v-for="(item, index) in chatroomStore.chatCache" :key="index">
        <!-- 用户行为 - userAction -->
        <div v-if="item.type === 'userAction'" class="user-action">
          {{ item.nickname + " " + item.data }}
        </div>
        <!-- 普通消息 - text -->
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
        <!-- 观影室消息 - videoAction -->
        <div
          v-if="item.type === 'videoAction' && showVideoLog?.showVideoLog.value"
          class="text videoAction"
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
</template>

<style lang="scss" scoped>
.chat-panel {
  position: relative;
  width: 100%;
  flex: 1;

  ::v-deep(.n-scrollbar-style) {
    transition: height 0.3s;
    padding: 10px 20px;
    position: absolute;
    left: 0;
    bottom: 0;
  }

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
</style>
