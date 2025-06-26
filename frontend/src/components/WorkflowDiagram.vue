<script setup lang="ts">
import { ref } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'

import ServiceNode  from "./ServiceNode.vue";

const workflow =  [
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

const groupedByOrder = workflow.reduce((acc, step, index) => {
  if (!acc[step.order]) acc[step.order] = []
  acc[step.order].push({ ...step, index })
  return acc
}, {} as Record<number, (typeof workflow[number] & { index: number })[]>)

const orderLevels = Object.keys(groupedByOrder)
    .map((o) => parseInt(o))
    .sort((a, b) => a - b)

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

const xGap = 350
const yGap = 180

orderLevels.forEach((order, levelIndex) => {
  const steps = groupedByOrder[order]

  steps.forEach((service, stepIndex) => {
    const id = `${service.index + 1}`

    // Determine type
    let nodeType: 'input' | 'output' | 'default' = 'default'
    if (levelIndex === 0) nodeType = 'input'
    else if (levelIndex === orderLevels.length - 1) nodeType = 'output'

    nodes.value.push({
      id,
      type:'serviceNode',
      position: {
        x: levelIndex * xGap,
        y: stepIndex * yGap
      },
      data: {
        nodeType,
        service
      }
    })

    // Generate edges from previous level (left to right)
    if (levelIndex > 0) {
      const prevServices = groupedByOrder[orderLevels[levelIndex - 1]]
      prevServices.forEach((prevService) => {
        edges.value.push({
          id: `e${prevService.index + 1}->${service.index + 1}`,
          source: `${prevService.index + 1}`,
          target: `${service.index + 1}`,
          animated: true
        })
      })
    }
  })
})


</script>

<template>
  <div :style="{
    width: '100vw',
    height: '1000px',
  }">
    <VueFlow :nodes="nodes" :edges="edges" :node-types="{
      serviceNode: ServiceNode
    }"
    />
  </div>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';
</style>