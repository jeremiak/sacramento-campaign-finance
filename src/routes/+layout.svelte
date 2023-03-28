<script>
	import '../app.css';
</script>

<main>
	<slot />
</main>

<footer>
	Made by <a href="https://www.jeremiak.com">Jeremia</a> in 2023
</footer>

<style lang="scss">
	nav {
		align-items: center;
		display: flex;
		justify-content: space-around;
		width: 100%;

		a {
			margin-right: 1rem;
		}

		h1 {
			text-align: left;
		}
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
		bottom: 1rem;
		font-size: 14px;
		line-height: 18px;
		margin-bottom: 1rem;
		position: absolute;
		text-align: center;
		width: 100%;
	}
</style>
