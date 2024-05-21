<script>
import dayjs from "dayjs";
import sources from '../js/sources.js'

export default{
  async data () {
    return { }
  },
  props:      ['review'],
  components: {},

  methods: {
    upper (str) {
      if (!str) return
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  },
  computed: {
    sourceImage() {
      return new URL(`../assets/img/sources/${this.review.source.slug}.png`, import.meta.url).href
    },
    reviewDate () {
      return dayjs(this.review.review_date).format("MMM DD, YYYY")
    },
    ratingColor () {
      let value = this.review.ratings.overall
      if (!value && value != '0') return 'rating-unknown'

      value = parseFloat(value)
      if (value <= 4)  return 'rating0-4'
      if (value >= 97) return 'rating97-100'

      let n = Math.floor((value - 1) / 4) * 4
      return `rating${n + 1}-${n + 4}`
    }
  }
}
</script>

<template>
  <div class="mb-4 card z-index-2 review">
    <div class="p-3 card-body">
      <div class="border-bottom-1 row justify-content-between d-flex mb-4">
        <div class='col-11 d-flex justify-content-start'>
          <div class="source-logo me-2" :title='review.source.name' >
            <img width='100%' :src="sourceImage" />
          </div>

          <div>
            <div class="title text-bold">
              {{ review.title }} 
            </div>
            <div class="subtitle">{{ $t('reviews.subtitle', { name: review.reviewer.name || $t('reviews.someone'), date: reviewDate }) }}</div>
          </div>
        </div>
        <div class="col-1">
          <div class='rating float-right' :class="ratingColor">
            {{ review.ratings.overall }}
          </div>
        </div>
      </div>
      <div v-for='comment in review.comments' :key='comment' class='mt-2'>
        <strong> {{ upper(comment.type) }}</strong>
        <div> {{ comment.comment }}</div>
      </div>
    </div>
  </div>
</template>
