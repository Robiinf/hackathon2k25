<template>
    <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Visualisation du workflow</h1>
    <WorkflowDiagram :workflow="workflowData" />
  </div>
</template>

<script setup lang="ts">
import WorkflowDiagram from '../components/WorkflowDiagram.vue'

const workflowData = [
        {
            "jobTitle": "Rédaction invitation mariage français",
            "order": 1,
            "tags": [
                "rédaction",
                "contenu"
            ],
            "prompt": "Rédiger un texte d'invitation de mariage en français, l'événement se déroulera à Paris le 26 juin 2026."
        },
        {
            "jobTitle": "Traduction invitation anglais",
            "order": 2,
            "tags": [
                "traducteur",
                "langues",
                "IA"
            ],
            "prompt": "Traduire le texte d'invitation de mariage en anglais."
        },
        {
            "jobTitle": "Traduction invitation espagnol",
            "order": 2,
            "tags": [
                "traducteur",
                "langues",
                "IA"
            ],
            "prompt": "Traduire le texte d'invitation de mariage en espagnol."
        },
        {
            "jobTitle": "Traduction invitation japonais",
            "order": 2,
            "tags": [
                "traducteur",
                "langues",
                "IA"
            ],
            "prompt": "Traduire le texte d'invitation de mariage en japonais."
        },
        {
            "jobTitle": "Design des invitations",
            "order": 3,
            "tags": [
                "design",
                "image"
            ],
            "prompt": "Créer un design d'invitation de mariage élégant et festif, en utilisant les textes traduits dans les 4 langues."
        }
    ]
</script>