<script lang="ts" setup>
import { onUnmounted, ref, watch } from "vue";
import { NSpace, NButton, NIcon } from "naive-ui";
import { Remove, Videocam, Folder } from "@vicons/ionicons5";
import socket from "@/socket";
import { useChatroomStore } from "@/store";
import { timeFormat } from "@/utils/timeFormat";

const chatroomStore = useChatroomStore();

const mini = defineModel<boolean>("mini");
const curVideo = defineModel<string>("curVideo");

const props = defineProps<{
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

const boxInfo = ref({
  left: 0,
  top: 0,
  width: 0,
  height: 0
});

watch(
  () => props.show,
  (newValue) => {
    if (newValue && !mini.value) {
      boxInfo.value = JSON.parse(
        localStorage.getItem("videoInfo") || '{"left":0,"top":0,"width":500,"height":311.25}'
      );
    } else {
      boxInfo.value = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      };
    }
  },
  { immediate: true }
);

watch(mini, (newValue) => {
  if (!newValue && props.show) {
    boxInfo.value = JSON.parse(
      localStorage.getItem("videoInfo") || '{"left":0,"top":0,"width":500,"height":311.25}'
    );
  } else {
    boxInfo.value = {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    };
  }
});

// 定义拖拽改变视频窗口尺寸
const sizeCache = ref({
  begin: false,
  from: "",
  oldWidth: 0,
  oldHeight: 0,
  startX: 0,
  startY: 0
});
const onSizeMouseDownX = (e: MouseEvent) => {
  if (["center-left", "center-right"].includes((e.target as HTMLElement).className)) {
    // 鼠标按下 - 记录初始值
    sizeCache.value = {
      begin: true,
      from: "x",
      oldWidth: boxInfo.value.width,
      oldHeight: boxInfo.value.height,
      startX: e.clientX,
      startY: e.clientY
    };
  }
};
const onSizeMouseDownY = (e: MouseEvent) => {
  if (["top-center", "bottom-center"].includes((e.target as HTMLElement).className)) {
    // 鼠标按下 - 记录初始值
    sizeCache.value = {
      begin: true,
      from: "y",
      oldWidth: boxInfo.value.width,
      oldHeight: boxInfo.value.height,
      startX: e.clientX,
      startY: e.clientY
    };
  }
};
const onSizeMouseDownXY = (e: MouseEvent) => {
  if (
    ["top-left", "top-right", "bottom-left", "bottom-right"].includes(
      (e.target as HTMLElement).className
    )
  ) {
    // 鼠标按下 - 记录初始值
    sizeCache.value = {
      begin: true,
      from: "xy",
      oldWidth: boxInfo.value.width,
      oldHeight: boxInfo.value.height,
      startX: e.clientX,
      startY: e.clientY
    };
  }
};
const onSizeMouseMove = (e: MouseEvent) => {
  if (sizeCache.value.begin) {
    if (sizeCache.value.from === "x") {
      // 鼠标移动时，计算 x轴 移动距离
      const moveX = e.clientX - sizeCache.value.startX;
      const newWidth = sizeCache.value.oldWidth + moveX;
      const newHeight = (newWidth * 9) / 16 + 30;
      changeBoxInfo(boxInfo.value.left, boxInfo.value.top, newWidth, newHeight);
    } else if (sizeCache.value.from === "y") {
      // 鼠标移动时，计算 y轴 移动距离
      const moveY = e.clientY - sizeCache.value.startY;
      const newHeight = sizeCache.value.oldHeight + moveY;
      const newWidth = ((newHeight - 30) * 16) / 9;
      changeBoxInfo(boxInfo.value.left, boxInfo.value.top, newWidth, newHeight);
    } else if (sizeCache.value.from === "xy") {
      const moveX = e.clientX - sizeCache.value.startX;
      const moveY = e.clientY - sizeCache.value.startY;
      if (moveX < moveY) {
        const newHeight = sizeCache.value.oldHeight + moveY;
        const newWidth = ((newHeight - 30) * 16) / 9;
        changeBoxInfo(boxInfo.value.left, boxInfo.value.top, newWidth, newHeight);
      } else {
        const newWidth = sizeCache.value.oldWidth + moveX;
        const newHeight = (newWidth * 9) / 16 + 30;
        changeBoxInfo(boxInfo.value.left, boxInfo.value.top, newWidth, newHeight);
      }
    }
  }
};
const onSizeMouseUp = () => {
  // 鼠标抬起 - 初始化缓存
  sizeCache.value = {
    begin: false,
    from: "",
    oldWidth: 0,
    oldHeight: 0,
    startX: 0,
    startY: 0
  };
};
const onSizeTouchStartX = (e: TouchEvent) => {
  if (["center-left", "center-right"].includes((e.target as HTMLElement).className)) {
    // 手指按下 - 记录初始值
    sizeCache.value = {
      begin: true,
      from: "x",
      oldWidth: boxInfo.value.width,
      oldHeight: boxInfo.value.height,
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    };
  }
};
const onSizeTouchStartY = (e: TouchEvent) => {
  if (["top-center", "bottom-center"].includes((e.target as HTMLElement).className)) {
    // 手指按下 - 记录初始值
    sizeCache.value = {
      begin: true,
      from: "y",
      oldWidth: boxInfo.value.width,
      oldHeight: boxInfo.value.height,
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    };
  }
};
const onSizeTouchStartXY = (e: TouchEvent) => {
  if (
    ["top-left", "top-right", "bottom-left", "bottom-right"].includes(
      (e.target as HTMLElement).className
    )
  ) {
    // 手指按下 - 记录初始值
    sizeCache.value = {
      begin: true,
      from: "xy",
      oldWidth: boxInfo.value.width,
      oldHeight: boxInfo.value.height,
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    };
  }
};
const onSizeTouchMove = (e: TouchEvent) => {
  if (sizeCache.value.begin) {
    if (sizeCache.value.from === "x") {
      // 鼠标移动时，计算 x轴 移动距离
      const moveX = e.changedTouches[0].clientX - sizeCache.value.startX;
      const newWidth = sizeCache.value.oldWidth + moveX;
      const newHeight = (newWidth * 9) / 16 + 30;
      changeBoxInfo(boxInfo.value.left, boxInfo.value.top, newWidth, newHeight);
    } else if (sizeCache.value.from === "y") {
      // 鼠标移动时，计算 y轴 移动距离
      const moveY = e.changedTouches[0].clientY - sizeCache.value.startY;
      const newHeight = sizeCache.value.oldHeight + moveY;
      const newWidth = ((newHeight - 30) * 16) / 9;
      changeBoxInfo(boxInfo.value.left, boxInfo.value.top, newWidth, newHeight);
    } else if (sizeCache.value.from === "xy") {
      const moveX = e.changedTouches[0].clientX - sizeCache.value.startX;
      const moveY = e.changedTouches[0].clientY - sizeCache.value.startY;
      if (moveX < moveY) {
        const newHeight = sizeCache.value.oldHeight + moveY;
        const newWidth = ((newHeight - 30) * 16) / 9;
        changeBoxInfo(boxInfo.value.left, boxInfo.value.top, newWidth, newHeight);
      } else {
        const newWidth = sizeCache.value.oldWidth + moveX;
        const newHeight = (newWidth * 9) / 16 + 30;
        changeBoxInfo(boxInfo.value.left, boxInfo.value.top, newWidth, newHeight);
      }
    }
  }
};
const onSizeTouchEnd = () => {
  // 手指抬起 - 初始化缓存
  sizeCache.value = {
    begin: false,
    from: "",
    oldWidth: 0,
    oldHeight: 0,
    startX: 0,
    startY: 0
  };
};

