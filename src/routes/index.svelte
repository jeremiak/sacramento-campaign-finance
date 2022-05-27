<script context="module">
  import { committees } from "$lib/data.json";
  export async function load() {
    const races = {};
    committees.forEach((committee) => {
      const { office, district } = committee;
      const raceKey = district === "" ? office : `${office} ${district}`;

      if (races[raceKey]) {
        races[raceKey].push(committee);
      } else {
        races[raceKey] = [committee];
      }
    });

    const array = [];
    Object.keys(races).forEach((raceKey) => {
      const committees = races[raceKey];
      const race = {
        race: raceKey,
        committees,
      };

      array.push(race);
    });

    return {
      props: {
        races: array,
      },
    };
  }

  export const prerender = true
</script>

<script>
  import Race from "$lib/Race.svelte";
  export let races = null;
</script>

<svelte:head>
  <title>Following the money in Sacramento elections</title>
</svelte:head>

<section>
  <h1>Sacramento campaign finance</h1>

  <p>Who's contributing to the current races in Sacramento?</p>

  <ul class="races-toc">
    {#each races as race}
      <li class="race">
        <a href={`#${race.race}`}>{race.race}</a>
      </li>
    {/each}
  </ul>

  <ul class="races">
    {#each races as race}
      <li class="race">
        <Race data={race} />
      </li>
    {/each}
  </ul>
</section>

<style lang="scss">
  h1 {
    font-weight: 900;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

</style>
