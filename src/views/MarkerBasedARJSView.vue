<script setup>
import router from '@/router'

const { title } = router.currentRoute.value.query
</script>
<template>
  <v-layout>
    <v-app-bar color="primary" density="compact" fixed>
      <template v-slot:prepend>
        <v-btn icon="mdi-arrow-left" @click="router.back()"> </v-btn>
      </template>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <iframe src="./htmls/ar-marker-based-arjs.html" noresize="noresize" />
    </v-main>
  </v-layout>
</template>

<style scoped>
iframe {
  position: absolute;
  top: 48px;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
</style>
