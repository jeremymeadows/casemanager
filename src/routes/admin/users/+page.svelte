<script lang="ts">
  import axios from "axios";
  import { open_dialog_modal, close_dialog } from "$lib/utils/dialogs";

  const { data } = $props();

  const users = data.users;
  let edit_id = $state("");
  let delete_id = -1;

  function edit(event: MouseEvent) {
    edit_id = (event.target as HTMLButtonElement).getAttribute("data-for")!;
    document.getElementById(edit_id)!.hidden = true;
    document.getElementById(`${edit_id}-edit`)!.hidden = false;
  }

  function cancel() {
    document.getElementById(edit_id)!.hidden = false;
    document.getElementById(`${edit_id}-edit`)!.hidden = true;
    edit_id = "";
  }

  function save() {
    document.getElementById(edit_id)!.hidden = false;
    document.getElementById(`${edit_id}-edit`)!.hidden = true;

    axios
      .put("/api/admin/users", {
        user_id: edit_id,
        name: (document.getElementById(`${edit_id}-name`) as HTMLInputElement).value,
        email: (document.getElementById(`${edit_id}-email`) as HTMLInputElement).value,
        admin: (document.getElementById(`${edit_id}-admin`) as HTMLInputElement).checked,
      })
      .then((_res: any) => {
        document.location.reload();
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  function reset_password() {
    axios
      .patch("/api/admin/users", {
        user_id: edit_id,
      })
      .then((res: any) => {
        let link = document.createElement('a');
        link.textContent = res.data.email;

        let message = `subject=Your Password has been Reset&body=Your password has been reset to: <code style="font-size: 1.5em; font-weight: bold;">${res.data.password}</code>`;
        link.href = `mailto:${res.data.email}?${encodeURI(message)}`;

        document.getElementById('password-email')!.replaceChildren(link);
        document.getElementById('password')!.textContent = res.data.password;
        (document.getElementById('new-password')! as HTMLDialogElement).showModal();
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  function add() {
    edit_id = "-1";
    document.getElementById('add')!.hidden = false;
  }

  function add_cancel() {
    document.getElementById('add')!.hidden = true;
    edit_id = "";
  }

  function add_save() {
    axios
      .post("/api/admin/users", {
        name: (document.getElementById('name') as HTMLInputElement).value,
        email: (document.getElementById('email') as HTMLInputElement).value,
        admin: (document.getElementById('admin') as HTMLInputElement).checked,
      })
      .then((_res: any) => {
        document.location.reload();
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  function remove(user_id: number) {
    axios
      .delete("/api/admin/users", { data: {
        user_id: user_id,
      }})
      .then((_res: any) => {
        document.location.reload();
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
</script>

<article>
  <h1>Users</h1>

  <section>
    <table id="users" class="table is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Permissions</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each users as user}
          <tr id={user.id}>
            <td>{user.name}</td>
            <td><a href="mailto:{user.email}">{user.email}</a></td>
            <td>{user.is_admin ? "Administrator" : "Normal"}</td>
            <td>
              <button class="button is-small invis">&nbsp</button>
              <span hidden={!!edit_id}>
                <button
                  class="button is-small is-info"
                  data-for={user.id}
                  onclick={edit}
                >
                  Edit
                </button>
                {#if user.id !== 0}
                  <button
                    class="button is-small is-danger"
                    data-for={user.id}
                    onclick={() => { delete_id = user.id; open_dialog_modal('delete-user'); }}
                  >
                    Delete
                  </button>
                {/if}
              </span>
            </td>
          </tr>
          <tr id="{user.id}-edit" hidden>
            <td><input id="{user.id}-name" class="input" type="text" value={user.name} /></td>
            <td><input id="{user.id}-email" class="input" type="email" value={user.email} /></td>
            <td>
              Administrator:
              <input id="{user.id}-admin" type="checkbox" checked={user.is_admin} disabled={user.id === 0} />
            </td>
            <td>
              <span class="buttons has-addons">
                <button
                  class="button is-small is-success"
                  onclick={save}
                >
                  Save
                </button>
                <button
                  class="button is-small is-danger"
                  onclick={() => open_dialog_modal('password-confirm')}
                >
                  Reset<br />Password
                </button>
                <button
                  class="button is-small is-warning"
                  onclick={cancel}
                >
                  Cancel
                </button>
              </span>
            </td>
          </tr>
        {/each}
        <tr id="add" hidden>
          <td><input id="name" class="input" type="text" /></td>
          <td><input id="email" class="input" type="email" /></td>
          <td>
            Administrator:
            <input id="admin" type="checkbox" />
          </td>
          <td>
            <button
              class="button is-small is-success"
              onclick={add_save}
            >
              Save
            </button>
            <button
              class="button is-small is-warning"
              onclick={add_cancel}
            >
              Cancel
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <button class="button" onclick={add} disabled={!!edit_id}>Add User</button>

    <dialog id="password-confirm">
      <h2>Are you sure you want to reset the password for <code>{users?.find((e: any) => e.user_id == edit_id)?.name}</code>?</h2>
      <br />
      <div class="center">
        <button
          class="button"
          onclick={close_dialog}
        >
          Cancel
        </button>
        <button
          class="button is-danger"
          onclick={(ev) => {
            close_dialog(ev);
            reset_password();
            cancel();
          }}
        >
          Reset
        </button>
      </div>
    </dialog>

    <dialog id="new-password">
      <p>The new password for <span id="password-email" /> is <code id="password" /></p>
      <br />
      <button class="button center" onclick={close_dialog}>Close</button>
    </dialog>

    <dialog id="delete-user">
      <h2>Are you sure you want to delete the user <code>{users?.find((e: any) => e.id === delete_id)?.name}</code>?</h2>
      <br />
      <div class="center">
        <button
          class="button"
          onclick={(ev) => { close_dialog(ev); cancel(); }}
        >
          No
        </button>
        <button
          class="button is-danger"
          onclick={(ev) => {
            close_dialog(ev);
            remove(delete_id);
          }}
        >
          Yes
        </button>
      </div>
    </dialog>
  </section>
</article>

<style lang="scss">
  table {
    width: 100%;
    background-color: var(--bg);
  }

  th:nth-child(1) {
    width: 25%
  }

  th:nth-child(2) {
    width: 30%
  }

  th:nth-child(3) {
    width: 15%
  }

  th:nth-child(4) {
    width: 20%
  }

  /* tr:hover { */
  /*   background-color: var(--bg-alt); */
  /* } */

  td {
    vertical-align: middle;
  }

  td input.input {
    height: calc(1.9em - 1px);
  }

  button {
    line-height: 1em;
  }

  .invis {
    visibility: hidden;
    width: 0;
    padding-left: 0;
    padding-right: 0;
  }

  dialog {
    border-color: var(--grey);
    border-radius: 5px;
    top: -33%;
  }
</style>
