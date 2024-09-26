<script>
import { alova } from '../js/alova.js'
import _ from 'lodash'
import ScrapedConnection from '@/components/ScrapedConnection.vue'

export default {
  data() {
    return {
      status:      null,
      saving:      false,
      profile:     null,
      property_id: this.$route.query.property_id,
      connection: {
        source: null,
        url:    null,
      },
      scraped: {},
    }
  },
  props: ['property', 'product', 'forProperty'],
  components: {ScrapedConnection},

  inject: ['reload'],

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

    cancel() {
      this.$parent.adding = false
    },

    async save() {
      this.saving = true
      let p = this.forProperty ? {property_id: this.property.id} : {product_id: this.product.id}
      let c = (await (await alova.Post(`/v1/connections`, _.merge(p, {connection: this.connection}))).clone().json())
      if (c.id) {
        this.$parent.adding = false
        this.reload()
      } else {
        this.status = this.$t('products.save_error', {error: c.error})
      }
      this.saving = false
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

    <ScrapedConnection v-if=!forProperty :scraped=scraped :url=connection.url />

    <div class='d-flex align-items-center mb-3' >
      <button type=button class='btn btn-primary mb-0' @click=save() :disabled='saving || (!forProperty && !connection.source)'  >
        {{ $t('connections.add') }}
      </button>
      <a class='ms-3 text-bold' role=button @click=cancel() > {{ $t('connections.cancel') }} </a>
      <span class=ms-3 > {{status}} </span>
    </div>
  </div>
</template>

