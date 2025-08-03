<script lang="ts">
  import { onMount } from "svelte";
  import { dtfmt } from "$lib/utils/dates";
  import Switch from "$lib/components/Switch.svelte";
  import axios from "axios";

  const { data } = $props();

  let edit = $state(!data.case);

  function swap_subtypes() {
    let type_select = document.getElementById("type")! as HTMLSelectElement;
    let subtype_select = document.getElementById("subtype")!;
    let new_select = document.createElement("select");
    subtype_select.replaceWith(new_select);

    subtype_select = new_select;
    subtype_select.id = "subtype";
    subtype_select.classList.add("input");

    let opt = document.createElement("option");
    opt.value = "";
    opt.selected = true;
    opt.disabled = true;
    opt.innerHTML = "&mdash;";
    subtype_select.appendChild(opt);

    for (let subtype of data.types[type_select.value]) {
      opt = document.createElement("option");
      opt.textContent = subtype;

      subtype_select.appendChild(opt);
    }
  }

  function get_case() {
    let type = (document.getElementById("type") as HTMLSelectElement).value;
    let subtype = (document.getElementById("subtype") as HTMLSelectElement).value;
    let assignee = (document.getElementById("assignee") as HTMLSelectElement).value;
    let contact_method = (document.getElementById("contact-method") as HTMLSelectElement).value;

    return {
      name: (document.getElementById("name") as HTMLInputElement).value,
      student_number: (document.getElementById("student-number") as HTMLInputElement).value,
      type: type ? type : null,
      subtype: subtype ? subtype : null,
      contact_method: contact_method ? contact_method : null,
      description: (document.getElementById("description") as HTMLTextAreaElement).value,
      assignee: assignee ? assignee : null,
      is_open: (document.getElementById("status") as HTMLInputElement).checked,
      just_closed: data.case?.is_open && !(document.getElementById("status") as HTMLInputElement).checked,
      closed: data.case?.closed,
    };
  }

  async function create_case() {
    axios
      .post("/cases", get_case())
      .then((res) => {
        window.location.pathname = `/cases/${res.data}`;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function save_case() {
    let new_case = get_case();
    let closed = null;

    if (data.case.is_open && !new_case.is_open) {
      closed = new Date();
    } else if (!data.case.is_open) {
      closed = data.case.closed;
    }

    axios
      .put("/cases", {
        case_id: data.case.case_id,
        new: data.case.assignee != new_case.assignee,
        closed: closed,
        ...new_case
      })
      .then((_) => {
        document.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onMount(() => {
    if (data.case?.assignee && data.case?.new) {
      document.location.reload();
    }
  });
</script>

<article>
  {#if data.case}
    <a id="back" class="button is-small" href="/cases/all" data-sveltekit-reload>
      <i class='bx bx-chevron-left' />&nbsp;Back
    </a>
  {/if}

  <h1>{data.case ? `Case #${data.case.id}` : 'New Case'}</h1>

  <div class="columns">
    <div class="column">
      <div class="field">
        <label for="name">Name</label>
        {#if edit}
          <input id="name" class="input" placeholder="John Doe" value={data.case?.name ?? ''} required />
        {:else}
          <div>{data.case.name}</div>
        {/if}
      </div>
      <div class="field">
        <label for="student-number">Student Number</label>
        {#if edit}
          <div class="control has-icons-left">
            <input
              id="student-number"
              class="input"
              placeholder="XXXXXX"
              minlength="6"
              maxlength="6"
              value={data.case?.student_number ?? ''}
            />
            <span class="icon is-left"> D00 </span>
          </div>
        {:else}
          <div>D00{data.case.student_number}</div>
        {/if}
      </div>
      <div class="field">
        <label for="description">Description</label>
        {#if edit}
          <textarea id="description" class="textarea" value={data.case?.description ?? ''} />
        {:else}
          <div>{data.case.description}</div>
        {/if}
      </div>

      <br />

      <div class="field">
        <label for="assignee">Assigned To</label>
        {#if edit}
          <div class="select">
            <select id="assignee">
              <option value="">Unassigned</option>
              {#each data.users as assignee}
                <option value={assignee.user_id} selected={assignee.user_id === data.case?.assignee}>{`${assignee.name} <${assignee.email}>`}</option>
              {/each}
            </select>
          </div>
        {:else}
          <div>{data.case.assignee_name ?? 'Unassigned'}</div>
        {/if}
      </div>
      {#if data.case}
        <div class="columns">
          <div class="field column">
            <label for="">Created</label>
            <div>{dtfmt('dd mmmm yyyy', data.case.created)}</div>
          </div>
          {#if !data.case.is_open}
            <div class="field column">
              <label for="">Closed</label>
              <div>{dtfmt('dd mmmm yyyy', data.case.closed)}</div>
            </div>
          {/if}
          </div>
      {/if}
    </div>

    <div class="column">
      <div class="field">
        <label for="type">Type</label>
        {#if edit}
          <div class="select">
            <select id="type" onchange={swap_subtypes}>
              <option value="" selected disabled>&mdash;</option>
              {#each Object.keys(data.types) as type}
                <option selected={type == data.case?.type}>{type}</option>
              {/each}
            </select>
          </div>
        {:else}
          <div>{data.case.type ?? 'None'}</div>
        {/if}
      </div>
      <div class="field">
        <label for="subtype">Subtype</label>
        {#if edit}
          <div class="select">
            <select id="subtype">
              {#each data.case && data.case.type ? data.types[data.case.type] : [] as subtype}
                <option selected={subtype == data.case?.subtype}>{subtype}</option>
              {/each}
            </select>
          </div>
        {:else}
          <div>{data.case.subtype ?? 'None'}</div>
        {/if}
      </div>

      <br />

      <div class="field">
        <label for="contact-method">Contact Method</label>
        {#if edit}
          <div class="select">
            <select id="contact-method">
              <option value="" selected={!data.case || !data.case.contact_method}>&mdash;</option>
              {#each data.contact_methods as contact_method}
                <option selected={data.case?.contact_method === contact_method}>{contact_method}</option>
              {/each}
            </select>
          </div>
        {:else}
          <div>{data.case.contact_method ?? "N/A"}</div>
        {/if}
      </div>

      <br />

      <div class="field">
        <label for="status">Status</label>
        {#if edit}
          <Switch id="status" left="Closed" right="Open" checked={data.case?.is_open ?? true} />
        {:else}
          <div>{data.case.is_open ? 'Open' : 'Closed'}</div>
        {/if}
      </div>
    </div>
  </div>

  <div class="center">
    {#if edit}
      <button
        id="save"
        class="button is-primary"
        onclick={() => {
          edit = false;
          if (data.case) {
            save_case();
          } else {
            create_case();
          }
          document.location.reload();
        }}
      >
        Save
      </button>
      {#if data.case}
        <button
          id="cancel"
          class="button"
          onclick={() => edit = false}
        >
          Cancel
        </button>
      {/if}
    {:else}
      <button
        id="edit"
        class="center button is-info"
        onclick={() => edit = true}
      >
        Edit
      </button>
    {/if}
  </div>
</article>

<style>
  #back {
    position: absolute;
    transform: translate(-2rem, -2rem);
  }

  .field .control .icon {
    color: #363636;
    top: 0.8px;
  }

  label {
    display: block;
    font-weight: bold;
  }

  select, .select {
    width: 100%;
  }
</style>
