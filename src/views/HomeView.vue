<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
import Loading from '../components/Loading.vue'
import ItemEvent from '../components/ItemEvent.vue'
import { getEventList } from '../axios'

const imageURL = `${import.meta.env.VITE_BASE_URL}/wegalaxy/public/images`;

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
      id: event.id,
      t: Date.now()
    }
  })
}
</script>

<template >
  <v-layout class="h-100" :style="{
    backgroundImage: `url(${imageURL}/bg_image.png)`,
    backgroundSize: '100% 100%'
  }">
    <v-main>
      <v-container>
        <v-row>
          <template v-for="(event, index) in events" :key="index">
            <v-col cols="12">
              <ItemEvent :event="event" @click="onClickEvent(event)"></ItemEvent>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>

  <Loading :overlay="overlay" />
</template>
