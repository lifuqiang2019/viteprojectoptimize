<template>
  <div id="three-container" class="three-container"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import * as THREE from "three";

let scene, camera, renderer, cube, animationId;

const initThree = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const container = document.getElementById("three-container");
  const width = container.clientWidth;
  const height = container.clientHeight;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  animate();
};

const animate = () => {
  animationId = requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

onMounted(() => {
  initThree();
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  // Dispose resources to avoid leaks (simple version)
  renderer.dispose();
});
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 500px; /* Specific height for container */
  background: #000;
}
</style>
