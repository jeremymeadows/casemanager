<script lang="ts">
  import axios from "axios";
  import { open_dialog_modal, close_dialog } from "$lib/utils/dialogs.js";

  export let data;

  let editing = '';

  function add(ev: MouseEvent, type: string | HTMLElement, subtype: string | HTMLElement | null = null) {
    let el = ev.currentTarget as HTMLButtonElement;

    if (typeof(type) !== 'string') {
      type = (type as HTMLInputElement).value;
    }
    if (subtype && typeof(subtype) !== 'string') {
      subtype = (subtype as HTMLInputElement).value;
    }

    if (editing === '') {
      editing = el.getAttribute('data-for')!;
    } else {
      let res = subtype ? axios.put('/api/admin/settings', { type: type, subtype: subtype }) : axios.post('/api/admin/settings', { type: type });
      res
        .then(() => {
          editing = '';
          document.location.reload();
        })
        .catch(() => {
          document.getElementById('error-message').classList.remove('hidden');
        });
    }
  }

  function cancel() {
    editing = '';
  }

  function remove(type: string, subtype: string | null = null) {
    let res = subtype ? axios.patch('/api/admin/settings', { type: type, subtype: subtype }) : axios.delete('/api/admin/settings', { data: { type: type } });
    res
      .then(() => {
        document.location.reload();
      })
      .catch(() => {
        document.getElementById('error-message').classList.remove('hidden');
      });
  }
</script>

<article>
  <h1>Admin Settings</h1>

  <article id="error-message" class="message is-danger hidden">
    <div class="message-body">
      An error occurred, please refresh the page and try again.
    </div>
  </article>

  <section>
    <h2>Types</h2>
    <ul>
      {#each Object.keys(data.types) as type}
        <li>
          <h3>{type}
            {#if data.types[type].length === 0}
              <button class="is-danger" title="remove type" on:click={() => remove(type)}><i class='bx bx-minus' /></button>
            {:else}
              <button class="disabled" title="please remove all subtypes before deleting the type" disabled><i class='bx bx-minus' /></button>
            {/if}
          </h3>
          <ul>
            {#each data.types[type] as subtype}
              <li><h4>{subtype}<button class="is-danger" title="remove subtype" on:click={() => remove(type, subtype)}><i class='bx bx-minus' /></button></h4></li>
            {/each}
            <li>
              <input id="{type}-new-subtype" class="" type="text" placeholder="new subtype" hidden={!editing || editing !== `${type}-new-subtype`} />
              <button class="is-warning" title="cancel" data-for="{type}-new-subtype" hidden={!editing || editing !== `${type}-new-subtype`} on:click={cancel}><i class='bx bx-x' /></button>
              <button class="is-success" title="new subtype" data-for="{type}-new-subtype" hidden={!!editing && editing !== `${type}-new-subtype`} on:click={(ev) => add(ev, type, document.getElementById(`${type}-new-subtype`))}><i class='bx bx-plus' /></button>
            </li>
          </ul>
        </li>
      {/each}
      <li>
        <input id="new-type" class="" type="text" placeholder="new type" hidden={!editing || editing !== 'new-type'} />
        <button class="is-warning" title="cancel" data-for="new-type" hidden={!editing || editing !== 'new-type'} on:click={cancel}><i class='bx bx-x' /></button>
        <button class="is-success" title="new type" data-for="new-type" on:click={(ev) => add(ev, document.getElementById('new-type'))}><i class='bx bx-plus' /></button>
      </li>
    </ul>
  </section>

  <dialog id="delete-confirm">
    <h2>Are you sure you want to delete this case type?</h2>
    <h3>All associated cases will be moved to the 'None' category.</h3>
    <br />
    <div class="center">
      <button
        class="button"
        on:click={close_dialog}
      >
        Cancel
      </button>
      <button
        class="button is-danger"
        on:click={(ev) => {
          close_dialog(ev);
        }}
      >
        Reset
      </button>
    </div>
  </dialog>
</article>

<style lang="scss">
  h3 {
    font-size: 1.2em;
  }

  button {
    border-radius: 9999px;
    border: none;
    cursor: pointer;
    width: 1em;
    height: 1em;
    padding-left: 0em;
    padding-top: 0em;
  }

  button.is-success {
    background-color: var(--green);
  }

  button.is-danger {
    background-color: var(--red);
  }

  button.is-warning {
    background-color: var(--yellow);
  }

  button.disabled {
    background-color: var(--grey);
    cursor: default;
  }

  h3 button, h4 button {
    margin-left: 0.1em;
  }

  ul ul {
    margin-left: 1.5em;
  }
</style>
