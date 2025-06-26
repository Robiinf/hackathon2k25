<script setup lang="ts">
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@vue-flow/core";
import { computed } from "vue";

const props = defineProps<EdgeProps>();

const path = computed(() => getBezierPath(props));

// Déterminer la couleur de l'arête en fonction des services sélectionnés
const edgeStyle = computed(() => {
  // Vérifier si les nœuds source et destination ont des services sélectionnés
  const sourceHasService = hasSelectedService(props.sourceNode);
  const targetHasService = hasSelectedService(props.targetNode);

  // Si les deux nœuds ont un service sélectionné, utiliser une couleur spéciale
  if (sourceHasService && targetHasService) {
    return {
      stroke: "#4CAF50", // Vert pour les connexions complètes
      strokeWidth: 2.5,
      strokeDasharray: "none",
      animation: "flowEdgeAnimation 1s linear infinite",
    };
  }
  // Si un seul nœud a un service sélectionné, utiliser une couleur intermédiaire
  else if (sourceHasService || targetHasService) {
    return {
      stroke: "#FF9800", // Orange pour les connexions partielles
      strokeWidth: 2,
      strokeDasharray: "5,5",
      animation: "none",
    };
  }
  // Si aucun nœud n'a de service sélectionné, utiliser la couleur par défaut
  else {
    return {
      stroke: "#693a2b", // Marron par défaut
      strokeWidth: 1.5,
      strokeDasharray: "3,3",
      animation: "none",
    };
  }
});

// Fonction pour vérifier si un nœud a un service sélectionné
function hasSelectedService(node: any) {
  return node?.data?.selectedService != null;
}

// Calculer le type de connexion pour afficher un badge sur l'arête
const connectionType = computed(() => {
  const sourceType = props.sourceNode?.data?.selectedService?.type;
  const targetType = props.targetNode?.data?.selectedService?.type;

  if (sourceType && targetType) {
    // Si les deux sont de même type
    if (sourceType === targetType) {
      return sourceType;
    }
    // Si les types sont différents
    return "mixed";
  }

  return null;
});

// Texte à afficher sur l'arête
const edgeText = computed(() => {
  if (!connectionType.value) return "";

  switch (connectionType.value) {
    case "services":
      return "IA";
    case "provider":
      return "Humain";
    case "mixed":
      return "IA + Humain";
    default:
      return "";
  }
});

// Classe CSS pour le badge
const badgeClass = computed(() => {
  if (!connectionType.value) return "";

  switch (connectionType.value) {
    case "services":
      return "ai-badge";
    case "provider":
      return "human-badge";
    case "mixed":
      return "mixed-badge";
    default:
      return "";
  }
});
</script>

<template>
  <!-- Arête personnalisée avec style dynamique -->
  <BaseEdge :path="path[0]" :style="edgeStyle" />

  <!-- Badge informatif si les deux nœuds ont des services sélectionnés -->
  <EdgeLabelRenderer v-if="connectionType">
    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
      }"
      :class="['edge-badge', badgeClass]"
      class="nodrag nopan"
    >
      {{ edgeText }}
    </div>
  </EdgeLabelRenderer>
</template>

<style scoped>
.edge-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: "Urbanist", sans-serif;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-badge {
  background-color: #4caf50; /* Vert pour IA */
}

.human-badge {
  background-color: #2196f3; /* Bleu pour humain */
}

.mixed-badge {
  background: linear-gradient(
    135deg,
    #4caf50 0%,
    #2196f3 100%
  ); /* Dégradé pour mixte */
}

@keyframes flowEdgeAnimation {
  to {
    stroke-dashoffset: -10;
  }
}
</style>
