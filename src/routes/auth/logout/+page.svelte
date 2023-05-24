<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";

  onMount(() => {
    axios
      .delete("/api/auth")
      .then((_res) => {
        window.location.href = "/auth/login";
      })
      .catch((err) => {
        console.log(err, "failed");
      });
  });
</script>
