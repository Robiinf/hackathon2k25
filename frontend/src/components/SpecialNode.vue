<!-- CustomNode.vue -->
<template>
  <div class="custom-node">
    <Handle type="target" position="left" />
    <div class="label">{{ props.data.label }}</div>
    <Handle type="source" position="right" />
  </div>
</template>

<script setup lang="ts">
import { Handle } from '@vue-flow/core'
const props = defineProps<{ data: { label: string } }>()
</script>

<style scoped>
.custom-node {
  padding: 10px;
  border: 1px solid #999;
  border-radius: 6px;
  background: white;
  min-width: 160px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

}
.label{
  color: #999;
}
</style>
