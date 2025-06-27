<!-- Dialog.vue -->
<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="model"
        class="dialog-overlay"
        @click="$emit('update:modelValue', false)"
      >
        <div class="dialog-content" @click.stop>
          <div class="dialog-header">
            <h3 class="dialog-title">{{ title }}</h3>
            <button
              class="dialog-close"
              @click="$emit('update:modelValue', false)"
            >
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
import { X } from "lucide-vue-next";

const props = defineProps<{
  title: string;
  closeOnOverlay?: boolean;
}>();

const model = defineModel<boolean>();

defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap");

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(105, 58, 43, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  min-width: 350px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 6px 32px rgba(105, 58, 43, 0.15);
  font-family: "Urbanist", sans-serif;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(105, 58, 43, 0.1);
  padding-bottom: 0.75rem;
}

.dialog-title {
  margin: 0;
  font-size: 1.3rem;
  color: #693a2b;
  font-weight: 600;
}

.dialog-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #693a2b;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.dialog-close:hover {
  background-color: rgba(195, 57, 17, 0.1);
  color: #c33911;
}

.dialog-body {
  color: #693a2b;
  font-size: 1rem;
  line-height: 1.6;
}

/* Transition animations */
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.dialog-enter-active .dialog-content,
.dialog-leave-active .dialog-content {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-enter-from .dialog-content,
.dialog-leave-to .dialog-content {
  transform: scale(0.95);
}
</style>
