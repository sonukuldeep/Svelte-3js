<script lang="ts">
  import { onMount } from "svelte";
  import type { Contributions } from "$lib/types";
  import { T, forwardEventHandlers } from "@threlte/core";
  import { Center, Grid, OrbitControls, Text } from "@threlte/extras";
  import { tweened } from "svelte/motion";
  import { quadInOut } from "svelte/easing";
  import { Group } from "three";
  import { useGltf } from "@threlte/extras";

  export const ref = new Group();

  export let data;
  let contributions: Contributions[] = data.contributions;
  const scaleY = tweened(0, { duration: 2000, easing: quadInOut });
  function getColor(level: number) {
    switch (level) {
      case 0:
        return "hsl(180, 77%, 0%)";
      case 1:
        return "hsl(180, 77%, 49%)";
      case 2:
        return "hsl(180, 77%, 39%)";
      case 3:
        return "hsl(180, 77%, 29%)";
      case 4:
        return "hsl(180, 77%, 19%)";
    }
  }

  function normalize(count: number, base = 4, offset = 2) {
    switch (true) {
      case count === 0:
        return base;
      case count > 40:
        return count;
      default:
        return count * (base + offset);
    }
  }
  onMount(async () => {
    $scaleY = 1;
  });

  const gltf = useGltf("/name-transformed.glb", { useDraco: true });

  const component = forwardEventHandlers();
</script>

<Grid
  infiniteGrid
  sectionColor="#4a4b4a"
  sectionSize={20}
  cellSize={20}
  fadeDistance={400}
/>

<T.PerspectiveCamera makeDefault position={[10, 200, 400]} fov={100}>
  <OrbitControls enableDamping autoRotate />
</T.PerspectiveCamera>

<T.AmbientLight color="#fff" intensity={0.4} />
<T.DirectionalLight position={[0, 200, 200]} intensity={2} color="#fff" />
<T.DirectionalLight position={[0, 200, -200]} intensity={2} color="#fff" />

<Center autoCenter position.y={40}>
  {#each contributions as row, i}
    {#each row as day, j}
      {#if day}
        {@const color = getColor(day.level)}
        {@const y = normalize(day.count)}
        <T.Group position={[0, 0, 12 * i]} scale.y={$scaleY}>
          <T.Mesh position={[12 * j, y / 2, 0]}>
            <T.BoxGeometry args={[10, y, 10]} />
            <T.MeshStandardMaterial {color} />
          </T.Mesh>
        </T.Group>
      {/if}
    {/each}
  {/each}
</Center>
<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
  {#await gltf}
    <slot name="fallback" />
  {:then gltf}
    <T.Mesh
      geometry={gltf.nodes.Text.geometry}
      material={gltf.materials["Material.001"]}
      rotation={[Math.PI / 2, 0, 0]}
      position.y="100"
      position.z="-150"
      scale.x="30"
      scale.y="30"
      scale.z="30"
    />
  {:catch error}
    <slot name="error" {error} />
  {/await}

  <slot {ref} />
</T>
