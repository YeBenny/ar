<script setup>
import LazyImage from './LazyImage.vue'

defineProps({
  event: {
    type: Object,
  }
})

const imageURL = `${import.meta.env.VITE_BASE_URL}/wegalaxy/public/images`;

</script>

<template>
  <v-container class="item-container pa-0 d-flex" key={event.eventId}>
    <div class="item-img-container v-col-4 d-flex" :style="{
      backgroundColor: 'rgba(255, 255, 255, 0.5)'
    }">
      <LazyImage v-if="event.image" class="item-img" :src="event.image" />
    </div>
    <v-container class="bg-white v-col-8 ma-0 px-3 py-2 d-flex flex-column justify-space-between">
      <div>
        <div class="item-title">{{ event.title }}</div>
        <div class="item-description">{{ event.description }}</div>
      </div>
      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-img class="item-btn v-col-auto" :style="{
          backgroundImage: `url(${imageURL}/btn_bg_round.png)`,
          backgroundSize: '100% 100%'
        }" :src="`${imageURL}/icon_arrow_right.png`" />
      </div>
    </v-container>
  </v-container>
</template>

<style scoped>
.item-container {
  overflow: hidden;
  border: 1px solid #ffffff;
  border-radius: 20px;
}

.item-img-container {
  padding: 16px;
  border-radius: 20px 0px 0px 20px;
}

.item-img {
  width: 100%;
  background: #ffffff;
  border: 1px solid #ffffff;
}

.item-title {
  font-size: 26px;
  font-weight: 600;
  color: #243766;
}

.item-description {
  font-size: 13px;
  font-weight: 400;
  color: #757a7c;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

.item-btn {
  width: 48px;
  height: 48px;
  padding: 12px;
}
</style>
