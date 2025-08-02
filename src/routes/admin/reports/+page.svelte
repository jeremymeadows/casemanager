<script lang="ts">
  import { onMount } from "svelte";

  import Switch from "$lib/components/Switch.svelte";
  import { dtfmt } from "$lib/utils/dates";

  import Chart from "chart.js/auto";
  // import { Colors } from "chart.js";

  const { data } = $props();
  const cases = data.cases;
  const types = data.types;
  const contact_methods = data.contact_methods;

  function draw_charts() {
    let options: object = {
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
      new Chart(document.getElementById("type-chart") as HTMLCanvasElement, {
        type: "pie",
        data: {
          labels: [...Object.keys(types), 'None'],
          datasets: [{
            label: "# of Cases",
            data: [...Object.keys(types), null].map(
              (type) => cases.filter((e) => e.type === type && ((document.getElementById('open-filter') as HTMLInputElement).checked ? e.is_open : true)).length
            ),
            borderWidth: 1,
          }]
        },
        options: options,
      }),
      new Chart(document.getElementById("assignee-chart") as HTMLCanvasElement, {
        type: "pie",
        data: {
          labels: [...data.users.map((e) => e.name), "Unassigned"],
          datasets: [{
            label: "# of Cases per User",
            data: [...data.users, {user_id: null, name: null}].map(
              (user) => cases.filter((e) => e.is_open && e.assignee?.id === user.id).length
            ),
            borderWidth: 1,
          }]
        },
        options: options,
      }),
      new Chart(document.getElementById("contact-method-chart") as HTMLCanvasElement, {
        type: "pie",
        data: {
          labels: [...contact_methods, 'N/A'],
          datasets: [{
            label: "",
            data: [...contact_methods, null].map((method) => cases.filter((e) => e.contact_method === method).length),
            borderWidth: 1,
          }]
        },
        options: options,
      }),
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
    let created_dates = [];
    let closed_dates = [];
    let open_cases = [];

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

          let interval_date = {
            start: new Date(`${year}-${month + 1}-${start}`),
            stop: new Date(`${year}-${month + 1}-${stop}`),
          }

          created_dates.push(
            cases.filter(
              (e) => e.created >= interval_date.start && e.created <= interval_date.stop
            ).length
          );
          closed_dates.push(
            cases.filter(
              (e) => e.closed && e.closed >= interval_date.start && e.closed <= interval_date.stop
            ).length
          );
          open_cases.push(
            cases.filter(
              (e) =>
                e.created <= interval_date.stop &&
                (e.closed ? e.closed > interval_date.stop : true)
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
            label: "# of Cases Created",
            data: created_dates,
            borderWidth: 1,
          },
          {
            label: "# of Cases Closed",
            data: closed_dates,
            borderWidth: 1,
          },
          {
            label: "# of Cases Open",
            data: open_cases,
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

  function draw_bar() {
    let options: object = {
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          position: "none",
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    };

    return new Chart(document.getElementById("type-bar") as HTMLCanvasElement, {
      type: "bar",
      data: {
        labels: [...Object.keys(types), 'None'],
        datasets: [...Object.keys(types)]
          .map((type) => types[type]
            .map((subtype: string) => {
              return {
                type: type,
                subtype: subtype,
                ndx: Object.keys(types).indexOf(type),
                data: Array(Object.keys(types).length + 1).fill(0),
              }
            })
            .map(({ type, subtype, ndx, data }: { type: string, subtype: string, ndx: number, data: Array<number>}) => {
              data[ndx] = cases.filter((e) => e.type === type && e.subtype === subtype).length;
              return {
                label: subtype,
                data: data,
              };
            })
          )
          .flat(1)
          .concat([{
            label: "None",
            data: Array(Object.keys(types).length).fill(0).concat([cases.filter((e) => !e.type).length]),
          }]),
        },
        options: options,
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

    let charts = draw_charts();
    let timeline = draw_timeline();
    let bar = draw_bar();

    document.getElementById('open-filter')?.addEventListener('click', () => {
      charts.forEach((chart) => chart.destroy());
      charts = draw_charts();
    });

    window.addEventListener("resize", () => {
      charts.forEach((chart) => chart.destroy());
      charts = draw_charts();

      timeline.destroy();
      timeline = draw_timeline();

      bar.destroy();
      bar = draw_bar();
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
  <h1>Reports</h1>

  <section>
    <div class="columns">
      <div class="column box">
        <label for="type-chart">Cases By Type<aside><Switch id="open-filter" left="all" right="open" /></aside></label>
        <canvas id="type-chart" />
      </div>
      <div class="column box">
        <label for="assignee-chart">Open Cases By Assignee</label>
        <canvas id="assignee-chart" />
      </div>
      <div class="column box">
        <label for="contact-method-chart">Contact Methods</label>
        <canvas id="contact-method-chart" />
      </div>
    </div>

    <hr />

    <div class="center box">
      <canvas id="type-bar" />
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
    gap: 0.8rem;
  }

  .box {
    background-color: var(--bg);
    margin: 0;
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
    background-color: var(--primary);
    color: white;
  }

  .buttons input[type="radio"]::after {
    content: attr(data-label);
  }
</style>