// 定义拖拽改变视频窗口位置
const positionCache = ref({
  begin: false,
  oldLeft: 0,
  oldTop: 0,
  startX: 0,
  startY: 0
});
const onPositionMouseDown = (e: MouseEvent) => {
  // 只有在 .chat-video-pc--position 内才会触发
  if ((e.target as HTMLElement).className === "chat-video-pc--position") {
    // 鼠标按下 - 记录初始值
    positionCache.value = {
      begin: true,
      oldLeft: boxInfo.value.left,
      oldTop: boxInfo.value.top,
      startX: e.clientX,
      startY: e.clientY
    };
  }
};
const onPositionMouseMove = (e: MouseEvent) => {
  // 鼠标移动 - 修改位置
  if (positionCache.value.begin && !sizeCache.value.begin) {
    const moveX = e.clientX - positionCache.value.startX;
    const moveY = e.clientY - positionCache.value.startY;
    changeBoxInfo(
      positionCache.value.oldLeft + moveX,
      positionCache.value.oldTop + moveY,
      boxInfo.value.width,
      boxInfo.value.height
    );
  }
};
const onPositionMouseUp = () => {
  // 鼠标抬起 - 初始化缓存
  positionCache.value = {
    begin: false,
    oldLeft: 0,
    oldTop: 0,
    startX: 0,
    startY: 0
  };
};
const onPositionTouchStart = (e: TouchEvent) => {
  if ((e.target as HTMLElement).className === "chat-video-pc--position") {
    // 触摸开始
    positionCache.value = {
      begin: true,
      oldLeft: boxInfo.value.left,
      oldTop: boxInfo.value.top,
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    };
  }
};
const onPositionTouchMove = (e: TouchEvent) => {
  // 手指移动 - 修改位置
  if (positionCache.value.begin && !sizeCache.value.begin) {
    const moveX = e.changedTouches[0].clientX - positionCache.value.startX;
    const moveY = e.changedTouches[0].clientY - positionCache.value.startY;
    changeBoxInfo(
      positionCache.value.oldLeft + moveX,
      positionCache.value.oldTop + moveY,
      boxInfo.value.width,
      boxInfo.value.height
    );
  }
};
const onPositionTouchEnd = () => {
  // 手指抬起 - 初始化缓存
  positionCache.value = {
    begin: false,
    oldLeft: 0,
    oldTop: 0,
    startX: 0,
    startY: 0
  };
};

