<script>
  export let name = ''
  export let data = []
</script>

<div>
  {#if data.length > 0}
    <div class="e">
      <h2>Independent expenditures</h2>
      <ul>
        {#each data as ie}
          <li>
            <p>
              <a
                href="https://cal-access.sos.ca.gov/Campaign/Committees/Detail.aspx?id={ie.spenderId}&view=received"
                >{ie.spenderName}</a
              >
              has spent
              <span class="monospace">${ie.total.toLocaleString("en-US")}</span>
              to {#if ie.position === "S"}support{:else}oppose{/if}
              {name}.
            </p>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style lang="scss">
  ul {
    list-style-type: none;
    padding-left: 0;
  }

  h2 {
    font-size: 1.2rem;
  }
</style>