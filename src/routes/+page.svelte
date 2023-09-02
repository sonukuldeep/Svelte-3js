<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "./scene.svelte";
  export let data;
</script>

<div class="scene">
  <Canvas>
    <Scene {data} />
  </Canvas>
</div>

<style>
  .scene {
    position: absolute;
    inset: 0;
    background-color: hsl(200, 10%, 10%);
  }
</style>
