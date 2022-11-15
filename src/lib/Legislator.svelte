<script>
  import { sum } from 'd3-array'
  import { formatDollar } from './format';
  import Contributors from './Contributors.svelte';
  export let name = ''
  export let title = ''
  export let contributors = []
  export let committees = []

  $: total = sum(contributors, d => d.total)
</script>

<div class="legislator">
  <div class="name-and-title">
    <div class="name">{name} - {formatDollar(total)}</div>
    <div class="title">{title}</div>
  </div>
  <div class="contributors">
    <Contributors data={contributors} />
  </div>
  <div class="committees">
    This data came from the following committees:
    <ul>
      {#each committees as committee}
        <li><a href={`https://cal-access.sos.ca.gov/Campaign/Committees/Detail.aspx?id=${committee}`}>{committee}</a></li>
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
  .committees {
    font-size: .9rem;
  }
  ul {
    display: inline-block;
    list-style-type: none;
    padding-left: 0;
  }
  li {
    display: inline-block;
    padding-right: .2rem;
  }
  li:after {
    content: ',';
    display: inline-block;
  }
  li:last-of-type:before {
    content: 'and';
    display: inline-block;
    padding-left: .2rem;
    padding-right: .2rem;
  }
  li:last-of-type:after {
    display: none;
  }
</style>