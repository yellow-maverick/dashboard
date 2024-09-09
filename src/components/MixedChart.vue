<script>
import Db   from "../js/db.js"
import Lib  from "../js/lib.js"
import Chart from "chart.js/auto";
import ArgonRadio from "@/components/ArgonRadio.vue";

export default {
  name: "bar-line-chart",

  data () {
    return {
      loading: false,
      period:  'month',
      defaultDataset: {
        ratings: {
          type:  'line',
          borderWidth: 4,
          fill: true,
          maxBarThickness: 10,
          yAxisID: 'y1'
        },
        reviews: {
          type:  'bar',
          borderWidth: 0,
          fill: true,
          maxBarThickness: 20,
          yAxisID: 'y'
        }
      },
      colors: { main: { reviews: "#4B7573", ratings: '#eab' }, competitor: { reviews: "#7B4573", ratings: '#aeb' } },
      data: { }
    }
  },

  components: { ArgonRadio },

  props: {
    filter: {
      type: Object,
      default: () => {},
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
      this.reload()
    },
    period () {
      this.reload()
    }
  },

  mounted() {
    this.load()
  },

  computed: {

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
    datasets (data) {
      let d = [];
      [ 'main', 'competitor' ].forEach(b => {
        if (data[b]) {
          Object.keys(data[b]).forEach(c => {
            d.push({
              label: this.$t(`charts.${c}`, { name: this.filter.property_objs[b].name }),
              data:  data[b][c],
              borderColor: this.colors[b][c],
              backgroundColor: (this.defaultDataset[c].type == 'bar' ? this.colors[b][c] : 'transparent'),
              ...this.defaultDataset[c]
            })
          })
        }
      })
      return d
    },

    async load () {
      //if (!this.filter) return
      var ctx1  = document.getElementById("chart").getContext("2d");

      this.data.main     = (await this.runQuery('base_analytics', { ...this.filter, period: this.period, periods: [] }))[0]?.data?.current
      if (this.filter.competitors?.property_id)
        this.data.competitor = (await this.runQuery('base_analytics', { ...this.filter.competitors, period: this.period, periods: [] }))[0]?.data?.current
      if (!this.data) return
      const series  = Lib.uniqSorted(this.data.main.map(d => d.date).concat(this.data.competitor?.map(d => d.date) || []))
      let data = {}
      Object.keys(this.data).forEach(d => {
        data[d] ||= {}
        data[d].reviews = this.data[d].map(d => d.reviews)
        data[d].ratings = this.data[d].map(d => d.overall_rating)
      })

      new Chart(ctx1, {
        data: {
          datasets: this.datasets(data),
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
                color: this.colors.main.reviews,
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
                color: this.colors.main.ratings,
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

<template>
  <div class="card">
    <div class="pb-0 card-header mb-0">
      <div class="d-flex justify-content-between me-4">
        <h6>{{ $t('charts.'+title) }}</h6>
        <div class="ms-5 d-flex justify-content-start">
          <argon-radio name='mixed-chart-period' id='mixed-chart-period-month' value='month' v-model='period'>{{ $t('periods.month') }}</argon-radio>
          <argon-radio name='mixed-chart-period' id='mixed-chart-period-quarter' value='quarter' v-model='period' class='ms-3'>{{ $t('periods.quarter') }}</argon-radio>
        </div>
      </div>
      <!--<p class="text-sm">
        <i class="fa fa-arrow-up text-success"></i>
        <span class="font-weight-bold">{{detail1}}</span>
        {{detail2}}
      </p>-->
    </div>
    <div class="p-3 card-body">
      <div class="chart">
        <canvas id="chart" class="chart-canvas" height="350" v-if='!loading'></canvas>
      </div>
    </div>
  </div>
</template>
