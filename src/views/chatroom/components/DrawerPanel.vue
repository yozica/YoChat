<script lang="ts" setup>
import { ref, onUnmounted } from "vue";
import { NDrawer, NDrawerContent, NList, NListItem, NThing, NSpace, NTag } from "naive-ui";
import { useChatroomStore } from "@/store";

const chatroomStore = useChatroomStore();

const show = defineModel<boolean>("show");

withDefaults(
  defineProps<{
    roomNumber: string;
  }>(),
  {
    roomNumber: "正在加载房间信息"
  }
);

const drawerWidth = ref<500 | "100vw">(500);

const resizeObserver = new ResizeObserver((entry) => {
  console.log(entry[0].contentRect.width);
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
      </n-list>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped></style>
