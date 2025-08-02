<script lang="ts">
  import axios from "axios";

  const { data } = $props();

  function seed() {
    axios
      .post("/admin/generate")
      .then((response) => {
          alert("Demo data generated successfully!");
      })
      .catch((error) => {
        console.error("Error generating demo data:", error);
        alert("An error occurred while generating demo data.");
      });
  }
</script>

<article>
  <h1>Generate Demo Data</h1>

  <button onclick={seed}>seed</button>
</article>
