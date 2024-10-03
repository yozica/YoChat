<script lang="ts" setup>
withDefaults(
  defineProps<{
    roomNumber: string;
  }>(),
  {
    roomNumber: "正在加载房间信息"
  }
);
</script>

<template>
  <div class="chat-header">
    <div class="header-left"></div>
    <div class="title">{{ roomNumber }}</div>
    <div class="header-right"></div>
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
</style>
