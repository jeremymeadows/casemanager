<script lang="ts">
  import { onMount } from "svelte";

  import Chart from "chart.js/auto";
  import type { ChartType } from "chart.js/auto";

  import { dtfmt } from "$lib/utils/dates";

  export let data;
  const cases = data.cases;
  const types = data.types;

  function draw_charts(type: ChartType) {
    let options = {
      animation: {
        duration: 0
      },
    //   ...(type === "bar" ? {
    //   scales: {
    //     y: {
    //       beginAtZero: true,
    //       ticks: {
    //         precision: 0,
    //       },
    //     },
    //   },
    // } : {})
    };

    return [
      new Chart(document.getElementById("status-chart") as HTMLCanvasElement, {
        type: type,
        data: {
          labels: ['Open', 'Closed'],
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
        type: type,
        data: {
          labels: Object.keys(types),
          datasets: [
            {
              label: "# of Cases",
              data: Object.keys(types).map(
                (type) => cases.filter((e) => e.type === type).length
              ),
              borderWidth: 1,
            },
          ],
        },
        options: options,
      }),
      new Chart(document.getElementById('assignee-chart') as HTMLCanvasElement, {
        type: type,
        data: {
          labels: data.users.map((e) => e.name.split(' ').slice(0, -1).join(' ')),
          datasets: [
            {
              label: "# of Cases per User",
              data: data.users.map(
                (user) => cases.filter((e) => e.assignee === user.name.split(' ').slice(0, -1).join(' ')).length
              ),
              borderWidth: 1,
            },
          ],
        },
        options: options,
      })
    ];
  }

  function draw_timeline() {
    const MONTHS = {
      "Jan": 31,
      "Feb": 29,
      "Mar": 31,
      "Apr": 30,
      "May": 31,
      "Jun": 30,
      "Jul": 31,
      "Aug": 31,
      "Sep": 30,
      "Oct": 31,
      "Nov": 30,
      "Dec": 31,
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
    let interval = parseInt((document.getElementById('date-interval')! as HTMLInputElement).value);

    localStorage.setItem('timeline', `${start_date};${end_date};${interval}`);

    let start_year = start_date.getFullYear();
    let end_year = end_date.getFullYear();

    let dates = [];
    let date_data = [];

    for (let year = start_year; year <= end_year; year += 1) {
      let start_month = year === start_year ? start_date.getMonth() : 0;
      let end_month = year !== end_year ? Object.keys(MONTHS).length - 1 : end_date.getMonth();

      for (let month = start_month; month <= end_month; month += 1) {
        let days = Object.values(MONTHS)[month];

        for (let i = 0; i < interval; i += 1) {
          let [start, stop] = [1, Math.floor(days / interval)];

          if (i === 0) {
            dates.push(`${Object.keys(MONTHS)[month]} ${year}`);
          } else {
            [start, stop] = [Math.floor(i * days / interval) + 1, Math.floor((i + 1) * days / interval)]
            dates.push(`${start}-${stop}`)
          }

          date_data.push(cases.filter((e) =>
            e.created.getFullYear() === year &&
            e.created.getMonth() === month &&
            e.created.getDate() >= start &&
            e.created.getDate() <= stop
          ).length);
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
    let chart_type = (localStorage.getItem("chart_type") || "pie") as ChartType;
    // document
    //   .getElementById("chart-toggle-icon")!
    //   .setAttribute(
    //     "src",
    //     `icons/bxs-${chart_type == "bar" ? "pie" : "bar"}-chart-alt-2.svg`
    //   );

    let initial_time = localStorage.getItem('timeline')?.split(';');
    (document.getElementById('date-start')! as HTMLInputElement).value = dtfmt('yyyy-mm', initial_time ? new Date(initial_time[0]) : new Date());
    (document.getElementById('date-end')! as HTMLInputElement).value = dtfmt('yyyy-mm', initial_time ? new Date(initial_time[1]) : new Date());
    (document.getElementById('date-interval')! as HTMLInputElement).value = initial_time ? initial_time[2] : '4';

    let charts = draw_charts(chart_type);
    let timeline = draw_timeline();

    window.addEventListener("resize", () => {
      charts.forEach((chart) => chart.destroy());
      charts = draw_charts(chart_type);

      timeline.destroy();
      timeline = draw_timeline();
    });

    // document.getElementById("chart-toggle")!.addEventListener("click", () => {
    //   document
    //     .getElementById("chart-toggle-icon")!
    //     .setAttribute("src", `icons/bxs-${chart_type}-chart-alt-2.svg`);
    //   chart_type = chart_type === "bar" ? "pie" : "bar";
    //   localStorage.setItem("chart_type", chart_type);
    //   window.dispatchEvent(new Event("resize"));
    // });
    
    document.querySelectorAll('input[type="month"], input[type="range"]').forEach((e) =>
      e.addEventListener("input", () => {
        timeline.destroy();
        timeline = draw_timeline();
      })
    );
  });
</script>

<article>
  <section>
    <!-- <button id="chart-toggle"> -->
    <!--   <span class="icon"> -->
    <!--     <img id="chart-toggle-icon" alt="pie/bar graph" /> -->
    <!--   </span> -->
    <!-- </button> -->

    <div class="columns">
      <div class="column">
        <canvas id="status-chart" />
      </div>
      <div class="column">
        <canvas id="type-chart" />
      </div>
      <div class="column">
        <canvas id="assignee-chart" />
      </div>
    </div>

    <hr />
    <div class="center">
      <canvas id="timeline" />
    </div>
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
        <input
          id="date-interval"
          type="range"
          min="1"
          max="4"
        />
      </div>
    </div>
  </section>
</article>

<style lang="scss">
  canvas {
    max-height: 20rem;
  }
</style>
