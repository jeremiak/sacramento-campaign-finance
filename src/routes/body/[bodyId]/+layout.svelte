<nav>
	<h1><a href="/">Sacramento Campaign Cash</a></h1>

	<div>
		<a href="/body/sac-city">City Council</a>
		<a href="/body/sac-county">County Board of Supervisors</a>
	</div>
</nav>

<slot />

<style lang="scss">

	h1 {
		line-height: 1.1em;
	}
	nav a {
		text-decoration: none;
	}
	nav {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		@media screen and (min-width: 700px) {
			flex-direction: row;
			align-items: center;
		}
	}

	nav div {
		display: flex;
		flex-direction: column;

		@media screen and (min-width: 700px) {
			display: block;
		}
	}

	nav a + a {
		border: 0;
		padding: 0;
		@media screen and (min-width: 700px) {
			border-left: 2px solid black;
			padding-left: .4rem;
		}
	}
</style>