// 窗口操作统一挂载
// 挂载尺寸监听事件
window.addEventListener("mousedown", onSizeMouseDownX);
window.addEventListener("mousedown", onSizeMouseDownY);
window.addEventListener("mousedown", onSizeMouseDownXY);
window.addEventListener("mousemove", onSizeMouseMove);
window.addEventListener("mouseup", onSizeMouseUp);
window.addEventListener("touchstart", onSizeTouchStartX);
window.addEventListener("touchstart", onSizeTouchStartY);
window.addEventListener("touchstart", onSizeTouchStartXY);
window.addEventListener("touchmove", onSizeTouchMove);
window.addEventListener("touchend", onSizeTouchEnd);
// 挂载位置监听事件
window.addEventListener("mousedown", onPositionMouseDown);
window.addEventListener("mousemove", onPositionMouseMove);
window.addEventListener("mouseup", onPositionMouseUp);
window.addEventListener("touchstart", onPositionTouchStart);
window.addEventListener("touchmove", onPositionTouchMove);
window.addEventListener("touchend", onPositionTouchEnd);

// 统一修改视频模态框尺寸 - 当500ms内尺寸没有变化时存放在
const changeBoxInfo = (left: number, top: number, width: number, height: number) => {
  boxInfo.value = {
    left,
    top,
    width,
    height
  };
  debounce(() => {
    localStorage.setItem("videoInfo", JSON.stringify(boxInfo.value));
  }, 500);
};
// 防抖函数
let timer: number | null = null;
function debounce(fn: () => void, delay: number) {
  timer && clearTimeout(timer);
  timer = setTimeout(function () {
    fn();
  }, delay);
}

