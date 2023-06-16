import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MarkerBasedARJSView from '../views/MarkerBasedARJSView.vue'
import ImageTrackingARJSView from '../views/ImageTrackingARJSView.vue'
import ImageTrackingMindARView from '../views/ImageTrackingMindARView.vue'
import ImageTrackingMindARInteractView from '../views/ImageTrackingMindARInteractView.vue'
import FaceTrackingMindARView from '../views/FaceTrackingMindARView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Home' }
    },
    {
      path: '/marker-based-arjs',
      name: 'marker-based-arjs',
      component: MarkerBasedARJSView,
      meta: { title: 'MarkerBasedARJSView' }
    },
    {
      path: '/image-tracking-arjs',
      name: 'image-tracking-arjs',
      component: ImageTrackingARJSView,
      meta: { title: 'ImageTrackingARJSView' }
    },
    {
      path: '/image-tracking-mindar',
      name: 'image-tracking-mindar',
      component: ImageTrackingMindARView,
      meta: { title: 'ImageTrackingMindARView' }
    },
    {
      path: '/image-tracking-mindar-interact',
      name: 'image-tracking-mindar-interact',
      component: ImageTrackingMindARInteractView,
      meta: { title: 'ImageTrackingInteractMindARView' }
    },
    {
      path: '/face-tracking-mindar',
      name: 'face-tracking-mindar',
      component: FaceTrackingMindARView,
      meta: { title: 'FaceTrackingMindARView' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title || to.query.title
  next()
})

export default router
