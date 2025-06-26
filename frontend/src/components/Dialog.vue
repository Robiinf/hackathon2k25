<!-- Dialog.vue -->
<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="model" class="dialog-overlay" @click="$emit('update:modelValue', false)">
        <div class="dialog-content" @click.stop>
          <div class="dialog-header">
            <h3 class="dialog-title">{{ title }}</h3>
            <button class="dialog-close" @click=" $emit('update:modelValue', false)">
              <X />
            </button>
          </div>
          <div class="dialog-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';


const props = defineProps<{
  title: string;
  closeOnOverlay?: boolean;
}>();

const model = defineModel<boolean>()


defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  min-width: 300px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.dialog-title {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.dialog-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  display: flex;
  align-items: center;
  border-radius: 4px;
}

.dialog-close:hover {
  background-color: #f0f0f0;
}

.dialog-body {
  color: #444;
}

/* Transition animations */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>
