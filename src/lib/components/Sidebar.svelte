<script lang="ts">
  import { onMount } from "svelte";
  import { navigating } from "$app/stores";

  export let admin: boolean;

  onMount(() => {
    document
      .querySelector(`#sidebar a[href='${document.location.pathname}']`)
      ?.classList.add("is-active");
  });

  $: if ($navigating) {
    document.querySelector(".is-active")?.classList.remove("is-active");
    document
      .querySelector(`#sidebar a[href='${$navigating.to?.url.pathname}']`)
      ?.classList.add("is-active");
  }
</script>

<aside id="sidebar" class="menu">
  <p class="menu-label">General</p>
  <ul class="menu-list">
    <li><a href="/">Dashboard</a></li>
  </ul>
  <p class="menu-label">Cases</p>
  <ul class="menu-list">
    <li><a href="/cases">All Cases</a></li>
    <li><a href="/cases/new">New Case</a></li>
  </ul>
  {#if admin}
    <p class="menu-label">Administration</p>
    <ul class="menu-list">
      <li><a href="/404">Reports</a></li>
      <li><a href="/admin">Users</a></li>
      <li><a href="/admin/settings">Settings</a></li>
    </ul>
  {/if}
</aside>

<style lang="scss">
  @import "../../variables.scss";

  #sidebar {
    left: 0;
    font-size: 0.8rem;
    position: fixed;
    border-right: 2px solid var(--bg-alt);
    padding: 4rem 1rem;
    height: 100vh;
    width: $sidebar-width;
  }
</style>
