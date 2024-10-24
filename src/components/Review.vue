<script>
import dayjs from 'dayjs'
import Lib from '../js/lib.js'
import { alova } from '../js/alova.js'

export default{
  data () {
    return {
    }
  },
  props:      ['review', 'translations', 'selected'],
  components: {},

  methods: {
    upper (str) {
      if (!str) return
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    async translate() {
      this.translations[this.review.id] ||= {};
      if (this.translations[this.review.id][this.$i18n.locale]) return;

      this.translations[this.review.id][this.$i18n.locale] = {};
      this.loading = true;
      let payload = {
        data: { ...(this.review.title?.length) && { title: this.review.title } },
        locale: this.$i18n.locale
      }
      this.review.comments?.forEach(comment => {
        payload.data[`comment_${comment.type}`] = comment.comment;
      });

      let r = await alova.Post(`/v1/translate`, payload)
      r     = await r.clone().json()
      if (!this.translations[this.review.id][this.$i18n.locale]) this.translations[this.review.id][this.$i18n.locale] = {}
      let response = r.data;

      if (this.review.title?.length) this.translations[this.review.id][this.$i18n.locale]['title'] = Lib.DOMParser(response.title?.[0]);
      this.review.comments?.forEach(comment => {
        this.translations[this.review.id][this.$i18n.locale][`comment_${comment.type}`] = Lib.DOMParser(response[`comment_${comment.type}`]?.[0]);
      });

      this.loading = false;
      this.$forceUpdate();
    },
    async toggleTranslation () {
      if (this.review.translated)
        this.review.translated = false
      else {
        await this.translate()
        this.review.translated = true
      }
    },
    showTranslateButton() {
      return this.$i18n.locale != this.review.sentiment?.language_code && this.review.comments?.length;
    },

    forward (review) {
      let body = `
Please, open this review: ${location.href}

Title: ${review.title}

Date: ${review.review_date}
`;

    return `mailto:?subject=${encodeURIComponent(this.$t("reviews.forward_subject"))}&body=${encodeURIComponent(body)}`;
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
      return Lib.scale(this.review.ratings.overall, 10)
    },
    user_comments () {
      return this.review.comments?.filter(c => c.type != 'manager' && c.comment)
    },
    manager_comment () {
      return this.review.comments?.find(c => c.type == 'manager')
    }
  },
}
</script>

<template>
  <div class="mb-4 card z-index-2 review" :class='{ highlighted: selected }'>
    <div class="p-3 card-body">
      <div class="border-bottom-1 row justify-content-between d-flex mb-4">
        <div class='col-11 d-flex justify-content-start'>
          <div class="source-logo me-2" :title='review.source.name' >
            <img width='100%' :src="sourceImage" />
          </div>

          <div>
            <div class="title text-bold">
              {{ (review.translated && translations[review.id][this.$i18n.locale]) ? translations[review.id][this.$i18n.locale].title : review.title }}
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

      <div v-for='comment in user_comments' :key='comment' class='mt-2'>
        <strong> {{ upper(comment.type) }}</strong>
        <div> {{ (review.translated && translations[review.id][this.$i18n.locale]) ? translations[review.id][this.$i18n.locale][`comment_${comment.type}`] : comment.comment }}</div>
      </div>
      <div v-if='manager_comment' class='mt-2 mb-1' style='background-color: #f0f0fa; padding: 8px; margin: -8px; color: #444'>
          <strong> {{ upper(manager_comment.type) }}</strong>
          <div> {{ (review.translated && translations[review.id][this.$i18n.locale]) ? translations[review.id][this.$i18n.locale].comment_manager : manager_comment.comment }}</div>
      </div>
      <div class="row mt-3" @click.stop >
        <a :href='review.source.respond_url' target='_blank' v-if="review.source.respond_url" class="btn btn-outline-primary ms-2 me-4 col-12 col-sm-auto mb-2 mb-sm-0"
          @click="openRespondUrl" >
          {{ $t("reviews.respond") }}
        </a>
        <button v-if="showTranslateButton()" class="btn btn-outline-primary me-4 col-12 col-sm-auto mb-2 mb-sm-0"
          @click="toggleTranslation" >
          {{ review.translated ? $t("reviews.show_original") : $t("reviews.translate") }}
        </button>
        <a :href="forward(review)" class="btn btn-outline-primary me-4 col-12 col-sm-auto mb-2 mb-sm-0">
          {{ $t("reviews.forward") }}
        </a>

      </div>
    </div>
  </div>
</template>
