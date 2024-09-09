<script>
import { alova } from '../js/alova.js'
//import _ from 'lodash'
import ProductForm from '@/components/ProductForm.vue'
import ScrapedConnection from '@/components/ScrapedConnection.vue'

export default {
  data() {
    return {
      property_id: this.$route.query.property_id,
      status: null,
      product: {
        connection: {
          source: null,
          url:    null,
        },
        name: null,
      },
      scraped: { },
      categories: [],
    }
  },
  props: [],
  components: {ProductForm, ScrapedConnection},

  created() {
    this.load()
  },

  watch: {
    scraped: {
      handler() {
        this.product.name                = this.scraped.name
        this.product.connection.name     = this.scraped.name
        this.product.connection.price    = this.scraped.price
        this.product.connection.currency = this.scraped.currency
        this.product.connection.source   = this.scraped.source.slug
        this.product.connection.images   = this.scraped.images
      },
      deep: true
    }
  },

  methods: {

    async save() {
      let r = (await (await alova.Post(`/v1/products`, {product: this.product})).clone().json())
      if (r.id) {
        this.$router.push({name: 'settings.connections', query: {
          ...this.$route.query, property_id: this.property_id, product_id: r.id,
        }})
      } else {
        this.status = this.$t('products.save_error', {error: r.error})
      }
    },

    async load() {
      this.profile    = await this.$store.dispatch('profile/fetch')
      this.categories = (await (await alova.Get(`/v1/product_categories`)).clone().json()).data
    },

  },
}
</script>

<template>
  <div class=card >
    <div class=card-body >
      <form>
        <div class=form-group >
          <label for=url >{{ $t('products.url') }}</label>
          <input name=url v-model=product.connection.url type=text class=form-control />
        </div>

        <ScrapedConnection :scraped=scraped :url=product.connection.url />

        <h5 role=button data-bs-toggle=collapse data-bs-target=#more-details aria-expanded=true aria-controls=more-details >
          {{ $t('products.more_details') }}
        </h5>
        <div id=more-details class=show >
          <ProductForm :product=product :categories=categories />
        </div>

        <div >
          <button type=button class='btn btn-primary' @click=save() :disabled='!product.name || !product.connection.url' >
            {{ $t('products.save') }}
          </button>
          <span v-if=status > {{status}} </span>
        </div>
      </form>
    </div>

  </div>
</template>

