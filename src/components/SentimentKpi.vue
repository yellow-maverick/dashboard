<script>
import Db      from "../js/db.js"
import Lib     from '../js/lib.js';
import KpiList from "@/components/KpiList.vue";

export default{
  props: ["filter"],
  components: { KpiList },
  data() {
    return {
      lib: Lib,
      data: [],
      title: this.$t('sentiment_kpi.title')
    }
  },
  methods: {
    ...Db,
    async load() {
      let data = (await this.runQuery('kpi', { ...this.filter, with_sentiment_ratings: true, periods: {} }))[0]
      data     = data.data.current.sentiment_ratings
      this.data = []
      Object.keys(data).forEach(d => {
        this.data.push({
          name:      this.$t(`topics.${d}`),
          value:     data[d].value,
          subtitle:  this.$t('sentiment_kpi.based_on', {reviews: data[d].reviews}),
          max_scale: 10,
        })
      })
    },
  },
  mounted () {
    this.load()
  },
  watch: {
    filter () { this.load() }
  },
};
</script>

<template>
  <KpiList :title='title' :data='data'/>
</template>
