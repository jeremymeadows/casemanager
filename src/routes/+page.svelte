<script lang="ts">
  import { onMount } from "svelte";

  import Chart from "chart.js/auto";
  import type { ChartType } from "chart.js/auto";

  import { dtfmt } from "$lib/utils/dates";

  enum Status {
    Open = "Open",
    Closed = "Closed",
  }

  enum Type {
    Academic = "Academic",
    Accommodation = "Accommodation",
    Welfare = "Welfare",
    Other = "Other",
  }

  let cases = [
    {
      status: Status.Closed,
      date: new Date("12 Feb 2023"),
      type: Type.Accommodation,
      owner: "Mark",
    },
    {
      status: Status.Open,
      date: new Date("4 May 2023"),
      type: Type.Welfare,
      owner: "Maria",
    },
    {
      status: Status.Open,
      date: new Date("5 May 2023"),
      type: Type.Other,
      owner: "Maria",
    },
  ];

  function draw_charts(type: ChartType) {
    let options = type === "bar" ? {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    } : {};

    return [
      new Chart(document.getElementById("status-chart") as HTMLCanvasElement, {
        type: type,
        data: {
          labels: Object.keys(Status),
          datasets: [
            {
              label: "# of Cases",
              data: Object.values(Status).map(
                (status) => cases.filter((e) => e.status === status).length
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
          labels: Object.keys(Type),
          datasets: [
            {
              label: "# of Cases",
              data: Object.values(Type).map(
                (type) => cases.filter((e) => e.type === type).length
              ),
              borderWidth: 1,
            },
          ],
        },
        options: options,
      }),
    ];
  }

  function draw_timeline() {
    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let start_date = new Date(
      (document.getElementById("date-start") as HTMLInputElement).value
    );
    let end_date = new Date(
      (document.getElementById("date-end") as HTMLInputElement).value
    );
    if (end_date < start_date) {
      [start_date, end_date] = [end_date, start_date];
    }

    let start_year = start_date.getFullYear();
    let end_year = end_date.getFullYear();

    let dates = [];

    for (let year = start_year; year <= end_year; year += 1) {
      let start_month = year === start_year ? start_date.getMonth() : 0;
      let end_month =
        year !== end_year ? MONTHS.length - 1 : end_date.getMonth();

      for (let month = start_month; month <= end_month; month += 1) {
        dates.push(`${MONTHS[month]} ${year}`);
      }
    }

    return new Chart(document.getElementById("timeline") as HTMLCanvasElement, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "# of Cases",
            data: dates
              .map((date) => new Date(date))
              .map(
                (date) =>
                  cases.filter(
                    (e) =>
                      e.date.getMonth() === date.getMonth() &&
                      e.date.getFullYear() == date.getFullYear()
                  ).length
              ),
            borderWidth: 1,
          },
        ],
      },
      options: {
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
    let chart_type = (localStorage.getItem("chart_type") || "bar") as ChartType;
    document
      .getElementById("chart-toggle-icon")!
      .setAttribute(
        "src",
        `icons/bxs-${chart_type == "bar" ? "pie" : "bar"}-chart-alt-2.svg`
      );

    let charts = draw_charts(chart_type);
    let timeline = draw_timeline();

    window.addEventListener("resize", () => {
      charts.forEach((chart) => chart.destroy());
      charts = draw_charts(chart_type);

      timeline.destroy();
      timeline = draw_timeline();
    });

    document.getElementById("chart-toggle")!.addEventListener("click", () => {
      document
        .getElementById("chart-toggle-icon")!
        .setAttribute("src", `icons/bxs-${chart_type}-chart-alt-2.svg`);
      chart_type = chart_type === "bar" ? "pie" : "bar";
      localStorage.setItem("chart_type", chart_type);
      window.dispatchEvent(new Event("resize"));
    });

    document.querySelectorAll('input[type="date"]').forEach((e) =>
      e.addEventListener("input", () => {
        timeline.destroy();
        timeline = draw_timeline();
      })
    );
  });
</script>

<article>
  <section>
    <button id="chart-toggle">
      <span class="icon">
        <img id="chart-toggle-icon" alt="pie/bar graph" />
      </span>
    </button>

    <div class="columns">
      <div class="column">
        <canvas id="status-chart" />
      </div>
      <div class="column">
        <canvas id="type-chart" />
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
          type="date"
          min="2020-01-01"
          max={dtfmt("yyyy-mm-dd")}
          value={`${dtfmt("yyyy")}-01-01`}
        />
      </div>
      <div class="column">
        <input
          id="date-end"
          class="input"
          type="date"
          min="2020-01-01"
          max={dtfmt("yyyy-mm-dd")}
          value={dtfmt("yyyy-mm-dd")}
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
