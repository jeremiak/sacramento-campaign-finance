<script>
  import _ from "lodash";
  import { is_empty } from "svelte/internal";
  import { writable } from "svelte/store";
  export let candidate = {
    contributors: [],
  };

  const contributorsShown = writable(5);

  function sortContributors(contributors) {
    return _.orderBy(contributors, ["total", "contributor"], ["desc", "asc"]);
  }

  function filterOutZeros(contributors) {
    return contributors.filter((d) => d.total !== 0);
  }

  function processContributors(contributors) {
    return sortContributors(filterOutZeros(contributors));
  }
</script>

<div class="candidate">
  <div class="candidate-name">{candidate.name}</div>
  <div class="candidate-stats">
    <p>
      <span class="monospace">${candidate.total.toLocaleString("en-US")}</span>
      in direct contributions from {candidate.contributors.length.toLocaleString(
        "en-US"
      )} people, companies, and organizations. Here they are:
    </p>
  </div>
  <div class="candidate-contributors">
    <ul class="contributors">
      {#each processContributors(candidate.contributors) as contributor, i}
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
        style:opacity={candidate.contributors.length > $contributorsShown
          ? 1
          : 0}
        on:click={() => {
          $contributorsShown += 15;
        }}
      >
        Show more
      </button>
      <p>
        Showing {$contributorsShown} out of {candidate.contributors.length.toLocaleString(
          "en-US"
        )} contributors
      </p>
    </div>
  </div>
  {#if candidate.ie.length > 0}
    <div class="candidate-ie">
      <h2>Independent expenditures</h2>
      <ul>
        {#each candidate.ie as ie}
          <li>
            <p>
              <a
                href="https://cal-access.sos.ca.gov/Campaign/Committees/Detail.aspx?id={ie.spenderId}&view=received"
                >{ie.spenderName}</a
              >
              has spent
              <span class="monospace">${ie.total.toLocaleString("en-US")}</span>
              to {#if ie.position === "S"}support{:else}oppose{/if}
              {candidate.name}.
            </p>
          </li>
        {/each}
      </ul>
    </div>
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

  .candidate-ie ul {
    list-style-type: none;
    padding-left: 0;
  }

  h2 {
    font-size: 1.2rem;
  }
</style>
