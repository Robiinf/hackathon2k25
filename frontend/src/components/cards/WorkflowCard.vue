<template>
  <div class="workflow-card" @click="$emit('view', workflow)">
    <div class="card-header">
      <h3 class="workflow-title">{{ workflow.name }}</h3>
      <div class="card-date">{{ formatDate(workflow.createdAt) }}</div>
    </div>

    <p class="workflow-description">
      {{ truncateText(workflow.description, 80) }}
    </p>

    <div class="steps-indicator">
      <div class="steps-icon">
        <Layers size="16" />
      </div>
      <div class="steps-label">{{ workflow.nodes.length }} étapes</div>
    </div>

    <div class="prompt-preview">
      <div class="prompt-label">Prompt utilisé:</div>
      <div class="prompt-content">{{ truncateText(workflow.prompt, 100) }}</div>
    </div>

    <div class="card-actions">
      <button class="action-button view" @click.stop="$emit('view', workflow)">
        <Eye size="16" />
        <span>Voir</span>
      </button>
      <button
        class="action-button delete"
        @click.stop="$emit('delete', workflow)"
      >
        <Trash2 size="16" />
        <span>Supprimer</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Eye, Layers, Trash2 } from "lucide-vue-next";
import { type Workflow } from "../../api/workflowApi";

defineProps<{
  workflow: Workflow;
}>();

defineEmits<{
  view: [workflow: Workflow];
  delete: [workflow: Workflow];
}>();

// Formater la date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// Tronquer un texte
function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}
</script>

<style scoped>
.workflow-card {
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(105, 58, 43, 0.08);
  border: 1px solid rgba(105, 58, 43, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 330px;
  position: relative;
  cursor: pointer;
}

.workflow-card:hover {
  box-shadow: 0 12px 30px rgba(105, 58, 43, 0.15);
  transform: translateY(-5px);
  border-color: rgba(195, 57, 17, 0.3);
}

.card-header {
  padding: 1.25rem 1.25rem 0.75rem;
  position: relative;
}

.workflow-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #693a2b;
  font-family: "Urbanist", sans-serif;
  padding-right: 80px; /* Pour éviter que le texte ne chevauche la date */
}

.card-date {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  font-size: 0.75rem;
  color: rgba(105, 58, 43, 0.5);
  background-color: rgba(105, 58, 43, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
}

.workflow-description {
  padding: 0 1.25rem;
  margin: 0 0 1rem;
  color: rgba(105, 58, 43, 0.7);
  font-size: 0.9rem;
  line-height: 1.4;
  flex-grow: 0;
}

.steps-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1.25rem;
  margin-bottom: 1rem;
}

.steps-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c33911;
}

.steps-label {
  font-size: 0.85rem;
  color: #693a2b;
  font-weight: 500;
}

.prompt-preview {
  margin: 0 1.25rem;
  margin-bottom: 1.25rem;
  padding: 0.75rem;
  background-color: rgba(195, 57, 17, 0.04);
  border-radius: 0.5rem;
  border-left: 3px solid rgba(195, 57, 17, 0.2);
  flex-grow: 1;
}

.prompt-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #c33911;
  margin-bottom: 0.25rem;
}

.prompt-content {
  font-size: 0.85rem;
  color: rgba(105, 58, 43, 0.7);
  font-style: italic;
  line-height: 1.4;
}

.card-actions {
  display: flex;
  margin-top: 5rem;
  border-top: 1px solid rgba(105, 58, 43, 0.1);
  margin-top: auto;
}

.action-button {
  flex: 1;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: "Urbanist", sans-serif;
  font-weight: 500;
  transition: all 0.2s;
}

.action-button.view {
  color: #2196f3;
}

.action-button.delete {
  color: #f44336;
  border-left: 1px solid rgba(105, 58, 43, 0.1);
}

.action-button.view:hover {
  background-color: rgba(33, 150, 243, 0.1);
}

.action-button.delete:hover {
  background-color: rgba(244, 67, 54, 0.1);
}
</style>
