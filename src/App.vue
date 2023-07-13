<script setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useConfigStore } from './stores/config'
import router from '@/router'

const i18n = useI18n()

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

  config.value.webArBaseUrl = 'https://61.93.153.23:11224/v1/wegalaxy-ar/webar'
  config.value.webArAccessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImF1dGgtdXNlciIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImkyS0pBWEFLUzhiWDhtSVFTWEsxNjhZZlViaEhYN2FYaDc4b2tqWnciLCJleHAiOjE2ODkyNjIzNDF9.WfunAhWbhSK1vrFkG3wBuY9_PgTCPSMJHHGzgH43v8xZdB_tvp9fHqF6NlCb6IqQUtxdOFiNh7utL0_IW4qzFPTiy1Xhp1b5iQYZ2DJS1elnkBl4BSxayTkIMiM9C-82hRyRtnpkEqXeRw5BL8j1rV6MJMEt64ZL9Rw301iiZXrs2O9LHU6_rv7sHGc7kiDbGiIf-K8PlUkAlInTwT5X2xKihNJE9oSGZpsDABiDF49jb7sEK4vniMabLdCOJRT5QSBEbrnB5kfFR6mN82BNnUUjRBewiwDlMoDgCk4FG67R_3Yuo7zBwV5sCBUQg1XdXCok6PnojJ_o9oX4S74tGg'
  config.value.appAccessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZW5ueXllIiwiZGFUb2tlbiI6ImV5SmhiR2NpT2lKU1V6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUp6ZFdJaU9pSmlaVzV1ZVhsbElpd2lhV0YwSWpveE5qZzVNalU0TVRRNExDSmxlSEFpT2pFMk9Ea3lOVGs1TkRnc0luUjVjR1VpT2lKaFkyTmxjM05VYjJ0bGJpSXNJbXh2WjJsdVZIbHdaU0k2SW5kbFkyaGhkQ0lzSW5WelpYSkpaQ0k2SWxWU05qTTBNelF4WkRsaFpEVTFZV1ZtWXlJc0ltRmpZMjkxYm5RaU9pSktXVVY1YkVkSk16ZHlWMUJ3YTFSM1NpdHNlSGhZTVdrelZVVmpOMFpRTkcxc1ZsTnZSRmt5TVRoWVdFaGhVMG8zYmpGbmJreGpiMWROYzB0emJqbGxUM0poT1doemNHdFlabGt4ZFVWVU5XNXViREpoTDNCNmNXVjFUbmhPVjB4YVUyVTFUMHR4Tm1GR2RHUlpVbU5hUWxCbVdGUjROSGhhVlU5V00ydEdVazVWT1ZScGVFbHNWMk51ZUZRclpYZzNlREpqZG5KNk5qaE1jVlZPWWpaQ1UwSk5Va00zZFZNclRFaEhZM1JKUm1abWEycDJOekpLVEhGMVltSlJTVXBYWXpBek9VOWxhSFZ3WTFGa1IyTjRMM0pETWxkRlp6ZFRaMUJ3YTBweE1WbGFhVmRaY0cwdlpUSjZOMmt5YkhvellVdERkak5FZEc1NWMxTlFkV2N6WkRkUk0wMXBaR2d5TjJaM1VsZFhWMEZaYUN0TVF6VXdTRzlQYkZFM2JXbHZSWEkwY0VVNGJFcHNUbFpqYWpGd1l6UjNaV2xSTjA1M1JIQlVZVVJ2YUdGQmRFd3hPRlpEVFhaSlpETnljR0ZLYUd0dVpFRTlQU0lzSW1keVlXNTBaV1JRWlhKdGFYTnphVzl1Y3lJNmJuVnNiSDAuaDhqVmM5dnZhd1RjT0tkdXZoSHhUUUpkNEJUekFwS2tDdUw5OUR2eDE0V0JacU5qZnkyNHg0a1FSTmNxa1VLLUNHRFFtMTJhVEVtTGNUcHJHandvR0NueUpxRHpoSWtuREFxaXBvNjVpNUI5akx0Y3V2S0lNYVdTa1Y1TUJMdFBrZVZySHZna21JSy1rWFlzdUF0OHV6LU1oRmwwR3YxX2hKdHNMMERmY3dnSktyd1JmR09hOTRNRHpMR08wenJ5RXlBUzNEVWNrTG5COHpycjZ1N19xdXA4bUszSVBleHlIdGFGV09tbEY3WU5TWjdzUHAwWnh4WnFCNWVPVXBSUlNSUTN4eTJzbzJrQUN2ZUp2Z2k1dXpyQ21LRkJCV0JiOWlCMHZFb1d1bnJ1cXFRWk9IYnBPaEJJeEF1YU03cV9KQklFMm5aSFQxUEk4MHhOMy1QaE9nIiwiZXhwIjoxNjg5MjU5OTQ4fQ.Da7iI9nRd5ZgBe0Yeax0_50M7B-yG_kEOsBGZ_6ANGpi62JW2FRG0vFNeDZgzFRMD8FoweLMW8UVPi6umAdnMqYlEfy_rVISN6dYeyJYGyP_gOPhoEcuRBmCmaP_XrKJws_ueme_hQFg2rYf_UHPZ9o9YjtuPBjv0__QKtjuHf-m18DeJ04jmwWyknHqN8CSvZoQXTa67LFPRjMQhyfjlg62ktfeNM8yrhOT6QpwpZbayoNEBTFK25DLxt8h1ciFLeUIcfCc0AhlQUBV8cu9Zg7VatP9-ENUWoWg8TwPaWFJYpXC1BE3XjICUiwNTUPYvbwbZi_im4M3i4fO_h9gCw'
})
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="route.fullPath" />
  </router-view>
</template>
