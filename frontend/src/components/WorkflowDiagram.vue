<script setup lang="ts">
import { ref } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'

import ServiceNode  from "./ServiceNode.vue";

const {workflow} = defineProps<{
  workflow: object[]
}>()

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