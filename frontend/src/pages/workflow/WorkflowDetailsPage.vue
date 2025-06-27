<!-- filepath: /home/ilyam/dev/hackathon2k25/frontend/src/pages/WorkflowDetailsPage.vue -->
<template>
  <GlobalLayout :title="workflow ? workflow.name : 'Détails du workflow'">
    <div class="workflow-details-container">
      <div class="details-header">
        <div class="header-left">
          <button class="back-button" @click="$router.push('/workflows')">
            &larr; Retour à la liste
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement du workflow...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">!</div>
        <h3>Une erreur est survenue</h3>
        <p>{{ error }}</p>
        <button class="retry-button" @click="fetchWorkflow">Réessayer</button>
      </div>

      <div v-else-if="workflow" class="workflow-content">
        <section class="content-section details-section">
          <h2 class="section-title">Informations</h2>
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-label">Créé le</div>
              <div class="detail-value">
                {{ formatDate(workflow.createdAt) }}
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Dernière modification</div>
              <div class="detail-value">
                {{ formatDate(workflow.updatedAt) }}
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Nombre d'étapes</div>
              <div class="detail-value">{{ workflow.nodes.length }}</div>
            </div>
          </div>
          <p class="workflow-description">{{ workflow.description }}</p>
        </section>

        <section class="content-section prompt-section">
          <div class="section-header">
            <h2 class="section-title">Prompt utilisé</h2>
            <button class="copy-button" @click="copyPrompt">Copier</button>
          </div>
          <div class="prompt-box">
            {{ workflow.prompt }}
          </div>
        </section>

        <section class="content-section steps-section">
          <h2 class="section-title">Étapes du workflow</h2>
          <div class="steps-list">
            <div
              v-for="(node, index) in sortedNodes"
              :key="index"
              class="step-card"
            >
              <div class="step-order">{{ node.order }}</div>
              <div class="step-content">
                <h3 class="step-title">{{ node.jobTitle }}</h3>
                <div class="step-params">
                  <h4 class="params-title">Paramètres:</h4>
                  <pre class="params-json">{{
                    JSON.stringify(node.params, null, 2)
                  }}</pre>
                </div>
                <div v-if="node.tags && node.tags.length" class="step-tags">
                  <span v-for="tag in node.tags" :key="tag" class="tag">{{
                    tag
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Modal de confirmation pour la suppression -->
    <div
      v-if="showConfirmDelete"
      class="modal-overlay"
      @click.self="showConfirmDelete = false"
    >
      <div class="confirm-modal">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer ce workflow ?</p>
        <div class="modal-actions">
          <button class="cancel-button" @click="showConfirmDelete = false">
            Annuler
          </button>
          <button class="delete-button" @click="deleteWorkflow">
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Toast pour les notifications -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </GlobalLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  deleteWorkflow as apiDeleteWorkflow,
  getWorkflowById,
  type Workflow,
} from "../../api/workflowApi";
import GlobalLayout from "../../components/layouts/GlobalLayout.vue";

const route = useRoute();
const router = useRouter();
const workflowId = computed(() => route.params.id as string);

const workflow = ref<Workflow | null>(null);
const loading = ref(true);
const error = ref("");
const showConfirmDelete = ref(false);

// Toast pour les notifications
const toast = ref({
  show: false,
  message: "",
  type: "success" as "success" | "error" | "info",
});

// Nœuds de workflow triés par ordre
const sortedNodes = computed(() => {
  if (!workflow.value) return [];
  return [...workflow.value.nodes].sort((a, b) => a.order - b.order);
});

// Récupérer les détails du workflow
async function fetchWorkflow() {
  if (!workflowId.value) return;

  loading.value = true;
  error.value = "";

  try {
    const result = await getWorkflowById(workflowId.value);

    if (result.success && result.data) {
      workflow.value = result.data;
    } else {
      error.value =
        result.message || "Erreur lors de la récupération du workflow";
    }
  } catch (err: any) {
    console.error("Erreur:", err);
    error.value = err.message || "Une erreur est survenue";
  } finally {
    loading.value = false;
  }
}

// Formater une date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Copier le prompt dans le presse-papiers
function copyPrompt() {
  if (!workflow.value) return;

  navigator.clipboard
    .writeText(workflow.value.prompt)
    .then(() => {
      showToast("success", "Prompt copié dans le presse-papiers");
    })
    .catch(() => {
      showToast("error", "Impossible de copier le texte");
    });
}

// Éditer le workflow
function editWorkflow() {
  // Rediriger vers une page d'édition (à implémenter)
  router.push(`/workflow/edit/${workflowId.value}`);
}

// Confirmer la suppression
function confirmDelete() {
  showConfirmDelete.value = true;
}

// Supprimer le workflow
async function deleteWorkflow() {
  if (!workflowId.value) return;

  try {
    const result = await apiDeleteWorkflow(workflowId.value);

    if (result.success) {
      showToast("success", "Le workflow a été supprimé avec succès");

      // Rediriger vers la liste des workflows
      setTimeout(() => {
        router.push("/workflows");
      }, 1500);
    } else {
      showToast("error", result.message || "Erreur lors de la suppression");
    }
  } catch (err: any) {
    console.error("Erreur:", err);
    showToast("error", err.message || "Une erreur est survenue");
  } finally {
    showConfirmDelete.value = false;
  }
}

// Afficher un toast de notification
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

// Initialisation
onMounted(() => {
  fetchWorkflow();
});
</script>

<style scoped>
.workflow-details-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.back-button {
  background: none;
  border: none;
  color: fff3eb;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 0.5rem;
  text-align: left;
  width: fit-content;
}

.back-button:hover {
  color: #fff3eb;
}

.details-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #693a2b;
  font-family: "Urbanist", sans-serif;
}

