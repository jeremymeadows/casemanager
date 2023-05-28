<script lang="ts">
  import { onMount } from "svelte";
  import { dtfmt } from "$lib/utils/dates";
  import {  } from "$app/stores";

  export let data;

  let cases = data.cases;
  let sort_method: string = 'created';
  let sort_reversed = false;

  let count = 0;
  let show_closed = false;
  let search = '';

  // let fields = {
  //   is_open: 'Status',
  // };
  // let display_fields = [
  //   'is_open'
  // ];

  onMount(() => {
    let [method, rev] = localStorage.getItem('sorting')?.split(';') ?? [sort_method, sort_reversed];
    [sort_method, sort_reversed] = ['', rev === 'true'];
    sort(method.toString());

    document.querySelectorAll("[data-href]").forEach((e) => {
      e.addEventListener("click", () => {
        window.location.pathname = e.getAttribute("data-href")!;
      });
    });

    count = count_cases();
  });

  function count_cases(): number {
    return document.querySelectorAll(`tr:not(.filtered)${show_closed ? '' : ':not(.closed)'}`).length;
  }

  function sort(field: string) {
    if (sort_method === field) {
      sort_reversed = !sort_reversed;
    } else {
      sort_method = field;
      sort_reversed = false;
    }

    switch (field) {
      case 'created':
        cases = cases.sort((a, b) => (sort_reversed ? -1 : 1) * ((a[field] ? a[field] - b[field] : sort_reversed) as number));
        break;
      default:
        cases = cases.sort((a, b) => (sort_reversed ? -1 : 1) * (a[field] ? a[field].localeCompare(b[field]) : sort_reversed));
    }

    localStorage.setItem('sorting', `${sort_method};${sort_reversed}`);
  }

  // function select(e: MouseEvent) {
  //   console.log(e)
  //   let option = e.target as HTMLOptionElement;
  //   if (option.selected) {
  //     // option.selected = false;
  //   }
  // }

  // $: if (document) {
  // //   // document.styleSheets[-1]
  //   count = count_cases();
  // //   // count = document.querySelectorAll('tr[hidden="false"]').length;
  // }
</script>

<article>
  <!-- <h1>Cases ({count})</h1> -->
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

  <div class="field">
    <label for="show-closed">Show Closed Cases</label>
    <input id="show-closed" type="checkbox" bind:checked={show_closed} />
  </div>
  <input id="search" class="input" placeholder="Search" bind:value={search} />

  <!-- <button on:click={sort}>sort</button> -->

  <br />
  <br />

  <section>
    <table id="summary" class="table is-hoverable is-fullwidth">
      <thead>
        <th>Status</th>
        <th class:sorted={sort_method === 'created'} class:reversed={sort_reversed} on:click={() => sort('created')}>Open Date</th>
        <th class:sorted={sort_method === 'name'} class:reversed={sort_reversed} on:click={() => sort('name')}>Name</th>
        <th class:sorted={sort_method === 'type'} class:reversed={sort_reversed} on:click={() => sort('type')}>Type</th>
        <th class:sorted={sort_method === 'assignee'} class:reversed={sort_reversed} on:click={() => sort('assignee')}>Owner</th>
      </thead>
      <tbody>
        {#each cases as c}
          <tr
            data-href={`/cases/${c.case_id}`}
            class:closed={!c.is_open}
            class:filtered={search !== '' && !(c.name.toLowerCase().includes(search.toLowerCase()))}
            hidden={(c.is_open ? false : !show_closed)}
          >
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

  th:not(:nth-child(1)), tr {
    cursor: pointer;
  }

  th:hover:not(:nth-child(1)) {
    background-color: var(--bg-shaded);
  }

  .sorted::after {
    border: 3px solid var(--primary);
    border-radius: 2px;
    border-right: 0;
    border-top: 0;
    content: "";
    /* display: block; */
    height: 0.625em;
    margin-top: 0.5em;
    margin-left: 0.5em;
    pointer-events: none;
    position: absolute;
    /* top: 50%; */
    transform: rotate(-45deg);
    transform-origin: center;
    width: 0.625em;
  }

  .sorted.reversed::after {
    transform: rotate(135deg);
  }

  .select {
    width: 100%;
  }

  .closed {
    color: var(--grey);
    background-color: var(--bg-shaded);
  }

  .filtered {
    display: none;
  }
</style>
