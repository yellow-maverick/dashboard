<script>
import { alova } from '../js/alova.js'
import PhotoGallery from '@/components/PhotoCardGallery.vue'

export default {
  data() {
    return {
      scraping: false,
    }
  },
  props: ['url', 'scraped'],

  components: {PhotoGallery},

  watch: {
    url() {
      this.scrape()
    }
  },

  methods: {
    async scrape() {
      this.scraping = true
      let r = (await (await alova.Get(`/v1/connections/scrape`, {params: {url: this.url}})).clone().json())
      this.scraped.error        = r.status
      this.scraped.source       = r.source
      this.scraped.name         = r.property_info.name                  || r.schema_org?.product?.name
      this.scraped.currency     = r.property_info?.price_info?.currency || r.schema_org?.offer?.priceCurrency
      this.scraped.price        = r.property_info?.price_info?.price    || r.schema_org?.offer?.price
      this.scraped.availability = r.property_info?.availability         || r.schema_org?.offer?.availability.includes('InStock')
      let schemaImg = r.schema_org?.product?.image?.url || r.schema_org?.product?.image
      this.scraped.images       = r.property_info?.images || (schemaImg ? [schemaImg] : [])
      this.scraping = false
    }
  },
}
</script>

<template>
  <div>
    <div :class='{"spinner-border": scraping}' >
    </div>
    <span v-if=scraping > {{$t('connections.scraping')}} </span>
    <div v-if=scraped.error >
      <span > {{$t('connections.scraping_error')}} </span>
    </div>

    <div class='card col-6 mb-3' v-if=scraped.source >
      <div class=card-body >

        <div class='py-2 border-bottom'>
          <PhotoGallery :images=scraped.images />
        </div>

        <div class='row py-2 border-bottom align-items-center'>
          <label class='col-5 col-form-label' > {{ $t('products.price') }} </label>
          <h3 class='col-6 text-primary m-0' v-if=scraped.price >
            <span class=price > {{scraped.price}} </span>
            <span class=currency > &nbsp;{{scraped.currency}} </span>
          </h3 >
        </div>

        <div class='py-2 row border-bottom align-items-center' >
          <label class='col-5 col-form-label py-0' > {{ $t('products.available.title') }} </label>
          <div class='col-6' >
            {{$t(`products.available.${scraped.availability ? 'yes' : 'no'}`)}}
          </div>
        </div>

        <div v-if='scraped.source.slug != "schema_org"' class='row py-2 border-bottom align-items-center' >
          <label class='col-5 col-form-label py-0' > {{ $t('connections.site') }} </label>
          <div class='col-6' >
            {{scraped.source.name}}
          </div>
        </div>

        <div v-if=scraped.name class='row py-2 border-bottom align-items-center' >
          <label class='col-5 col-form-label ' > {{ $t('connections.name') }} </label>
          <div class='col-6' >
            <a class=form-control-plaintext :href=url > {{scraped.name}} </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

