<script lang="ts">
  import { onMount } from "svelte";

  let theme = "dark";

  function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
  }

  onMount(() => {
    if (localStorage.getItem("theme") === "light") {
      toggleTheme();
    }
  });
</script>

<button id="toggle-dark-mode" class="button" on:click={toggleTheme}>
  {#if theme === "dark"}
    <i class="bx bx-sm bxs-sun" />
  {:else}
    <i class="bx bx-sm bxs-moon" />
  {/if}
</button>

<style lang="scss">
  @import "bulma/sass/utilities/initial-variables.sass";
  @import "bulma/sass/utilities/functions.sass";

  #toggle-dark-mode {
    margin-top: 0.4em;
    background: none;
    border: none;
  }

  button:has(i.bxs-sun),
  button:has(i.bxs-sun):focus {
    color: $yellow;
  }

  button:has(i.bxs-sun):hover {
    color: findDarkColor($yellow);
  }

  button:has(i.bxs-moon),
  button:has(i.bxs-moon):focus {
    color: $purple;
  }

  button:has(i.bxs-moon):hover {
    color: findDarkColor($purple);
  }
</style>
