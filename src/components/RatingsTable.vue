<script>
import Db    from "../js/db.js"
import Lib   from "../js/lib.js"
import dayjs from "dayjs";
import { alova } from '../js/alova.js'
import ArgonRadio from "@/components/ArgonRadio.vue";
import LineChart  from "@/components/LineChart.vue";

export default{
  data () {
    return {
      data:    null,
      period:  'month',
      datatype: 'table',
      identifier: '',
      columns: []
    }
  },
  props:      ['filter', 'type', 'segment'],
  components: { ArgonRadio, LineChart },
  created () {
    this.identifier = parseInt(Math.random() * 1000)
  },
  methods: {
    ...Db,
    async load () {
      let dates, data, params = { ...this.filter, period: this.period, periods: { yoy: 1 }, origin_sources: true }
      if (this.type == 'sentiment') {
        params['with_sentiment_ratings'] = true
        this.columns = [{ value: 'name', text: this.$t(`segments.topic`)}]
      }
      if (this.segment) {
        params['segment'] = this.segment
        this.columns = [{ value: 'name', text: this.$t(`segments.${this.segment}`) }]
      }
      if (this.type == 'sentiment') {
        data  = await alova.Get(`/v1/sentiment`, { params: { ...this.filter, per: this.period, trend: 'yoy' } })
        data  = await data.clone().json()
        dates = [ ... new Set(Object.values(data).flatMap(s => s?.map(d => d?.current?.date))) || [] ].sort()
        this.organizeSentimentData(data)
      } else {
        data  = (await this.runQuery('base_analytics', params))
        dates = [ ... new Set(data.flatMap(s => s.data?.current?.map(d => d.date) || [])) ].sort()
        this.organizeRatingsData(data)
      }

      this.columns = this.columns.concat(dates.map(d => {
        return { value: d, text: this.formatDate(d) }
      }))

    },
    formatDate (d) {
      if (this.period == 'quarter') return d
      return dayjs(d).format('MMM YYYY')
    },
    organizeRatingsData (data) {
      this.data = []
      data.forEach(d => {
        if (!d.data.current) return
        let row = { name: d.name }
        d.data.current.forEach((c) => {
          const pDate = dayjs(c.date).add(-1, 'year').format('YYYY-MM-DD')
          let prev    = d.data.yoy?.find(y => y.date == pDate)
          row[c.date] = [
            `${Lib.round(c.overall_rating, 2)} (${c.reviews})`,
            Lib.change(c.overall_rating, prev?.overall_rating),
          ]
        })
        this.data.push(row)
      })
    },
    organizeSentimentData (data) {
      let rows = {}
      Object.keys(data).forEach(key => {
        if (!rows[key]) rows[key] = {name: this.$t(`topics.${key}`) }
        let d = data[key]
        d.forEach(c => {
          rows[key][c.current.date] = [
            `${Lib.round(c.current?.value, 2)} (${c.current?.reviews})`,
            Lib.change(c.current?.value, c.yoy?.value),
          ]
        })
        this.data = Object.keys(rows).sort().map(k => rows[k])
      })
    },
    changeColor (value) {
      if (value == undefined || value[1] == undefined) return 'grey'
      let v = parseFloat(value[1].split(' ')[0])
      if (v > 0) return '#00DD00'
      if (v < 0) return '#DD0000'
      return '#67748e'
    }
  },
  computed: {
    title () {
      if (this.segment)
        return this.$t('ratings_table.title_with_segment', { s: this.$t(`segments.${this.segment}`) })
      return this.$t(`ratings_table.${this.type}_title`)
    }
  },
  mounted () {
    this.load()
  },
  watch: {
    filter () {
      this.load()
    },
    period () {
      this.load()
    }
  },
}
</script>

<template>
  <div class="card ratings-table">
    <div class="d-flex justify-content-between me-4">
      <div class="pb-0 card-header mb-0">
        <h6>{{ title }}</h6>
      </div>
      <div class="d-flex justify-content-start pt-4">
        <div class="d-flex justify-content-start">
          <argon-radio :name="`tc-${identifier}`" :id="`tc-${identifier}-table`" value='table' v-model='datatype' class=''>{{ $t('ratings_table.table') }}</argon-radio>
          <argon-radio :name="`tc-${identifier}`" :id="`tc-${identifier}-chart`" value='chart' v-model='datatype' class='ms-3'>{{ $t('ratings_table.chart') }}</argon-radio>
        </div>
        <div class="ms-6 d-flex justify-content-start">
          <argon-radio :name="`rt-${identifier}`" :id="`rt-${identifier}-month`" value='month' v-model='period'>{{ $t('periods.month') }}</argon-radio>
          <argon-radio :name="`rt-${identifier}`" :id="`rt-${identifier}-quarter`" value='quarter' v-model='period' class='ms-3'>{{ $t('periods.quarter') }}</argon-radio>
        </div>
      </div>
    </div>
    <div class="p-3 card-body table-responsive">
      <table class='table text-center' v-if='data && datatype == "table"' >
        <thead>
          <tr class='bordered-side'>
            <template v-for='c in columns' :key='c' >
              <th rowspan="2" v-if='c == columns[0]'>{{ c.text }}</th>
              <th colspan="2" v-else class='text-center'>{{ c.text }}</th>
            </template>
          </tr>
          <tr class='bordered-side'>
            <template v-for='c in columns' :key='c'>
              <template v-if='c != columns[0]' >
                <th>{{ $t('periods_labels.current') }}</th>
                <th>{{ $t('periods_labels.yoy_short') }}</th>
              </template>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for='row in data' class='text-center' :key='row'>
            <template v-for='c in columns' :key='c' >
              <td v-if='c == columns[0]' >{{ row[c.value] }}</td>
              <template v-else>
                <td >{{ (row[c.value] || [])[0] || '-' }}</td>
                <td :style="{ color: changeColor(row[c.value]) }">{{ (row[c.value] || [])[1] || '-' }}%</td>
              </template>
            </template>
          </tr>
        </tbody>
      </table>
      <line-chart :series='columns' :data='data' v-if='data && datatype == "chart"' />
    </div>
  </div>
</template>
