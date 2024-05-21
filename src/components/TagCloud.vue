<script>
import { alova } from '../js/alova.js';
import VueWordCloud from 'vuewordcloud';

export default{
  data () {
    return {
      data: null
    }
  },
  components: { VueWordCloud },
  mounted() {
    alova.Get('/v1/queries/1/run').then(r => r.clone().json() ).then(async r => {
      this.data = r.data?.slice(1)
    })
  },
  methods: {
    formatData(row) {
      if (!row) return
      return row.map(r => [r.text, r.weight])
    }
  },
}
</script>

<template>
  <div v-for="product in data" :key="product" v-if='data' class='mt-4'>
    <h5>{{ product[1] }} - <span style='color: green'>{{ $t('word_cloud.positive_words') }}</span></h5>
    <VueWordCloud class='w-100' style="height: 480px" :words="formatData(product[2])"></VueWordCloud>
    <h5>{{ product[1] }} - <span style='color: red'>{{ $t('word_cloud.negative_words') }}</span></h5>
    <VueWordCloud class='w-100' style="height: 480px" :words="formatData(product[3])"></VueWordCloud>
  </div>
</template>
