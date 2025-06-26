<template>
  <div class="landing-page" :class="{ 'is-loaded': isLoaded }">
    <Header />

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content animate-element">
        <h1 class="title">
          <span class="highlight">Simplifiez</span> vos projets avec des
          workflows intelligents
        </h1>
        <p class="subtitle animate-delay-1">
          Automatisez la création de workflows personnalisés grâce à
          l'intelligence artificielle et optimisez votre productivité.
        </p>
        <div class="cta-buttons animate-delay-2">
          <router-link to="/workflow-generator" class="btn btn-primary">
            <Zap :size="18" class="btn-icon" />
            Commencer gratuitement
          </router-link>
          <a href="#features" class="btn btn-secondary">
            <Info :size="18" class="btn-icon" />
            En savoir plus
          </a>
        </div>
        <div class="stats animate-delay-3">
          <div class="stat-item">
            <span class="stat-number count-up">5K+</span>
            <span class="stat-label">Utilisateurs</span>
          </div>
          <div class="stat-item">
            <span class="stat-number count-up">25K+</span>
            <span class="stat-label">Workflows créés</span>
          </div>
          <div class="stat-item">
            <span class="stat-number count-up">4.9</span>
            <span class="stat-label">Note moyenne</span>
          </div>
        </div>
      </div>
      <div class="hero-image animate-element animate-delay-2"></div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features animate-section">
      <div class="section-header">
        <h2 class="section-title">
          Fonctionnalités <span class="highlight">clés</span>
        </h2>
        <p class="section-description">
          Découvrez comment notre plateforme transforme la gestion de vos
          projets.
        </p>
      </div>

      <div class="features-grid">
        <div
          class="feature-card animate-card"
          v-for="(feature, index) in features"
          :key="index"
          :style="{ '--delay': `${0.1 * index}s` }"
        >
          <div class="feature-icon">
            <component :is="feature.icon" :size="28" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works animate-section">
      <div class="section-header">
        <h2 class="section-title">
          Comment ça <span class="highlight">fonctionne</span>
        </h2>
        <p class="section-description">
          Un processus simple en trois étapes pour créer vos workflows.
        </p>
      </div>

      <div class="steps">
        <div
          class="step animate-step"
          v-for="(step, index) in steps"
          :key="index"
          :style="{ '--delay': `${0.2 * index}s` }"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-content">
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section class="demo animate-section">
      <div class="demo-container">
        <div class="demo-content">
          <h2 class="demo-title">
            Essayez notre <span class="highlight">générateur</span>
          </h2>
          <p class="demo-description">
            Entrez une description de votre projet et laissez notre IA créer un
            workflow pour vous.
          </p>

          <div class="generator-page animate-fade-in">
            <div class="content-container">
              <ChatUI ref="chatInput" class="chat-ui-component" />

              <div class="chat-container">
                <div class="examples-section">
                  <div class="examples-grid">
                    <div
                      v-for="(example, index) in examples"
                      :key="index"
                      class="example-card animate-example"
                      :style="{ '--delay': `${0.1 * index}s` }"
                      @click="setPrompt(example.text)"
                    >
                      <div class="example-icon">
                        <component :is="example.icon" :size="20" />
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
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials animate-section">
      <div class="section-header">
        <h2 class="section-title">
          Ce que nos <span class="highlight">utilisateurs</span> disent
        </h2>
        <p class="section-description">
          Des milliers d'utilisateurs font confiance à notre solution pour leurs
          projets.
        </p>
      </div>

      <div class="testimonials-carousel">
        <div
          class="testimonial animate-testimonial"
          v-for="(testimonial, index) in testimonials"
          :key="index"
          :style="{ '--delay': `${0.15 * index}s` }"
        >
          <div class="testimonial-content">
            <div class="testimonial-stars">
              <Star
                v-for="n in 5"
                :key="n"
                :size="16"
                :fill="n <= testimonial.rating ? '#c33911' : 'none'"
                :color="n <= testimonial.rating ? '#c33911' : '#ddd'"
              />
            </div>
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
          </div>
          <div class="testimonial-author">
            <div class="testimonial-avatar">
              {{ testimonial.name.charAt(0) }}
            </div>
            <div class="testimonial-info">
              <div class="testimonial-name">{{ testimonial.name }}</div>
              <div class="testimonial-role">{{ testimonial.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section animate-section">
      <div class="cta-container">
        <h2 class="cta-title">
          Prêt à optimiser votre <span class="highlight">productivité</span> ?
        </h2>
        <p class="cta-description">
          Rejoignez des milliers d'utilisateurs qui créent déjà des workflows
          intelligents avec notre plateforme.
        </p>
        <div class="cta-buttons animate-buttons">
          <router-link to="/register" class="btn btn-outlined">
            Créer un compte
          </router-link>
          <router-link to="/workflow-generator" class="btn btn-outlined">
            Essayer gratuitement
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <p class="footer-tagline">Simplifiez vos projets avec l'IA</p>
        </div>

        <div class="footer-links">
          <div class="footer-links-column">
            <h4 class="footer-links-title">Produit</h4>
            <router-link to="/workflow-generator">Générateur</router-link>
            <router-link to="/workflows">Mes workflows</router-link>
            <router-link to="/about">À propos</router-link>
          </div>

          <div class="footer-links-column">
            <h4 class="footer-links-title">Ressources</h4>
            <a href="#">Documentation</a>
            <a href="#">Tutoriels</a>
            <a href="#">Blog</a>
          </div>

          <div class="footer-links-column">
            <h4 class="footer-links-title">Légal</h4>
            <a href="#">Mentions légales</a>
            <a href="#">Politique de confidentialité</a>
            <a href="#">Conditions d'utilisation</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          © {{ new Date().getFullYear() }} Talia Workflow Generator. Tous droits
          réservés.
        </p>
        <div class="social-icons">
          <a href="#" class="social-icon"><Twitter :size="18" /></a>
          <a
            href="https://github.com/Robiinf/hackathon2k25"
            class="social-icon"
            target="_blank"
            ><Github :size="18"
          /></a>
          <a href="#" class="social-icon"><Linkedin :size="18" /></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {
  AlertCircle,
  Bot,
  Clock,
  Code,
  FileSpreadsheet,
  Github,
  Globe,
  Info,
  LayoutGrid,
  Linkedin,
  PenTool,
  Puzzle,
  Smartphone,
  Star,
  Twitter,
  Users,
  Zap,
} from "lucide-vue-next";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import ChatUI from "../components/ChatUI.vue";
import Header from "../components/header/Header.vue";

const isLoaded = ref(false);
const observer = ref<IntersectionObserver | null>(null);
const chatInput = ref<InstanceType<typeof ChatUI> | null>(null);

function setPrompt(text: string) {
  if (chatInput.value) {
    chatInput.value.setPrompt(text);
  }
}

function setupIntersectionObserver() {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.value?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -100px 0px" }
  );

  const sections = document.querySelectorAll(".animate-section");
  sections.forEach((section) => {
    observer.value?.observe(section);
  });

  const cards = document.querySelectorAll(".animate-card");
  cards.forEach((card) => {
    observer.value?.observe(card);
  });

  const steps = document.querySelectorAll(".animate-step");
  steps.forEach((step) => {
    observer.value?.observe(step);
  });

  const testimonials = document.querySelectorAll(".animate-testimonial");
  testimonials.forEach((testimonial) => {
    observer.value?.observe(testimonial);
  });

  const examples = document.querySelectorAll(".animate-example");
  examples.forEach((example) => {
    observer.value?.observe(example);
  });
}

onMounted(async () => {
  await nextTick();

  setTimeout(() => {
    isLoaded.value = true;
  }, 100);

  setupIntersectionObserver();

  const countElements = document.querySelectorAll(".count-up");
  countElements.forEach((el) => {
    const text = el.textContent || "";
    if (text.includes("K")) {
      const num = parseFloat(text);
      animateCount(el as HTMLElement, 0, num, 2000, true);
    } else {
      const num = parseFloat(text);
      animateCount(el as HTMLElement, 0, num, 2000);
    }
  });
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});

function animateCount(
  el: HTMLElement,
  start: number,
  end: number,
  duration: number,
  hasK: boolean = false
) {
  let startTime: number | null = null;
  const suffix = hasK ? "K+" : "";

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const value = start + (end - start) * easeOutQuad(progress);

    el.textContent = hasK
      ? `${value.toFixed(1)}${suffix}`
      : `${value.toFixed(1)}`;

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

function easeOutQuad(x: number): number {
  return 1 - (1 - x) * (1 - x);
}

const features = [
  {
    icon: Zap,
    title: "Génération IA",
    description:
      "Créez des workflows complexes en quelques secondes grâce à notre système de génération par IA.",
  },
  {
    icon: LayoutGrid,
    title: "Interface intuitive",
    description:
      "Interface visuelle simple et intuitive pour organiser et modifier vos workflows.",
  },
  {
    icon: Puzzle,
    title: "Modules personnalisables",
    description:
      "Personnalisez chaque étape de votre workflow avec des paramètres spécifiques.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "Partagez vos workflows avec votre équipe pour améliorer la collaboration.",
  },
  {
    icon: Clock,
    title: "Gain de temps",
    description:
      "Économisez des heures de planification en automatisant la création de vos workflows.",
  },
  {
    icon: Bot,
    title: "Services IA intégrés",
    description:
      "Accédez à une bibliothèque de services IA pour enrichir vos workflows.",
  },
];

const steps = [
  {
    title: "Décrivez votre projet",
    description:
      "Saisissez simplement une description de votre projet dans notre interface de chat.",
  },
  {
    title: "L'IA génère votre workflow",
    description:
      "Notre intelligence artificielle analyse votre description et crée un workflow adapté à vos besoins.",
  },
  {
    title: "Personnalisez et sauvegardez",
    description:
      "Ajustez les étapes générées selon vos besoins spécifiques et sauvegardez votre workflow.",
  },
];

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

const testimonials = [
  {
    text: "Cette plateforme a révolutionné notre façon de planifier nos projets. L'IA génère des workflows pertinents en quelques secondes!",
    name: "Sophie Martin",
    role: "Chef de projet",
    rating: 5,
  },
  {
    text: "Incroyablement intuitif et efficace. J'ai gagné un temps précieux dans la planification de mes développements web.",
    name: "Thomas Dubois",
    role: "Développeur Full Stack",
    rating: 5,
  },
  {
    text: "Un outil essentiel pour notre startup. Nous avons optimisé nos processus de travail et amélioré notre productivité.",
    name: "Léa Garcia",
    role: "CEO & Fondatrice",
    rating: 4,
  },
];
</script>

<style scoped>
:root {
  --color-primary: #c33911;
  --color-primary-light: #e85a2f;
  --color-primary-dark: #a6320f;
  --color-secondary: #693a2b;
  --color-secondary-light: #8f5c4a;
  --color-secondary-dark: #4a2a1f;
  --color-white: #ffffff;
  --color-light: #fff3eb;
  --color-gray: #f5f5f5;
  --color-text: #333333;
  --color-text-light: #666666;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --transition: all 0.3s ease;
  --font-family: "Urbanist", sans-serif;
}

.landing-page {
  font-family: var(--font-family);
  color: var(--color-text);
  line-height: 1.6;
  overflow-x: hidden;
  background-color: white;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.landing-page.is-loaded {
  opacity: 1;
}

.highlight {
  color: var(--color-primary);
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: "";
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 0.2rem;
  background-color: rgba(195, 57, 17, 0.2);
  border-radius: 0.2rem;
  z-index: -1;
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
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.btn-primary::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.btn-primary:hover::after {
  transform: translateX(0);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(195, 57, 17, 0.2);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  cursor: pointer;
  text-decoration: none;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn:hover .btn-icon {
  transform: translateX(2px) scale(1.1);
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
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.btn-secondary::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(105, 58, 43, 0.05);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.btn-secondary:hover::after {
  transform: translateX(0);
}

.btn-secondary:hover {
  border-color: #c33911;
  transform: translateY(-3px);
}

.btn-outlined {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.btn-outlined:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.section-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.section-description {
  font-size: 1.2rem;
  color: var(--color-text-light);
  max-width: 700px;
  margin: 0 auto;
}

.hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  padding: 10rem 8rem;
  background: radial-gradient(
      circle at top right,
      rgba(195, 57, 17, 0.05),
      transparent 80%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(105, 58, 43, 0.03),
      transparent 70%
    );
  position: relative;
  overflow: hidden;
}

.animate-element {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s forwards ease-out;
}

.animate-delay-1 {
  animation-delay: 0.2s;
}

.animate-delay-2 {
  animation-delay: 0.4s;
}

.animate-delay-3 {
  animation-delay: 0.6s;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: var(--color-secondary);
  position: relative;
}

.title::after {
  content: "";
  position: absolute;
  top: -20px;
  left: -10px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #c33911 0%, rgba(195, 57, 17, 0) 70%);
  border-radius: 50%;
  opacity: 0.3;
  animation: pulse 4s infinite ease-in-out;
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: var(--color-text-light);
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s forwards ease-out;
  animation-delay: 0.2s;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 3rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s forwards ease-out;
  animation-delay: 0.4s;
}

.stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s forwards ease-out;
  animation-delay: 0.6s;
}

.stat-item {
  display: flex;
  flex-direction: column;
  position: relative;
}

.stat-item::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: rgba(195, 57, 17, 0.3);
  transition: width 0.8s ease;
}

.stat-item:hover::after {
  width: 100%;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 1s ease 0.5s forwards;
  opacity: 0;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.features {
  padding: 6rem 2rem;
  background-color: #fff3eb;
  position: relative;
  overflow: hidden;
}

.features::before {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(195, 57, 17, 0.1) 0%,
    transparent 70%
  );
  top: -150px;
  right: -100px;
}

.animate-section {
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.animate-section.in-view {
  opacity: 1;
  transform: translateY(0);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.animate-card {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease;
  transition-delay: var(--delay);
}

.animate-card.in-view {
  opacity: 1;
  transform: translateY(0);
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px) !important;
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  color: var(--color-primary);
  background-color: rgba(195, 57, 17, 0.1);
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
  background-color: rgba(195, 57, 17, 0.15);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-secondary);
  position: relative;
}

.feature-title::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.feature-card:hover .feature-title::after {
  width: 50px;
}

.feature-description {
  color: var(--color-text-light);
  margin: 0;
}

.how-it-works {
  padding: 6rem 2rem;
  background: linear-gradient(to bottom, white, var(--color-light));
  position: relative;
}

.how-it-works::after {
  content: "";
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(105, 58, 43, 0.1) 0%,
    transparent 70%
  );
  bottom: -100px;
  left: -100px;
}

.steps {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.steps::before {
  content: "";
  position: absolute;
  top: 40px;
  left: 40px;
  height: calc(100% - 80px);
  width: 2px;
  background-color: rgba(195, 57, 17, 0.2);
}

.animate-step {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: var(--delay);
}

.animate-step.in-view {
  opacity: 1;
  transform: translateX(0);
}

.step {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  position: relative;
}

.step:last-child {
  margin-bottom: 0;
}

.step-number {
  width: 80px;
  height: 80px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  flex-shrink: 0;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(195, 57, 17, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.step:hover .step-number {
  transform: scale(1.1) rotate(-5deg);
  box-shadow: 0 8px 20px rgba(195, 57, 17, 0.4);
}

.step-content {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  flex: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.step:hover .step-content {
  transform: translateX(5px);
  box-shadow: var(--shadow-lg);
}

.step-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-secondary);
}

.step-description {
  color: var(--color-text-light);
  margin: 0;
}

.demo {
  padding: 4rem 2rem;
  background-color: var(--color-primary);
  color: white;
  position: relative;
  overflow: hidden;
}

.demo::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
}

.demo-container {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.demo-content {
  text-align: center;
  margin-bottom: 3rem;
}

.demo-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.demo-description {
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 3rem;
  color: rgba(255, 255, 255, 0.9);
}

.demo .highlight {
  color: white;
}

.demo .highlight::after {
  background-color: rgba(255, 255, 255, 0.3);
}

.animate-fade-in {
  opacity: 0;
  transition: opacity 0.8s ease;
}

.animate-section.in-view .animate-fade-in {
  opacity: 1;
}

.generator-page {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  padding: 2rem;
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

.chat-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.examples-section {
  width: 100%;
  margin-top: 2rem;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  width: 100%;
}

.animate-example {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: var(--delay);
}

.animate-section.in-view .animate-example {
  opacity: 1;
  transform: translateY(0);
}

.example-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 2px 10px rgba(105, 58, 43, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border: 1px solid rgba(105, 58, 43, 0.05);
}

.example-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(105, 58, 43, 0.1);
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
  transition: transform 0.3s ease;
}

.example-card:hover .example-icon {
  transform: scale(1.1);
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
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.testimonials {
  padding: 9rem 2rem;
  background-color: #fff3eb;
  position: relative;
  overflow: hidden;
}

.testimonials::before {
  content: "";
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(195, 57, 17, 0.05) 0%,
    transparent 70%
  );
  bottom: -200px;
  right: -200px;
}

.testimonials::after {
  content: "";
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(195, 57, 17, 0.05) 0%,
    transparent 70%
  );
  top: -100px;
  left: -100px;
}

.testimonials-carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  overflow-x: auto;
  padding: 1rem 0 2rem;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.testimonials-carousel::-webkit-scrollbar {
  display: none;
}

.animate-testimonial {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: var(--delay);
}

.animate-testimonial.in-view {
  opacity: 1;
  transform: translateY(0);
}

.testimonial {
  flex: 0 0 350px;
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  scroll-snap-align: start;
  transition: var(--transition);
  position: relative;
}

.testimonial::before {
  content: '"';
  position: absolute;
  top: -15px;
  left: 20px;
  font-size: 80px;
  color: rgba(195, 57, 17, 0.1);
  font-family: Georgia, serif;
}

.testimonial:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-lg);
}

.testimonial-content {
  margin-bottom: 1.5rem;
}

.testimonial-stars {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.testimonial-text {
  font-style: italic;
  margin: 0;
  color: var(--color-text);
  position: relative;
  z-index: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.testimonial-avatar {
  width: 40px;
  height: 40px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  box-shadow: 0 3px 6px rgba(195, 57, 17, 0.2);
}

.testimonial-name {
  font-weight: 600;
  color: var(--color-secondary);
}

.testimonial-role {
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.cta-section {
  padding: 6rem 2rem;
  background: linear-gradient(
    45deg,
    var(--color-primary-light),
    var(--color-primary)
  );
  background-color: var(--color-primary);
  color: white;
  text-align: center;
  position: relative;
}

.cta-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.cta-title .highlight {
  color: white;
  position: relative;
}

.cta-title .highlight::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.cta-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
}

.animate-buttons {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: 0.3s;
}

.animate-section.in-view .animate-buttons {
  opacity: 1;
  transform: translateY(0);
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.footer {
  background-color: #fff3eb;
  color: var(--color-primary);
  padding: 4rem 2rem 2rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(105, 58, 43, 0.1);
}

.footer-logo {
  max-width: 300px;
}

.logo {
  height: 40px;
  margin-bottom: 1rem;
}

.footer-tagline {
  margin: 0;
  color: var(--color-primary);
}

.footer-links {
  display: flex;
  gap: 3rem;
}

.footer-links-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-links-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: var(--color-secondary);
}

.footer-links a {
  color: var(--color-primary-dark);
  text-decoration: none;
  transition: var(--transition);
  position: relative;
}

.footer-links a::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 1px;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.footer-links a:hover::after {
  width: 100%;
}

.footer-links a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 2rem auto 0;
}

.copyright {
  margin: 0;
  color: var(--color-primary-dark);
  font-size: 0.9rem;
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-primary);
  transition: var(--transition);
  border-radius: 50%;
  background-color: rgba(195, 57, 17, 0.1);
}

.social-icon:hover {
  transform: translateY(-3px);
  background-color: var(--color-primary);
  color: white;
  box-shadow: 0 5px 15px rgba(195, 57, 17, 0.3);
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

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}

@media (max-width: 992px) {
  .hero {
    flex-direction: column;
    padding: 4rem 2rem;
    gap: 2rem;
  }

  .hero-content {
    text-align: center;
    max-width: 100%;
  }

  .title {
    font-size: 3rem;
  }

  .cta-buttons,
  .stats {
    justify-content: center;
  }

  .footer-content {
    flex-direction: column;
    gap: 3rem;
  }

  .footer-logo {
    text-align: center;
    max-width: 100%;
  }

  .footer-links {
    justify-content: space-around;
    width: 100%;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .features {
    padding: 4rem 1.5rem;
  }

  .how-it-works,
  .demo,
  .testimonials,
  .cta-section {
    padding: 4rem 1.5rem;
  }

  .steps::before {
    left: 32px;
  }

  .step-number {
    width: 64px;
    height: 64px;
    font-size: 1.5rem;
  }

  .step-content {
    padding: 1.5rem;
  }

  .testimonial {
    flex: 0 0 300px;
  }

  .footer-links {
    flex-direction: column;
    gap: 2rem;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .cta-buttons {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .stats {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .step {
    gap: 1rem;
  }

  .step-number {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .steps::before {
    left: 25px;
  }

  .testimonial {
    flex: 0 0 100%;
  }
}

@media (max-width: 1200px) {
  .hero {
    padding: 6rem 4rem;
  }

  .title {
    font-size: 3rem;
  }

  .section-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 992px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 5rem 2rem;
  }

  .hero-content,
  .hero-image {
    max-width: 100%;
  }

  .hero-image {
    margin-top: 2rem;
  }

  .cta-buttons {
    justify-content: center;
  }

  .stats {
    flex-direction: column;
    align-items: center;
  }

  .features {
    padding: 4rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-description {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .btn,
  .btn-primary,
  .btn-secondary {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats {
    gap: 1rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .section-header {
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.8rem;
  }

  .hero {
    padding: 3rem 1rem;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
