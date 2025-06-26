<script setup lang="ts">
import { AlertTriangle, Info as InfoIcon } from "lucide-vue-next";
import { defineEmits, defineProps, ref } from "vue";
import { useDialog } from "../../composables/useDialog";
import Dialog from "../Dialog.vue";

const props = defineProps({
  title: {
    type: String,
    default: "Confirmation de suppression",
  },
  message: {
    type: String,
    default: "Êtes-vous sûr de vouloir supprimer cette étape ?",
  },
  confirmButtonText: {
    type: String,
    default: "Supprimer",
  },
  cancelButtonText: {
    type: String,
    default: "Annuler",
  },
  warningLevel: {
    type: String,
    default: "warning", // "info", "warning", "danger"
  },
});

const emit = defineEmits(["confirm", "cancel"]);

// Utiliser le composable useDialog comme le fait ServiceSelectionDialog
const { isOpen, open, close } = useDialog();
const resolvePromise = ref<((value: boolean) => void) | null>(null);

// Fonction pour ouvrir la boîte de dialogue avec une promesse
function openDialog(): Promise<boolean> {
  return new Promise((resolve) => {
    resolvePromise.value = resolve;
    open(); // Utiliser la fonction open du composable
  });
}

// Fonction pour confirmer l'action
function confirmAction() {
  if (resolvePromise.value) {
    resolvePromise.value(true);
  }
  emit("confirm");
  close(); // Utiliser la fonction close du composable
}

// Fonction pour annuler l'action
function cancelAction() {
  if (resolvePromise.value) {
    resolvePromise.value(false);
  }
  emit("cancel");
  close(); // Utiliser la fonction close du composable
}

// Exposer les méthodes pour le parent
defineExpose({
  openDialog,
});
</script>

<template>
  <Dialog v-model="isOpen" :title="title" class="confirmation-dialog">
    <div class="dialog-content">
      <div class="confirmation-message" :class="warningLevel">
        <AlertTriangle v-if="warningLevel === 'warning'" :size="24" />
        <AlertTriangle
          v-else-if="warningLevel === 'danger'"
          :size="24"
          class="danger-icon"
        />
        <InfoIcon v-else :size="24" />
        <p>{{ message }}</p>
      </div>

      <div class="additional-info">
        <p>Cette action peut être annulée avec Ctrl+Z (Undo).</p>
      </div>

      <div class="dialog-actions">
        <button type="button" class="btn-secondary" @click="cancelAction">
          {{ cancelButtonText }}
        </button>
        <button
          type="button"
          class="btn-primary"
          :class="{
            'btn-danger': warningLevel === 'danger',
            'btn-warning': warningLevel === 'warning',
          }"
          @click="confirmAction"
        >
          {{ confirmButtonText }}
        </button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.confirmation-dialog {
  max-width: 500px;
}

.dialog-content {
  padding: 24px;
}

.confirmation-message {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  background-color: #f3f4f6;
  color: #4b5563;
}

.confirmation-message.warning {
  background-color: #fff8e6;
  color: #92400e;
}

.confirmation-message.warning svg {
  color: #f59e0b;
}

.confirmation-message.danger {
  background-color: #fef2f2;
  color: #b91c1c;
}

.confirmation-message.danger svg,
.danger-icon {
  color: #ef4444;
}

.confirmation-message p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  flex-grow: 1;
}

.additional-info {
  padding: 12px 0;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 16px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-secondary,
.btn-primary {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-primary.btn-warning {
  padding: 0.5rem 1.25rem;
  background-color: #c33911;
  color: white;
  border: 1px solid #c33911;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: "Urbanist", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary.btn-warning:hover {
  color: #c33911;
  background-color: transparent;
  border-color: #c33911;
}

.btn-primary.btn-danger {
  background-color: #c33911;
}

.btn-primary.btn-danger:hover {
  background-color: #a22e0d;
}
</style>
