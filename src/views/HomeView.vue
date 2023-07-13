<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
import Loading from '../components/Loading.vue'
import LazyImage from '../components/LazyImage.vue'
import { getEventList } from '../axios'

const overlay = ref(true)
const events = ref([])
const isLoading = ref(true)
const isFinish = ref(true)
const pageSize = 10
var startIndex = 1

async function getData() {
  try {
    overlay.value = true
    isLoading.value = true
    isFinish.value = true
    startIndex = 1
    events.value = []
    let data = await getEventList(startIndex, pageSize)
    let list = data.result
    let totalRows = data.pageInfo.totalRows
    events.value.push(...list)
    isFinish.value = totalRows === 0 || startIndex + pageSize >= totalRows
  } catch (err) {
    console.log(err)
    isFinish.value = true
    startIndex = 1
  } finally {
    overlay.value = false
    isLoading.value = false
  }
}

async function loadMoreData() {
  try {
    if (!isLoading.value && !isFinish.value) {
      isLoading.value = true
      startIndex = startIndex + pageSize
      let data = await getEventList(startIndex, pageSize)
      let list = data.result
      let totalRows = data.pageInfo.totalRows
      events.value.push(...list)
      isFinish.value = totalRows === 0 || startIndex + pageSize >= totalRows
    }
  } catch (err) {
    console.log(err)
    isFinish.value = false
    startIndex = startIndex - pageSize
  } finally {
    overlay.value = false
    isLoading.value = false
  }
}

getData()

onMounted(() => {
  window.onscroll = () => {
    let isBottom =
      document.documentElement.scrollTop + window.innerHeight ===
      document.documentElement.offsetHeight
    if (isBottom) {
      loadMoreData()
    }
  }
})

function onClickEvent(event) {
  router.push({
    path: "/image-tracking-interact",
    query: {
      title: event.title,
      id: event.id
    }
  }).then(() => { router.go() })
}
</script>

<template>
  <v-layout>
    <v-app-bar color="primary" title="AR Demo" density="compact" fixed> </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <template v-for="(event, index) in events" :key="index">
            <v-col cols="12">
              <v-card @click="onClickEvent(event)">
                <LazyImage v-if="event.image" :src="event.image" />
                <v-card-title>
                  {{ event.title }}
                </v-card-title>
                <v-card-subtitle>
                  {{ event.description }}
                </v-card-subtitle>
                <v-card-text>
                  {{ $d(event.startUnixTime * 1000, 'short') }} - {{ $d(event.endUnixTime * 1000, 'short') }}
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>

  <Loading :overlay="overlay" />
</template>
