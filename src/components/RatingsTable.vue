<script>
import Db    from "../js/db.js"
import Lib   from "../js/lib.js"
import dayjs from "dayjs";

export default{
  data () {
    return {
      data:    null,
      columns: []
    }
  },
  props:      ['filter', 'type', 'segment'],
  components: {},
  methods: {
    ...Db,
    async load () {
      let params = { ...this.filter, period: 'month', periods: { yoy: 1 } }
      if (this.type == 'sentiment') {
        params['with_sentiment_ratings'] = true
        this.columns = [{ value: 'name', text: this.$t(`segments.topic`)}]
      }
      if (this.segment) {
        params['segment'] = this.segment
        this.columns = [{ value: 'name', text: this.$t(`segments.${this.segment}`) }]
      }
      let data     = (await this.runQuery('base_analytics', params))
      let dates    = [ ... new Set(data.flatMap(s => s.data.current.map(d => d.date))) ].sort()
      this.columns = this.columns.concat(dates.map(d => {
        return { value: d, text: dayjs(d).format('MMM YYYY') }
      }))
      if (this.type == 'sentiment') 
        this.organizeSentimentData(data)
      else
        this.organizeRatingsData(data)

    },
    organizeRatingsData (data) {
      this.data = []
      data.forEach(d => {
        let row = { name: d.name }
        d.data.current.forEach((c, i) => {
          const pDate = dayjs(c.date).add(-1, 'year').format('YYYY-MM-DD')
          let prev    = d.data.yoy.find(y => y.date == pDate)
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
      data.forEach(d => {
        d.data.current.forEach(c => {
          const pDate = dayjs(c.date).add(-1, 'year').format('YYYY-MM-DD')
          let prev    = d.data.yoy.find(y => dayjs(y.date).add(1, 'year').format('YYYY-MM-DD') == c.date)
          Object.keys(c.sentiment_ratings).forEach(key => {
            const stPrev      = prev.sentiment_ratings[key]
            rows[key]       ??= {name: this.$t(`topics.${key}`) }
            rows[key][c.date] = [
              `${Lib.round(c.sentiment_ratings[key].value, 2)} (${c.sentiment_ratings[key].reviews})`,
              Lib.change(c.sentiment_ratings[key].value, stPrev.value),
              ]
          })
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
    }
  },
}
</script>

<template>
  <div class="card ratings-table">
    <div class="pb-0 card-header mb-0">
      <h6>{{ title }}</h6>
    </div>
    <div class="p-3 card-body table-responsive">
      <table class='table' v-if='data' >
        <thead>
          <tr class='bordered-side'>
            <template v-for='c in columns' >
              <th rowspan="2" v-if='c == columns[0]'>{{ c.text }}</th>
              <th colspan="2" v-else class='text-center'>{{ c.text }}</th>
            </template>
          </tr>
          <tr class='bordered-side'>
            <template v-for='c in columns'>
              <template v-if='c != columns[0]' >
                <th>{{ $t('periods_labels.current') }}</th>
                <th>{{ $t('periods_labels.yoy_short') }}</th>
              </template>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for='row in data' class='text-center'>
            <template v-for='c in columns' >
              <td v-if='c == columns[0]' >{{ row[c.value] }}</td>
              <template v-else>
                <td >{{ (row[c.value] || [])[0] || '-' }}</td>
                <td :style="{ color: changeColor(row[c.value]) }">{{ (row[c.value] || [])[1] || '-' }}%</td>
              </template>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
