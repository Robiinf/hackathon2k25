<template>
  <GlobalLayout>
    <router-view />
    <ChatUI />
  </GlobalLayout>
</template>

<script lang="ts" setup>
import ChatUI from "../components/ChatUI.vue";
import GlobalLayout from "../components/layouts/GlobalLayout.vue";
</script>
