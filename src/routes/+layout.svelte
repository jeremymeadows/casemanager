<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { onMount } from "svelte";
  // import Footer from "$lib/components/Footer.svelte";

  import "/src/global.scss";

  const { children, data } = $props();
  let user = $state({name: null, email: null, is_admin: false});

  onMount(() => {
    user = localStorage.getItem("user")
      ? (user = JSON.parse(localStorage.getItem("user")!))
      : (user = null);
  });
</script>

<svelte:head>
  <title>Case Manager</title>
  <meta name="author" content="Jeremy Meadows" />
</svelte:head>

<Navbar {user} />

{#if user}
  <Sidebar admin={user.is_admin} has_new={data.has_new_cases} />
{/if}

<main>
  {@render children()}
</main>

<!-- <Footer /> -->

<style lang="scss">
  main {
    padding-top: 6rem;
    padding-bottom: 6rem;
    min-height: calc(100vh - 4rem + 3px);
  }
</style>
