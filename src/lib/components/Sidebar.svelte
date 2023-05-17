<script lang="ts">
  export let admin: boolean;
</script>

<ul id="sidebar">
  <li>
    <a href="/">Dashboard</a>
  </li>

  <li>
    <a href="/cases">Cases</a>
    <ul>
      <li>
        <a href="/cases/new">New Case</a>
      </li>
    </ul>
  </li>

  <li>
    <a href="/404">Reports</a>
  </li>

  {#if admin}
    <li>
      <a href="/admin">Admin</a>
    </li>
  {/if}
</ul>

<style lang="scss">
  @import "../../variables.scss";

  #sidebar {
    left: 0;
    position: fixed;
    border-right: 2px solid var(--bg-alt);
    padding: 4rem 1rem;
    height: 100vh;
    width: $sidebar-width;
  }

  ul ul {
    padding-left: 1rem;
  }
</style>
