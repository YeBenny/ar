import { createRouter, createWebHashHistory } from 'vue-router'
import { useConfigStore } from '../stores/config'
import { storeToRefs } from 'pinia'
import HomeView from '../views/HomeView.vue'
import ImageTrackingInteractView from '../views/ImageTrackingInteractView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'AR体验馆' }
    },
    {
      path: '/image-tracking-interact',
      name: 'image-tracking-interact',
      component: ImageTrackingInteractView,
      meta: { title: 'ImageTrackingInteractView' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title || to.query.title
  let store = useConfigStore()
  let { config } = storeToRefs(store)
  let { webArBaseUrl, webArAccessToken, appAccessToken, extraHeaderInRequest } =
    router.currentRoute.value.query
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
  next()
})

export default router
