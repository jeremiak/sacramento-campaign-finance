<script>
  import { sum } from "d3-array";
  import { formatDollar, formatGenerated } from "$lib/format";
  import Legislator from "$lib/Legislator.svelte";

  export let data = {}

  const { bodyId, generated, legislators } = data

  $: contributions = legislators.map(d => d.contributors).flat()
  $: total = sum(contributions, (d) => d.amount);
  
  let name = ''

  if (bodyId === 'sac-city') {
    name = 'Sacramento City Council'
  }
</script>

<div class="container">
  <h1>{name}</h1>
  <p>The {legislators.length} members of the {name} have raised {formatDollar(total)}.</p>
  <p>Below is each elected representative and all of the people and organizations who have given them campaign contributions during their time in local elected office.</p>
  <p>The data was retrieved on {formatGenerated(generated)}. Download it <a href="/body/{bodyId}/download" download="{bodyId}-{generated}.csv">here</a>.</p>
  {#if bodyId === 'sac-city'}
    <div class="sac-mayor-container">
      <Legislator {...legislators.find(d => d.title === 'Mayor')} />
    </div>
  {/if}
  <ul>
    {#each legislators.filter(d => d.title !== 'Mayor') as legislator }
      <li>
        <Legislator {...legislator} />
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .container {
    max-width: 80%;
    margin: 0 auto;
  }
  
  ul {
    list-style-type: none;
    padding-left: 0;
  }
</style>