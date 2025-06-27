<script setup lang="ts">
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Eye,
  FolderOpen,
  Grid,
  Info,
  Layers,
  List,
  PlusCircle,
  Trash2,
} from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  deleteWorkflow as apiDeleteWorkflow,
  getWorkflows,
  type Workflow,
} from "../../api/workflowApi";
import WorkflowCard from "../../components/cards/WorkflowCard.vue";
import GlobalLayout from "../../components/layouts/GlobalLayout.vue";

const router = useRouter();
const workflows = ref<Workflow[]>([]);
const loading = ref(true);
const error = ref("");
const viewMode = ref<"cards" | "list">("cards");

// État pour la suppression
const showConfirmDelete = ref(false);
const workflowToDelete = ref<Workflow | null>(null);

// Toast pour les notifications
const toast = ref({
  show: false,
  message: "",
  type: "success" as "success" | "error" | "info",
});

// Récupérer tous les workflows
async function fetchWorkflows() {
  loading.value = true;
  error.value = "";

  try {
    const result = await getWorkflows();

    if (result.success && result.data) {
      workflows.value = result.data;
    } else {
      error.value =
        result.message || "Erreur lors de la récupération des workflows";
    }
  } catch (err: any) {
    console.error("Erreur:", err);
    error.value = err.message || "Une erreur est survenue";
  } finally {
    loading.value = false;
  }
}

// Voir un workflow spécifique
function viewWorkflow(workflow: Workflow) {
  router.push(`/workflows/${workflow._id}`);
}

// Confirmer la suppression d'un workflow
function confirmDeleteWorkflow(workflow: Workflow) {
  workflowToDelete.value = workflow;
  showConfirmDelete.value = true;
}

// Supprimer un workflow
async function deleteWorkflow() {
  if (!workflowToDelete.value) return;

  try {
    const result = await apiDeleteWorkflow(workflowToDelete.value._id);

    if (result.success) {
      // Mettre à jour la liste localement
      workflows.value = workflows.value.filter(
        (w) => w._id !== workflowToDelete.value?._id
      );
      showToast(
        "success",
        `Le workflow "${workflowToDelete.value.name}" a été supprimé`
      );
    } else {
      showToast("error", result.message || "Erreur lors de la suppression");
    }
  } catch (err: any) {
    console.error("Erreur:", err);
    showToast("error", err.message || "Une erreur est survenue");
  } finally {
    showConfirmDelete.value = false;
    workflowToDelete.value = null;
  }
}

// Formater une date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
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
  fetchWorkflows();
});
</script>

<template>
  <GlobalLayout title="Mes projets">
    <div class="workflows-page">
      <div class="content-container">
        <div class="header-section">
          <button
            class="create-button"
            @click="$router.push('/workflow-generator')"
          >
            <PlusCircle :size="18" class="btn-icon" />
            Créer un nouveau projet
          </button>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="loader">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
          <p class="loading-text">Chargement de vos projets...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <AlertCircle :size="32" class="error-icon" />
          <h3 class="error-title">Une erreur est survenue</h3>
          <p class="error-message">{{ error }}</p>
          <button class="retry-button" @click="fetchWorkflows">
            Réessayer
          </button>
        </div>

        <div v-else-if="workflows.length === 0" class="empty-state">
          <FolderOpen :size="48" class="empty-icon" />
          <h2 class="empty-title">Aucun projet trouvé</h2>
          <p class="empty-message">Vous n'avez pas encore créé de projet.</p>
          <button
            class="create-button"
            @click="$router.push('/workflow-generator')"
          >
            <PlusCircle :size="18" class="btn-icon" />
            Créer votre premier projet
          </button>
        </div>

        <div v-else class="workflows-section">
          <div class="section-header">
            <div class="view-controls">
              <button
                class="view-button"
                :class="{ active: viewMode === 'cards' }"
                @click="viewMode = 'cards'"
                title="Vue en cartes"
              >
                <Grid :size="18" />
              </button>
              <button
                class="view-button"
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
                title="Vue en liste"
              >
                <List :size="18" />
              </button>
            </div>
          </div>

          <!-- Vue en cartes (défilement horizontal) -->
          <div v-if="viewMode === 'cards'" class="workflows-carousel">
            <div class="workflows-scroll">
              <WorkflowCard
                v-for="(workflow, index) in workflows"
                :key="workflow._id"
                :workflow="workflow"
                :style="{ animationDelay: `${index * 0.1}s` }"
                @view="viewWorkflow"
                @delete="confirmDeleteWorkflow"
              />
            </div>
            <div class="scroll-indicator">
              <span>Faites défiler pour voir plus</span>
              <ChevronRight :size="16" />
            </div>
          </div>

          <!-- Vue en liste -->
          <div v-else class="workflows-list">
            <div
              v-for="(workflow, index) in workflows"
              :key="workflow._id"
              class="list-item"
              :style="{ animationDelay: `${index * 0.05}s` }"
            >
              <div class="list-content" @click="viewWorkflow(workflow)">
                <h3 class="list-title">{{ workflow.name }}</h3>
                <p class="list-desc">{{ workflow.description }}</p>
                <div class="list-meta">
                  <span class="meta-item">
                    <Calendar :size="14" />
                    {{ formatDate(workflow.createdAt) }}
                  </span>
                  <span class="meta-item">
                    <Layers :size="14" />
                    {{ workflow.nodes.length }} étapes
                  </span>
                </div>
              </div>
              <div class="list-actions">
                <button
                  class="list-action view"
                  @click.stop="viewWorkflow(workflow)"
                >
                  <Eye :size="16" />
                </button>
                <button
                  class="list-action delete"
                  @click.stop="confirmDeleteWorkflow(workflow)"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Éléments décoratifs -->
      <div class="decoration-element decoration-1"></div>
      <div class="decoration-element decoration-2"></div>
      <div class="decoration-element decoration-3"></div>
    </div>

    <!-- Modal de confirmation pour la suppression -->
    <div
      v-if="showConfirmDelete"
      class="modal-overlay"
      @click.self="showConfirmDelete = false"
    >
      <div class="confirm-modal">
        <AlertCircle class="confirm-icon" :size="24" />
        <h3>Confirmer la suppression</h3>
        <p>
          Êtes-vous sûr de vouloir supprimer le projet "{{
            workflowToDelete?.name
          }}" ?
          <br />
          <span class="warning-text">Cette action est irréversible.</span>
        </p>
        <div class="modal-actions">
          <button class="cancel-button" @click="showConfirmDelete = false">
            Annuler
          </button>
          <button class="delete-button" @click="deleteWorkflow">
            <Trash2 :size="14" />
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Toast pour les notifications -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      <CheckCircle2
        v-if="toast.type === 'success'"
        :size="18"
        class="toast-icon"
      />
      <AlertCircle
        v-if="toast.type === 'error'"
        :size="18"
        class="toast-icon"
      />
      <Info v-if="toast.type === 'info'" :size="18" class="toast-icon" />
      <span>{{ toast.message }}</span>
    </div>
  </GlobalLayout>
