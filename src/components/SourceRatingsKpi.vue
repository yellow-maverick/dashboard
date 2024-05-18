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
      title: this.$t('source_ratings_kpi.title')
    }
  },
  methods: {
    ...Db,
    async load() {
      let data  = (await this.runQuery('kpi', { ...this.filter, segment: 'source', periods: {} }))
      this.data = []
      data.forEach(d => {
        this.data.push({ name: d.name, value: d.data.current.overall_rating, max_scale: 5 })
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
