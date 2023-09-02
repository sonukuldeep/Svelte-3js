<script lang="ts">
  import { onMount } from "svelte";
  import type { Contributions } from "$lib/types";
  import { T } from "@threlte/core";
  import { Center, Grid, OrbitControls, Text } from "@threlte/extras";
  import { tweened } from "svelte/motion";
  import { quadInOut } from "svelte/easing";

  export let data;
  let contributions: Contributions[] = data.contributions;
  const scaleY = tweened(0, { duration: 2000, easing: quadInOut });
  function getColor(level: number) {
    switch (level) {
      case 0:
        return "#0e0e0e";
      case 1:
        return "#00442a";
      case 2:
        return "#006d35";
      case 3:
        return "#00a648";
      case 4:
        return "#00d35c";
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
