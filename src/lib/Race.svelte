<script>
  import _ from 'lodash'
  export let data = null

  function sortContributors(contributors) {
    return _.orderBy(contributors, ['total', 'contributor'], ['desc', 'asc'])
  }
</script>

<section>
  <h1><a id={data.race}>{data.race}</a></h1>

  <ul class="candidates">
    {#each data.committees as candidate}
      <li class="candidate">
        <div class="candidate-name">{candidate.name}</div>
        <div class="candidate-stats">
         <p>${candidate.total.toLocaleString('en-US')} from {candidate.contributors.length.toLocaleString('en-US')} people, companies, and organizations. Here they are:</p>
        </div>
        <div class="candidate-contributors">
          <ul class="contributors">
            {#each sortContributors(candidate.contributors) as contributor}
              <li class="contributor">
                <div class="contributor-info">
                  <div class="contributor-name">
                    {contributor.contributor}
                  </div>
                  <div class="contributor-location">
                    {contributor.contributorCity}, {contributor.contributorState}
                  </div>
                </div>
                <div class="contributor-amount">
                  ${contributor.total.toLocaleString('en-US')}
                </div>
              </li>
            {/each}
          </ul>
        </div>
      </li>
    {/each}
  </ul>
</section>

<style lang="scss">
  section {
    background-color: #ebebeb;
    margin-bottom: 2.5rem;
    padding: 1.5rem;
  }

  h1 {
    margin-top: 0;
  }

  ul {
  }
  
  ul.candidates {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    list-style-type: none;
    padding-left: 0;

    @media screen and (min-width: 700px) {
      flex-direction: row;      
    }
  }

  .candidate {
    // border: 1px solid green;
    background: #ffffff;
    flex: 1;
    margin: .5rem;
    padding: .5rem;
  }

  .candidate-name {
    font-weight: 700;
  }

  ul.contributors {
    list-style-type: none;
    height: 400px;
    margin-top: 1rem;
    padding: 0;
    overflow-y: scroll;

    li {
      padding: .5rem;
    }

    li:nth-child(2n) {
      background-color: #cccccc;
    }
  }

  .contributor {
    display: flex;
    justify-content: space-between;
  }

  .contributor-location {
    font-style: italic;
  }

  .contributor-info {

  }
</style>