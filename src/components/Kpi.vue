<script>
import Db   from "../js/db.js"
import Card from "../examples/Cards/Card.vue";
import Lib  from '../js/lib.js';
import { alove } from '../js/alova.js';

export default{
  props: ["start_date", "end_date", 'segment', "company_id", "group_id", 'trend'],
  components: { Card },
  data() {
    return {
      data: {
        current: { reviews: null }
      },
      valueField: 'reviews'
    }
  },
  methods: {
    ...Db,
    async load() {
      let data    = {};
      let periods = {}
      if (this.trend) periods[this.trend] = 1

      this.valueField = /reviews_count|mentions_count/.test(this.segment) ? "reviews" : "overall_rating";
      this.data       = (await this.runQuery('kpi', { periods: periods }))[0].data
      if (this.data.current) {
        this.data.change = Lib.change(this.data.current[this.valueField], this.data.yoy?.[this.valueField]);
        //if (this.segment == "numerical") this.data.current.overall_rating /= 10;
        if (!/reviews_count|mentions_count/.test(this.segment))
          this.data.current[this.valueField] = Lib.round(this.data.current[this.valueField]);
      }
    },
    changedStatus(change) {
      if (change == null) return "";
      if (change > 1) return "text-success";
      if (change < 1) return "text-danger";
      return "text-muted";
    },
  },
  mounted () {
    this.load()
  },
  computed: {
    title() {
      return this.$t(`segments.${this.segment}`);
    },
    trendDetail () {
      if (this.trend)
        return this.$t(`periods_labels.${this.trend}`);
      else
        return ''
    },
  },
};
</script>

<template>
  <div>
    <Card
      :title="title"
      :value="data.current[valueField]"
      :percentage="data.change"
      :percentageColor='changedStatus(data.change)'
      iconClass="fa-solid fa-star"
      iconBackground="white"
      :detail="trendDetail"
      directionReverse
      />
  </div>
</template>
