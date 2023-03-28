<script>
  export let data = []

  function getContributorName(contributor) {
    const { contributorFirstName, contributorLastName } = contributor
    const contributorName = contributorFirstName === '' ? contributorLastName : `${contributorFirstName} ${contributorLastName}`
    return contributorName
  }
</script>

<div class="contributors">
  <ul class="contributors">
    {#each data as contributor, i}
        <li class="contributor">
          <div class="contributor-info">
            <div class="contributor-name">
              {getContributorName(contributor)}
            </div>
            <div class="contributor-location">
              {contributor.contributorCity}, {contributor.contributorState}
            </div>
          </div>
          <div class="contributor-amount monospace">
            ${contributor.amount.toLocaleString("en-US")}
          </div>
        </li>
    {/each}
  </ul>

  <!-- <div class="contributor-pagination">
    <p>
      {contributors.length.toLocaleString(
        "en-US"
      )} contributors
    </p>
  </div> -->
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
    text-align: right;

    p {
      font-size: 0.9rem;
      font-style: italic;
    }
  }
</style>