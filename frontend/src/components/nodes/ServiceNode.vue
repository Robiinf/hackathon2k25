<template>
  <div
    class="custom-node"
    :class="[
      `node-type-${props.data.nodeType}`,
      { 'with-service': props.data.selectedService },
    ]"
    :style="{
      '--color-with-service':
        props.data?.selectedService?.type === 'services'
          ? '#4caf50'
          : '#2196f3',
    }"
    @click="handleNodeClick"
  >
    <Handle
      type="target"
      position="left"
      v-if="props.data.nodeType == 'output' || props.data.nodeType == 'default'"
      :style="{ top: '50%', transform: 'translateY(-50%)' }"
    />
    <div class="node-header">
      <div class="node-order">{{ props.data.service.order }}</div>
      <!-- Ajout des boutons d'action -->
      <div class="node-actions">
        <button
          class="action-button delete-button"
          @click.stop="handleDelete"
          title="Supprimer ce nœud"
        >
          <Trash2 size="14" />
        </button>
      </div>
    </div>
    <div class="node-content">
      <div class="node-title">{{ props.data.service.jobTitle }}</div>

      <!-- Service sélectionné -->
      <div v-if="props.data.selectedService" class="selected-service">
        <div
          class="service-badge"
          :class="{
            'ai-badge': props.data.selectedService.type === 'services',
            'human-badge': props.data.selectedService.type === 'provider',
          }"
        >
          <RobotIcon
            v-if="props.data.selectedService.type === 'services'"
            size="12"
          />
          <UserIcon v-else size="12" />
        </div>
        <span class="service-name">{{ props.data.selectedService.name }}</span>
      </div>
      <div v-else class="no-service-selected">
        <span class="select-prompt">Cliquez pour sélectionner un service</span>
      </div>

      <div
        class="node-tags"
        v-if="props.data.service.tags && props.data.service.tags.length"
      >
        <span
          v-for="(tag, index) in props.data.service.tags.slice(0, 3)"
          :key="index"
          class="node-tag"
        >
          {{ tag }}
        </span>
        <span v-if="props.data.service.tags.length > 3" class="more-tags"
          >+{{ props.data.service.tags.length - 3 }}</span
        >
      </div>
    </div>
    <Handle
      type="source"
      position="right"
      v-if="props.data.nodeType == 'default' || props.data.nodeType == 'input'"
      :style="{ top: '50%', transform: 'translateY(-50%)' }"
    />
  </div>
</template>

<script setup lang="ts">
import { Handle } from "@vue-flow/core";
import { Bot as RobotIcon, Trash2, User as UserIcon } from "lucide-vue-next";
import { defineEmits, defineProps } from "vue";

const props = defineProps<{
  id: string;
  data: {
    service: {
      jobTitle: string;
      order: number;
      tags?: string[];
      services?: any[];
    };
    nodeType: string;
    selectedService?: any;
    serviceParams?: any;
    onNodeClick?: (nodeId: string, services: any[]) => void;
    onNodeDelete?: (nodeId: string) => void;
  };
}>();

const emit = defineEmits<{
  click: [nodeId: string, services: any[]];
  delete: [nodeId: string];
}>();

// Gérer le clic sur le nœud
function handleNodeClick(event: MouseEvent) {
  // Empêcher la propagation de l'événement
  event.stopPropagation();

  // Émettre l'événement click
  emit("click", props.id, props.data.service.services || []);

  // Appeler la fonction onNodeClick si elle existe
  if (props.data.onNodeClick) {
    props.data.onNodeClick(props.id, props.data.service.services || []);
  }
}

// Gérer la suppression du nœud
function handleDelete(event: MouseEvent) {
  // Empêcher la propagation de l'événement
  event.stopPropagation();

  // Émettre l'événement delete
  emit("delete", props.id);

  // Appeler la fonction onNodeDelete si elle existe
  if (props.data.onNodeDelete) {
    props.data.onNodeDelete(props.id);
  }
}

// Ouvrir l'édition des paramètres
function openEditParams(event: MouseEvent) {
  // Empêcher la propagation de l'événement
  event.stopPropagation();

  // Logique pour éditer les paramètres
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap");

.custom-node {
  border: 2px solid #e3e3e3;
  border-radius: 8px;
  background: white;
  min-width: 220px;
  font-family: "Urbanist", sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.custom-node:hover {
  border-color: #c33911;
  box-shadow: 0 6px 16px rgba(195, 57, 17, 0.15);
}

.custom-node.with-service {
  border-color: var(--color-with-service);
}

.node-type-input {
  border-left: 4px solid #4caf50;
}

.node-type-output {
  border-right: 4px solid #2196f3;
}

.node-header {
  background-color: rgba(105, 58, 43, 0.05);
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e3e3e3;
}

.node-edit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.node-order {
  background-color: #c33911;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.node-actions {
  display: flex;
  gap: 4px;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #693a2b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: rgba(195, 57, 17, 0.1);
  color: #c33911;
}

.delete-button:hover {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.node-content {
  padding: 12px;
}

.node-title {
  color: #693a2b;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 8px;
  text-align: left;
}

.selected-service {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background-color: rgba(105, 58, 43, 0.05);
  border-radius: 4px;
  margin-bottom: 8px;
}

.service-badge {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.ai-badge {
  background-color: #4caf50;
}

.human-badge {
  background-color: #2196f3;
}

.service-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #693a2b;
}

.no-service-selected {
  padding: 4px 8px;
  background-color: rgba(195, 57, 17, 0.05);
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: rgba(105, 58, 43, 0.7);
  font-style: italic;
  text-align: center;
}

.select-prompt {
  display: inline-block;
  opacity: 0.8;
}

.custom-node:hover .select-prompt {
  opacity: 1;
  color: #c33911;
}

.node-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  text-align: left;
}

.node-tag {
  background-color: rgba(195, 57, 17, 0.1);
  color: #c33911;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.more-tags {
  font-size: 0.7rem;
  color: rgba(105, 58, 43, 0.6);
  padding: 2px 4px;
}

.edit-icon {
  cursor: pointer;
  color: #693a2b;
  transition: color 0.2s;
}

.edit-icon:hover {
  color: #c33911;
}

/* Animation pour la suppression */
@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
}

.node-delete-animation {
  animation: fadeOut 0.3s forwards;
}
</style>
