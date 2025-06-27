<script setup lang="ts">
import type { Edge, Node } from "@vue-flow/core";
import { useVueFlow, VueFlow } from "@vue-flow/core";
import {
  Check as CheckIcon,
  CircleAlert as CircleAlertIcon,
  Redo2,
  Undo2,
} from "lucide-vue-next";
import { computed, defineEmits, onMounted, onUnmounted, ref, watch } from "vue";
import ConfirmationDialog from "../dialogs/ConfirmationDialog.vue";
import ServiceSelectionDialog from "../dialogs/ServiceSelectionDialog.vue";
import ServiceNode from "../nodes/ServiceNode.vue";
import SpecialEdge from "../nodes/SpecialEdge.vue";

const workflow = defineModel<any[]>("workflow");
const isReadyToSave = defineModel<boolean>("isReadyToSave", { default: false });

// Définir les émissions d'événements
const emit = defineEmits<{
  "update:selectedServices": [
    services: Record<string, { service: any; params: any }>
  ];
  save: [];
}>();

// Utiliser un computed pour accéder aux données et s'assurer qu'elles sont un tableau
const workflowData = computed({
  get: () => workflow.value || [],
  set: (value) => {
    workflow.value = value;
  },
});

const showNOtification = ref(false);
const notification = ref({
  type: "info",
  message: "",
});

// Nodes et edges réactifs
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);
// État du workflow et historique
const workflowHistory = ref<any[]>([]);
const currentHistoryIndex = ref<number>(-1);
const maxHistorySize = 20;
const hasChanges = ref(false);
const confirmationDialogRef = ref(null);

const canUndo = computed(() => currentHistoryIndex.value > 0);
const canRedo = computed(
  () => currentHistoryIndex.value < workflowHistory.value.length - 1
);
// Référence au workflow actuel
const {
  getNodes,
  getEdges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setNodes,
  setEdges,
  addNodes,
  removeNodes,
} = useVueFlow();

// État pour le dialogue de sélection de service
const serviceSelectionDialogRef = ref<InstanceType<
  typeof ServiceSelectionDialog
> | null>(null);
const selectedNodeId = ref<string | null>(null);
const availableServices = ref<any[]>([]);

// État pour stocker les services sélectionnés pour chaque nœud
const selectedServices = ref<Record<string, { service: any; params: any }>>({});

// Computed pour vérifier si tous les nœuds ont un service sélectionné
const isWorkflowComplete = computed(() => {
  if (!workflowData.value || workflowData.value.length === 0) return false;

  return workflowData.value.every((step, index) => {
    const nodeId = `${index + 1}`;
    return selectedServices.value[nodeId]?.service != null;
  });
});

// Mettre à jour la propriété isReadyToSave quand le workflow est complet
watch(isWorkflowComplete, (newValue) => {
  isReadyToSave.value = newValue;
});

// Constants pour la disposition
const xGap = 350;
const yGap = 180;

// Gérer le clic sur un nœud
function handleNodeClick(nodeId: string, services: any[]) {
  selectedNodeId.value = nodeId;
  availableServices.value = services || [];

  // Ouvrir le dialogue de sélection de service
  if (serviceSelectionDialogRef.value) {
    serviceSelectionDialogRef.value.openDialog();
  }
}

