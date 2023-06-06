<script lang="ts">
  export let value: string | null = null;
  export let selected: boolean = false;
  let default_value: string;
</script>

<li class="dropdown-item">
  <label contenteditable="false" bind:textContent={default_value}>
    <input type="checkbox" value={value ?? default_value?.trim()} checked={selected} />
    <slot />
  </label>
</li>

<style>
  li:has(label:hover) {
    background-color: var(--bg-shaded);
  }

  li.dropdown-item {
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
  }

  label {
    display: flex;
    width: 100%;
  }

  input {
    margin-right: 0.2rem;
  }
</style>
