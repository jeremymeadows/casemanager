<script lang="ts">
  import axios from "axios";

  const { data } = $props();

  function login() {
    let form = document.getElementsByTagName('form')[0] as HTMLElement;
    form.querySelectorAll("input").forEach((e: HTMLInputElement) => {
      e.disabled = true;
    });

    let email = (form.querySelector("#email")! as HTMLInputElement).value;
    let password = (form.querySelector("#password")! as HTMLInputElement).value;

    axios
      .post("/auth", {
        email: email,
        password: password,
      })
      .then((user: any) => {
        localStorage.setItem("user", JSON.stringify(user.data));
        document.location.href = "/";
      })
      .catch((err: any) => {
        let message = document.querySelector("#error-message")! as HTMLDivElement;
        message.hidden = false;
        message.querySelector("span")!.textContent = err.response.data.message;
      })
      .finally(() => {
        form
          .querySelectorAll("input")
          .forEach((e: HTMLInputElement) => (e.disabled = false));
      });
  }
</script>

<article>
  <h1>Log In</h1>

  <div id="error-message" hidden>
    <article class="message is-danger narrow">
      <div class="message-body">
        Failed to log in: <span />.
      </div>
    </article>
    <br />
  </div>
  <form class="narrow">
    <div class="field">
      <label for="email">Email</label>
      <input id="email" type="email" class="input" required />
    </div>
    <div class="field">
      <label for="password">Password</label>
      <input id="password" type="password" class="input" required />
    </div>
    <button id="submit" class="button center" onclick={login}>Sign In</button>
  </form>

  <br /><br />

  <aside class="narrow">
    {@html data.message}
  </aside>
</article>

<style>
  .narrow {
    max-width: 50%;
    margin: auto;
  }
</style>
