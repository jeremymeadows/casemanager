<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";

  import Switch from "$lib/components/Switch.svelte";

  export let data;

  const assignees = data.post.users;
  const types = data.post.types;

  onMount(async () => {
    document.getElementById("type")!.addEventListener("input", (e) => {
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

      for (let subtype of types.find((t) => t.name === (e.target as HTMLSelectElement).value).subtypes) {
        opt = document.createElement("option");
        opt.value = subtype;
        opt.textContent = subtype;
        subtype_select.appendChild(opt);
      }
    });
  });

  async function create_case() {
    axios
      .post("/cases/new_case", {
        name: (document.getElementById("name") as HTMLInputElement).value,
        student_number: (document.getElementById("student-number") as HTMLInputElement).value,
        type: (document.getElementById("type") as HTMLSelectElement).value,
        subtype: (document.getElementById("subtype") as HTMLSelectElement).value,
        description: (document.getElementById("description") as HTMLTextAreaElement).value,
        assignee: (document.getElementById("assignee") as HTMLSelectElement).value,
        status: (document.getElementById("status") as HTMLInputElement).checked,
      })
      .then((res) => {
        console.log(res);
        window.location.pathname = `/cases/${res.data}`;
      })
      .catch((err) => {
        console.log(err);
      });
  }
</script>

<article>
  <h1>New Case</h1>

  <div class="columns">
    <div class="column">
      <div class="field">
        <label for="name">Name</label>
        <input id="name" class="input" placeholder="John Doe" required />
      </div>
      <div class="field">
        <label for="student-number">Student number</label>
        <div class="control has-icons-left">
          <input
            id="student-number"
            class="input"
            placeholder="XXXXXX"
            minlength="6"
            maxlength="6"
          />
          <span class="icon is-left"> D00 </span>
        </div>
      </div>
      <div class="field">
        <label for="description">Description</label>
        <textarea id="description" class="textarea" />
      </div>

      <br />

      <div class="field">
        <label for="assignee">Assigned to</label>
        <div class="select">
          <select id="assignee">
            <option selected disabled>&mdash;</option>
            {#each assignees as assignee}
              <option value={assignee.id}>{assignee.name}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="field switch">
        <Switch id="status" left="Closed" right="Open" checked />
      </div>
    </div>

    <div class="column">
      <div class="field">
        <label for="type">Type</label>
        <div class="select">
          <select id="type">
            <option selected disabled>&mdash;</option>
            {#each types as type}
              <option value={type.name}>{type.name}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="field">
        <label for="subtype">Subtype</label>
        <div class="select">
          <select id="subtype" />
        </div>
      </div>
    </div>
  </div>

  <button id="save" class="center button" on:click={create_case}>
    Save
  </button
  >
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
