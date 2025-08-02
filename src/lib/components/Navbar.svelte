<script lang="ts">
  import { onMount } from "svelte";
  import { navigating } from "$app/state";

  export const { user } = $props();

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

  $effect(() => {
    if (navigating) {
      document
        .querySelector(".is-current-page")
        ?.classList.remove("is-current-page");
      document
        .querySelector(`.navbar-item[href='${navigating.to?.url.pathname}']`)
        ?.classList.add("is-current-page");
    }
  });
</script>

<nav
  id="navbar"
  class="navbar is-fixed-top has-shadow"
  aria-label="main navigation"
>
  <div class="navbar-brand">
    <a href="/" class="navbar-item">Case Manager</a>

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
      {#if user}
        <div class="navbar-item has-dropdown is-hoverable">
          <span class="navbar-link">
            {user.name}
          </span>
          <div class="navbar-dropdown">
            <a href="/settings" class="navbar-item">
              Account Settings
            </a>
            <a href="/auth/logout" class="navbar-item">
              Log Out
            </a>
          </div>
        </div>
      {/if}
    </div>
  </div>
</nav>

<style lang="scss">
  nav {
    margin: -8px;
    margin-bottom: 100%;
    padding: 8px 8px 0 8px;
  }

  nav .navbar-brand .navbar-item {
    font-weight: bold;
  }

  nav .navbar-dropdown {
    left: auto;
    right: 0;
  }
</style>
