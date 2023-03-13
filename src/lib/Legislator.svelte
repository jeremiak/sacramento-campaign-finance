<script>
  import { sum } from "d3-array";
  import { formatDollar } from "./format";
  import Contributors from "./Contributors.svelte";
  export let name = "";
  export let title = "";
  export let contributors = [];
  export let committees = [];

  $: total = sum(contributors, (d) => d.amount);
</script>

<div class="legislator">
  <div class="name-and-title">
    <div class="name">{name}</div>
    <div class="title">{title}</div>
  </div>
  <div class="totals">
    <p>
      Raised {formatDollar(total)} from {contributors.length.toLocaleString(
        "en-US"
      )} contributors.
    </p>
  </div>
  <div class="contributors">
    <Contributors data={contributors} />
  </div>
  <div class="committees">
    This data came from the following committees:
    <ul>
      {#each committees as committee, i}
        <li>
          <a
            href={`https://cal-access.sos.ca.gov/Campaign/Committees/Detail.aspx?id=${committee}`}
          >
            {committee}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .legislator {
    border: 1px solid black;
    margin-bottom: 1rem;
    padding: 1rem;
  }
  .name-and-title {
    display: flex;
    justify-content: space-between;
  }
  .totals {
    font-size: 1rem;
  }
  .committees {
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  ul {
    display: inline-block;
    list-style-type: none;
    padding-left: 0;
  }
  li {
    display: inline-block;
    padding-right: 0.2rem;
  }
</style>