// Fonction pour supprimer un nœud du workflow
async function handleNodeDelete(nodeId: string) {
  // Vérifier si le nœud existe
  const nodeToDelete = nodes.value.find((node) => node.id === nodeId);
  if (!nodeToDelete) return;

  // Utiliser une simple alerte de confirmation
  if (confirmationDialogRef.value) {
    const confirmed = await confirmationDialogRef.value.openDialog();

    if (confirmed) {
      try {
        // Sauvegarder l'état avant la suppression
        saveCurrentState();
        hasChanges.value = true;

        // Récupérer l'index de l'étape dans le workflow
        const index = Number(nodeId) - 1;

        // Supprimer le service associé au nœud
        if (selectedServices.value[nodeId]) {
          const updatedServices = { ...selectedServices.value };
          delete updatedServices[nodeId];
          selectedServices.value = updatedServices;
        }

        // Supprimer le nœud du workflow
        if (index >= 0 && index < workflowData.value.length) {
          const newWorkflowData = [...workflowData.value];
          newWorkflowData.splice(index, 1);

          // Mettre à jour les index des étapes restantes
          workflowData.value = newWorkflowData;

          // Régénérer le graphe
          generateGraph();
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du nœud:", error);
      }
    }
  }
}

// Fonctions pour écouter les changements dans le workflow
function handleNodesChange(changes: any) {
  // Ne pas sauvegarder l'état pour les changements de position en cours
  const shouldSaveState = changes.some(
    (change) =>
      change.type !== "position" ||
      (change.type === "position" && change.dragging === false)
  );

  if (shouldSaveState) {
    saveCurrentState();
    hasChanges.value = true;
  }

  onNodesChange(changes);
}

function handleEdgesChange(changes: any) {
  saveCurrentState();
  hasChanges.value = true;
  onEdgesChange(changes);
}

function handleConnect(connection: any) {
  saveCurrentState();
  hasChanges.value = true;
  onConnect(connection);
}

function handleKeyDown(event: KeyboardEvent) {
  // Ctrl+Z pour annuler
  if (
    (event.ctrlKey || event.metaKey) &&
    event.key === "z" &&
    !event.shiftKey &&
    canUndo.value
  ) {
    event.preventDefault();
    undo();
  }

  // Ctrl+Y ou Ctrl+Shift+Z pour rétablir
  if (
    (event.ctrlKey || event.metaKey) &&
    (event.key === "y" || (event.key === "z" && event.shiftKey)) &&
    canRedo.value
  ) {
    event.preventDefault();
    redo();
  }
}

// Gérer la sélection d'un service
function handleServiceSelection(serviceWithParams: {
  service: any;
  params: any;
}) {
  if (!selectedNodeId.value) return;

  // Sauvegarder l'état actuel avant modification
  saveCurrentState();
  hasChanges.value = true;

  // Stocker le service sélectionné avec ses paramètres
  selectedServices.value[selectedNodeId.value] = serviceWithParams;

  const index = Number(selectedNodeId.value) - 1;

  workflowData.value[index].selectedService = serviceWithParams.service;
  workflowData.value[index].serviceParams = serviceWithParams.params;

  // Forcer une mise à jour complète des nœuds
  updateNodeWithService(selectedNodeId.value, serviceWithParams);

  // Émettre les services sélectionnés pour que le parent puisse les utiliser
  emit("update:selectedServices", { ...selectedServices.value });
}

// Mettre à jour un nœud spécifique avec le service sélectionné
function updateNodeWithService(
  nodeId: string,
  serviceWithParams: { service: any; params: any }
) {
  const updatedNodes = [...nodes.value];
  const nodeIndex = updatedNodes.findIndex((node) => node.id === nodeId);
  if (nodeIndex !== -1) {
    const updatedNode = { ...updatedNodes[nodeIndex] };
    updatedNode.data = {
      ...updatedNode.data,
      selectedService: serviceWithParams.service,
      serviceParams: serviceWithParams.params,
      onNodeDelete: handleNodeDelete,
    };
    updatedNodes[nodeIndex] = updatedNode;
    nodes.value = updatedNodes;
  }
}

// Fonction pour préparer les données du workflow pour la sauvegarde
function prepareWorkflowForSave() {
  if (!isWorkflowComplete.value) return null;

  return workflowData.value.map((step, index) => {
    const nodeId = `${index + 1}`;
    const selectedServiceInfo = selectedServices.value[nodeId];
    return {
      order: step.order,
      jobTitle: step.jobTitle,
      serviceId: selectedServiceInfo.service._id,
      params: selectedServiceInfo.params || {},
      tags: step.tags || [],
    };
  });
}

// Fonction pour déclencher la sauvegarde
function saveWorkflow() {
  if (!isWorkflowComplete.value) {
    ("Le workflow n'est pas complet. Veuillez sélectionner un service pour chaque étape.");
    alert;
    return;
  }

  emit("save");
  hasChanges.value = false;
}

// Fonctions pour gérer l'historique
function saveCurrentState() {
  // Ne rien faire si les nodes et edges sont vides
  if (nodes.value.length === 0 && edges.value.length === 0) return;

  // Copier l'état actuel
  const currentState = {
    nodes: JSON.parse(JSON.stringify(nodes.value)),
    edges: JSON.parse(JSON.stringify(edges.value)),
  };

  // Si nous sommes au milieu de l'historique, supprimer les états futurs
  if (currentHistoryIndex.value < workflowHistory.value.length - 1) {
    workflowHistory.value = workflowHistory.value.slice(
      0,
      currentHistoryIndex.value + 1
    );
  }

  // Ne pas ajouter d'état si c'est identique au précédent
  if (workflowHistory.value.length > 0) {
    const prevState = workflowHistory.value[currentHistoryIndex.value];
    if (JSON.stringify(prevState) === JSON.stringify(currentState)) {
      return;
    }
  }

  // Ajouter l'état actuel à l'historique
  workflowHistory.value.push(currentState);

  // Limiter la taille de l'historique
  if (workflowHistory.value.length > maxHistorySize) {
    workflowHistory.value.shift();
  }

  // Mettre à jour l'index
  currentHistoryIndex.value = workflowHistory.value.length - 1;
}

function generateGraph() {
  // Vider les tableaux
  nodes.value = [];
  edges.value = [];

  if (!workflowData.value || workflowData.value.length === 0) {
    console.warn("Aucune donnée de workflow disponible");
    return;
  }

  try {
    // Grouper par ordre
    const groupedByOrder = workflowData.value.reduce((acc, step, index) => {
      const order = step.order || 0;
      if (!acc[order]) acc[order] = [];
      acc[order].push({ ...step, index });
      return acc;
    }, {});

    // Trier les niveaux
    const orderLevels = Object.keys(groupedByOrder)
      .map((o) => parseInt(o))
      .sort((a, b) => a - b);

    // Générer les nodes
    orderLevels.forEach((order, levelIndex) => {
      const steps = groupedByOrder[order];

      steps.forEach((service, stepIndex) => {
        const id = `${service.index + 1}`;

        // Déterminer le type
        let nodeType: "input" | "output" | "default" = "default";
        if (levelIndex === 0) nodeType = "input";
        else if (levelIndex === orderLevels.length - 1) nodeType = "output";

        // Récupérer le service sélectionné et ses paramètres s'ils existent
        const selectedServiceInfo = selectedServices.value[id];

        nodes.value.push({
          id,
          type: "serviceNode",
          position: {
            x: levelIndex * xGap,
            y: stepIndex * yGap,
          },
          data: {
            nodeType,
            service,
            onNodeClick: handleNodeClick,
            onNodeDelete: handleNodeDelete, // Ajouter la fonction de suppression
            selectedService: selectedServiceInfo?.service || null,
            serviceParams: selectedServiceInfo?.params || null,
          },
        });

        // Générer les edges depuis le niveau précédent
        if (levelIndex > 0) {
          const prevServices = groupedByOrder[orderLevels[levelIndex - 1]];
          prevServices.forEach((prevService) => {
            edges.value.push({
              id: `e${prevService.index + 1}->${service.index + 1}`,
              source: `${prevService.index + 1}`,
              target: `${service.index + 1}`,
              animated: true,
              type: "specialEdge",
            });
          });
        }
      });
    });
  } catch (error) {
    console.error("Erreur lors de la génération du graphe:", error);
  }
}

// Fonction pour annuler (Ctrl+Z)
function undo() {
  if (currentHistoryIndex.value > 0) {
    currentHistoryIndex.value--;
    const prevState = workflowHistory.value[currentHistoryIndex.value];
    setNodes(prevState.nodes);
    setEdges(prevState.edges);
  }
}

// Fonction pour rétablir (Ctrl+Y)
function redo() {
  if (currentHistoryIndex.value < workflowHistory.value.length - 1) {
    currentHistoryIndex.value++;
    const nextState = workflowHistory.value[currentHistoryIndex.value];
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
  }
}

// Surveiller les changements dans workflowData
watch(
  workflowData,
  () => {
    generateGraph();
  },
  { immediate: true }
);

// Surveiller les changements dans selectedServices pour mettre à jour les nœuds et émettre l'événement
watch(
  selectedServices,
  () => {
    console.log("Selected services changed:", workflowData.value);
    // Émettre les services sélectionnés
    emit("update:selectedServices", { ...selectedServices.value });
  },
  { deep: true }
);

// S'assurer que le graphe est généré après le montage du composant
onMounted(() => {
  generateGraph();
  // Sauvegarder l'état initial seulement si nous avons des nodes
  if (nodes.value.length > 0) {
    saveCurrentState();
  }
});

// Enregistrer l'état initial lors du montage
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

// Exposer les méthodes pertinentes pour le composant parent
defineExpose({
  prepareWorkflowForSave,
  saveWorkflow,
  isWorkflowComplete,
  selectedServices,
});
</script>

<template>
  <div v-if="nodes.length === 0" class="empty-workflow">
    <p>Chargement du étape...</p>
  </div>
  <div v-else class="workflow-container">
    <div class="workflow-actions">
      <button
        class="save-button"
        @click="saveWorkflow"
        :disabled="!isWorkflowComplete"
        :title="
          isWorkflowComplete
            ? 'Sauvegarder le projet'
            : 'Sélectionnez un service pour chaque étape'
        "
      >
        Sauvegarder le projet
      </button>
      <div class="workflow-status">
        <span v-if="isWorkflowComplete" class="status-complete">
          <CheckIcon />
          Étapes complet
        </span>
        <span v-else class="status-incomplete">
          <CircleAlertIcon />
          Services manquants
        </span>
      </div>

      <div
        class="workflow-toolbar flex items-center gap-4 p-4 bg-gray-50 border-b border-gray-200 shadow-sm sticky top-0 z-10"
      >
        <button
          @click="undo"
          :disabled="!canUndo"
          class="toolbar-button flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
        >
          <Undo2 class="w-4 h-4" />
          Annuler
        </button>
        <button
          @click="redo"
          :disabled="!canRedo"
          class="toolbar-button flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
        >
          <Redo2 class="w-4 h-4" />
          Rétablir
        </button>
        <button
          @click="saveWorkflow"
          :disabled="!isWorkflowComplete"
          :title="
            isWorkflowComplete
              ? 'Sauvegarder le projet'
              : 'Sélectionnez un service pour chaque étape'
          "
          class="save-button toolbar-button flex items-center gap-2 px-3 py-2 text-sm text-white bg-emerald-500 border border-emerald-500 rounded-md hover:bg-emerald-600"
        >
          <CheckIcon class="w-4 h-4" />
          Sauvegarder
        </button>
      </div>
    </div>

    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :node-types="{
        serviceNode: ServiceNode,
      }"
      :edge-types="{
        specialEdge: SpecialEdge,
      }"
      fit-view-on-init
      @nodesChange="handleNodesChange"
      @edgesChange="handleEdgesChange"
      @connect="handleConnect"
    >
      <template #node-serviceNode="nodeProps">
        <ServiceNode
          :id="nodeProps.id"
          :data="{
            ...nodeProps.data,
            onNodeDelete: handleNodeDelete,
          }"
          @delete="handleNodeDelete"
        />
      </template>
    </VueFlow>

    <!-- Dialog de sélection de service -->
    <ServiceSelectionDialog
      ref="serviceSelectionDialogRef"
      :services="availableServices"
      @select="handleServiceSelection"
    />

    <!-- Ajouter le dialogue de confirmation -->
    <ConfirmationDialog ref="confirmationDialogRef" />
  </div>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import "@vue-flow/core/dist/style.css";

/* import the default theme, this is optional but generally recommended */
@import "@vue-flow/core/dist/theme-default.css";

.workflow-container {
  width: 100%;
  height: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.workflow-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.save-button {
  background-color: #c33911;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-family: "Urbanist", sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-button:hover:not(:disabled) {
  background-color: #a22e0d;
}

.save-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.workflow-status {
  font-family: "Urbanist", sans-serif;
  font-size: 0.9rem;
}

.status-complete {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4caf50;
  font-weight: 600;
}

.status-incomplete {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ff9800;
  font-weight: 600;
}

.empty-workflow {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-family: "Urbanist", sans-serif;
  color: rgba(105, 58, 43, 0.6);
  font-style: italic;
}

.workflow-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.workflow-toolbar .toolbar-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.workflow-toolbar .toolbar-button:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.workflow-toolbar .toolbar-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.workflow-toolbar .toolbar-button .icon {
  width: 1rem;
  height: 1rem;
}

.workflow-toolbar .save-button {
  background-color: #10b981;
  border-color: #10b981;
  color: white;
}

.workflow-toolbar .save-button:hover {
  background-color: #059669;
}

.workflow-toolbar .warning-icon {
  color: #f59e0b;
  font-size: 1.2rem;
}
</style>
