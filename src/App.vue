<script setup lang="ts">
import {
  lightTheme,
  darkTheme,
  GlobalThemeOverrides,
  NConfigProvider,
  NButton,
} from "naive-ui";
import {
  VdGlobalThemeOverrides,
  VdConfigProvider,
} from "@/components/config-provider";
import { VdCard } from "./components/card";
import { shallowRef } from "vue";

const themeOverrides: GlobalThemeOverrides = {
  Card: {
    color: "blue",
  },
};

const vdThemeOverrides: VdGlobalThemeOverrides = {
  Card: {
    color: "red",
    titleTextColor: "white",
    textColor: "white",
  },
};

const theme = shallowRef(lightTheme);
function switchTheme() {
  if (theme.value === lightTheme) {
    theme.value = darkTheme;
  } else {
    theme.value = lightTheme;
  }
}
</script>

<template>
  <div class="main">
    <n-button @click="switchTheme">切换主题</n-button>
    <n-config-provider class="content" :theme="theme">
      <vd-card title="卡片">
        <vd-config-provider :theme-overrides="vdThemeOverrides">
          <vd-card title="卡片"> 卡片内容 </vd-card>
        </vd-config-provider>
      </vd-card>
    </n-config-provider>
  </div>
</template>

<style scoped>
.vd-card {
  max-width: 300px;
}

.main {
  margin: 20px;
}

.content {
  margin-top: 20px;
}
</style>
