<template>
  <GlobalLayout title="Générateur de workflow">
    <div class="generator-page">
      <div class="content-container">
        <div class="header-section">
          <p class="subtitle">
            Décrivez votre projet et notre IA créera un workflow personnalisé
            pour vous aider à le réaliser.
          </p>
        </div>

        <ChatUI ref="chatInput" class="chat-ui-component" />

        <div class="chat-container">
          <div class="examples-section">
            <div class="examples-grid">
              <div
                v-for="(example, index) in examples"
                :key="index"
                class="example-card"
                @click="setPrompt(example.text)"
              >
                <div class="example-icon">
                  <component :is="example.icon" size="20" />
                </div>
                <div class="example-content">
                  <h3 class="example-title">{{ example.title }}</h3>
                  <p class="example-text">{{ example.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </GlobalLayout>
</template>

<script setup lang="ts">
import {
  AlertCircle,
  Code,
  FileSpreadsheet,
  Globe,
  PenTool,
  Smartphone,
} from "lucide-vue-next";
import { ref } from "vue";
import ChatUI from "../../components/ChatUI.vue";
import GlobalLayout from "../../components/layouts/GlobalLayout.vue";

const chatInput = ref<InstanceType<typeof ChatUI> | null>(null);

// Exemples de prompts pour inspirer l'utilisateur
const examples = [
  {
    title: "Application mobile",
    text: "Je voudrais créer une application mobile pour suivre mes entraînements sportifs avec un système de gestion d'objectifs",
    icon: Smartphone,
  },
  {
    title: "Site web e-commerce",
    text: "Je dois construire un site e-commerce pour vendre des produits artisanaux avec paiement en ligne",
    icon: Globe,
  },
  {
    title: "API REST",
    text: "Je souhaite développer une API REST pour gérer un système de réservation de salles de réunion",
    icon: Code,
  },
  {
    title: "Traitement de données",
    text: "J'ai besoin d'analyser des données de vente pour identifier des tendances et générer des rapports automatiques",
    icon: FileSpreadsheet,
  },
  {
    title: "Refonte graphique",
    text: "Mon entreprise a besoin d'une refonte complète de son identité visuelle, logo et charte graphique",
    icon: PenTool,
  },
  {
    title: "Résolution de bug",
    text: "Mon application crash quand les utilisateurs essaient d'uploader des fichiers de plus de 10Mo",
    icon: AlertCircle,
  },
];

// Fonction pour définir un prompt depuis les exemples
function setPrompt(text: string) {
  if (chatInput.value) {
    // Accéder à l'input via une méthode exposée ou autre mécanisme
    // Cette partie nécessiterait d'exposer une méthode dans le composant ChatUI
    // Pour l'instant, simulons l'événement
    const event = new CustomEvent("set-prompt", { detail: text });
    window.dispatchEvent(event);

    // Faire défiler jusqu'au chat
    chatInput.value.$el.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<style scoped>
.generator-page {
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
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
  max-width: 800px;
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
  color: fff3eb;
  margin: 0 auto;
  max-width: 700px;
  animation: fadeInUp 0.8s 0.2s ease forwards;
  opacity: 0;
}

.chat-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 1s 0.4s ease forwards;
  opacity: 0;
}

.examples-section {
  width: 100%;
  margin-bottom: 2.5rem;
}

.examples-title {
  font-family: "Urbanist", sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: #693a2b;
  margin: 0 0 1rem;
  text-align: center;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  width: 100%;
}

.example-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 2px 10px rgba(105, 58, 43, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border: 1px solid rgba(105, 58, 43, 0.05);
}

.example-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(105, 58, 43, 0.1);
  border-color: rgba(195, 57, 17, 0.3);
}

.example-icon {
  color: #c33911;
  padding: 0.5rem;
  background-color: rgba(195, 57, 17, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.example-content {
  flex-grow: 1;
}

.example-title {
  margin: 0 0 0.5rem;
  font-family: "Urbanist", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #693a2b;
}

.example-text {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(105, 58, 43, 0.7);
  line-height: 1.4;
}

.chat-ui-component {
  width: 100%;
  margin-bottom: 2rem;
}

.features-section {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Urbanist", sans-serif;
  color: rgba(105, 58, 43, 0.7);
  font-size: 0.95rem;
}

.feature-icon {
  color: #c33911;
}

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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }

  .features-section {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
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
