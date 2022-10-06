<script>
  import _ from "lodash";
  import { writable } from "svelte/store";

  export let data = []
  $: contributors = data

  const contributorsShown = writable(5);

  function sortContributors(contributors) {
    return _.orderBy(contributors, ["total", "contributor"], ["desc", "asc"]);
  }

  function filterOutZeros(contributors) {
    return contributors.filter((d) => d.total !== 0);
  }

  function processContributors(contributors) {
    const filtered = filterOutZeros(contributors)
    const sorted = sortContributors(filtered)
    return sorted;
  }

  $: processedContributors = processContributors(contributors)
</script>

<div class="contributors">
  <ul class="contributors">
    {#each processedContributors as contributor, i}
      {#if i < $contributorsShown}
        <li class="contributor">
          <div class="contributor-info">
            <div class="contributor-name">
              {contributor.contributor}
            </div>
            <div class="contributor-location">
              {contributor.contributorCity}, {contributor.contributorState}
            </div>
          </div>
          <div class="contributor-amount monospace">
            ${contributor.total.toLocaleString("en-US")}
          </div>
        </li>
      {/if}
    {/each}
  </ul>

  <div class="contributor-pagination">
    <button
      style:opacity={contributors.length > $contributorsShown
        ? 1
        : 0}
      on:click={() => {
        $contributorsShown += 15;
      }}
    >
      Show more
    </button>
    <p>
      Showing {Math.min($contributorsShown, contributors.length)} out of {contributors.length.toLocaleString(
        "en-US"
      )} contributors
    </p>
  </div>
</div>

<style lang="scss">
  ul.contributors {
    font-size: 1rem;
    list-style-type: none;
    height: 400px;
    margin-top: 1rem;
    padding: 0;
    overflow-y: scroll;

    li {
      padding: 0.5rem;
    }

    li:nth-child(2n) {
      background-color: #ebebeb;
    }
  }

  .contributor {
    display: flex;
    justify-content: space-between;
  }

  .contributor-location {
    font-style: italic;
  }

  .contributor-pagination {
    align-items: center;
    display: flex;
    justify-content: space-between;

    button {
      display: block;
    }

    p {
      font-size: 0.9rem;
      font-style: italic;
    }
  }
</style>