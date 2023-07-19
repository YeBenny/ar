<script setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useConfigStore } from './stores/config'
import router from '@/router'

const i18n = useI18n()
const isReady = ref(false)

onMounted(async () => {
  await router.isReady()
  let store = useConfigStore()
  let { config } = storeToRefs(store)
  let {
    webArBaseUrl,
    webArAccessToken,
    appAccessToken,
    extraHeaderInRequest
  } = router.currentRoute.value.query
  if (webArBaseUrl) {
    config.value.webArBaseUrl = webArBaseUrl
  }
  if (webArAccessToken) {
    config.value.webArAccessToken = webArAccessToken
  }
  if (appAccessToken) {
    config.value.appAccessToken = appAccessToken
  }
  if (extraHeaderInRequest) {
    config.value.extraHeaderInRequest = extraHeaderInRequest
  }
  i18n.locale.value = config.value.locale ?? i18n.locale.value
  isReady.value = true
})
</script>

<template>
  <router-view v-if="isReady" v-slot="{ Component, route }">
    <component :is="Component" :key="route.fullPath" />
  </router-view>
</template>
