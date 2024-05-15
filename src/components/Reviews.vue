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
    paginate (page) {
      this.page = page
      this.load()
    }
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
    <div class="d-flex justify-content-between">
      <h6 class="ps-3">{{ $t('reviews.title') }}</h6>
      <strong class="">{{ $t('reviews.page', { page: page }) }}</strong>
    </div>
    <template v-if='filter' >
      <review v-for='review in reviews' :key='review.id' :review='review' />
      <nav aria-label="Review navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item">
            <a class="page-link" href="#" :aria-label="$t('reviews.previous')" @click='paginate(page - 1)'>
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">$t('reviews.previous')</span>
            </a>
          </li>
          <template v-for='i in [-1,0,1]' :key=i>
            <li class="page-item" :class='{ active: i == 0}' v-if='page + i > 0'><a class="page-link" href="#" @click='paginate(page + i)'>{{ page + i }}</a></li>
          </template>
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Next" @click='paginate(page + 1)'>
              <span aria-hidden="true">&raquo;</span>
              <span class="sr-only">$t('reviews.next')</span>
            </a>
          </li>
        </ul>
      </nav>

    </template>
  </div>
</template>
