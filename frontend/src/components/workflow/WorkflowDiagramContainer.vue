<script setup lang="ts">
import WorkflowDiagram from "./WorkflowDiagram.vue";

defineProps<{
  prompt: string;
}>();

const workflow = defineModel<any[]>("workflow");
</script>

<template>
  <div class="workflow-diagram-container">
    <h2 class="workflow-title">Diagramme généré</h2>

    <div class="workflow-prompt-box">
      <p class="prompt-label">Prompt utilisé :</p>
      <p class="prompt-value">"{{ prompt }}"</p>
    </div>

    <div class="diagram-wrapper">
      <WorkflowDiagram v-model:workflow="workflow" />
    </div>
  </div>
</template>

<style scoped>
.workflow-diagram-container {
  padding: 2rem;
  margin-top: 2rem;
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(195, 57, 17, 0.1);
  font-family: "Urbanist", sans-serif;
  animation: fadeIn 0.4s ease;
}

.workflow-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #693a2b;
  margin-bottom: 1rem;
}

.workflow-prompt-box {
  background-color: #fff3eb;
  padding: 1rem;
  border-left: 5px solid #c33911;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.prompt-label {
  font-weight: 500;
  color: #c33911;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.prompt-value {
  font-style: italic;
  color: #693a2b;
  font-size: 1rem;
  white-space: pre-wrap;
}

.diagram-wrapper {
  padding: 1rem;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 0.75rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
