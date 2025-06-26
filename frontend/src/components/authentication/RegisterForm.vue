<script setup lang="ts">
import { ref } from "vue";

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const termsAccepted = ref(false);
const loading = ref(false);
const error = ref("");

function handleSubmit() {
  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    error.value = "Veuillez remplir tous les champs.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Les mots de passe ne correspondent pas.";
    return;
  }

  if (!termsAccepted.value) {
    error.value = "Vous devez accepter les conditions générales.";
    return;
  }

  loading.value = true;
  error.value = "";

  setTimeout(() => {
    loading.value = false;
    console.log("Inscription:", {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
    });
  }, 1500);
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">Créer un compte</h1>
        <p class="auth-subtitle">
          Rejoignez Talia pour trouver les meilleurs talents
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName" class="form-label">Prénom</label>
            <input
              v-model="firstName"
              type="text"
              id="firstName"
              class="form-input"
              placeholder="Jean"
              :disabled="loading"
              required
            />
          </div>

          <div class="form-group">
            <label for="lastName" class="form-label">Nom</label>
            <input
              v-model="lastName"
              type="text"
              id="lastName"
              class="form-input"
              placeholder="Dupont"
              :disabled="loading"
              required
            />
          </div>
        </div>

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
          <label for="password" class="form-label">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="form-input"
            placeholder="••••••••"
            :disabled="loading"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label"
            >Confirmez le mot de passe</label
          >
          <input
            v-model="confirmPassword"
            type="password"
            id="confirmPassword"
            class="form-input"
            placeholder="••••••••"
            :disabled="loading"
            required
          />
        </div>

        <div class="form-options">
          <label class="checkbox-container">
            <input
              v-model="termsAccepted"
              type="checkbox"
              :disabled="loading"
              required
            />
            <span class="checkbox-label">
              J'accepte les
              <a href="#" class="auth-link">conditions générales</a> et la
              <a href="#" class="auth-link">politique de confidentialité</a>
            </span>
          </label>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" class="auth-button" :disabled="loading">
          <span v-if="!loading">Créer mon compte</span>
          <span v-else class="button-loader">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </span>
        </button>
      </form>

      <div class="auth-footer">
        <p>
          Vous avez déjà un compte ?
          <RouterLink to="/login" class="auth-link">Se connecter</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap");

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  font-family: "Urbanist", sans-serif;
}

.auth-card {
  width: 100%;
  max-width: 600px;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 6px 32px rgba(105, 58, 43, 0.15);
  padding: 3rem 2.5rem;
  transition: all 0.3s ease;
}

.auth-header {
  margin-bottom: 2rem;
  text-align: center;
}

.auth-title {
  color: #693a2b;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: rgba(105, 58, 43, 0.7);
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.form-label {
  color: #693a2b;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-input {
  height: 50px;
  padding: 0 1rem;
  background-color: white;
  border: 1px solid rgba(105, 58, 43, 0.2);
  border-radius: 0.5rem;
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
  align-items: flex-start;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-container input {
  accent-color: #c33911;
  width: 16px;
  height: 16px;
  margin-top: 3px;
  cursor: pointer;
}

.checkbox-label {
  color: #693a2b;
  font-size: 0.9rem;
  line-height: 1.4;
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

  .form-row {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>
