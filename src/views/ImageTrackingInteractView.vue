<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import router from '@/router'
import Loading from '../components/Loading.vue'
import { getEventDetail, getResult } from '../axios'

const { title, id } = router.currentRoute.value.query

const overlay = ref(true)
const target = ref(null)
const popUp = ref(null)
var confirmButton
var longitude = 0
var latitude = 0

const sceneTargetRef = ref(null)
const sceneInteractRef = ref(null)
const confirmBtnRef = ref(null)
const closeBtnRef = ref(null)
const dialog = ref(false)
const dialogText = ref(false)

var arSystem
var isVisible = false

async function getData() {
  try {
    overlay.value = true
    const event = await getEventDetail(id)
    const templateInstance = JSON.parse(event.templateInstance);
    target.value = templateInstance['target']
    popUp.value = templateInstance['pop_up']
    confirmButton = templateInstance['confirm_button']
  } catch (err) {
    console.log(err)
  } finally {
    overlay.value = false
  }
}

onMounted(async () => {
  await getData()

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      longitude = position.coords.longitude
      latitude = position.coords.latitude
    })
  }

  const sceneEl = sceneTargetRef.value
  sceneEl.addEventListener('loaded', () => {
    arSystem = sceneEl.systems['mindar-image-system']
    arSystem.start()
  })

  if (AFRAME.components['model-handler'] === undefined) {
    AFRAME.registerComponent("model-handler", {
      init: function () {
        this.el.addEventListener('model-loaded', () => {
          const animations = this.el.components['gltf-model'].model.animations
          if (animations.length > 0) {
            this.el.setAttribute(
              'animation-mixer',
              `clip: ${animations[0].name}; loop: repeat; timeScale: 0.5;`
            )
          }
        })
      }
    })
  }

  if (AFRAME.components['target-handler'] === undefined) {
    AFRAME.registerComponent('target-handler', {
      init: function () {
        this.el.addEventListener('targetFound', () => {
          if (!isVisible) {
            isVisible = true

            const interactScene = sceneInteractRef.value
            interactScene.setAttribute('visible', true)

            const confirmBtn = confirmBtnRef.value
            confirmBtn.classList.add('clickable')

            const closeBtn = closeBtnRef.value
            closeBtn.classList.add('clickable')
          }
        })

        this.el.addEventListener('targetLost', () => {
          if (isVisible) {
            arSystem.pause(true)
            setTimeout(() => {
              arSystem.ui.hideScanning()
            }, 0);
          }
        })
      }
    })
  }
})

onUnmounted(() => {
  isVisible = false
  arSystem.stop()
  arSystem.ui.hideScanning()
})

const confirm = async () => {
  const interactScene = sceneInteractRef.value
  interactScene.setAttribute('visible', false)

  const confirmBtn = confirmBtnRef.value
  confirmBtn.classList.remove('clickable')

  const closeBtn = closeBtnRef.value
  closeBtn.classList.remove('clickable')

  const url = confirmButton['url']
  const inputJson = confirmButton['input_json']
  try {
    overlay.value = true
    let data = await getResult(url, id, longitude, latitude, inputJson)
    dialogText.value = data
  } catch (err) {
    console.log(err)
    dialogText.value = err
  } finally {
    overlay.value = false
    dialog.value = true
  }
}

const close = () => {
  isVisible = false
  arSystem.unpause()
  arSystem.ui.showScanning()

  const interactScene = sceneInteractRef.value
  interactScene.setAttribute('visible', false)

  const confirmBtn = confirmBtnRef.value
  confirmBtn.classList.remove('clickable')

  const closeBtn = closeBtnRef.value
  closeBtn.classList.remove('clickable')
}

const ok = () => {
  dialog.value = false
  isVisible = false
  arSystem.unpause()
  arSystem.ui.showScanning()
}
</script>

<template>
  <v-layout>
    <v-app-bar style="z-index: 10000" color="primary" density="compact" fixed>
      <template v-slot:prepend>
        <v-btn icon="mdi-arrow-left" @click="router.back()"> </v-btn>
      </template>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
    </v-app-bar>
    <v-main class="container">
      <a-scene style="z-index: 9999" ref="sceneInteractRef" vr-mode-ui="enabled: false;"
        renderer="logarithmicDepthBuffer: false;" arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
        device-orientation-permission-ui="enabled: false" visible="false" gesture-detector>
        <a-entity camera emitevents="true"></a-entity>
        <a-entity position="0 -1 -5">
          <a-entity v-if="popUp" model-handler
            :scale="`${popUp['pop_up_content_size']} ${popUp['pop_up_content_size']} ${popUp['pop_up_content_size']}`"
            :gltf-model="popUp['pop_up_content']" gesture-handler="isVisible: true; minScale: 0.5; maxScale: 1.5">
          </a-entity>
          <a-entity position="0 -0.5 0" rotation="0 0 0" scale="1 1 1">
            <a-entity position="0 -0.75 0" cursor="rayOrigin: mouse;" raycaster="objects: .clickable;">
              <a-gui-button v-if="confirmButton" ref="confirmBtnRef" width="1.5" height="0.5" border-color="white"
                font-color="black" active-color="orange" hover-color="orange" focus-color="orange"
                background-color="orange" bevel="true" @click="confirm">
                <a-text color="#000" :value="confirmButton['label']" position="0 0.1 0.2" align="center"></a-text>
              </a-gui-button>
            </a-entity>
          </a-entity>
          <a-entity position="1.5 2.5 0" rotation="0 0 0" scale="1 1 1">
            <a-entity cursor="rayOrigin: mouse;" raycaster="objects: .clickable;">
              <a-image ref="closeBtnRef" width="0.5" height="0.5" src="./images/close.png" @click="close"></a-image>
            </a-entity>
          </a-entity>
        </a-entity>
      </a-scene>
      <a-scene v-if="target" ref="sceneTargetRef"
        :mindar-image="`imageTargetSrc: ${target['target_model']}; autoStart: false;`" color-space="sRGB"
        renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false">
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
        <a-entity target-handler mindar-image-target="targetIndex: 0"></a-entity>
      </a-scene>
    </v-main>
  </v-layout>

  <v-dialog v-model="dialog" style="z-index: 9999">
    <v-card>
      <v-card-text>{{ dialogText }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="ok">{{ $t('btn.ok') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <Loading :overlay="overlay" />
</template>

<style scoped>
.container {
  position: absolute;
  top: 48px;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: calc(100% - 48px);
}
</style>
