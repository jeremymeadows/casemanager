<script lang="ts">
  import { onMount } from "svelte";
  import SelectList from "$lib/components/SelectList.svelte";
  import SelectListItem from "$lib/components/SelectListItem.svelte";
  import { dtfmt } from "$lib/utils/dates";

  export let data;

  let cases = data.cases;

  let search = '';
  let sort_method: string = 'created';
  let sort_reversed = false;

  let status_filter = 'Open';
  let type_filter: string[] = [];

  let columns = [
    { field: 'status', name: 'Status' },
    { field: 'created', name: 'Open Date' },
    { field: 'name', name: 'Name' },
    { field: 'type', name: 'Type' },
    { field: 'subtype', name: 'Subtype' },
    { field: 'assignee', name: 'Owner' },
  ];
  let view_columns = ['status', 'created', 'name', 'type'].concat(data.user.is_admin ? ['assignee'] : []);

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

  onMount(() => {
    let [method, rev] = localStorage.getItem('sorting')?.split(';') ?? [sort_method, sort_reversed];
    [sort_method, sort_reversed] = ['', rev === 'true'];
    sort(method.toString());

    document.querySelectorAll("[data-href]").forEach((e) => {
      e.addEventListener("click", () => {
        window.location.pathname = e.getAttribute("data-href")!;
      });
    });
  });
</script>

<article>
  <h1>Cases</h1>

  <div class="field is-grouped">
    <SelectList id="status-filter" label="Status" bind:selection={status_filter} multiple={false}>
      <SelectListItem selected>Open</SelectListItem>
      <SelectListItem>Closed</SelectListItem>
      <SelectListItem>All</SelectListItem>
    </SelectList>

    <input id="search" class="input" placeholder="Search for a Name or Description" bind:value={search} />

    <SelectList id="type-filter" label="Types" bind:selection={type_filter}>
      {#each Object.keys(data.types) as type}
        <SelectListItem>{type}</SelectListItem>
      {/each}
      <SelectListItem value="">None</SelectListItem>
    </SelectList>

    <SelectList id="view-columns" label="Columns" bind:selection={view_columns}>
      {#each columns as { field, name }}
        <SelectListItem value={field} selected={view_columns.includes(field)}>{name}</SelectListItem>
      {/each}
    </SelectList>
  </div>

  <br />

  <section>
    <table id="summary" class="table is-hoverable is-fullwidth">
      <thead>
        {#each columns as { field, name }}
          {#if field === 'status'}
            <th hidden={!view_columns.includes(field)}>Status</th>
          {:else}
            <th hidden={!view_columns.includes(field)} class:sorted={sort_method === field} class:reversed={sort_reversed} on:click={() => sort(field)}>{name}</th>
          {/if}
        {/each}
      </thead>
      <tbody>
        {#each cases as c}
          <tr
            data-href={`/cases/${c.case_id}`}
            class:closed={!c.is_open}
            class:filtered={
              !(
                (
                  c.name.toLowerCase().includes(search.toLowerCase()) ||
                  c.description.toLowerCase().includes(search.toLowerCase())
                ) &&
                (
                  type_filter.length === 0 ||
                  type_filter.includes(c.type ?? '')
                )
              )
            }
            title={c.description}
            hidden={c.is_open && status_filter === 'Closed' || !c.is_open && status_filter === 'Open'}
          >
            <td hidden={!view_columns.includes('status')}>{c.is_open ? "Open" : "Closed"}</td>
            <td hidden={!view_columns.includes('created')}>{dtfmt("dd mmmm yyyy", c.created)}</td>
            <td hidden={!view_columns.includes('name')}>{c.name}</td>
            <td hidden={!view_columns.includes('type')}>{c.type ?? 'None'}</td>
            <td hidden={!view_columns.includes('subtype')}>{c.subtype ?? 'None'}</td>
            <td hidden={!view_columns.includes('assignee')}>{c.assignee ?? 'Unassigned'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</article>

<style lang="scss">
  .field.is-grouped {
    gap: 0.5rem;
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
    height: 0.625em;
    margin-top: 0.5em;
    margin-left: 0.5em;
    pointer-events: none;
    position: absolute;
    transform: rotate(-45deg);
    transform-origin: center;
    width: 0.625em;
  }

  .sorted.reversed::after {
    transform: rotate(135deg);
  }

  .closed {
    color: var(--grey);
    background-color: var(--bg-shaded);
  }

  .filtered {
    display: none;
  }
</style>
