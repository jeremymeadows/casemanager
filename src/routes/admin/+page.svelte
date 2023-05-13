<script lang="ts">
  import axios from "axios";

  export let data;

  const users = data.users;
  let edit_mode = false;

  function edit(event: MouseEvent) {
    let id = (event.target as HTMLButtonElement).getAttribute("data-for")!;

    document.getElementById(id)!.hidden = true;
    document.getElementById(`${id}-edit`)!.hidden = false;
    edit_mode = true;
  }

  function cancel(event: MouseEvent) {
    let id = (event.target as HTMLButtonElement).getAttribute("data-for")!;

    document.getElementById(id)!.hidden = false;
    document.getElementById(`${id}-edit`)!.hidden = true;
    edit_mode = false;
  }

  function save(event: MouseEvent) {
    let id = (event.target as HTMLButtonElement).getAttribute("data-for")!;

    document.getElementById(id)!.hidden = false;
    document.getElementById(`${id}-edit`)!.hidden = true;

    axios
      .put("/admin/users", {
        user_id: id,
        name: (document.getElementById(`${id}-name`) as HTMLInputElement).value,
        email: (document.getElementById(`${id}-email`) as HTMLInputElement).value,
        admin: (document.getElementById(`${id}-admin`) as HTMLInputElement).checked,
      })
      .then((_res: any) => {
        document.location.reload();
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  function reset_password(event: MouseEvent) {
    let id = (event.target as HTMLButtonElement).getAttribute("data-for")!;

    axios
      .patch("/admin/users", {
        user_id: id,
      })
      .then((res: any) => {
        console.log(res);
        document.getElementById('password-email')!.textContent = res.data.email;
        document.getElementById('password')!.textContent = res.data.password;
        document.querySelector('dialog')!.showModal();
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  function add() {
    edit_mode = true;
    document.getElementById('add')!.hidden = false;
  }

  function add_cancel() {
    edit_mode = false;
    document.getElementById('add')!.hidden = true;
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
              <span hidden={edit_mode}>
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
                data-for={user.user_id}
                on:click={save}
              >
                Save
              </button>
              <button
                class="button is-small is-danger"
                data-for={user.user_id}
                on:click={reset_password}
              >
                Reset<br />Password
              </button>
              <button
                class="button is-small is-warning"
                data-for={user.user_id}
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

    <button class="button" on:click={add} disabled={edit_mode}>Add User</button>
    <button class="button" on:click={() => document.querySelector('dialog')?.showModal()}>Test</button>

    <dialog class="dialog">
      <p>The new password for <span id="password-email" /> is <code id="password" /></p>
      <br />
      <button class="button center" on:click={() => document.querySelector('dialog')?.close()}>OK</button>
    </dialog>
  </section>
</article>

<style lang="scss">
  table {
    width: 100%;
  }

  th:nth-child(1) {
    width: 20%
  }

  th:nth-child(2) {
    width: 40%
  }

  tr, td, td input {
    height: 1.8em;
  }

  tr:hover {
    background-color: var(--bg-alt);
  }

  button {
    line-height: 1em;
  }

  dialog {
    /* background-color: var(--bg-alt); */
    border-color: var(--grey);
    border-radius: 5px;
    top: -33%;
  }
</style>
