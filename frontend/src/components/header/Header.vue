<template>
  <header class="header">
    <div class="header-container">
      <div class="logo">
        <h1>Talia</h1>
      </div>
      <nav class="navigation">
        <ul class="nav-list">
          <li v-for="item in links" :key="item.path" class="nav-item">
            <RouterLink
              :to="item.path"
              class="nav-link"
              active-class="active-link"
              exact-active-class="active-link"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>
      <div class="actions">
        <RouterLink to="/login" class="btn-secondary">Se connecter</RouterLink>
        <RouterLink to="/register" class="btn-primary">S'inscrire</RouterLink>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
const links = [
  { path: "/", label: "Accueil" },
  { path: "/generateur", label: "Générateur" },
  { path: "/exemples", label: "Exemples" },
  { path: "/a-propos", label: "À propos" },
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap");

.header {
  width: 100%;
  background-color: #fff3ec;
  border-bottom: 1px solid rgba(105, 58, 43, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
  font-family: "Urbanist", sans-serif;
  box-shadow: 0 1px 3px rgba(105, 58, 43, 0.1);
  backdrop-filter: blur(8px);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo h1 {
  font-size: 1.6rem;
  font-weight: 600;
  color: #693a2b;
  margin: 0;
  letter-spacing: -0.02em;
}

.navigation {
  flex-grow: 1;
  padding: 0 3rem;
}

.nav-list {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
  gap: 2rem;
  justify-content: center;
}

.nav-item {
  position: relative;
}

.nav-link {
  text-decoration: none;
  color: #693a2b;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #c33911;
  cursor: pointer;
}

.nav-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #c33911;
  transition: width 0.2s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
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
  text-decoration: none;
}

.btn-primary:hover {
  color: #c33911;
  background-color: transparent;
  border-color: #c33911;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .navigation {
    padding: 0.5rem 0;
    width: 100%;
  }

  .nav-list {
    gap: 1rem;
  }

  .actions {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .nav-list {
    overflow-x: auto;
    padding-bottom: 0.5rem;
    justify-content: flex-start;
  }

  .nav-item {
    flex: 0 0 auto;
  }
}
</style>
