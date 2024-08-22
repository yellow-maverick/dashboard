<script>
import { alova } from '../js/alova.js'
//import _ from 'lodash'
import ProductForm from '@/components/ProductForm.vue'

export default {
  data() {
    return {
      property_id: this.$route.query.property_id,
      scraping: false,
      product: {
        url:  null,
        name: null,
      },
      scraped: {
        error:        null,
        name:         null,
        source:       null,
        currency:     null,
        price:        null,
        availability: null,
      },
      categories: [],
    }
  },
  props: [],
  components: {ProductForm},

  created() {
    this.load()
  },

  methods: {

    async scrape() {
      if (!this.product.url) return
      this.scraping = true
      let r = (await (await alova.Get(`/v1/connections/scrape`, {params: {url: this.product.url}})).clone().json())
      this.product.name   = this.scraped.name = r.property_info.name
      this.product.images = r.property_info.images
      this.scraped.error        = r.status
      this.scraped.currency     = r.property_info.price_info.currency || r.schema_org?.offer?.priceCurrency
      this.scraped.price        = r.property_info.price_info.price    || r.schema_org?.offer?.price
      this.scraped.availability = r.property_info.availability        || r.schema_org?.offer?.availability == 'InStock'
      this.scraped.source       = r.source
      this.scraping = false
    },

    async save() {
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
          <input name=url v-model=product.url type=text @input=scrape() class=form-control />
        </div>

        <div :class='{"spinner-border": scraping}' >
        </div>
        <span v-if=scraping > {{$t('products.scraping')}} </span>
        <div v-if=scraped.error >
          <span > {{$t('products.scraping_error')}} </span>
        </div>

        <div class='card col-4 mb-3' v-if=scraped.currency >
          <div class=card-body >
            <h3 class='text-primary pb-3 border-bottom' >
              <span class=price > {{scraped.price}} </span>
              <span class=currency > &nbsp;{{scraped.currency}} </span>
            </h3 >

            <div class='form-group row border-bottom' >
              <label class='col-4 col-form-label' > Available </label>
              <div class='col-7' >
                <p class=form-control-plaintext >
                  {{$t(`products.available.${scraped.availability ? 'yes' : 'no'}`)}}
                </p>
              </div>
            </div>

            <div class='form-group row border-bottom' >
              <label class='col-4 col-form-label' > Site </label>
              <div class='col-7' >
                <p class=form-control-plaintext > {{scraped.source.name}} </p>
              </div>
            </div>

            <div class='form-group row border-bottom' >
              <label class='col-4 col-form-label' > Name </label>
              <div class='col-7' >
                <a class=form-control-plaintext :href=product.url > {{scraped.name}} </a>
              </div>
            </div>
          </div>
        </div>

        <h5 role=button data-bs-toggle=collapse data-bs-target=#more-details aria-expanded=true aria-controls=more-details >
          {{ $t('products.more_details') }}
        </h5>
        <div id=more-details >
          <ProductForm :product=product :categories=categories />
        </div>

        <button type=button class='btn btn-primary' @click=save() :disabled='!scraping && product.name' > Save </button>
      </form>
    </div>
  </div>
</template>

