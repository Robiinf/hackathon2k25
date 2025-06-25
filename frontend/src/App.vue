<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Visualisation du workflow</h1>
    <WorkflowDiagram :workflow="workflowData" />
  </div>
</template>

<script setup lang="ts">
import WorkflowDiagram from './components/WorkflowDiagram.vue'

const workflowData = [
  {
    type: 'IA',
    order: 1,
    job: "Rédaction de l'invitation",
    params: { lang: 'fr' },
    prompt: "Rédige une invitation de mariage en français..."
  },
  {
    type: 'IA',
    order: 2,
    job: 'Traduction en anglais',
    params: { source_lang: 'fr', target_lang: 'en' },
    prompt: 'Traduis en anglais...'
  },
  {
    type: 'IA',
    order: 2,
    job: 'Traduction en japonais',
    params: { source_lang: 'fr', target_lang: 'ja' },
    prompt: 'Traduis en japonais...'
  },
  {
    type: 'IA',
    order: 2,
    job: 'Traduction en espagnol',
    params: { source_lang: 'fr', target_lang: 'es' },
    prompt: 'Traduis en espagnol...'
  },
  {
    type: 'humain',
    order: 3,
    job: 'Validation finale multilingue',
    params: { languages: ['fr', 'en', 'ja', 'es'] }
  }
]
</script>
