<script lang="ts">
  export let id: string | null = null;
  export let left: string = "off";
  export let right: string = "on";
  export let checked: boolean = false;
</script>

<span>
  {left || "off"}
  <label class="switch">
    <input id={id} type="checkbox" {checked} />
    <span class="slider" />
  </label>
  {right || "on"}
</span>

<style lang="scss">
  @import "../../variables.scss";

  label {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  label span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 4px ;
    transition: background-color 0.4s;
  }

  label span:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    border-radius: 4px;
    transition: background-color 0.4s;
  }

  /* label span.is-rounded, label span.is-rounded::before { */
  /*   border-radius: 9999px; */
  /* } */

  input:checked + span {
    background-color: $primary;
  }

  input:focus + span {
    border-color: hsl(229, 53%, 53%);
    box-shadow: 0 0 0 0.125em rgba(72, 95, 199, 0.25);
  }

  input + span:before {
    transition: 0.4s;
  }

  input:checked + span:before {
    transform: translateX(24px);
  }
</style>
