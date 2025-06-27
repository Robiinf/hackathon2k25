<script setup lang="ts">
import { defineEmits, ref } from "vue";
import WorkflowDiagram from "./WorkflowDiagram.vue";

const props = defineProps<{
  prompt: string;
}>();

const emit = defineEmits<{
  "update:workflow": [workflow: any[]];
  save: [
    workflowData: any,
    selectedServices: Record<string, { service: any; params: any }>
  ];
  "update:isReadyToSave": [isReady: boolean];
}>();

// Modèles réactifs pour la communication bidirectionnelle
const workflow = defineModel<any[]>("workflow");
const workflowReadyToSave = defineModel<boolean>("isReadyToSave", {
  default: false,
});

// Référence pour stocker les services sélectionnés
const selectedServices = ref<Record<string, { service: any; params: any }>>({});

// Méthode pour recevoir les services sélectionnés mis à jour
function updateSelectedServices(
  services: Record<string, { service: any; params: any }>
) {
  console.log("Services sélectionnés mis à jour:", services);
  selectedServices.value = services;
}

// Méthode pour gérer la sauvegarde du workflow
function saveWorkflowToAPI() {
  const workflowData = prepareWorkflowForSave();

  if (!workflowData) {
    console.warn("Aucune donnée de projet à sauvegarder");
    return;
  }

  // Au lieu d'appeler l'API directement, on émet un événement pour que le parent s'en occupe
  console.log(
    "Émission de l'événement de sauvegarde avec les données:",
    workflowData
  );
  emit("save", workflowData, selectedServices.value);
}

// Préparer les données du workflow pour la sauvegarde
function prepareWorkflowForSave() {
  if (!workflow.value || workflow.value.length === 0) {
    console.warn("Aucune donnée de workflow disponible");
    return null;
  }

  return workflow.value.map((step, index) => {
    const nodeId = `${index + 1}`;
    const serviceInfo = selectedServices.value[nodeId];

    return {
      ...step,
      selectedService: serviceInfo?.service,
      serviceParams: serviceInfo?.params || {},
    };
  });
}
</script>

<template>
  <div class="workflow-diagram-container">
    <h2 class="workflow-title">Diagramme généré</h2>

    <div class="workflow-prompt-box">
      <p class="prompt-label">Prompt utilisé :</p>
      <p class="prompt-value">"{{ prompt }}"</p>
    </div>

    <!-- Indicateur de l'état du workflow -->
    <div
      class="workflow-status-indicator"
      :class="{ ready: workflowReadyToSave }"
    >
      <span v-if="workflowReadyToSave">
        Étape prêt à être sauvegardé ✓
      </span>
      <span v-else>
        Veuillez sélectionner des services pour toutes les étapes
      </span>
    </div>

    <div class="diagram-wrapper">
      <WorkflowDiagram
        v-model:workflow="workflow"
        v-model:isReadyToSave="workflowReadyToSave"
        @update:selectedServices="updateSelectedServices"
        @save="saveWorkflowToAPI"
      />
    </div>
  </div>
</template>

<style scoped>
.workflow-diagram-container {
  width: 100vw;
  max-width: 1200px;
  padding: 8rem;
  margin-top: 2rem;
  margin-left: 0;
  margin-right: 0;
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

.workflow-status-indicator {
  margin-top: 1rem;
  padding: 0.75rem;
  text-align: center;
  border-radius: 0.5rem;
  background-color: rgba(255, 152, 0, 0.1);
  color: #ff9800;
  font-weight: 500;
  transition: all 0.3s ease;
}

.workflow-status-indicator.ready {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
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
