<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import GlobalLayout from "../../components/layouts/GlobalLayout.vue";
import WorkflowDiagramContainer from "../../components/workflow/WorkflowDiagramContainer.vue";

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref("");
const workflowData = ref<any[]>([]);
const prompt = ref("");
const workflowReadyToSave = ref(false);
const isSaving = ref(false);

const toast = ref({
  show: false,
  type: "info",
  message: "",
});

onMounted(() => {
  const urlPrompt = route.query.prompt?.toString();

  if (!urlPrompt) {
    error.value = "Aucun prompt spécifié dans l'URL";
    loading.value = false;
    return;
  }

  prompt.value = urlPrompt;
  fetchWorkflowFromAPI();
});

// Définir la fonction de sauvegarde du workflow
async function saveWorkflow(
  data: any
): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      }/api/workflows`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: responseData.message || `Erreur HTTP: ${response.status}`,
      };
    }

    return {
      success: true,
      data: responseData.data,
    };
  } catch (error: any) {
    console.error("Erreur lors de la sauvegarde du workflow:", error);
    return {
      success: false,
      message: error.message || "Une erreur est survenue lors de la sauvegarde",
    };
  }
}

// Fonction pour récupérer les données du workflow depuis l'API
async function fetchWorkflowFromAPI() {
  loading.value = true;
  error.value = "";

  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      }/api/workflows/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.value }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const data = await response.json();
    workflowData.value = data.data;
    /* workflowData.value = [
      {
        jobTitle: "Cahier des charges initial",
        order: 1,
        tags: ["rédaction", "ui/ux", "mobile", "web"],
        prompt:
          "Rédiger un cahier des charges initial pour une application mobile et web, décrivant les fonctionnalités principales, l'interface utilisateur et l'expérience utilisateur souhaitées. Inclure les objectifs de l'application et les plateformes cibles.",
        services: [
          {
            _id: "685d44d26b80fadead08b89d",
            type: "provider",
            name: "Designer UI/UX",
            description: "Création d'interfaces utilisateur intuitives",
            tags: ["web", "mobile", "ui/ux", "design", "interface"],
            inputJSON: [],
            __v: 0,
            createdAt: "2025-06-26T13:02:10.083Z",
            updatedAt: "2025-06-26T13:02:10.083Z",
            matchPercentage: "75%",
            averageNote: 4.4,
          },
          {
            _id: "685d44d26b80fadead08b8a2",
            type: "provider",
            name: "Développeur mobile",
            description: "Création d'applications mobiles pour iOS et Android",
            tags: ["mobile", "iOS", "Android", "développement"],
            inputJSON: [],
            __v: 0,
            createdAt: "2025-06-26T13:02:10.083Z",
            updatedAt: "2025-06-26T13:02:10.083Z",
            matchPercentage: "25%",
            averageNote: 4.2,
          },
          {
            _id: "685d44d26b80fadead08b89e",
            type: "services",
            name: "Rédacteur web",
            description: "Rédaction de contenu optimisé pour le web",
            tags: ["rédaction", "web", "SEO", "contenu"],
            inputJSON: [
              {
                label: "Style rédactionnel",
                type: "string",
                placeholder: "Professionnel, amical, etc.",
                required: false,
                options: [],
                _id: "685d44d26b80fadead08b89f",
              },
            ],
            __v: 0,
            createdAt: "2025-06-26T13:02:10.083Z",
            updatedAt: "2025-06-26T13:02:10.083Z",
            matchPercentage: "50%",
            averageNote: 4.2,
          },
          {
            _id: "685d44d26b80fadead08b8a0",
            type: "services",
            name: "Scribe de contenu",
            description: "IA spécialisée dans la rédaction de contenu",
            tags: ["rédaction", "contenu", "génération"],
            inputJSON: [
              {
                label: "Style de rédaction",
                type: "string",
                placeholder: "Formel, narratif...",
                required: false,
                options: [],
                _id: "685d44d26b80fadead08b8a1",
              },
            ],
            __v: 0,
            createdAt: "2025-06-26T13:02:10.083Z",
            updatedAt: "2025-06-26T13:02:10.083Z",
            matchPercentage: "25%",
            averageNote: 4.2,
          },
          {
            _id: "685d44d26b80fadead08b89b",
            type: "services",
            name: "Créateur de maquettes web",
            description: "Conception de maquettes pour sites web",
            tags: ["web", "maquette", "design", "ui/ux"],
            inputJSON: [
              {
                label: "Style de maquette",
                type: "string",
                placeholder: "Minimaliste, coloré, etc.",
                required: false,
                options: [],
                _id: "685d44d26b80fadead08b89c",
              },
            ],
            __v: 0,
            createdAt: "2025-06-26T13:02:10.083Z",
            updatedAt: "2025-06-26T13:02:10.083Z",
            matchPercentage: "50%",
            averageNote: 4.3,
          },
        ],
      },
      {
        jobTitle: "Traduction du cahier des charges",
        order: 2,
        tags: ["traducteur", "langue"],
        prompt:
          "Traduire le cahier des charges dans différentes langues pour supporter un service i18n. Spécifier les langues cibles.",
        services: [
          {
            _id: "685d44d26b80fadead08b896",
            type: "services",
            name: "Traducteur",
            description: "Traduction de texte en toutes langues",
            tags: ["traducteur", "langue"],
            inputJSON: [
              {
                label: "Langue cible",
                type: "select",
                placeholder: "",
                required: false,
                options: ["FR", "EN", "ES", "DE", "IT"],
                _id: "685d44d26b80fadead08b897",
              },
            ],
            __v: 0,
            createdAt: "2025-06-26T13:02:10.083Z",
            updatedAt: "2025-06-26T13:02:10.083Z",
            matchPercentage: "100%",
            averageNote: 4.2,
          },
        ],
      },
      {
        jobTitle: "Déploiement",
        order: 6,
        tags: ["développement", "web", "mobile"],
        prompt:
          "Déployer l'application sur les plateformes cibles (web et mobile).",
        services: [
          {
            _id: "685d44d26b80fadead08b8a2",
            type: "provider",
            name: "Développeur mobile",
            description: "Création d'applications mobiles pour iOS et Android",
            tags: ["mobile", "iOS", "Android", "développement"],
            inputJSON: [],
            __v: 0,
            createdAt: "2025-06-26T13:02:10.083Z",
            updatedAt: "2025-06-26T13:02:10.083Z",
            matchPercentage: "67%",
            averageNote: 4.2,
          },
          {
            _id: "685d44d26b80fadead08b89d",
            type: "provider",
            name: "Designer UI/UX",
            description: "Création d'interfaces utilisateur intuitives",
            tags: ["web", "mobile", "ui/ux", "design", "interface"],
            inputJSON: [],
            __v: 0,
            createdAt: "2025-06-26T13:02:10.083Z",
            updatedAt: "2025-06-26T13:02:10.083Z",
            matchPercentage: "67%",
            averageNote: 4.4,
          },
          {
            _id: "685d44d26b80fadead08b89b",
            type: "services",
            name: "Créateur de maquettes web",
            description: "Conception de maquettes pour sites web",
            tags: ["web", "maquette", "design", "ui/ux"],
            inputJSON: [
              {
                label: "Style de maquette",
                type: "string",
                placeholder: "Minimaliste, coloré, etc.",
                required: false,
                options: [],
                _id: "685d44d26b80fadead08b89c",
              },
            ],
            __v: 0,
            createdAt: "2025-06-26T13:02:10.083Z",
            updatedAt: "2025-06-26T13:02:10.083Z",
            matchPercentage: "33%",
            averageNote: 4.3,
          },
          {
            _id: "685d44d26b80fadead08b89e",
            type: "services",
            name: "Rédacteur web",
            description: "Rédaction de contenu optimisé pour le web",
            tags: ["rédaction", "web", "SEO", "contenu"],
            inputJSON: [
              {
                label: "Style rédactionnel",
                type: "string",
                placeholder: "Professionnel, amical, etc.",
                required: false,
                options: [],
                _id: "685d44d26b80fadead08b89f",
              },
            ],
            __v: 0,
            createdAt: "2025-06-26T13:02:10.083Z",
            updatedAt: "2025-06-26T13:02:10.083Z",
            matchPercentage: "33%",
            averageNote: 4.2,
          },
        ],
      },
    ]; */
  } catch (err) {
    console.error("Erreur lors de la génération du projet:", err);
    error.value =
      err instanceof Error
        ? err.message
        : "Erreur inconnue lors de la génération du projet";
  } finally {
    loading.value = false;
  }
}

// Fonction pour gérer la sauvegarde du workflow depuis le conteneur du diagramme
async function handleWorkflowSave(
  workflowData: any,
  selectedServices: Record<string, { service: any; params: any }>
) {
  isSaving.value = true;

  try {
    const workflowToSave = {
      name: "Workflow généré", // Vous pourriez demander à l'utilisateur de donner un nom
      description: "Workflow généré à partir du prompt",
      prompt: prompt.value,
      nodes: workflowData.map((step: any) => ({
        order: step.order,
        jobTitle: step.jobTitle,
        serviceId: step.selectedService?._id,
        params: step.serviceParams || {},
        tags: step.tags || [],
      })),
      selectedServices, // Garder cette info si nécessaire
    };

    const result = await saveWorkflow(workflowToSave);

    if (result.success) {
      // Afficher un message de succès
      showToast("success", "Workflow sauvegardé avec succès!");

      // Rediriger vers la liste des workflows
      setTimeout(() => {
        router.push("/workflows");
      }, 1500);
    } else {
      showToast("error", result.message || "Erreur lors de la sauvegarde");
    }
  } catch (error: any) {
    console.error("Erreur lors de la sauvegarde:", error);
    showToast("error", error.message || "Une erreur est survenue");
  } finally {
    isSaving.value = false;
  }
}

function showToast(type: "success" | "error" | "info", message: string) {
  toast.value = {
    show: true,
    type,
    message,
  };

  setTimeout(() => {
    toast.value.show = false;
  }, 5000);
}

onMounted(() => {
  const urlPrompt = route.query.prompt?.toString();

  if (!urlPrompt) {
    error.value = "Aucun prompt spécifié dans l'URL";
    loading.value = false;
    return;
  }

  prompt.value = urlPrompt;
  fetchWorkflowFromAPI();
});
</script>

<template>
  <GlobalLayout
    :title="loading ? 'Génération du projet...' : 'Visualisation de votre projet'"
  >
    <div v-if="loading" class="loading-container">
      <div class="loader">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      <h2 class="loading-title">Génération de votre projet en cours...</h2>
      <p class="loading-description">
        Veuillez patienter pendant que nous analysons votre demande et créons un
        projet adapté.
      </p>
    </div>

    <div v-else-if="error" class="error-container">
      <h2 class="error-title">Une erreur est survenue</h2>
      <p class="error-message">{{ error }}</p>
      <button class="retry-button" @click="fetchWorkflowFromAPI">
        Réessayer
      </button>
    </div>

    <div v-else>
      <WorkflowDiagramContainer
        :prompt="prompt"
        v-model:workflow="workflowData"
        v-model:isReadyToSave="workflowReadyToSave"
        @save="handleWorkflowSave"
      />
    </div>

    <!-- Ajoutez un composant Toast pour les notifications -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>

    <!-- Indicateur de sauvegarde -->
    <div v-if="isSaving" class="saving-overlay">
      <div class="saving-spinner"></div>
      <p>Enregistrement du workflow...</p>
    </div>
  </GlobalLayout>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap");

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(105, 58, 43, 0.1);
  text-align: center;
  font-family: "Urbanist", sans-serif;
}

.loader {
  display: flex;
  gap: 8px;
  margin-bottom: 2rem;
}

.dot {
  width: 12px;
  height: 12px;
  background-color: #c33911;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

.loading-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #693a2b;
  margin-bottom: 1rem;
  font-family: "Urbanist", sans-serif;
}

.loading-description {
  color: rgba(105, 58, 43, 0.7);
  max-width: 500px;
}

.error-container {
  padding: 2rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(105, 58, 43, 0.1);
  text-align: center;
  font-family: "Urbanist", sans-serif;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e53e3e;
  margin-bottom: 1rem;
}

.error-message {
  color: rgba(105, 58, 43, 0.8);
  margin-bottom: 1.5rem;
}

.retry-button {
  background-color: #c33911;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #a22e0d;
}

.workflow-prompt-container {
  margin: 2rem auto;
  max-width: 800px;
  background-color: #ffff;
  border-left: 6px solid #c33911;
  border-radius: 0.75rem;
  padding: 0.5rem 0.5rem;
  box-shadow: 0 8px 20px rgba(195, 57, 17, 0.1);
  font-family: "Urbanist", sans-serif;
  transition: transform 0.2s ease;
}

.workflow-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #693a2b;
  margin-bottom: 0.5rem;
  font-family: "Urbanist", sans-serif;
}

.workflow-prompt {
  font-style: italic;
  background-color: #fff3eb;
  color: #c33911;
  padding: 1rem 1.5rem;
  border-color: #c33911;
  border-width: 1.5px;
  border-left: 4px solid #c33911;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  white-space: pre-wrap;
  word-break: break-word;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Style pour les toasts */
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 4px;
  color: white;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.toast.success {
  background-color: #4caf50;
}

.toast.error {
  background-color: #f44336;
}

.toast.info {
  background-color: #2196f3;
}

/* Style pour l'overlay de sauvegarde */
.saving-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  color: white;
}

.saving-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid white;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
