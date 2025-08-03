<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";

  onMount(() => {
    axios
      .delete("/auth")
      .then((_res) => {
        window.location.href = "/auth/login";
        localStorage.removeItem("user");
      })
      .catch((err) => {
        console.log(err, "failed");
      });
  });
</script>
