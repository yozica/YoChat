<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { useMessage, useLoadingBar } from "naive-ui";
import type { NaiveWindow } from "./types/common";

// 为window对象绑定naive的message
(window as NaiveWindow).$message = useMessage();
// 为window对象绑定naive的loadingBar
(window as NaiveWindow).$loadingBar = useLoadingBar();
</script>