</template>

<style scoped>
.workflows-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: radial-gradient(
      circle at top right,
      rgba(195, 57, 17, 0.03),
      transparent 70%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(105, 58, 43, 0.02),
      transparent 70%
    );
  padding: 2rem 1rem;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  animation: fadeIn 0.5s ease forwards;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInUp 0.8s ease forwards;
}

.page-title {
  font-family: "Urbanist", sans-serif;
  font-size: 3.2rem;
  font-weight: 700;
  color: #693a2b;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.8s ease forwards;
}

.highlight {
  color: #c33911;
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: "";
  position: absolute;
  bottom: 0.1rem;
  left: 0;
  width: 100%;
  height: 0.2rem;
  background-color: rgba(195, 57, 17, 0.2);
  border-radius: 1rem;
}

.subtitle {
  font-family: "Urbanist", sans-serif;
  font-size: 1.2rem;
  line-height: 1.6;
  color: rgba(105, 58, 43, 0.8);
  margin: 0 auto 1.5rem;
  max-width: 700px;
  opacity: 0;
  animation: fadeInUp 0.8s 0.2s ease forwards;
}

.create-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #c33911;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-family: "Urbanist", sans-serif;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(195, 57, 17, 0.2);
}

.create-button:hover {
  background-color: #a22e0d;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(195, 57, 17, 0.3);
}

.btn-icon {
  transition: transform 0.2s;
}

.create-button:hover .btn-icon {
  transform: rotate(90deg);
}

/* Section de workflows */
.workflows-section {
  margin-top: 2rem;
  opacity: 0;
  animation: fadeIn 1s 0.3s ease forwards;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: #693a2b;
  font-family: "Urbanist", sans-serif;
}

.view-controls {
  display: flex;
  gap: 0.5rem;
}

.view-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  border: 1px solid rgba(105, 58, 43, 0.2);
  background-color: white;
  color: rgba(105, 58, 43, 0.6);
  cursor: pointer;
  transition: all 0.2s;
}

.view-button:hover,
.view-button.active {
  color: #fff3eb;
  border-color: rgba(195, 57, 17, 0.5);
  background-color: rgba(105, 58, 43, 0.6);
}

/* Vue en cartes (carousel) */
.workflows-carousel {
  position: relative;
}

.workflows-scroll {
  display: flex;
  overflow-x: auto;
  gap: 1.5rem;
  padding: 0.5rem 0 1.5rem;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.workflows-scroll::-webkit-scrollbar {
  display: none;
}

.workflows-scroll > * {
  flex: 0 0 auto;
  width: 350px;
  max-width: 90%;
  opacity: 0;
  animation: fadeInRight 0.6s ease forwards;
}

.scroll-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: #fff3eb;
  font-size: 0.9rem;
  animation: pulse 2s infinite ease-in-out;
}

