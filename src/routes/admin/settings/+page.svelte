<script lang="ts">
  import axios from "axios";
  import { open_dialog_modal, close_dialog } from "$lib/utils/dialogs.js";

   const { data } = $props();

  let editing = $state("");

  function add(
    ev: MouseEvent,
    type: string | HTMLElement,
    subtype: string | HTMLElement | null = null
  ) {
    let el = ev.currentTarget as HTMLButtonElement;

    if (typeof type !== "string") {
      type = (type as HTMLInputElement).value;
    }
    if (subtype && typeof subtype !== "string") {
      subtype = (subtype as HTMLInputElement).value;
    }

    if (editing === "") {
      editing = el.getAttribute("data-for")!;
    } else {
      let res = subtype
        ? axios.put("/admin/settings", { type: type, subtype: subtype })
        : axios.post("/admin/settings", { type: type });
      res
        .then(() => {
          editing = "";
          document.location.reload();
        })
        .catch(() => {
          document.getElementById("error-message").classList.remove("hidden");
        });
    }
  }

  function remove(type: string, subtype: string | null = null) {
    let conf = document.getElementById(
      "delete-confirm-type"
    ) as HTMLDialogElement;
    conf.showModal();

    (
      document.querySelector(
        '#delete-confirm-type button[value="delete"]'
      ) as HTMLButtonElement
    ).onclick = () => {
      let res = subtype
        ? axios.patch("/admin/settings", { type: type, subtype: subtype })
        : axios.delete("/admin/settings", { data: { type: type } });
      res
        .then(() => {
          editing = "";
          document.location.reload();
        })
        .catch(() => {
          document.getElementById("error-message").classList.remove("hidden");
        });
    };
  }

  function cancel() {
    editing = "";
  }

  function add_contact_method() {
    let method = (
      document.getElementById("new-contact-method") as HTMLInputElement
    ).value;

    if (editing === "") {
      editing = "new-contact-method";
    } else {
      let res = axios.post("/admin/settings/contact", { method: method });
      res
        .then(() => {
          editing = "";
          document.location.reload();
        })
        .catch(() => {
          document.getElementById("error-message").classList.remove("hidden");
        });
    }
  }

  function remove_contact_method(method: string) {
    let conf = document.getElementById(
      "delete-confirm-contact"
    ) as HTMLDialogElement;
    conf.showModal();

    (
      document.querySelector(
        '#delete-confirm-contact button[value="delete"]'
      ) as HTMLButtonElement
    ).onclick = () => {
      let res = axios.delete("/admin/settings/contact", {
        data: { method: method },
      });
      res
        .then(() => {
          editing = "";
          document.location.reload();
        })
        .catch(() => {
          document.getElementById("error-message").classList.remove("hidden");
        });
    };
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
    <div class="columns">
      <div class="column">
        <h2>Types</h2>
        <ul>
          {#each Object.keys(data.types) as type}
            <li>
              <h3>
                {#if data.types[type].length === 0}
                  <button
                    class="is-danger"
                    title="remove type"
                    onclick={() => remove(type)}
                  >
                    <i class="bx bx-minus" />
                  </button>
                {:else}
                  <button
                    class="disabled"
                    title="please remove all subtypes before deleting the type"
                    disabled
                  >
                    <i class="bx bx-minus" />
                  </button>
                {/if}
                {type}
              </h3>
              <ul>
                {#each data.types[type] as subtype}
                  <li>
                    <h4>
                      <button
                        class="is-danger"
                        title="remove subtype"
                        onclick={() => remove(type, subtype)}
                      >
                        <i class="bx bx-minus" />
                      </button>
                      {subtype}
                    </h4>
                  </li>
                {/each}
                <li>
                  <input
                    id="{type}-new-subtype"
                    type="text"
                    placeholder="new subtype"
                    hidden={!editing || editing !== `${type}-new-subtype`}
                  />
                  <button
                    class="is-warning"
                    title="cancel"
                    data-for="{type}-new-subtype"
                    hidden={!editing || editing !== `${type}-new-subtype`}
                    onclick={cancel}
                  >
                    <i class="bx bx-x" />
                  </button>
                  <button
                    class="is-success"
                    title="new subtype"
                    data-for="{type}-new-subtype"
                    hidden={!!editing && editing !== `${type}-new-subtype`}
                    onclick={(ev) =>
                      add(
                        ev,
                        type,
                        document.getElementById(`${type}-new-subtype`)
                      )}
                  >
                    <i class="bx bx-plus" />
                  </button>
                </li>
              </ul>
            </li>
          {/each}
          <li>
            <input
              id="new-type"
              class=""
              type="text"
              placeholder="new type"
              hidden={!editing || editing !== "new-type"}
            />
            <button
              class="is-warning"
              title="cancel"
              data-for="new-type"
              hidden={!editing || editing !== "new-type"}
              onclick={cancel}
            >
              <i class="bx bx-x" />
            </button>
            <button
              class="is-success"
              title="new type"
              data-for="new-type"
              hidden={!!editing && editing !== "new-type"}
              onclick={(ev) => add(ev, document.getElementById("new-type"))}
            >
              <i class="bx bx-plus" />
            </button>
          </li>
        </ul>
      </div>
      <div class="column">
        <h2>Contact Methods</h2>
        <ul>
          {#each data.contact_methods as contact_method}
            <li>
              <h3>
                <button
                  class="is-danger"
                  title="remove type"
                  onclick={() => remove_contact_method(contact_method)}
                >
                  <i class="bx bx-minus" />
                </button>
                {contact_method}
              </h3>
            </li>
          {/each}
          <li>
            <input
              id="new-contact-method"
              type="text"
              placeholder="new subtype"
              hidden={!editing || editing !== `new-contact-method`}
            />
            <button
              class="is-warning"
              title="cancel"
              data-for="new-contact-method"
              hidden={!editing || editing !== `new-contact-method`}
              onclick={cancel}
            >
              <i class="bx bx-x" />
            </button>

            <button
              class="is-success"
              title="new type"
              onclick={add_contact_method}
            >
              <i class="bx bx-plus" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <dialog id="delete-confirm-type">
    <h2>Are you sure you want to delete this case type?</h2>
    <h3>All associated cases will be moved to the 'None' category.</h3>
    <br />
    <form class="center" method="dialog">
      <button class="button">Cancel</button>
      <button class="button is-danger" value="delete">Delete</button>
    </form>
  </dialog>

  <dialog id="delete-confirm-contact">
    <h2>Are you sure you want to delete this contact method?</h2>
    <h3>All associated cases will be moved to the 'None' category.</h3>
    <br />
    <form class="center" method="dialog">
      <button class="button">Cancel</button>
      <button class="button is-danger" value="delete">Delete</button>
    </form>
  </dialog>
</article>

<style lang="scss">
  h3 {
    font-size: 1.2em;
  }

  button:has(i.bx) {
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

  h3 button,
  h4 button {
    margin-left: 0.1em;
  }

  ul ul {
    margin-left: 1.5em;
  }
</style>
