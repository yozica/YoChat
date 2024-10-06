<script lang="ts" setup>
import { ref, type Ref, onUnmounted, inject } from "vue";
import { NButton, NDrawer, NDrawerContent, NList, NListItem, NThing, NSpace, NTag } from "naive-ui";
import { useMessage } from "naive-ui";
import { useChatroomStore } from "@/store";

const message = useMessage();
const chatroomStore = useChatroomStore();

const showVideo = inject<{
  showVideo: Ref<boolean>;
  switch: () => void;
}>("showVideo");

const show = defineModel<boolean>("show");

withDefaults(
  defineProps<{
    roomNumber: string;
  }>(),
  {
    roomNumber: "正在加载房间信息"
  }
);

const openVideo = () => {
  showVideo?.switch();
  show.value = false;
};
const clearVideoCache = () => {
  if (showVideo) {
    showVideo.showVideo.value = false;
  }
  localStorage.removeItem("videoInfo");
  message.success("好了，再打开观影室试试");
};

// 根据当前屏幕宽度切换抽屉宽度
const drawerWidth = ref<500 | "100vw">(500);
const resizeObserver = new ResizeObserver((entry) => {
  if (entry[0].contentRect.width <= 500) {
    drawerWidth.value = "100vw";
  } else {
    drawerWidth.value = 500;
  }
});
resizeObserver.observe(document.body);
onUnmounted(() => {
  resizeObserver.disconnect();
});
</script>

<template>
  <n-drawer
    v-model:show="show"
    :width="drawerWidth"
    :style="drawerWidth === 500 ? '' : '--n-border-radius: 0'"
  >
    <n-drawer-content :title="roomNumber" closable>
      <n-list>
        <n-list-item>
          <n-thing title="房间成员">
            <n-space>
              <n-tag v-for="(item, index) in chatroomStore.roomMembers" :key="index">
                {{ item }}
              </n-tag>
            </n-space>
          </n-thing>
        </n-list-item>
        <n-list-item>
          <n-thing title="好玩的东西">
            <n-space>
              <n-button @click="openVideo">
                {{ showVideo?.showVideo.value ? "关闭" : "打开" }}观影室
              </n-button>
              <n-button @click="clearVideoCache" v-if="drawerWidth === 500">
                什么？你说你找不到视频框了
              </n-button>
            </n-space>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped></style>
