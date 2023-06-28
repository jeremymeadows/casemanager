<script lang="ts">
  import { onMount } from "svelte";
  import SelectList from "$lib/components/SelectList.svelte";
  import SelectListItem from "$lib/components/SelectListItem.svelte";
  import { dtfmt } from "$lib/utils/dates";
  import { sleep } from "$lib/utils/misc";

  export let data;

  let cases = data.cases;
  // let pins = data.pins;
  let mounted = false;

  let search = '';
  let sort_method: string = 'created';
  let sort_reversed = false;

  let status_filter = 'Open';
  let type_filter: string[] = [];
  let owner_filter: string[] = [];

  let columns = [
    { field: 'case_id', name: '#' },
    { field: 'status', name: 'Status' },
    { field: 'created', name: 'Open Date' },
    { field: 'closed', name: 'Close Date' },
    { field: 'name', name: 'Name' },
    { field: 'student_number', name: 'Student Number' },
    { field: 'type', name: 'Type' },
    { field: 'subtype', name: 'Subtype' },
    { field: 'contact_method', name: 'Contact Method' },
  ].concat(data.user.is_admin ? [{ field: 'assignee', name: 'Owner' }] : []);
  let view_columns = ['status', 'created', 'name', 'type'].concat(data.user.is_admin ? ['assignee'] : []);

  function sort(field: string) {
    if (sort_method === field) {
      sort_reversed = !sort_reversed;
    } else {
      if (sort_method !== '') {
        sort_reversed = false;
      }
      sort_method = field;
    }

    switch (field) {
      case 'case_id':
      case 'created':
        cases = cases.sort((a, b) => (sort_reversed ? -1 : 1) * ((a[field] ? a[field] - b[field] : sort_reversed) as number));
        break;
      default:
        cases = cases.sort((a, b) => (sort_reversed ? -1 : 1) * (a[field] ? a[field].localeCompare(b[field]) : sort_reversed));
    }

    localStorage.setItem('sorting', `${sort_method};${sort_reversed}`);
  }

  $: if (mounted) {
    localStorage.setItem('view_columns', view_columns.join(';'));
  };

  onMount(async () => {
    mounted = true;

    let [method, rev] = localStorage.getItem('sorting')?.split(';') ?? [sort_method, sort_reversed];
    [sort_method, sort_reversed] = ['', rev === 'true'];
    sort(method.toString());

    view_columns = localStorage.getItem('view_columns')?.split(';') ?? view_columns;
    document.querySelector('thead.loading').classList.remove('loading');

    document.querySelectorAll("[data-href]").forEach((e) => {
      let url = e.getAttribute("data-href")!;

      e.addEventListener("click", () => {
        console.log(url);
        console.log(e);
        window.location.pathname = url;
      });

      e.addEventListener("auxclick", () => {
        window.open(url, "_blank");
      });
    });
    await sleep(1000);
    document.querySelector('tbody.loading').classList.remove('loading');

    document.querySelector('.loading-icon').remove();
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

    {#if data.user.is_admin}
      <SelectList id="owner-filter" label="Owner" bind:selection={owner_filter}>
        {#each data.users as { user_id, name }}
          <SelectListItem value={user_id} selected={owner_filter.includes(String(user_id))}>{name}</SelectListItem>
        {/each}
      </SelectList>
    {/if}

    <SelectList id="view-columns" label="Columns" indicator={false} bind:selection={view_columns}>
      {#each columns as { field, name }}
        <SelectListItem value={field} selected={view_columns.includes(field)}>{name}</SelectListItem>
      {/each}
    </SelectList>
  </div>

  <br />

  <section>
    <table id="summary" class="table is-hoverable is-fullwidth">
      <thead class="loading">
        <th class="indicators status" />
        {#each columns as { field, name }}
          {#if field === 'status'}
            <th class="status" hidden={!view_columns.includes(field)}>Status</th>
          {:else}
            <th
              hidden={!view_columns.includes(field)}
              class:sorted={sort_method === field}
              class:reversed={sort_reversed}
              on:click={() => sort(field)}
            >
              {name}
            </th>
          {/if}
        {/each}
      </thead>
      <tbody class="loading">
        {#each cases as c}
          <tr
            data-href={`/cases/${c.case_id}`}
            class:new={c.new && c.user_id === data.user.user_id}
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
                ) &&
                (
                  owner_filter.length === 0 ||
                  owner_filter.includes(String(c.user_id))
                )
              )
            }
            title={c.description}
            hidden={c.is_open && status_filter === 'Closed' || !c.is_open && status_filter === 'Open'}
          >
            <td hidden={!view_columns.includes('case_id')}>{c.case_id}</td>
            <td hidden={!view_columns.includes('status')}>{c.is_open ? "Open" : "Closed"}</td>
            <td hidden={!view_columns.includes('created')}>{dtfmt("dd mmmm yyyy", c.created)}</td>
            <td hidden={!view_columns.includes('closed')}>{c.closed ? dtfmt("dd mmmm yyyy", c.closed) : ''}</td>
            <td hidden={!view_columns.includes('name')}>{c.name}</td>
            <td hidden={!view_columns.includes('student_number')}><span class="d-number">D00</span>{c.student_number}</td>
            <td hidden={!view_columns.includes('type')}>{c.type ?? 'None'}</td>
            <td hidden={!view_columns.includes('subtype')}>{c.subtype ?? 'None'}</td>
            <td hidden={!view_columns.includes('contact_method')}>{c.contact_method ?? 'N/A'}</td>
            <td hidden={!view_columns.includes('assignee')}>{c.assignee ?? 'Unassigned'}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="loading-icon" />
  </section>
</article>

<style lang="scss">
  .field.is-grouped {
    gap: 0.5rem;
  }

  section {
    overflow: auto;
  }

  th:not(.status), tr {
    cursor: pointer;
  }

  th:hover:not(.status) {
    background-color: var(--bg-shaded);
  }

  th.indicators {
    width: 0;
    margin: 0;
    padding: 0;
  }

  tr::before {
    content: '';
    display: inline-block;
    border-radius: 100%;
    width: 0.5em;
    height: 0.5em;
    transform: translateY(0.4em);
  }

  /* tr.pin::before { */
  /*   background-color: var(--blue); */
  /* } */

  tr.new::before {
    background-color: var(--red);
  }

  .sorted {
    position: relative;
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

  .d-number {
    color: var(--grey);
  }

  .loading {
    display: none;
  }

  .loading-icon {
    border: 6px solid #f1f1f1;
    border-top: 6px solid #4a4a4a;
    border-radius: 50%;
    width: 4rem;
    height: 4rem;
    animation: spin 2s ease-in-out alternate infinite;
    margin: 64px auto;
  }
</style>
