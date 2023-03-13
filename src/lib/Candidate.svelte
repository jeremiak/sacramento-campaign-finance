<script>
  import Contributors from "./Contributors.svelte";
  import IE from './IE.svelte'

  export let candidate = {
    contributors: [],
  };
</script>

<div class="candidate">
  <div class="candidate-name">{candidate.Name}</div>
  {#if candidate.total > 0}
  <div class="candidate-stats">
    <p>
      <span class="monospace">${candidate.total.toLocaleString("en-US")}</span>
      in direct contributions from {candidate.contributors.length.toLocaleString(
        "en-US"
      )} people, companies, and organizations. Here they are:
    </p>
  </div>
  <Contributors data={candidate.contributors} />
  <IE data={candidate.ie} name={candidate.name} />
  {:else}
    <p>Hasn't reported any fundraising yet.</p>
  {/if}
</div>

<style lang="scss">
  .candidate {
    background: #ffffff;
    flex: 1;
    margin-top: 0.5rem;
    padding: 0.5rem;
  }

  .candidate-name {
    font-weight: 700;
  }

  .candidate-stats p {
    height: 3.25rem;
  }
</style>
