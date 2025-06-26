<!-- CustomNode.vue -->
<template>
  <div class="custom-node">
    <Handle type="target" position="left" v-if="props.data.nodeType == 'output' || props.data.nodeType == 'default'" />
    <div class="label">{{ props.data.service.order }} {{ props.data.service.jobTitle }}
      <button class="edit-button" @click="openEditDialog">
        <Pencil size="16" />
      </button>
    </div>
    <Handle type="source" position="right" v-if="props.data.nodeType == 'default' || props.data.nodeType == 'input'" />

    <Dialog v-model="isOpen" title="Edit Service">
      <form @submit.prevent="saveService" class="edit-form">
        <div class="form-group">
          <label for="jobTitle">Job Title</label>
          <input 
            id="jobTitle" 
            v-model="editedService.jobTitle" 
            type="text" 
            required
          >
        </div>
        <div class="form-group">
          <label for="order">Order</label>
          <input 
            id="order" 
            v-model="editedService.order" 
            type="number" 
            required
          >
        </div>
        <div class="form-actions">
          <button type="button" @click="dialog.close">Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';
import { Handle } from '@vue-flow/core';
import Dialog from './Dialog.vue';
import { useDialog } from '../composables/useDialog';
import { ref } from 'vue';

const props = defineProps<{ 
  data: { 
    service: {
      jobTitle: string;
      order: number;
    }, 
    nodeType: string 
  } 
}>();

const emit = defineEmits<{
  'update:service': [service: { jobTitle: string; order: number }]
}>();

const {isOpen, open, close} = useDialog();

const editedService = ref({ ...props.data.service });

const openEditDialog = () => {
  editedService.value = { ...props.data.service };
  open();
};

const saveService = () => {
  emit('update:service', editedService.value);
  close();
};
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

.label {
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.edit-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  color: #999;
}

.edit-button:hover {
  background-color: #f0f0f0;
  color: #666;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
}

.form-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.form-actions button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.form-actions button[type="submit"] {
  background: #4CAF50;
  color: white;
  border: none;
}

.form-actions button:hover {
  opacity: 0.9;
}
</style>
