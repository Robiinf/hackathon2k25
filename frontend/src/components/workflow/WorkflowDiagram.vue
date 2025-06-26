<script setup lang="ts">
import type { Edge, Node } from "@vue-flow/core";
import { VueFlow } from "@vue-flow/core";
import { computed, onMounted, ref, watch } from "vue";
import ServiceSelectionDialog from "../dialogs/ServiceSelectionDialog.vue";
import ServiceNode from "../nodes/ServiceNode.vue";
import SpecialEdge from "../nodes/SpecialEdge.vue";

const workflow = defineModel<any[]>("workflow");

// Utiliser un computed pour accéder aux données et s'assurer qu'elles sont un tableau
const workflowData = computed({
  get: () => workflow.value || [],
  set: (value) => {
    console.log("Setting workflow data:", value);
    workflow.value = value;
  },
});

// Nodes et edges réactifs
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

// État pour le dialogue de sélection de service
const serviceSelectionDialogRef = ref<InstanceType<
  typeof ServiceSelectionDialog
> | null>(null);
const selectedNodeId = ref<string | null>(null);
const availableServices = ref<any[]>([]);

// État pour stocker les services sélectionnés pour chaque nœud
const selectedServices = ref<Record<string, { service: any; params: any }>>({});

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

// Gérer la sélection d'un service
function handleServiceSelection(serviceWithParams: {
  service: any;
  params: any;
}) {
  if (!selectedNodeId.value) return;

  // Stocker le service sélectionné avec ses paramètres
  selectedServices.value[selectedNodeId.value] = serviceWithParams;

  const index = Number(selectedNodeId.value) - 1;

  workflowData.value[index].selectedService = serviceWithParams.service;
  workflowData.value[index].serviceParams = serviceWithParams.params;

  // Forcer une mise à jour complète des nœuds
  updateNodeWithService(selectedNodeId.value, serviceWithParams);
}

// Mettre à jour un nœud spécifique avec le service sélectionné
function updateNodeWithService(
  nodeId: string,
  serviceWithParams: { service: any; params: any }
) {
  const updatedNodes = [...nodes.value];
  const nodeIndex = updatedNodes.findIndex((node) => node.id === nodeId);

  if (nodeIndex !== -1) {
    // Créer un nouvel objet node pour déclencher la réactivité
    const updatedNode = { ...updatedNodes[nodeIndex] };

    // Mettre à jour les données avec une nouvelle référence d'objet
    updatedNode.data = {
      ...updatedNode.data,
      selectedService: serviceWithParams.service,
      serviceParams: serviceWithParams.params,
    };

    updatedNodes[nodeIndex] = updatedNode;
    nodes.value = updatedNodes; // Remplacer l'ancien tableau par le nouveau
  }
}

// Fonction pour générer le graphe
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

// Surveiller les changements dans workflowData
watch(
  workflowData,
  () => {
    generateGraph();
  },
  { immediate: true }
);

// Surveiller les changements dans selectedServices pour mettre à jour les nœuds
watch(
  selectedServices,
  () => {
    console.log("Selected services changed:", workflowData.value);
    // On ne régénère pas tout le graphe pour préserver la disposition,
    // on va plutôt mettre à jour chaque nœud individuellement
  },
  { deep: true }
);

// S'assurer que le graphe est généré après le montage du composant
onMounted(() => {
  generateGraph();
});
</script>

<template>
  <div v-if="nodes.length === 0" class="empty-workflow">
    <p>Chargement du workflow...</p>
  </div>
  <div v-else class="workflow-container">
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
    >
      <template #node-serviceNode="nodeProps">
        <ServiceNode
          v-bind="nodeProps"
          @click="
            handleNodeClick(nodeProps.id, nodeProps.data.service.services || [])
          "
        />
      </template>
    </VueFlow>

    <!-- Dialog de sélection de service -->
    <ServiceSelectionDialog
      ref="serviceSelectionDialogRef"
      :services="availableServices"
      @select="handleServiceSelection"
    />
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
</style>
