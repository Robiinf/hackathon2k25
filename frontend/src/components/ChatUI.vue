<script setup lang="ts">
import { onMounted, ref } from "vue";

const input = ref("");
const loading = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

function handleSubmit() {
  const trimmed = input.value.trim();
  if (!trimmed) return;

  loading.value = true;

  setTimeout(() => {
    console.log("Recherche envoyée :", trimmed);
    input.value = "";
    loading.value = false;

    // Réinitialiser la hauteur après l'envoi
    if (textareaRef.value) {
      textareaRef.value.style.height = "auto";
    }
  }, 2000);
}

function adjustHeight(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSubmit();
  }
}

onMounted(() => {
  if (textareaRef.value) {
    adjustHeight({ target: textareaRef.value } as Event);
  }
});
</script>

<template>
  <div class="chat-input-container">
    <form @submit.prevent="handleSubmit" class="chat-form">
      <textarea
        ref="textareaRef"
        v-model="input"
        class="chat-textarea"
        :class="{ 'chat-textarea-disabled': loading }"
        placeholder="Décrivez votre besoin..."
        :disabled="loading"
        @input="adjustHeight"
        @keydown="handleKeydown"
        rows="1"
      ></textarea>

      <button
        type="submit"
        class="send-btn"
        :class="{ 'send-btn-active': input.trim() && !loading }"
        :disabled="loading || !input.trim()"
        aria-label="Envoyer"
      >
        <svg
          v-if="!loading"
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M2.94 2.94a1.5 1.5 0 0 1 1.72-.26l12.5 6.25a1.5 1.5 0 0 1 0 2.68l-12.5 6.25a1.5 1.5 0 0 1-2.14-1.54l.69-4.12a.5.5 0 0 1 .49-.41H10a.5.5 0 0 0 0-1H1.7a.5.5 0 0 1-.49-.59l.69-4.12a1.5 1.5 0 0 1 .26-.72z"
          />
        </svg>
        <span v-else class="loader">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </span>
      </button>
    </form>
    <div class="hint">
      Appuyez sur Entrée pour envoyer, Maj+Entrée pour sauter une ligne
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap");
:root {
  --font-family: "Urbanist", sans-serif;
  --color-text-dark: #693a2b;
  --color-primary: #c33911;
}

.chat-input-container {
  width: 100%;
  max-width: 800px;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
}

.chat-form {
  position: relative;
  width: 100%;
  display: flex;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 0.75rem 0.75rem 0.75rem 1.25rem;
}

.chat-textarea {
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  font-family: var(--font-family, "Urbanist", sans-serif);
  color: var(--color-text-dark, #693a2b);
  line-height: 1.5;
  padding: 0.5rem 50px 0.5rem 0;
  min-height: 24px;
  max-height: 200px;
  overflow-y: auto;
}

.chat-textarea::placeholder {
  color: rgba(105, 58, 43, 0.5);
}

.chat-textarea-disabled {
  opacity: 0.7;
}

.send-btn {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #e3e3e3;
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-btn-active {
  background-color: var(--color-primary, #c33911);
  color: white;
}

.send-btn-active:hover {
  background-color: #c33911;
  transform: scale(1.05);
}

.send-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.icon {
  width: 18px;
  height: 18px;
}

.loader {
  display: flex;
  gap: 3px;
}

.dot {
  width: 4px;
  height: 4px;
  background-color: #c33911;
  border-radius: 50%;
  animation: blink 1.2s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%,
  80%,
  100% {
    transform: scale(0.9);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.4);
    opacity: 1;
  }
}

.hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

@media (max-width: 768px) {
  .chat-input-container {
    margin-top: 1rem;
    max-width: 100%;
  }

  .chat-form {
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    border-radius: 0.75rem;
  }

  .chat-textarea {
    font-size: 0.95rem;
  }

  .send-btn {
    width: 32px;
    height: 32px;
    right: 10px;
    bottom: 10px;
  }

  .icon {
    width: 16px;
    height: 16px;
  }

  .hint {
    font-size: 0.7rem;
  }
}
</style>
