<template>
  <!-- Header -->
  <Header />

  <!-- Body -->
  <main class="main-container">
    <div class="hero">
      <h1>{{ title }}</h1>
      <slot></slot>
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <p>&copy; 2023 Talia. Tous droits réservés.</p>
  </footer>
</template>

<script lang="ts" setup>
import Header from "../header/Header.vue";

// Props pour personnaliser le layout
defineProps({
  title: {
    type: String,
    default: "Les Bons Talents, Pour Les Bons Projets",
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap");

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 130px);
  font-family: "Urbanist", sans-serif;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4rem 2rem;
  background-color: var(--color-primary, #c33911);
  color: white;
  text-align: center;
}

.hero h1 {
  font-family: "Urbanist", sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  max-width: 800px;
  line-height: 1.2;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: var(--color-bg-light, #fff3ec);
  border-top: 1px solid rgba(105, 58, 43, 0.1);
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-dark, #693a2b);
  height: 50px;
  font-family: "Urbanist", sans-serif;
}

@media (max-width: 768px) {
  .hero {
    padding: 3rem 1.5rem;
  }

  .hero h1 {
    font-size: 1.8rem;
  }
}
</style>
