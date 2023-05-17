<script lang="ts">
  import { onMount } from "svelte";
  import { dtfmt } from "$lib/utils/dates";

  export let data;
  const cases = data.cases;

  onMount(() => {
    document.querySelectorAll("[data-href]").forEach((e) => {
      e.addEventListener("click", () => {
        window.location.pathname = e.getAttribute("data-href")!;
      });
    });
  });
</script>

<article>
  <h1>Cases</h1>

  <section>
    <table id="summary" class="table">
      <thead>
        <th>Status</th>
        <th>Open Date</th>
        <th>Name</th>
        <th>Type</th>
        <th>Owner</th>
      </thead>
      <tbody>
        {#each cases as c}
          <tr data-href={`/cases/${c.case_id}`}>
            <td>{c.is_open ? "Open" : "Closed"}</td>
            <td>{dtfmt("dd mmmm yyyy", c.created)}</td>
            <td>{c.name}</td>
            <td>{c.type}</td>
            <td>{c.assignee}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</article>

<style lang="scss">
  #summary {
    width: 100%;
    background-color: var(--bg);
    color: var(--fg);
    border: 1px solid var(--grey);
  }

  #summary th {
    color: var(--fg);
  }

  #summary thead {
    border-bottom-color: var(--grey);
  }

  #summary tr[data-href] {
    cursor: pointer;
  }

  #summary tr:hover {
    background-color: var(--bg-alt);
  }
</style>
