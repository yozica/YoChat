<script lang="ts" setup>
import { NButton, NIcon } from "naive-ui";
import { ChevronUp } from "@vicons/ionicons5";

const mini = defineModel<boolean>("mini");

defineProps<{
  show: boolean;
}>();
</script>

<template>
  <div
    class="chat-video-pe"
    :style="`height: ${show ? (mini ? '20px' : 'calc(56.25vw + 20px)') : '0'}`"
  >
    <div class="video-container" :style="`flex: ${mini ? '0' : '1'}`">
      <slot></slot>
    </div>
    <n-button class="switch-mini" @click="mini = !mini">
      <n-icon
        :style="`transition: transform 0.3s; transform: ${mini ? 'rotate(180deg)' : 'rotate(0)'}`"
      >
        <ChevronUp />
      </n-icon>
    </n-button>
  </div>
</template>

<style lang="scss" scoped>
.chat-video-pe {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100vw;
  transition: height 0.3s;
  overflow: hidden;

  .video-container {
    width: 100%;
    flex: 1;
    background-color: #000;
    transition: flex 0.3s;
  }

  .switch-mini {
    width: 100%;
    height: 20px;
    background-color: #fff;
  }
}
</style>
