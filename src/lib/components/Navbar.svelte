<script lang="ts">
  import { onMount } from "svelte";
  import { navigating } from "$app/stores";

  export let authenticated: boolean;

  const pages = authenticated ? { "Settings": "/settings", "Log Out": "/auth/logout" } : {};

  onMount(async () => {
    const menu = document.getElementById("burger-menu")!;
    menu.addEventListener("click", () => {
      menu.classList.toggle("is-active");
      document
        .getElementById(menu.getAttribute("data-target")!)!
        .classList.toggle("is-active");
    });

    document
      .querySelector(`.navbar-item[href='${document.location.pathname}']`)
      ?.classList.add("is-current-page");
  });

  $: if ($navigating) {
    document
      .querySelector(".is-current-page")
      ?.classList.remove("is-current-page");
    document
      .querySelector(`.navbar-item[href='${$navigating.to?.url.pathname}']`)
      ?.classList.add("is-current-page");
  }
</script>

<nav
  id="navbar"
  class="navbar is-fixed-top has-shadow"
  aria-label="main navigation"
>
  <div class="navbar-brand">
    <a href="/" class="navbar-item">DkIT SU Case Manager</a>
    {#if !true}
      <!-- prevents Svelte from optimizing out `.is-current-page` from the css since it's only set via script -->
      <div class="is-current-page" hidden />
    {/if}

    <a
      id="burger-menu"
      role="button"
      class="navbar-burger"
      aria-label="menu"
      aria-expanded="false"
      data-target="navbar"
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>

  <div class="navbar-menu">
    <div class="navbar-start" />

    <div class="navbar-end">
      {#each Object.entries(pages) as [page, url]}
        <a href={url} class="navbar-item">{page}</a>
      {/each}
    </div>
  </div>
</nav>

<style lang="scss">
  nav {
    margin: -8px;
    margin-bottom: 100%;
    padding: 8px 8px 0 8px;
  }

  /* .is-current-page { */
  /* } */
</style>
