<script lang="ts" setup>
import { ref } from "vue";
import { NButton, NIcon } from "naive-ui";
import { IosMore } from "@vicons/ionicons4";
import DrawerPanel from "./DrawerPanel.vue";

withDefaults(
  defineProps<{
    roomNumber: string;
  }>(),
  {
    roomNumber: "正在加载房间信息"
  }
);

const show = ref(false);
</script>

<template>
  <div class="chat-header">
    <div class="header-left"></div>
    <div class="title">{{ roomNumber }}</div>
    <div class="header-right">
      <div class="header-tools">
        <n-button text @click="show = true">
          <n-icon size="30">
            <IosMore />
          </n-icon>
        </n-button>
      </div>
    </div>
    <DrawerPanel v-model:show="show" :roomNumber="roomNumber" />
  </div>
</template>

<style lang="scss" scoped>
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #ccc;
  padding: 0 20px;

  .header-left,
  .header-right {
    width: 0;
    height: 40px;
  }

  .header-left {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-right {
    position: relative;

    .header-tools {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      height: 40px;
    }
  }

  .title {
    font-weight: 700;
  }
}
</style>
