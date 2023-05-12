<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  import '/src/global.scss';

  export let data;

  const authenticated: boolean = !!data.user;
</script>

<svelte:head>
  <title>DkIT SU Case Manager</title>

  <meta name="author" content="Jeremy Meadows" />
  <meta name="url" content="https://dkitsu.com/" />
</svelte:head>

<Navbar authenticated={authenticated} />

{#if authenticated}
  <Sidebar />
{/if}

<main>
  <slot />
</main>

<Footer />

<style lang="scss">
  main {
    padding-top: 6rem;
    padding-bottom: 6rem;
    min-height: calc(100vh - 4rem + 3px);
  }
</style>
