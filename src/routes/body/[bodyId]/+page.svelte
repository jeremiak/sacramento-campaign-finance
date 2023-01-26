<script>
  import { sum } from "d3-array";
  import { formatDollar } from "$lib/format";
  import Legislator from "$lib/Legislator.svelte";

  export let data = {}

  $: contributions = data.legislators.map(d => d.contributors).flat()
  $: total = sum(contributions, (d) => d.total);
  
  let name = ''

  if (data.bodyId === 'sac-city') {
    name = 'Sacramento City Council'
  }
</script>

<div>
  <h1>{name}</h1>
  <p>The {data.legislators.length} members of the {name} have raised a total of {formatDollar(total)}.</p>
  <p>Below is each elected representative and all of the people and organizations who have given them campaign contributions during their time at City Hall.</p>
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