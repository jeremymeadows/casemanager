<script lang="ts">
  import { onMount } from "svelte";
  import { random_string } from "$lib/utils/misc";

  let {
    children,
    id,
    label = "Select",
    multiple = true,
    indicator = true,
    selection = $bindable(multiple ? [] : null),
  } = $props();

  let component_id = id ?? `s-${random_string(12)}`;

  function toggle() {
    let visible = document
      .getElementById(component_id)
      .classList.toggle("is-active");

    if (visible) {
      document.addEventListener('click', dismiss);
    } else {
      document.removeEventListener('click', dismiss);
    }
  }

  function dismiss(ev: MouseEvent) {
    if (!ev.composedPath().includes(document.getElementById(component_id))) {
      toggle();
    }
  }

  // export function reset(target: HTMLElement) {
  //   target.querySelectorAll('input:checked').forEach((e) => (e as HTMLInputElement).checked = false);
  // }

  onMount(() => {
    document.querySelectorAll(`#${component_id} form input`).forEach((el) => {
      let input = el as HTMLInputElement;
      input.name = component_id;
      input.type = multiple ? "checkbox" : "radio";
    });

    document.querySelector(`#${component_id} form`).addEventListener("input", () => {
      selection = multiple
        ? Array.from(document.querySelectorAll(`#${component_id} form li:has(input:checked) input`)).map((e) => (e as HTMLInputElement).value)
        : (document.querySelector(`#${component_id} form li input:checked`) as HTMLInputElement)?.value;
    });
  });
</script>

<div id={component_id} class="dropdown">
  <div class="dropdown-trigger">
    <button
      class="button"
      class:selected={multiple && selection.length > 0}
      class:indicator={indicator}
      aria-haspopup="true"
      aria-controls="dropdown-menu"
      onclick={toggle}
    >
      <span>{label}</span>
      <span class="icon">
        <i class="bx bx-chevron-down" />
      </span>
    </button>
  </div>
  <div class="dropdown-menu" role="menu">
    <form class="dropdown-content">
      <ul>
        {@render children()}
      </ul>
    </form>
  </div>
</div>

<style>
  .dropdown .dropdown-trigger .button.selected.indicator {
    border-color: var(--blue);
  }
</style>
