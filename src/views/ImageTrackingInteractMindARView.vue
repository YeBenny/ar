<script setup>
import router from '@/router'

const { title, location } = router.currentRoute.value.query
</script>
<template>
  <v-layout>
    <v-app-bar color="primary" density="compact" fixed>
      <template v-slot:prepend>
        <v-btn icon="mdi-arrow-left" @click="router.back()"> </v-btn>
      </template>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
    </v-app-bar>
    <v-main fill-height>
      <iframe :src="`./htmls/ar-image-tracking-mindar-interact.html?location=${location}`" noresize="noresize" />
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
  height: calc(100% - 48px);
}
</style>
