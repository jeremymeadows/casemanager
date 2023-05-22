<script lang="ts">
  import { onMount } from "svelte";

  import Switch from "$lib/components/Switch.svelte";
  import { dtfmt } from "$lib/utils/dates";

  import Chart from "chart.js/auto";

  export let data;
  const cases = data.cases;
  const types = data.types;

  function draw_charts() {
    let options = {
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    };

    return [
      new Chart(document.getElementById("status-chart") as HTMLCanvasElement, {
        type: "pie",
        data: {
          labels: ["Open", "Closed"],
          datasets: [
            {
              label: "# of Cases",
              data: [true, false].map(
                (status) => cases.filter((e) => e.is_open === status).length
              ),
              borderWidth: 1,
            },
          ],
        },
        options: options,
      }),
      new Chart(document.getElementById("type-chart") as HTMLCanvasElement, {
        type: "pie",
        data: {
          labels: [...Object.keys(types), 'None'],
          datasets: [
            {
              label: "# of Cases",
              data: [...Object.keys(types), null].map(
                // (type) => cases.filter((e) => e.type === type && document.getElementById('open-filter')!.checked ? e.is_open : true).length
                (type) => cases.filter((e) => e.type === type && (document.getElementById('open-filter')!.checked ? e.is_open : true)).length
              ),
              borderWidth: 1,
            },
          ],
        },
        options: options,
      }),
      new Chart(
        document.getElementById("assignee-chart") as HTMLCanvasElement,
        {
          type: "pie",
          data: {
            labels: [...data.users.map((e) =>
              e.name
            ), "Unassigned"],
            datasets: [
              {
                label: "# of Cases per User",
                data: [...data.users, {user_id: null, name: null}].map(
                  (user) =>
                    cases.filter(
                      (e) =>
                        e.is_open && e.assignee === user.name
                    ).length
                ),
                borderWidth: 1,
              },
            ],
          },
          options: options,
        }
      ),
    ];
  }

  function draw_timeline() {
    const MONTHS = {
      Jan: 31,
      Feb: 29,
      Mar: 31,
      Apr: 30,
      May: 31,
      Jun: 30,
      Jul: 31,
      Aug: 31,
      Sep: 30,
      Oct: 31,
      Nov: 30,
      Dec: 31,
    };

    let start_date = new Date(
      (document.getElementById("date-start") as HTMLInputElement).value
    );
    let end_date = new Date(
      (document.getElementById("date-end") as HTMLInputElement).value
    );
    if (end_date < start_date) {
      [start_date, end_date] = [end_date, start_date];
    }
    let interval = parseInt(
      (
        document.querySelector(
          'input[name="date-interval"]:checked'
        )! as HTMLInputElement
      ).value
    );

    localStorage.setItem("timeline", `${start_date};${end_date};${interval}`);

    let start_year = start_date.getFullYear();
    let end_year = end_date.getFullYear();

    let dates = [];
    let date_data = [];

    for (let year = start_year; year <= end_year; year += 1) {
      let start_month = year === start_year ? start_date.getMonth() : 0;
      let end_month =
        year !== end_year
          ? Object.keys(MONTHS).length - 1
          : end_date.getMonth();

      for (let month = start_month; month <= end_month; month += 1) {
        let days = Object.values(MONTHS)[month];

        for (let i = 0; i < interval; i += 1) {
          let [start, stop] = [1, Math.floor(days / interval)];

          if (i === 0) {
            dates.push(`${Object.keys(MONTHS)[month]} ${year}`);
          } else {
            [start, stop] = [
              Math.floor((i * days) / interval) + 1,
              Math.floor(((i + 1) * days) / interval),
            ];
            dates.push(`${start}-${stop}`);
          }

          date_data.push(
            cases.filter(
              (e) =>
                e.created.getFullYear() === year &&
                e.created.getMonth() === month &&
                e.created.getDate() >= start &&
                e.created.getDate() <= stop
            ).length
          );
        }
      }
    }

    return new Chart(document.getElementById("timeline") as HTMLCanvasElement, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "# of Cases",
            data: date_data,
            borderWidth: 1,
          },
        ],
      },
      options: {
        animation: {
          duration: 0,
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    });
  }

  onMount(async () => {
    let initial_time = localStorage.getItem("timeline")?.split(";");
    (document.getElementById("date-start")! as HTMLInputElement).value = dtfmt(
      "yyyy-mm",
      initial_time ? new Date(initial_time[0]) : new Date()
    );
    (document.getElementById("date-end")! as HTMLInputElement).value = dtfmt(
      "yyyy-mm",
      initial_time ? new Date(initial_time[1]) : new Date()
    );
    (
      document.querySelector(
        `input[name="date-interval"][value="${
          initial_time ? initial_time[2] : "4"
        }"]`
      )! as HTMLInputElement
    ).checked = true;
    // (document.querySelector('input[name="date-interval"]')! as HTMLInputElement).value = initial_time ? initial_time[2] : '4';

    let charts = draw_charts();
    let timeline = draw_timeline();

    document.getElementById('open-filter')?.addEventListener('click', () => {
      charts.forEach((chart) => chart.destroy());
      charts = draw_charts();
    });

    window.addEventListener("resize", () => {
      charts.forEach((chart) => chart.destroy());
      charts = draw_charts();

      timeline.destroy();
      timeline = draw_timeline();
    });

    document
      .querySelectorAll('input[type="month"], input[type="radio"]')
      .forEach((e) =>
        e.addEventListener("input", () => {
          timeline.destroy();
          timeline = draw_timeline();
        })
      );
  });
</script>

<article>
  <section>
    <div class="columns">
      <div class="column box">
        <label for="status-chart">Cases By Status</label>
        <canvas id="status-chart" />
      </div>
      <div class="column box">
        <label for="type-chart">Cases By Type <aside><Switch id="open-filter" left="all" right="open"/></aside></label>
        <canvas id="type-chart" />
      </div>
      <div class="column box">
        <label for="assignee-chart">Open Cases By Assignee</label>
        <canvas id="assignee-chart" />
      </div>
    </div>

    <hr />

    <div class="center box">
      <canvas id="timeline" />

      <br />

      <div class="columns">
        <div class="column">
          <input
            id="date-start"
            class="input"
            type="month"
            min="2020-01"
            max={dtfmt("yyyy-mm")}
          />
        </div>
        <div class="column">
          <input
            id="date-end"
            class="input"
            type="month"
            min="2020-01"
            max={dtfmt("yyyy-mm")}
          />
        </div>
        <div class="column">
          <div class="buttons has-addons">
            <input
              type="radio"
              class="button"
              name="date-interval"
              value="4"
              data-label="Weekly"
            />
            <input
              type="radio"
              class="button"
              name="date-interval"
              value="2"
              data-label="Bi-Weekly"
            />
            <input
              type="radio"
              class="button"
              name="date-interval"
              value="1"
              data-label="Monthly"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</article>

<style lang="scss">
  .columns {
    justify-content: space-between;
    gap: 0.8rem;
  }

  .box {
    background-color: var(--bg);
    margin: 0;
    /* padding: auto -0.4rem; */
  }

  label {
    display: block;
    text-align: center;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  canvas {
    max-height: 20rem;
  }

  aside:has(#open-filter) {
    position: absolute;
    margin-top: -2em;
  }

  .buttons input[type="radio"]:checked {
    background-color: cyan;
  }

  .buttons input[type="radio"]::after {
    content: attr(data-label);
  }
</style>
