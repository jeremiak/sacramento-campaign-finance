<script>
  import Candidate from './Candidate.svelte'
  export let data = []

  $: candidatesWithNoMoney = data.committees.filter(d => d.total === 0)
</script>

<section>
  <h1><a id={data.race}>{data.race}</a></h1>

  <ul class="candidates">
    {#each data.committees as candidate}
    {#if candidate.total > 0}
      <li class="candidate">
        <Candidate {candidate} />
      </li>
      {/if}
    {/each}
    {#if data.committees.length === 1}
    <li class="candidate unopposed">
      <p>There's only one person running in this race.</p>
    </li>
    {/if}
  </ul>

  {#if candidatesWithNoMoney.length > 0}
    <p>{candidatesWithNoMoney.map(c => c.name).join(' and ')} {#if candidatesWithNoMoney.length === 1}hasn't{:else}haven't{/if} raised any money yet.</p>
  {/if}
</section>

<style lang="scss">
  section {
    color: #212121;
    margin-bottom: 2.5rem;
    padding: 1.5rem;
  }

  h1 {
    margin-top: 0;

    a {
      color: white;
    }
  }
  
  ul.candidates {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-around;
    list-style-type: none;
    padding-left: 0;

    @media screen and (min-width: 700px) {
      flex-direction: row;      
    }
  }

  .candidate {
    background: #ffffff;
    flex: 1;
    margin-top: 0.5rem;
    min-width: 30%;
    padding: 0.5rem;

    @media screen and (min-width: 700px) {
      margin: 0.5rem;
      max-width: 50%;
    }
  }

  .candidate.unopposed {
    background: inherit;
    font-style: italic;
    display: none;

    @media screen and (min-width: 700px) {
      display: block;
    }
  }

  
  </style>