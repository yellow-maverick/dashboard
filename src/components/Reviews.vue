<script>
import Lib  from '../js/lib.js';
import Review from './Review.vue';
import { alove } from '../js/alova.js';

export default{
  props: ["filter"],
  components: { Review },
  data() {
    return {
      perPage: 20,
      page:    1,
      reviews: []
    }
  },
  methods: {
    async load() {
      if (!this.filter) return
      let r        = await alove.Get(`/v1/reviews`, { params: { ...this.filter, limit: this.perPage, page: this.page } })
      this.reviews = await r.clone().json()
    },
  },
  mounted () {
    this.load()
  },
  watch: {
    filter () { this.load() }
  },
  computed: {},
};
</script>

<template>
  <div>
    <h6 class="ps-3">{{ $t('reviews.title') }}</h6>
    <template v-if='filter' >
      <review v-for='review in reviews' :key='review.id' :review='review' />
    </template>
  </div>
</template>
