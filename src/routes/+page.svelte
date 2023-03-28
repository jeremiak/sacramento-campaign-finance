<script>
  import { formatDollar } from "$lib/format.js";
  export let data = {};

  const { sacCityTotal, sacCountyTotal } = data;
  const total = sacCityTotal + sacCountyTotal;

  const blocks = [
    {
      label: "Raised by current local elected officials",
      value: total,
    },
    {
      label: "City Council",
      href: "/body/sac-city",
      value: sacCityTotal,
    },
    {
      label: "Board of Supervisors",
      href: "/body/sac-county",
      value: sacCountyTotal,
    },
  ];
</script>

<h1>Sacramento campaign cash</h1>
<p>A regularly updated website that tracks the people and organizations that make campaign contributions to elected officials in Sacramento.</p>

<div class="blocks">
  {#each blocks as block}
    <div class="block">
      <div class="amount">{formatDollar(block.value)}</div>
      <div class="label">
        {#if block.href}
          <a href={block.href}>{block.label}</a>
        {:else}
          {block.label}
        {/if}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  h1 {
    text-align: center;
  }
  .blocks {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    margin-bottom: 100px;
    margin-top: 100px;
  }

  .block {
    margin: 0.75rem;
    padding: 0.5rem;
    text-align: center;
  }

  .block .amount {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .block:nth-child(1) {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-start: 1;
  }

  .block:nth-child(2),
  .block:nth-child(3) {
    grid-row-start: 2;
    grid-row-start: 2;
  }

  .block:nth-child(2) {
    grid-column-start: 1;
    grid-column-end: 1;
  }
  .block:nth-child(3) {
    grid-column-start: 2;
    grid-column-end: 2;
  }
</style>
