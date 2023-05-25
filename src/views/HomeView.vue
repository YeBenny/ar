<script setup>
import { ref } from 'vue'
import router from '@/router'

const pages = ref([
  {
    title: 'MarkerBased(AR.js)',
    path: '/marker-based-arjs'
  },
  {
    title: 'ImageTracking(AR.js)',
    path: '/image-tracking-arjs'
  },
  {
    title: 'ImageTracking(MindAR)',
    path: '/image-tracking-mindar'
  },
  {
    title: 'ImageTrackingInteract(MindAR)',
    path: '/image-tracking-interact-mindar'
  }
])

function onClickPage(page) {
  router.push({
    path: page.path,
    query: {
      title: page.title
    }
  })
}
</script>

<template>
  <v-layout>
    <v-app-bar color="primary" title="AR Demo" density="compact" fixed> </v-app-bar>
    <v-main>
      <v-row>
        <template v-for="(page, index) in pages" :key="index">
          <v-col cols="12">
            <v-card :value="page" @click="onClickPage(page)">
              <v-card-title class="text-black">{{ page.title }}</v-card-title>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-main>
  </v-layout>
</template>
