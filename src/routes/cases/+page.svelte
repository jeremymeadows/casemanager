<script lang="ts">
  import { onMount } from "svelte";
  import { dtfmt } from "$lib/utils/dates";

  export let data;

  const cases = data.cases;

  let fields = {
    is_open: 'Status',
  };
  let display_fields = [
    'is_open'
  ];

  onMount(() => {
    document.querySelectorAll("[data-href]").forEach((e) => {
      e.addEventListener("click", () => {
        window.location.pathname = e.getAttribute("data-href")!;
      });
    });
  });

  function select(e: MouseEvent) {
    console.log(e)
    let option = e.target as HTMLOptionElement;
    if (option.selected) {
      // option.selected = false;
    }
  }
</script>

<article>
  <h1>Cases</h1>

  <!-- <div class="dropdown is-hoverable"> -->
  <!--   <div class="dropdown-trigger"> -->
  <!--     <button -->
  <!--       class="button" -->
  <!--       aria-haspopup="true" -->
  <!--       aria-controls="dropdown-menu4" -->
  <!--     > -->
  <!--       <span>Hover me</span> -->
  <!--       <span class="icon is-small"> -->
  <!--         <i class="bx bx-chevron-down" /> -->
  <!--       </span> -->
  <!--     </button> -->
  <!--   </div> -->
  <!--   <div class="dropdown-menu" role="menu"> -->
  <!--     <div class="dropdown-content"> -->
  <!--       <div class="dropdown-item"> -->
  <!--         <div class="select is-multiple"> -->
  <!--           <select id="fields" multiple on:click|preventDefault={select}> -->
  <!--             <option>Status</option> -->
  <!--             <option>Open Date</option> -->
  <!--             <option>Name</option> -->
  <!--             <option>Type</option> -->
  <!--             <option>Owner</option> -->
  <!--           </select> -->
  <!--         </div> -->
  <!--       </div> -->
  <!--     </div> -->
  <!--   </div> -->
  <!-- </div> -->

  <input type="checkbox" /> <input id="search" class="input" placeholder="Search" />

  <br />
  <br />

  <section>
    <table id="summary" class="table is-hoverable is-fullwidth">
      <thead>
        <th>Status</th>
        <th>Open Date</th>
        <th>Name</th>
        <th>Type</th>
        <th>Owner</th>
      </thead>
      <tbody>
        {#each cases as c}
          <tr data-href={`/cases/${c.case_id}`} class:closed={!c.is_open}>
            <td>{c.is_open ? "Open" : "Closed"}</td>
            <td>{dtfmt("dd mmmm yyyy", c.created)}</td>
            <td>{c.name}</td>
            <td>{c.type ?? 'None'}</td>
            <td>{c.assignee ?? 'Unassigned'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</article>

<style lang="scss">
  .dropdown-item, .dropdown-content {
    padding: 0;
    /* background-color: #0000; */
  }

  .select {
    width: 100%;
  }

  /* #summary { */
  /*   width: 100%; */
  /*   background-color: var(--bg); */
  /*   color: var(--fg); */
  /*   border: 1px solid var(--grey); */
  /* } */

  /* #summary th { */
  /*   color: var(--fg); */
  /* } */

  /* #summary thead { */
  /*   border-bottom-color: var(--grey); */
  /* } */

  /* #summary tr[data-href] { */
  /*   cursor: pointer; */
  /* } */

  /* #summary tr:hover, #summary tr.closed:hover { */
  /*   background-color: var(--bg-alt); */
  /* } */

  .closed {
    color: var(--grey);
    background-color: var(--bg-shaded);
  }
</style>
