<script>
import dayjs from 'dayjs'
import Lib from '../js/lib.js'

export default{
  data () {
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
      return Lib.sourceImage(this.review.source.slug)
    },
    reviewDate () {
      return dayjs(this.review.review_date).format("MMM DD, YYYY")
    },
    ratingColor () {
      return Lib.ratingColor(this.scaledRating)
    },
    scaledRating () {
      return Lib.scale(this.review.ratings.overall, 100)
    },
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
            {{ scaledRating }}
          </div>
        </div>
      </div>

      <span class="me-2" v-if='review.origin'>{{ $t('reviews.from') }}</span><span class="text-bold"> {{ review.origin }} </span>

      <div v-for='comment in review.comments' :key='comment' class='mt-2'>
        <template v-if=comment.comment >
          <strong> {{ upper(comment.type) }}</strong>
          <div> {{ comment.comment }}</div>
        </template>
      </div>
    </div>
  </div>
</template>
