<script setup>
import { ref } from 'vue'
import router from '@/router'

const pages = ref([
  {
    title: 'ShenZhen',
    location: 'sz',
    path: '/image-tracking-interact-mindar'
  },
  {
    title: 'HongKong',
    location: 'hk',
    path: '/image-tracking-interact-mindar'
  }
])

function onClickPage(page) {
  router.push({
    path: page.path,
    query: {
      title: page.title,
      location: page.location
    }
  })
}
</script>

<template>
  <v-layout>
    <v-app-bar color="primary" title="AR Demo" density="compact" fixed> </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <template v-for="(page, index) in pages" :key="index">
            <v-col cols="12">
              <v-card :value="page" @click="onClickPage(page)">
                <v-card-title class="text-black">{{ page.title }}</v-card-title>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>
