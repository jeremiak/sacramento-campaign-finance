<script>
  import Legislator from "$lib/Legislator.svelte";

  export let data = {}
</script>

<div>
  <h1>{#if data.bodyId === 'sac-city'}Sacramento City Council{/if}</h1>
  <p>TKTKTK</p>
  <ul>
    {#each data.legislators as legislator }
      <li>
        <Legislator {...legislator} />
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  ul {
    list-style-type: none;
    padding-left: 0;
  }
</style>