<script>
import Db      from "../js/db.js"
import Lib     from '../js/lib.js';
import KpiList from "@/components/KpiList.vue";

export default{
  props: ["filter"],
  components: { KpiList },
  data() {
    return {
      lib:   Lib,
      data:  [],
      title: this.$t('source_ratings_kpi.title')
    }
  },
  methods: {
    ...Db,
    async load() {
      let params = { ...this.filter, segment: 'source', periods: {} }
      //if (!this.filter.for_properties) params.origin_sources = true
      let data  = await this.runQuery('base_analytics', params)
      this.data = []
      data.forEach(d => {
        this.data.push({
          name:     d.name,
          value:    d.data.current.overall_rating,
          subtitle: this.$t('sentiment_kpi.based_on', {reviews: d.data.current.reviews}),
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
