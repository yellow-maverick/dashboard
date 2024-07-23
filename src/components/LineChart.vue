<script>
import Db   from "../js/db.js"
import Chart from "chart.js/auto";

export default {
  name: "line-chart",

  data () {
    return {
      loading: false,
      id: parseInt(Math.random() * 10000)
    }
  },

  components: {},

  props: {
    data: {
      type: Object,
      default: {},
    },
    series: {
      type: Array,
      default: {},
    }
  },

  watch: {
    data () {
      this.reload()
    }
  },

  mounted() {
    this.load()
  },

  computed: {
    chartID() {
      return `line-chart-${this.id}`
    }
  },

  methods: {
    ...Db,

    reload () {
      this.loading = true
      this.$nextTick(() => {
        this.loading = false
        this.$nextTick(() => {
          this.load()
        })
      })
    },

    async load () {
      if (!this.data) return

      var ctx      = document.getElementById(this.chartID).getContext("2d");
      const colors = [
        '#ffa056', '#6f4e7c', '#0b84a5', '#4198d7','#ff6384', "#4B7573", '#ffaaff',
         '#d78', '#ffcd56', '#9966ff', '#aa5500', '#550000', '#ff9f40', '#36a2eb' ]
      const series = this.series.slice(1).map(d => d.text)
      const datasets = [] 
      let yAxes      = {}
      let yAxe       = {
        display: false,
        suggestedMin: 0,
        suggestedMax: 10,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          display: true,
          color: colors[1],
          padding: 5,
          font: {
            size: 11,
            family: "Open Sans",
            style: "normal",
            lineHeight: 2,
          },
        },
      }

      this.data.forEach((d,i) => {
        let sd = this.series.slice(1).map(s => d[s.value])
        sd = sd.map(s => s ? s[0].split(' ')[0] : s)
        datasets.push({
          type:            'line',
          label:           d.name,
          data:            sd.map(s => s?.split(' ')[0]),
          borderColor:     colors[i],
          borderWidth:     4,
          fill:            false,
          maxBarThickness: 10,
          yAxisID:         `y${i}`
        })
        yAxes[`y${i}`] = {... yAxe}
      })
      yAxes['y0'].display = true

      new Chart(ctx, {
        data: {
          datasets: datasets,
          labels:   series
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              enabled: true,
              mode: 'nearest'
            }
          },
          scales: {
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
            ... yAxes
          },

        }
      });
    }
  },
};
</script>

<template>
  <div class="chart">
    <canvas :id='chartID' class="chart-canvas" height="350" v-if='data && !loading'></canvas>
  </div>
</template>