.skeleton-title {
  height: 2.5rem;
  width: 200px;
  background-color: #eee;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-button {
  padding: 0.6rem 1.25rem;
  border-radius: 0.5rem;
  font-family: "Urbanist", sans-serif;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.action-button.edit {
  background-color: #2196f3;
  color: white;
}

.action-button.delete {
  background-color: white;
  color: #f44336;
  border: 1px solid #f44336;
}

.action-button.edit:hover {
  background-color: #1976d2;
}

.action-button.delete:hover {
  background-color: rgba(244, 67, 54, 0.08);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  border: 4px solid rgba(195, 57, 17, 0.1);
  border-radius: 50%;
  border-top: 4px solid #c33911;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f44336;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1.25rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-family: "Urbanist", sans-serif;
  cursor: pointer;
}

.content-section {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(105, 58, 43, 0.05);
  margin-bottom: 2rem;
  border: 1px solid rgba(105, 58, 43, 0.08);
}

.section-title {
  margin-top: 0;
  margin-bottom: 1.25rem;
  font-size: 1.25rem;
  color: #693a2b;
  font-family: "Urbanist", sans-serif;
  font-weight: 600;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.copy-button {
  padding: 0.4rem 1rem;
  background-color: rgba(105, 58, 43, 0.05);
  border: 1px solid rgba(105, 58, 43, 0.1);
  color: #693a2b;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-family: "Urbanist", sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-button:hover {
  background-color: rgba(105, 58, 43, 0.1);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.8rem;
  color: rgba(105, 58, 43, 0.7);
}

.detail-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: #693a2b;
}

.workflow-description {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #555;
}

.prompt-box {
  background-color: rgba(105, 58, 43, 0.03);
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  border-left: 3px solid #c33911;
  white-space: pre-wrap;
  color: #555;
  line-height: 1.5;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(105, 58, 43, 0.02);
  border-radius: 0.5rem;
  border: 1px solid rgba(105, 58, 43, 0.08);
}

.step-order {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #c33911;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex-grow: 1;
}

.step-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  color: #693a2b;
}

.step-params {
  margin-bottom: 1rem;
}

.params-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  color: rgba(105, 58, 43, 0.7);
}

.params-json {
  background-color: rgba(0, 0, 0, 0.03);
  padding: 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  overflow-x: auto;
  color: #555;
}

.step-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.tag {
  padding: 0.25rem 0.6rem;
  background-color: rgba(105, 58, 43, 0.08);
  border-radius: 1rem;
  font-size: 0.8rem;
  color: #693a2b;
}

/* Modal et toast styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirm-modal {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.confirm-modal h3 {
  margin-top: 0;
  color: #693a2b;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 0.25rem;
  cursor: pointer;
}

.delete-button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #f44336;
  color: white;
  border-radius: 0.25rem;
  cursor: pointer;
}

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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>
