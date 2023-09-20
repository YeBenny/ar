<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import router from '@/router'
import Loading from '../components/Loading.vue'
import { getEventDetail, getResult } from '../axios'

const { id } = router.currentRoute.value.query

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
const dialogText = ref('')

var arSystem
var isNeedLocation = false
var isVisible = false

async function getData() {
  try {
    overlay.value = true
    // const event = await getEventDetail(id)
    const event = {
      id: 'ab92d4a1-0a6a-4ce8-89d7-ffd3fec55ce5',
      appId: '3upckB2GoyOgpG9RpKJsK3xOPCH6cy7CXCd45yQWc',
      title: 'AR小游戏',
      userId: '784b6300-3a6f-4cff-9532-62823c5a6aa4',
      description: '扫Logo得星尘',
      image:
        'https://photos-1257653870.cos.ap-guangzhou.myqcloud.com/wegalaxy/ar/1689744551211.png',
      startUnixTime: 1688140800,
      endUnixTime: 1690819200,
      locationRestriction: false,
      centerLatitude: 0,
      centerLongitude: 0,
      radiusInMeters: 0,
      templateId: '8e7d4dbf-1f9f-11ee-833e-0242ac110002',
      templateInstance:
        '{"target":{"target_description":"扫描Logo","target_model":"https://wegalaxy-1259029301.cos.ap-guangzhou.myqcloud.com/ar/targets_kfc.mind"},"pop_up":{"pop_up_content":"https://wegalaxy-1259029301.cos.ap-guangzhou.myqcloud.com/ar/3dmodel/it-box/it-box.glb","pop_up_content_size":"1.0","pop_up_type":"3d_model"},"confirm_button":{"label":"Click","url":"https://wegalaxy-sit.test.webank.com/wegalaxy/v1/wegalaxy-gamicore/ar/scan-and-show/issue-mdot","input_json":"{\\"amount\\":1.0}"}}',
      status: 1,
      version: 10
    }

    const templateInstance = JSON.parse(event.templateInstance)
    isNeedLocation = event.locationRestriction
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
  window['showImg'] = (base64) => {
    if (arSystem !== null) {
      arSystem.updateFrame(base64)
    }
  }

  await getData()

  if (isNeedLocation && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      longitude = position.coords.longitude
      latitude = position.coords.latitude
    })
  }

  const sceneEl = sceneTargetRef.value
  if (sceneEl) {
    sceneEl.addEventListener('loaded', () => {
      arSystem = sceneEl.systems['mindar-image-system']
      arSystem.start()
    })
  }

  if (AFRAME.components['model-handler'] === undefined) {
    AFRAME.registerComponent('model-handler', {
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
          // if (!isVisible) {
          //   isVisible = true
          //   const interactScene = sceneInteractRef.value
          //   interactScene.setAttribute('visible', true)
          //   const confirmBtn = confirmBtnRef.value
          //   confirmBtn.classList.add('clickable')
          //   const closeBtn = closeBtnRef.value
          //   closeBtn.classList.add('clickable')
          // }
        })

        this.el.addEventListener('targetLost', () => {
          if (isVisible) {
            arSystem.pause(true)
            setTimeout(() => {
              arSystem.ui.hideScanning()
            }, 0)
          }
        })
      }
    })
  }
})

onUnmounted(() => {
  isVisible = false
  arSystem.ui.hideScanning()
  arSystem.ui.hideLoading()
  arSystem.stop()
  delete AFRAME.components['model-handler']
  delete AFRAME.components['target-handler']
})

