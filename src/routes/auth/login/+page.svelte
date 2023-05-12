<script lang="ts">
  import axios from "axios";

  function login(event: SubmitEvent) {
    event.preventDefault();

    let form = event.target as HTMLElement;
    form.querySelectorAll('input').forEach((e: HTMLInputElement) => { e.disabled = true; });

    let email = (form.querySelector('#email')! as HTMLInputElement).value;
    let password = (form.querySelector("#password")! as HTMLInputElement).value;

    axios
      .post("/auth", {
        email: email,
        password: password,
      })
      .then((_res: any) => {
        document.location.href = '/';
      })
      .catch((err: any) => {
        console.log(err);
        form.querySelectorAll('input').forEach((e: HTMLInputElement) => e.disabled = false);
      });
  }
</script>

<article>
  <h1>Log In</h1>

  <form class="narrow" on:submit={login}>
    <div class="field">
      <label for="email">Email</label>
      <input id="email" type="email" class="input" required />
    </div>
    <div class="field">
      <label for="password">Password</label>
      <input id="password" type="password" class="input" required />
    </div>
    <input id="submit" type="submit" class="button center" />
  </form>

  <br /><br />

  <aside class="narrow">
    The admin of this site must grant new users access. If you need an account
    or forgot your password contact the office at <a
      href="mailto:generalmanager@dkitsu.com">generalmanager@dkitsu.com</a
    >.
  </aside>
</article>

<style>
  .narrow {
    max-width: 50%;
    margin: auto;
  }
</style>