// 组件卸载时关闭侦听
onUnmounted(() => {
  // 关闭尺寸监听事件
  window.removeEventListener("mousedown", onSizeMouseDownX);
  window.removeEventListener("mousedown", onSizeMouseDownY);
  window.removeEventListener("mousedown", onSizeMouseDownXY);
  window.removeEventListener("mousemove", onSizeMouseMove);
  window.removeEventListener("mouseup", onSizeMouseUp);
  window.removeEventListener("touchstart", onSizeTouchStartX);
  window.removeEventListener("touchstart", onSizeTouchStartY);
  window.removeEventListener("touchstart", onSizeTouchStartXY);
  window.removeEventListener("touchmove", onSizeTouchMove);
  window.removeEventListener("touchend", onSizeTouchEnd);
  // 关闭位置监听事件
  window.removeEventListener("mousedown", onPositionMouseDown);
  window.removeEventListener("mousemove", onPositionMouseMove);
  window.removeEventListener("mouseup", onPositionMouseUp);
  window.removeEventListener("touchstart", onPositionTouchStart);
  window.removeEventListener("touchmove", onPositionTouchMove);
  window.removeEventListener("touchend", onPositionTouchEnd);
});
</script>

<template>
  <div
    class="chat-video-pc"
    :style="`--video-top:${boxInfo.top}px;--video-left:${boxInfo.left}px;--video-width:${boxInfo.width}px;--video-height:${boxInfo.height}px;transition: all ${positionCache.begin || sizeCache.begin ? '0s' : '0.3s'};`"
  >
    <div class="top-left"></div>
    <div class="top-center"></div>
    <div class="top-right"></div>
    <div class="center-left"></div>
    <div class="chat-video-pc--position">
      <div class="chat-video-pc--tools">
        <n-space>
          <n-button text @click="selectVideo">
            <n-icon size="20">
              <Folder />
            </n-icon>
          </n-button>
          <n-button text @click="mini = true">
            <n-icon size="30">
              <Remove />
            </n-icon>
          </n-button>
        </n-space>
      </div>
      <div class="chat-video-pc--container">
        <div class="video-box">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="center-right"></div>
    <div class="bottom-left"></div>
    <div class="bottom-center"></div>
    <div class="bottom-right"></div>
  </div>
  <div class="video-mini" v-show="show && mini">
    <n-button text @click="mini = false">
      <n-icon size="30">
        <Videocam />
      </n-icon>
    </n-button>
  </div>
</template>

<style lang="scss" scoped>
.chat-video-pc {
  display: grid;
  grid-template-columns: 10px auto 10px;
  grid-template-rows: 10px auto 10px;
  position: fixed;
  left: var(--video-left);
  top: var(--video-top);
  width: var(--video-width);
  height: var(--video-height);
  z-index: 1;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px #ccc;
  transition: all 0.3s;
  overflow: hidden;

  // 左上
  .top-left {
    cursor: nw-resize;
  }
  // 上
  .top-center {
    cursor: n-resize;
  }
  // 右上
  .top-right {
    cursor: ne-resize;
  }
  // 左
  .center-left {
    cursor: w-resize;
  }
  // 右
  .center-right {
    cursor: e-resize;
  }
  // 左下
  .bottom-left {
    cursor: sw-resize;
  }
  // 下
  .bottom-center {
    cursor: s-resize;
  }
  // 右下
  .bottom-right {
    cursor: se-resize;
  }

  &:hover {
    background-color: #36ad6a;
  }

  &:has(.chat-video-pc--position:hover) {
    background-color: #fff;
  }

  .chat-video-pc--position {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 6px;
    padding: 0 20px;
    cursor: move;

    .chat-video-pc--tools {
      margin-left: auto;
      height: 30px;
      cursor: default;
    }

    .chat-video-pc--container {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      cursor: default;

      .video-box {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
      }
    }
  }
}

.video-mini {
  position: fixed;
  top: 10px;
  left: 20px;
}

@media (max-width: 500px) {
  .chat-video-pc {
    grid-template-columns: 0 auto 0;
    grid-template-rows: 0 auto 0;
    position: static;
    width: 100%;
    height: 100%;
    border-radius: 0;

    .chat-video-pc--position {
      padding: 0;
      border-radius: 0;
    }

    .chat-video-pc--tools {
      display: none;
    }
  }
}
</style>
