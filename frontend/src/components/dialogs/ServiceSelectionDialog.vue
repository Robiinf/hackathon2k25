<template>
  <Dialog v-model="isOpen" title="Sélectionner un service">
    <div class="service-selection-container">
      <!-- Liste des services disponibles -->
      <div class="services-list">
        <div
          v-for="service in props.services"
          :key="service._id"
          class="service-card"
          :class="{
            selected: selectedService?._id === service._id,
            'service-ai': service.type === 'services',
            'service-human': service.type === 'provider',
          }"
          @click="selectService(service)"
        >
          <div class="service-badge">
            <RobotIcon v-if="service.type === 'services'" size="16" />
            <UserIcon v-else size="16" />
          </div>

          <div class="service-info">
            <div class="service-header">
              <h4 class="service-name">{{ service.name }}</h4>
              <div class="service-rating">
                <StarIcon size="14" />
                <span>{{ service.averageNote?.toFixed(1) || "?" }}</span>
              </div>
            </div>

            <p class="service-description">{{ service.description }}</p>

            <div class="service-tags">
              <span
                v-for="tag in service.tags"
                :key="tag"
                class="service-tag"
                >{{ tag }}</span
              >
            </div>

            <div class="service-match">
              Match:
              <span class="match-percentage">{{
                service.matchPercentage
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire pour les paramètres du service sélectionné -->
      <div v-if="selectedService" class="service-params">
        <h3 class="params-title">Paramètres du service</h3>

        <form @submit.prevent="submitService" class="params-form">
          <template v-if="parsedFields.length">
            <div
              v-for="(field, index) in parsedFields"
              :key="index"
              class="form-field"
            >
              <label :for="field.name" class="field-label">{{
                formatFieldName(field.name)
              }}</label>

              <textarea
                v-if="field.type === 'textarea'"
                :id="field.name"
                v-model="formValues[field.name]"
                class="field-input textarea"
                rows="4"
                :placeholder="
                  field.placeholder ||
                  `Entrez ${formatFieldName(field.name).toLowerCase()}`
                "
                required
              ></textarea>

              <select
                v-else-if="field.type === 'select'"
                :id="field.name"
                v-model="formValues[field.name]"
                class="field-input"
                required
              >
                <option
                  v-for="option in field.options"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>

              <input
                v-else
                :id="field.name"
                v-model="formValues[field.name]"
                :type="getInputType(field.type)"
                class="field-input"
                :placeholder="
                  field.placeholder ||
                  `Entrez ${formatFieldName(field.name).toLowerCase()}`
                "
                required
              />
            </div>
          </template>
          <div v-else class="no-params">
            <p>Ce service ne nécessite pas de paramètres.</p>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="btn-secondary"
              @click="cancelSelection"
            >
              Annuler
            </button>
            <button type="submit" class="btn-primary">
              Sélectionner ce service
            </button>
          </div>
        </form>
      </div>

      <!-- Message si aucun service n'est sélectionné -->
      <div v-else class="no-selection-message">
        <InfoIcon :size="24" />
        <p>Sélectionnez un service pour configurer ses paramètres</p>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Info as InfoIcon,
  Bot as RobotIcon,
  Star as StarIcon,
  User as UserIcon,
} from "lucide-vue-next";
import { computed, defineEmits, defineProps, ref } from "vue";
import { useDialog } from "../../composables/useDialog";
import Dialog from "../Dialog.vue";

interface Service {
  _id: string;
  name: string;
  description: string;
  type: "services" | "provider";
  tags: string[];
  averageNote?: number;
  matchPercentage: string;
  inputJSON: Record<string, string> | Array<any>;
}

interface ServiceWithParams {
  service: Service;
  params: Record<string, any>;
}

const props = defineProps<{
  services: Service[];
}>();

const emit = defineEmits<{
  select: [serviceWithParams: ServiceWithParams];
}>();

const { isOpen, open, close } = useDialog();
const selectedService = ref<Service | null>(null);
const formValues = ref<Record<string, any>>({});

// Champs analysés à partir du service
const parsedFields = computed(() => {
  return selectedService.value
    ? parseInputJSON(selectedService.value.inputJSON)
    : [];
});

function openDialog() {
  open();
  selectedService.value = null;
  formValues.value = {};
}

function selectService(service: Service) {
  selectedService.value = service;
  formValues.value = {};

  parseInputJSON(service.inputJSON).forEach((field) => {
    formValues.value[field.name] = "";
  });
}

function formatFieldName(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

function getInputType(fieldType: string): string {
  switch (fieldType) {
    case "number":
      return "number";
    case "boolean":
      return "checkbox";
    case "date":
      return "date";
    default:
      return "text";
  }
}

function submitService() {
  if (!selectedService.value) return;
  emit("select", {
    service: selectedService.value,
    params: { ...formValues.value },
  });
  close();
}

function cancelSelection() {
  selectedService.value = null;
  formValues.value = {};
}

function parseInputJSON(
  inputJSON: any
): Array<{ name: string; type: string; placeholder?: string }> {
  if (!inputJSON) return [];

  if (Array.isArray(inputJSON)) {
    return inputJSON.map((item) => ({
      name: item.label || "",
      type: item.type || "string",
      placeholder: item.placeholder || "",
      options: item?.options || [],
    }));
  }

  if (typeof inputJSON === "object") {
    return Object.entries(inputJSON).map(([key, value]) => ({
      name: key,
      type: typeof value === "string" ? value : "string",
      placeholder: "",
      options: Array.isArray(value) ? value : [],
    }));
  }

  return [];
}

// Exposer la méthode pour ouvrir le dialogue depuis l'extérieur
defineExpose({ openDialog });
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap");

.no-params {
  color: rgba(105, 58, 43, 0.7);
  font-style: italic;
  text-align: center;
  padding: 1rem 0;
}

.service-selection-container {
  display: flex;
  gap: 2rem;
  font-family: "Urbanist", sans-serif;
}

.services-list {
  flex: 1;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.service-card {
  padding: 1rem;
  border: 2px solid #e3e3e3;
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background-color: white;
}

.service-card:hover {
  border-color: #c33911;
  box-shadow: 0 4px 12px rgba(195, 57, 17, 0.1);
}

.service-card.selected {
  border-color: #c33911;
  background-color: rgba(195, 57, 17, 0.05);
}

.service-ai .service-badge {
  background-color: #4caf50;
}

.service-human .service-badge {
  background-color: #2196f3;
}

.service-badge {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.service-info {
  flex: 1;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.service-name {
  font-size: 1rem;
  font-weight: 600;
  color: #693a2b;
  margin: 0;
}

.service-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #c33911;
  font-weight: 600;
}

.service-description {
  font-size: 0.9rem;
  color: rgba(105, 58, 43, 0.8);
  margin: 0 0 0.75rem 0;
}

.service-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

.service-tag {
  background-color: rgba(195, 57, 17, 0.1);
  color: #c33911;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.service-match {
  font-size: 0.85rem;
  color: rgba(105, 58, 43, 0.7);
}

.match-percentage {
  font-weight: 600;
  color: #4caf50;
}

.service-params {
  flex: 1;
  padding-left: 1rem;
  border-left: 1px solid rgba(105, 58, 43, 0.1);
}

.params-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #693a2b;
  margin: 0 0 1.25rem 0;
}

.params-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 500;
  font-size: 0.95rem;
  color: #693a2b;
}

.field-input {
  padding: 0.75rem;
  border: 1px solid rgba(105, 58, 43, 0.2);
  border-radius: 6px;
  font-family: "Urbanist", sans-serif;
  transition: border-color 0.2s;
}

.field-input:focus {
  outline: none;
  border-color: #c33911;
}

.field-input.textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-secondary {
  padding: 0.5rem 1.25rem;
  background-color: transparent;
  color: #693a2b;
  border: 1px solid rgba(105, 58, 43, 0.2);
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: "Urbanist", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: rgba(105, 58, 43, 0.05);
  border-color: #c33911;
}

.btn-primary {
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
}

.btn-primary:hover {
  background-color: #a22e0d;
}

.no-selection-message {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(105, 58, 43, 0.6);
  border-left: 1px solid rgba(105, 58, 43, 0.1);
  padding: 2rem;
  gap: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .service-selection-container {
    flex-direction: column;
  }

  .service-params {
    border-left: none;
    border-top: 1px solid rgba(105, 58, 43, 0.1);
    padding-left: 0;
    padding-top: 1.5rem;
    margin-top: 1rem;
  }

  .no-selection-message {
    border-left: none;
    padding: 1.5rem 0;
  }
}
</style>
