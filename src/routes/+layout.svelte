<script>
	import '../app.css';
</script>

<div>
	<main>
		<slot />
	</main>

	<footer>
		Made by <a href="https://www.jeremiak.com">Jeremia</a> in 2023
	</footer>
</div>

<style lang="scss">
	div {
		position: relative;
	}
	main {
    max-width: 90%;
    margin: 0 auto;
  }

  @media screen and (min-width: 700px) {
    main {
      max-width: 80%;
    }
  }
	footer {
		bottom: 0;
		font-size: 14px;
		line-height: 18px;
		margin-bottom: 1rem;
		text-align: center;
		width: 100%;
	}
</style>
