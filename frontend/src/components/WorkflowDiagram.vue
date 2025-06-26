<script setup lang="ts">
import { ref } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'

import SpecialNode  from "./SpecialNode.vue";

const workflow = [
        {
            "order": 1,
            "tags": [
                "rédaction",
                "contenu"
            ],
            "type": "services",
            "prompt": "Rédige une invitation de mariage en français pour un mariage qui aura lieu à Paris le 26 juin 2026. Sois créatif et élégant."
        },
        {
            "order": 2,
            "tags": [
                "traducteur",
                "langues"
            ],
            "type": "services",
            "params": {
                "langue_cible": "anglais"
            },
            "prompt": "Traduis l'invitation de mariage suivante en anglais : [texte_invitation_francaise]."
        },
        {
            "order": 2,
            "tags": [
                "traducteur",
                "langues"
            ],
            "type": "services",
            "params": {
                "langue_cible": "espagnol"
            },
            "prompt": "Traduis l'invitation de mariage suivante en espagnol : [texte_invitation_francaise]."
        },
        {
            "order": 2,
            "tags": [
                "traducteur",
                "langues"
            ],
            "type": "services",
            "params": {
                "langue_cible": "japonais"
            },
            "prompt": "Traduis l'invitation de mariage suivante en japonais : [texte_invitation_francaise]."
        },
        {
            "order": 3,
            "tags": [
                "design",
                "image"
            ],
            "type": "services",
            "prompt": "Crée un design d'invitation de mariage élégant et moderne en utilisant les textes suivants : [texte_invitation_francaise], [texte_invitation_anglaise], [texte_invitation_espagnole], [texte_invitation_japonaise].  Assure-toi que le design est approprié pour un mariage à Paris."
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

const xGap = 250
const yGap = 180

orderLevels.forEach((order, levelIndex) => {
  const steps = groupedByOrder[order]

  steps.forEach((step, stepIndex) => {
    const id = `${step.index + 1}`

    // Determine type
    let nodeType: 'input' | 'output' | 'default' = 'default'
    if (levelIndex === 0) nodeType = 'input'
    else if (levelIndex === orderLevels.length - 1) nodeType = 'output'

    nodes.value.push({
      id,
      type:'custom',
      position: {
        x: levelIndex * xGap,
        y: stepIndex * yGap
      },
      data: {
        label: `${order}. ${step.job}`
      }
    })

    // Generate edges from previous level (left to right)
    if (levelIndex > 0) {
      const prevSteps = groupedByOrder[orderLevels[levelIndex - 1]]
      prevSteps.forEach((prevStep) => {
        edges.value.push({
          id: `e${prevStep.index + 1}->${step.index + 1}`,
          source: `${prevStep.index + 1}`,
          target: `${step.index + 1}`,
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
      custom: SpecialNode
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