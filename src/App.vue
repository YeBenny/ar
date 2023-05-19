<script setup>
import { onMounted, ref } from 'vue'

const animations = [
  'Idle',
  'Bounce',
  'Clicked',
  'Munch',
  'Roll',
  'Run',
  'Spin',
  'Swim',
  'Run',
  'Jump',
  'Fear',
  'Death'
]
const animation = ref(animations[0])
var isMarkerVisible = false

onMounted(() => {
  AFRAME.registerComponent('markerhandler', {
    init: function () {
      this.el.sceneEl.addEventListener('markerFound', () => {
        const model = document.querySelector('#model')
        model.setAttribute(
          'animation-mixer',
          `clip: ${animation.value}; loop: repeat; duration: 1.5;`
        )
        isMarkerVisible = true
      })

      this.el.sceneEl.addEventListener('markerLost', (e) => {
        isMarkerVisible = false
      })

      this.el.sceneEl.addEventListener('onefingermove', (event) => {
        if (isMarkerVisible) {
          this.el.object3D.rotation.y += event.detail.positionChange.x * rotationFactor
          this.el.object3D.rotation.x += event.detail.positionChange.y * rotationFactor
        }
      })

      this.el.sceneEl.addEventListener('twofingermove', (event) => {
        if (isMarkerVisible) {
          this.scaleFactor *= 1 + event.detail.spreadChange / event.detail.startSpread

          this.scaleFactor = Math.min(
            Math.max(this.scaleFactor, this.data.minScale),
            this.data.maxScale
          )

          this.el.object3D.scale.x = scaleFactor * initialScale.x
          this.el.object3D.scale.y = scaleFactor * initialScale.y
          this.el.object3D.scale.z = scaleFactor * initialScale.z
        }
      })

      this.el.addEventListener('click', () => {
        animation.value = animations[Math.floor(Math.random() * 12)]
        const model = document.querySelector('#model')
        model.setAttribute(
          'animation-mixer',
          `clip: ${animation.value}; loop: repeat; duration: 1.5;`
        )
      })
    }
  })
})
</script>

<template>
  <a-scene
    vr-mode-ui="enabled: false;"
    renderer="logarithmicDepthBuffer: true;"
    arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
    gesture-detector
  >
    <a-marker markerhandler emitevents="true" preset="hiro">
      <a-entity
        id="model"
        position="0 0 0"
        rotation="0 0 0"
        scale="0.01 0.01 0.01"
        gltf-model="./gltfs/Scene/scene.gltf"
        gesture-handler="minScale: 0.8; maxScale: 5.0"
      >
      </a-entity>
      <a-entity position="0 0 1.5" rotation="-90 0 0" scale="1.0 1.0 1.0">
        <a-entity cursor="rayOrigin: mouse" raycaster="objects: .clickable;">
          <a-image class="clickable" src="./images/button.png"></a-image>
        </a-entity>
        <a-entity position="0 -1 0">
          <a-text :value="animation" color="#000"></a-text>
        </a-entity>
      </a-entity>
    </a-marker>
    <a-entity camera></a-entity>
  </a-scene>
</template>