const confirm = async () => {
  if (!overlay.value) {
    overlay.value = true

    const interactScene = sceneInteractRef.value
    interactScene.setAttribute('visible', false)

    const confirmBtn = confirmBtnRef.value
    confirmBtn.classList.remove('clickable')

    const closeBtn = closeBtnRef.value
    closeBtn.classList.remove('clickable')

    const url = confirmButton['url']
    const inputJson = confirmButton['input_json']
    try {
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

const back = () => {
  'object' != typeof ue || 'object' != typeof ue.interface
    ? ('object' != typeof ue && (ue = {}),
      (ue.interface = {}),
      (ue.interface.broadcast = function (e, t) {
        if ('string' == typeof e) {
          var o = [e, '']
          void 0 !== t && (o[1] = t)
          var n = encodeURIComponent(JSON.stringify(o))
          'object' == typeof history && 'function' == typeof history.pushState
            ? (history.pushState({}, '', '#' + n),
              history.pushState({}, '', '#' + encodeURIComponent('[]')))
            : ((document.location.hash = n), (document.location.hash = encodeURIComponent('[]')))
        }
      }))
    : (function (e) {
        ;(ue.interface = {}),
          (ue.interface.broadcast = function (t, o) {
            'string' == typeof t &&
              (void 0 !== o ? e.broadcast(t, JSON.stringify(o)) : e.broadcast(t, ''))
          })
      })(ue.interface),
    (window.ue4 = ue.interface.broadcast)
  window.ue = ue
  ue.obj.close()
}
</script>

<template>
  <v-layout>
    <v-app-bar fixed>
      <template v-slot:prepend>
        <v-btn icon="mdi-arrow-left" @click="back"></v-btn>
      </template>
    </v-app-bar>
    <v-main class="container">
      <a-scene
        ref="sceneInteractRef"
        vr-mode-ui="enabled: false;"
        renderer="logarithmicDepthBuffer: false;"
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
        device-orientation-permission-ui="enabled: false"
        visible="false"
        gesture-detector
      >
        <a-entity camera emitevents="true"></a-entity>
        <a-entity position="0 -1 -5">
          <a-entity
            v-if="popUp"
            model-handler-1
            :scale="`${popUp['pop_up_content_size']} ${popUp['pop_up_content_size']} ${popUp['pop_up_content_size']}`"
            :gltf-model="popUp['pop_up_content']"
            gesture-handler="isVisible: true; minScale: 0.5; maxScale: 1.5;"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 5000; easing: linear;"
          >
          </a-entity>
          <a-entity position="0 -0.5 0" rotation="0 0 0" scale="1 1 1">
            <a-entity
              position="0 -0.75 0"
              cursor="rayOrigin: mouse;"
              raycaster="objects: .clickable;"
            >
              <a-gui-button
                v-if="confirmButton"
                ref="confirmBtnRef"
                width="1.5"
                height="0.5"
                gap="0.0"
                border-color="white"
                font-color="black"
                active-color="orange"
                hover-color="orange"
                focus-color="orange"
                background-color="orange"
                bevel="true"
                @click="confirm"
                :value="confirmButton['label']"
                font-size="0.4"
              >
                <a-text
                  color="#000"
                  :value="confirmButton['label']"
                  position="0 0.1 0.2"
                  align="center"
                ></a-text>
              </a-gui-button>
            </a-entity>
          </a-entity>
          <a-entity position="1.5 2.5 0" rotation="0 0 0" scale="1 1 1">
            <a-entity cursor="rayOrigin: mouse;" raycaster="objects: .clickable;">
              <a-image
                ref="closeBtnRef"
                width="0.5"
                height="0.5"
                src="./images/btn_close.png"
                @click="close"
              ></a-image>
            </a-entity>
          </a-entity>
        </a-entity>
      </a-scene>
      <a-scene
        v-if="target"
        ref="sceneTargetRef"
        :mindar-image="`imageTargetSrc: ${target['target_model']}; autoStart: false; useCamera: false; filterMinCF: 0.0002; filterBeta: 0.0002; warmupTolerance: 10; missTolerance: 30;`"
        color-space="sRGB"
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
      >
        <a-camera
          position="0 0 0"
          look-controls="enabled: false"
          cursor="fuse: false; rayOrigin: mouse;"
          raycaster="far: 10000; objects: [gui-interactable]"
        ></a-camera>
        <a-entity target-handler mindar-image-target="targetIndex: 0">
          <a-entity
            v-if="popUp"
            model-handler
            :scale="`${popUp['pop_up_content_size']} ${popUp['pop_up_content_size']} ${popUp['pop_up_content_size']}`"
            :gltf-model="popUp['pop_up_content']"
            rotation="0 0 0"
            gesture-handler="isVisible: true; minScale: 0.5; maxScale: 1.5;"
          >
          </a-entity>
          <a-entity v-if="popUp" position="0 0 0">
            <a-entity position="0 -0.75 0" rotation="0 0 0" scale="0.5 0.5 0.5">
              <a-gui-button
                v-if="confirmButton"
                ref="confirmBtnRef"
                class="clickable"
                width="1.5"
                height="0.5"
                gap="0.0"
                border-color="white"
                font-color="black"
                active-color="#FF8000"
                hover-color="#FF8000"
                focus-color="#FF8000"
                background-color="#FF8000"
                bevel="true"
                @click="confirm"
                :value="confirmButton['label']"
                font-size="0.4"
              >
                <a-text
                  color="#000"
                  :value="confirmButton['label']"
                  position="0 0.05 0.2"
                  align="center"
                ></a-text>
              </a-gui-button>
            </a-entity>
          </a-entity>
        </a-entity>
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
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
</style>
