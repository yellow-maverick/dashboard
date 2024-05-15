<template>
  <div class="card">
    <div class="pb-0 card-header mb-0">
      <h6>{{ $t('charts.'+title) }}</h6>
      <p class="text-sm">
        <i class="fa fa-arrow-up text-success"></i>
        <span class="font-weight-bold">{{detail1}}</span>
        {{detail2}}
      </p>
    </div>
    <div class="p-3 card-body">
      <div class="chart">
        <canvas id="chart" class="chart-canvas" height="350" v-if='!loading'></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Db   from "../js/db.js"
import Chart from "chart.js/auto";

export default {
  name: "bar-line-chart",

  data () {
    return {
      loading: false
    }
  },

  props: {
    filter: {
      type: Object,
      default: {},
    },
    title: {
      type: String,
      default: "Ratings",
    },
    detail1: {
      type: String,
      default: "4% more",
    },
    detail2: {
      type: String,
      default: "in 2024",
    },
  },

  watch: {
    filter () {
      this.loading = true
      this.$nextTick(() => {
        this.loading = false
        this.$nextTick(() => {
          this.load()
        })
      })
    }
  },

  mounted() {
    this.load()
  },

  methods: {
    ...Db,

    async load () {
      var ctx1  = document.getElementById("chart").getContext("2d");

      this.data     = (await this.runQuery('base_analytics', { ...this.filter, period: 'month', periods: [] }))[0]?.data?.current
      if (!this.data) return
      const series  = this.data.map(d => d.date)
      const reviews = this.data.map(d => d.reviews)
      const ratings = this.data.map(d => d.overall_rating)
      const colors  = { reviews: "#4B7573", ratings: '#eab' }

      const mixedChart = new Chart(ctx1, {
        data: {
          datasets: [
            {
              type:  'line',
              label: 'Overall Rating',
              data:  ratings,
              borderColor: colors.ratings,
              borderWidth: 4,
              fill: true,
              maxBarThickness: 10,
              pointRadius: 0,
              yAxisID: 'y1'
            },
            {
              type:  'bar',
              label: 'Reviews',
              data:  reviews,
              borderColor: colors.reviews,
              backgroundColor: colors.reviews,
              borderWidth: 0,
              fill: true,
              maxBarThickness: 20,
              yAxisID: 'y'
            },
          ],
          labels: series
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index' },
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              enabled: true
            }
          },
          scales: {
            y: {
              grid: {
                display: true,
                drawOnChartArea: true,
                drawTicks: true,
              },
              ticks: {
                display: true,
                padding: 5,
                color: colors.reviews,
                font: {
                  size: 11,
                  family: "Open Sans",
                  style: "normal",
                  lineHeight: 2,
                },
              },
            },
            y1: {
              position: 'right',
              suggestedMin: 0,
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                display: true,
                padding: 5,
                color: colors.ratings,
                font: {
                  size: 11,
                  family: "Open Sans",
                  style: "normal",
                  lineHeight: 2,
                },
              },
            },
            x: {
              grid: {
                drawOnChartArea: true,
              },
              ticks: {
                display: true,
                color: "#444",
                font: {
                  size: 11,
                  family: "Open Sans",
                  style: "normal",
                  lineHeight: 2,
                },
              },
            },
          },
        }
      });
    }
  },
};
</script>
