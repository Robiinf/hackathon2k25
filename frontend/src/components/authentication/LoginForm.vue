<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const loading = ref(false);
const error = ref("");

function handleSubmit() {
  if (!email.value || !password.value) {
    error.value = "Veuillez remplir tous les champs.";
    return;
  }

  loading.value = true;
  error.value = "";

  // Simuler une connexion (remplacer par un appel API réel)
  setTimeout(() => {
    loading.value = false;
    console.log("Tentative de connexion:", {
      email: email.value,
      rememberMe: rememberMe.value,
    });
  }, 1500);
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">Se connecter</h1>
        <p class="auth-subtitle">
          Entrez vos identifiants pour accéder à votre compte
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="form-input"
            placeholder="exemple@email.com"
            :disabled="loading"
            required
          />
        </div>

        <div class="form-group">
          <div class="password-header">
            <label for="password" class="form-label">Mot de passe</label>
          </div>
          <input
            v-model="password"
            type="password"
            id="password"
            class="form-input"
            placeholder="••••••••"
            :disabled="loading"
            required
          />
          <a href="#" class="forgot-password">Mot de passe oublié?</a>
        </div>

        <div class="form-options">
          <label class="checkbox-container">
            <input v-model="rememberMe" type="checkbox" :disabled="loading" />
            <span class="checkbox-label">Se souvenir de moi</span>
          </label>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" class="auth-button" :disabled="loading">
          <span v-if="!loading">Se connecter</span>
          <span v-else class="button-loader">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </span>
        </button>
      </form>

      <div class="auth-footer">
        <p>
          Vous n'avez pas de compte?
          <RouterLink to="/register" class="auth-link">S'inscrire</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Import de la police Urbanist depuis Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap");

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  padding: 2rem;
  font-family: "Urbanist", sans-serif;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(105, 58, 43, 0.1);
  padding: 2.5rem;
}

.auth-header {
  margin-bottom: 2rem;
  text-align: center;
}

.auth-title {
  color: #693a2b;
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.auth-subtitle {
  color: rgba(105, 58, 43, 0.7);
  font-size: 0.95rem;
  font-weight: 400;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #693a2b;
  font-weight: 500;
  font-size: 0.95rem;
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  color: #c33911;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #a22e0d;
  text-decoration: underline;
}

.form-input {
  height: 50px;
  padding: 0 1rem;
  background-color: white;
  border: 1px solid rgba(105, 58, 43, 0.2);
  border-radius: 0.5rem;
  font-family: "Urbanist", sans-serif;
  font-size: 1rem;
  color: #693a2b;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input::placeholder {
  color: rgba(105, 58, 43, 0.4);
}

.form-input:focus {
  border-color: #c33911;
  box-shadow: 0 0 0 3px rgba(195, 57, 17, 0.1);
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-container input {
  accent-color: #c33911;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-label {
  color: #693a2b;
  font-size: 0.9rem;
}

.error-message {
  background-color: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.auth-button {
  height: 50px;
  background-color: #c33911;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-family: "Urbanist", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-button:hover:not(:disabled) {
  background-color: #a22e0d;
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-loader {
  display: flex;
  gap: 5px;
}

.dot {
  width: 5px;
  height: 5px;
  background-color: white;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
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

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  color: #693a2b;
  font-size: 0.95rem;
}

.auth-link {
  color: #c33911;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.auth-link:hover {
  color: #a22e0d;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-container {
    padding: 1rem;
  }

  .auth-card {
    padding: 2rem 1.5rem;
  }

  .auth-title {
    font-size: 1.5rem;
  }
}
</style>
