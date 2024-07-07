<script>
import Db from "../js/db.js"
import VueWordCloud from 'vuewordcloud';

export default{
  data () {
    return {
      data: null,
      topics: []
    }
  },
  props: [ 'filter', 'topic' ],
  components: { VueWordCloud },
  mounted() {
    this.load()
  },
  watch: {
    filter () { this.load() },
    topic () { this.load() }
  },
  methods: {
    ...Db,
    async load() {
      this.data = await this.runQuery('products_word_cloud', { ...this.filter, topic: this.topic, limit: 200 })
    },
    formatData(row) {
      if (!row) return
      console.log(row);
      return row.map(r => [r.word, r.weight * this.multiplier(r.polarity)])
    },
    multiplier (p) {
      return p == 'negative' ? -1 : 1
    }
  },
}
</script>

<template>
  <VueWordCloud v-if='data' class='w-100' style="height: 480px" :words="formatData(data)" :color="([, weight]) => weight > 0 ? 'darkgreen' : 'orangered'"></VueWordCloud>
</template>
