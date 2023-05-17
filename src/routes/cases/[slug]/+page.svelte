<script lang="ts">
  import { dtfmt } from "$lib/utils/dates";
  import Switch from "$lib/components/Switch.svelte";
  import axios from "axios";

  export let data: { user: any, types: any, users: any, "case": any };

  let edit = !data.case;

  function swap_subtypes() {
    let type_select = document.getElementById("type")! as HTMLSelectElement;
    let subtype_select = document.getElementById("subtype")!;
    let new_select = document.createElement("select");
    subtype_select.replaceWith(new_select);

    subtype_select = new_select;
    subtype_select.id = "subtype";
    subtype_select.classList.add("input");

    let opt = document.createElement("option");
    opt.selected = true;
    opt.disabled = true;
    opt.innerHTML = "&mdash;";
    subtype_select.appendChild(opt);

    for (let subtype of data.types[type_select.value]) {
      opt = document.createElement("option");
      opt.value = subtype;
      opt.textContent = subtype;

      subtype_select.appendChild(opt);
    }
  }

  function get_case() {
    return {
      name: (document.getElementById("name") as HTMLInputElement).value,
      student_number: (document.getElementById("student-number") as HTMLInputElement).value,
      type: (document.getElementById("type") as HTMLSelectElement).value,
      subtype: (document.getElementById("subtype") as HTMLSelectElement).value,
      description: (document.getElementById("description") as HTMLTextAreaElement).value,
      assignee: (document.getElementById("assignee") as HTMLSelectElement).value,
      status: (document.getElementById("status") as HTMLInputElement).checked,
    };
  }

  async function create_case() {
    axios
      .post("/cases", get_case())
      .then((res) => {
        console.log(res);
        window.location.pathname = `/cases/${res.data}`;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function save_case() {
    axios
      .put("/cases", {
        case_id: data.case.case_id,
        ...get_case(),
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
</script>

<article>
  <a class="button" href="/cases">&lt; Back</a>

  <h1>{data.case ? `Case #${data.case.case_id}` : 'New Case'}</h1>

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
        <label for="student-number">Student number</label>
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
        <label for="assignee">Assigned to</label>
        {#if edit}
          <div class="select">
            <select id="assignee">
              <option>Unassigned</option>
              {#each data.users as assignee}
                <option value={assignee.user_id} selected={assignee.user_id === data.case?.assignee}>{assignee.name}</option>
              {/each}
            </select>
          </div>
        {:else}
          <div>{data.case.assignee}</div>
        {/if}
      </div>
      <div class="field switch">
        <label for="">Status</label>
        {#if edit}
          <Switch id="status" left="Closed" right="Open" checked={data.case?.is_open ?? true} />
        {:else}
          <div>{data.case.is_open ? 'Open' : 'Closed'}</div>
        {/if}
      </div>
      {#if data.case}
        <div class="field switch">
          <label for="">Created</label>
          <div>{dtfmt('dd mmmm yyyy', data.case?.created)}</div>
        </div>
      {/if}
    </div>

    <div class="column">
      <div class="field">
        <label for="type">Type</label>
        {#if edit}
          <div class="select">
            <select id="type" on:change={swap_subtypes}>
              <option selected disabled>&mdash;</option>
              {#each Object.keys(data.types) as type}
                <option value={type} selected={type == data.case?.type}>{type}</option>
              {/each}
            </select>
          </div>
        {:else}
          <div>{data.case.type}</div>
        {/if}
      </div>
      <div class="field">
        <label for="subtype">Subtype</label>
        {#if edit}
          <div class="select">
            <select id="subtype">
              {#each data.types[data.case?.type] as subtype}
                <option value={subtype} selected={subtype == data.case?.subtype}>{subtype}</option>
              {/each}
            </select>
          </div>
        {:else}
          <div>{data.case.subtype}</div>
        {/if}
      </div>
    </div>
  </div>

  <div class="center">
    {#if edit}
      <button
        id="save"
        class="button is-primary"
        on:click={() => {
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
          on:click={() => edit = false}
        >
          Cancel
        </button>
      {/if}
    {:else}
      <button
        id="edit"
        class="center button"
        on:click={() => edit = true}
      >
        Edit
      </button>
    {/if}
  </div>
</article>

<style>
  .field .control .icon {
    color: #363636;
    top: 0.8px;
  }

  label {
    display: block;
  }

  select, .select {
    width: 100%;
  }
</style>
