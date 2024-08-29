<script>
//import { alova } from '../js/alova.js'
import ScrapedConnection from '@/components/ScrapedConnection.vue'

export default {
  data() {
    return {
      profile:     null,
      property_id: this.$route.query.property_id,
      connection: {
        source: null,
        url:    null,
      },
      scraped: {},
    }
  },
  props: ['property', 'product', 'adding'],
  components: {ScrapedConnection},

  created() {
    this.load()
  },

  watch: {
    scraped: {
      handler() {
        this.connection.name     = this.scraped.name
        this.connection.price    = this.scraped.price
        this.connection.currency = this.scraped.currency
        this.connection.source   = this.scraped.source.slug
        this.connection.images   = this.scraped.images
      },
      deep: true
    }
  },

  methods: {

    async save() {
      this.adding = false
      //let c = (await (await alova.Post(`/v1/connections`, {product: this.product})).clone().json())
      //if (c.id) {
      //  this.adding = false
      //} else {
      //  this.status = this.$t('products.save_error', {error: c.error})
      //}
    },

    async load() {
      this.profile = await this.$store.dispatch('profile/fetch')
    },

  },
}
</script>

<template>
  <div>
    <div class=form-group >
      <label for=url >{{ $t('connections.url') }}</label>
      <input name=url v-model=connection.url type=text class=form-control />
    </div>

    <ScrapedConnection :scraped=scraped :url=connection.url />

    <button type=button class='btn btn-primary' @click=save() :disabled='!connection.source' >
      {{ $t('connections.save') }}
    </button>
  </div>
</template>