/* Vue en liste */
.workflows-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 2px 10px rgba(105, 58, 43, 0.06);
  transition: all 0.2s ease;
  border: 1px solid rgba(105, 58, 43, 0.05);
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
}

.list-item:hover {
  transform: translateX(3px);
  box-shadow: 0 4px 15px rgba(105, 58, 43, 0.1);
  border-color: rgba(195, 57, 17, 0.3);
}

.list-content {
  flex-grow: 1;
  cursor: pointer;
}

.list-title {
  margin: 0 0 0.25rem;
  font-family: "Urbanist", sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #693a2b;
}

.list-desc {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: rgba(105, 58, 43, 0.7);
}

.list-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: rgba(105, 58, 43, 0.5);
}

.meta-item.active {
  color: #fff3eb;
  border-color: rgba(178, 148, 140, 0.5);
  background-color: rgba(255, 0, 179, 0.6);
}

.list-actions {
  display: flex;
  gap: 0.5rem;
}

.list-action {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: rgba(105, 58, 43, 0.5);
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;
}

.list-action.view:hover {
  color: #2196f3;
  background-color: rgba(33, 150, 243, 0.1);
}

.list-action.delete:hover {
  color: #f44336;
  background-color: rgba(244, 67, 54, 0.1);
}

/* États de chargement, erreur, vide */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  animation: fadeIn 0.8s ease forwards;
}

.loader {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.loader .dot {
  width: 10px;
  height: 10px;
  background-color: #c33911;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loader .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loader .dot:nth-child(2) {
  animation-delay: -0.16s;
}

.loading-text {
  color: rgba(105, 58, 43, 0.7);
  font-size: 1rem;
}

.error-icon {
  color: #f44336;
  margin-bottom: 1rem;
}

.error-title {
  margin: 0 0 0.5rem;
  color: #f44336;
}

.error-message {
  margin: 0 0 1.5rem;
  color: rgba(244, 67, 54, 0.8);
}

.retry-button {
  padding: 0.6rem 1.25rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-family: "Urbanist", sans-serif;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #d32f2f;
}

.empty-icon {
  color: rgba(105, 58, 43, 0.3);
  margin-bottom: 1rem;
}

.empty-title {
  margin: 0 0 0.5rem;
  color: #693a2b;
}

.empty-message {
  margin: 0 0 1.5rem;
  color: rgba(105, 58, 43, 0.7);
}

/* Modal de confirmation */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.confirm-modal {
  background-color: white;
  padding: 1.75rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: zoomIn 0.3s ease;
}

.confirm-icon {
  color: #f44336;
  margin-bottom: 1rem;
}

.confirm-modal h3 {
  margin-top: 0;
  color: #693a2b;
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.confirm-modal p {
  margin-bottom: 1.75rem;
  line-height: 1.6;
  color: rgba(105, 58, 43, 0.8);
}

.warning-text {
  color: #f44336;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.cancel-button {
  padding: 0.6rem 1.5rem;
  border: 1px solid rgba(105, 58, 43, 0.2);
  background-color: white;
  border-radius: 0.5rem;
  color: #693a2b;
  font-family: "Urbanist", sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-button {
  padding: 0.6rem 1.5rem;
  border: none;
  background-color: #f44336;
  color: white;
  border-radius: 0.5rem;
  font-family: "Urbanist", sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cancel-button:hover {
  background-color: rgba(105, 58, 43, 0.05);
  border-color: rgba(105, 58, 43, 0.4);
}

.delete-button:hover {
  background-color: #d32f2f;
}

/* Toast notifications */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  color: white;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease forwards;
  max-width: 350px;
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

/* Éléments décoratifs */
.decoration-element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(rgba(195, 57, 17, 0.1), rgba(105, 58, 43, 0.05));
  z-index: 1;
}

.decoration-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -150px;
  opacity: 0.4;
}

.decoration-2 {
  width: 300px;
  height: 300px;
  bottom: 5%;
  left: -100px;
  opacity: 0.3;
}

.decoration-3 {
  width: 200px;
  height: 200px;
  top: 40%;
  right: 10%;
  opacity: 0.2;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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

@keyframes pulse {
  0%,
  100% {
    transform: translateX(0);
    opacity: 0.6;
  }
  50% {
    transform: translateX(5px);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .workflows-scroll > * {
    width: 280px;
  }

  .decoration-1 {
    width: 200px;
    height: 200px;
    top: -50px;
    right: -100px;
  }

  .decoration-2 {
    width: 150px;
    height: 150px;
    bottom: 5%;
    left: -75px;
  }

  .decoration-3 {
    display: none;
  }
}
</style>
