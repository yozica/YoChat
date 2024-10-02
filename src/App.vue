<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-modal-provider>
          <Content />
        </n-modal-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import {
  NConfigProvider,
  zhCN,
  dateZhCN,
  NLoadingBarProvider,
  NMessageProvider,
  NModalProvider
} from "naive-ui";
import Content from "./Content.vue";
</script>
