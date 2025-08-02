<script lang="ts">
  import { onMount } from "svelte";
  import { navigating } from "$app/state";

  let { admin, has_new } = $props();

  onMount(() => {
    document
      .querySelector(`#sidebar a[href='${document.location.pathname}']`)
      ?.classList.add("is-active");
  });

  $effect(() => {
    if (navigating) {
      document.querySelector(".is-active")?.classList.remove("is-active");
      document
        .querySelector(`#sidebar a[href='${navigating.to?.url.pathname}']`)
        ?.classList.add("is-active");
    }
  });
</script>

<aside id="sidebar" class="menu">
  <p class="menu-label">General</p>
  <ul class="menu-list">
    <li><a href="/">Dashboard</a></li>
  </ul>
  <p class="menu-label">Cases</p>
  <ul class="menu-list">
    <li>
      <a href="/cases/all" data-sveltekit-reload>
        All Cases<span class="tag" hidden={!has_new}>New</span>
      </a>
    </li>
    <li><a href="/cases/new">New Case</a></li>
  </ul>
  {#if admin}
    <p class="menu-label">Administration</p>
    <ul class="menu-list">
      <li><a href="/admin/reports">Reports</a></li>
      <li><a href="/admin/users">Users</a></li>
      <li><a href="/admin/settings">Settings</a></li>
      <li><a href="/admin/generate">Generate Demo Data</a></li>
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

  .tag {
    color: white;
    font-size: 0.5em;
    background-color: var(--red);
    margin-left: 1em;
    position: relative;
    top: -0.5em;
  }
</style>
