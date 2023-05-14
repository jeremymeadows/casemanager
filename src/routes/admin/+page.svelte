<script lang="ts">
  import axios from "axios";

  export let data;

  const users = data.users;
  let edit_id = "";

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
      .put("/admin/users", {
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
      .patch("/admin/users", {
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
      .post("/admin/users", {
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
</script>

<article>
  <h1>Admin Settings</h1>

  <section>
    <table id="users" class="table">
      <thead>
        <th>Name</th>
        <th>Email</th>
        <th>Permissions</th>
        <th />
      </thead>
      <tbody>
        {#each users as user}
          <tr id={user.user_id}>
            <td>{user.name}</td>
            <td><a href="mailto:{user.email}">{user.email}</a></td>
            <td>{user.is_admin ? "Administrator" : "Normal"}</td>
            <td>
              <button class="button is-small invis">&nbsp</button>
              <span hidden={!!edit_id}>
                <button
                  class="button is-small is-info"
                  data-for={user.user_id}
                  on:click={edit}
                >
                  Edit
                </button>
              </span>
            </td>
          </tr>
          <tr id="{user.user_id}-edit" hidden>
            <td><input id="{user.user_id}-name" class="input" type="text" value={user.name} /></td>
            <td><input id="{user.user_id}-email" class="input" type="email" value={user.email} /></td>
            <td>
              Administrator:
              <input id="{user.user_id}-admin" type="checkbox" checked={user.is_admin} />
            </td>
            <td>
              <button
                class="button is-small is-success"
                on:click={save}
              >
                Save
              </button>
              <button
                class="button is-small is-danger"
                on:click={() => document.getElementById('password-confirm').showModal()}
              >
                Reset<br />Password
              </button>
              <button
                class="button is-small is-warning"
                on:click={cancel}
              >
                Cancel
              </button>
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
              on:click={add_save}
            >
              Save
            </button>
            <button
              class="button is-small is-warning"
              on:click={add_cancel}
            >
              Cancel
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <button class="button" on:click={add} disabled={!!edit_id}>Add User</button>

    <dialog id="password-confirm">
      <h2>Are you sure you want to reset the password?</h2>
      <br />
      <div class="center">
        <button
          class="button"
          on:click={() => document.getElementById('password-confirm')?.close()}
        >
          Cancel
        </button>
        <button
          class="button is-danger"
          on:click={() => {
            document.getElementById('password-confirm')?.close();
            reset_password();
          }}
        >
        Reset
        </button>
      </div>
    </dialog>

    <dialog id="new-password">
      <p>The new password for <span id="password-email" /> is <code id="password" /></p>
      <br />
      <button class="button center" on:click={() => document.getElementById('new-password')?.close()}>Close</button>
    </dialog>
  </section>
</article>

<style lang="scss">
  table {
    width: 100%;
    background-color: var(--bg);
  }

  th:nth-child(1) {
    width: 20%
  }

  th:nth-child(2) {
    width: 40%
  }

  tr:hover {
    background-color: var(--bg-alt);
  }

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
