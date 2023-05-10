<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";

  export let data;

  const ASIGNEES = data.post.users;
  const TYPES = data.post.types;

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

      for (let subtype of TYPES.find((t) => t.name === (e.target as HTMLSelectElement).value).subtypes) {
        opt = document.createElement("option");
        opt.value = subtype;
        opt.textContent = subtype;
        subtype_select.appendChild(opt);
      }
    });
  });

  async function create_case() {
    axios.post('/cases/new_case', {
      name: (document.getElementById('name') as HTMLInputElement).value,
      student_number: (document.getElementById('student-number') as HTMLInputElement).value,
      type: (document.getElementById('type') as HTMLSelectElement).value,
      subtype: (document.getElementById('subtype') as HTMLSelectElement).value,
      description: (document.getElementById('description') as HTMLTextAreaElement).value,
      assignee: (document.getElementById('assignee') as HTMLSelectElement).value,
      status: (document.getElementById('status') as HTMLInputElement).value,
    }).then((res) => {
      console.log(res);
    }).catch((err) => {
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
          <input id="student-number" class="input" placeholder="XXXXXX" minlength="6" maxlength="6" />
          <span class="icon is-left">
            D00
          </span>
        </div>
      </div>
      <div class="field">
        <label for="description">Description</label>
        <textarea id="description" class="textarea" />
      </div>

      <br />

      <div class="field">
        <label for="assignee">Assigned to</label>
        <select id="assignee" class="input">
          <option selected disabled>&mdash;</option>
          {#each ASIGNEES as assignee}
            <option value={assignee.id}>{assignee.name}</option>
          {/each}
        </select>
      </div>
      <div class="field">
        <label for="status">Status</label><br />
        Closed <input id="status" class="checkbox" type="checkbox" /> Open
      </div>
    </div>

    <div class="column">
      <div class="field">
        <label for="type">Type</label>
        <select id="type" class="input">
          <option selected disabled>&mdash;</option>
          {#each TYPES as type}
            <option value={type.name}>{type.name}</option>
          {/each}
        </select>
      </div>
      <div class="field">
        <label for="subtype">Subtype</label>
        <select id="subtype" class="input" />
      </div>
    </div>
  </div>

  <button id="save" class="center button" on:click={create_case}>&nbsp;Save&nbsp;</button>
</article>

<style>
  .field .control .icon {
    color: #363636;
    top: 0.8px;
  }
</style>
