<script lang="ts">
  import axios from "axios";

  export let data;

  function logout_all() {

  }

  function check_password(): boolean {
    let password = (document.getElementById('new')! as HTMLInputElement).value;
    let password_conf = (document.getElementById('new-conf')! as HTMLInputElement).value;

    let valid = password === password_conf && password.length >= 8;

    (document.getElementById('submit')! as HTMLInputElement).disabled = !valid;
    return valid;
  }

  function change_password(event: SubmitEvent) {
    let form = event.target as HTMLElement;
    form.querySelectorAll("input").forEach((e: HTMLInputElement) => {
      e.disabled = true;
    });

    let message = document.querySelector('#message .message-body')! as HTMLDivElement;

    axios
      .patch("/admin/users", {
        old_password: (document.getElementById('old')! as HTMLInputElement).value,
        password: (document.getElementById('new')! as HTMLInputElement).value,
      })
      .then((_res: any) => {
        message.parentElement!.classList.remove('is-danger');
        message.parentElement!.classList.add('is-success');
        message.textContent = 'Password updated successfully.';

        form.querySelectorAll("input:not([type=submit])").forEach((el: Element) => {
          (el as HTMLInputElement).value = "";
        });
      })
      .catch((err: any) => {
        message.parentElement!.classList.remove('is-success');
        message.parentElement!.classList.add('is-danger');

        switch (err.response.status) {
          case 403:
            message.textContent = 'Incorrect password';
            break;
          default:
            message.textContent = 'Failed to update password';
        }
      })
      .finally(() => {
        message.parentElement!.parentElement!.hidden = false;
        form.querySelectorAll("input").forEach((e: HTMLInputElement) => {
          e.disabled = false;
        });
      });
  }

  function start_change_password(ev: MouseEvent) {
    (ev.target as HTMLDivElement).parentElement.hidden = true;
    document.getElementById('change-password').hidden = false;
  }
</script>

<article>
  <h1>Settings<aside>{data.user.email}</aside></h1>
  <br /><br />

  <div id="message" hidden>
    <article class="message narrow">
      <div class="message-body" />
    </article>
    <br />
  </div>

  <!-- <button -->
  <!--   class="button center" -->
  <!--   on:click={logout_all} -->
  <!-- > -->
  <!--   Log Out Everywhere -->
  <!-- </button> -->

  <div>
    <button
      class="button center"
      on:click={start_change_password}
    >
      Change Password
    </button>
  </div>

  <form id="change-password" class="narrow" on:submit|preventDefault={change_password} hidden>
    <div class="field">
      <label for="old">Old Password</label>
      <input id="old" type="password" class="input" on:input={check_password} required />
    </div>
    <div class="field">
      <label for="new">New Password</label>
      <input id="new" type="password" class="input" on:input={check_password} required />
    </div>
    <div class="field">
      <label for="new-conf">Confirm New Password</label>
      <input id="new-conf" type="password" class="input" on:input={check_password} required />
    </div>
    <input id="submit" type="submit" class="button center is-danger" value="Change Password" disabled />
  </form>
</article>

<style>
  .narrow {
    max-width: 50%;
    margin: auto;
  }

  h1 aside {
    font-size: 0.6em;
  }
</style>
