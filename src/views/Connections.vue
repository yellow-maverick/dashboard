<script>
import Db from '../js/db.js'
import Lib from '../js/lib.js'
import { alova } from '../js/alova'

import ProductsEdit from '@/components/ProductsEdit.vue'
import ConnectionsEdit from '@/components/ConnectionsEdit.vue'

export default {
  data() {
    return {
      property_id: null, // open on mount
      product_id:  null, // open on mount
      properties:  [],
      categories:  [],
    }
  },
  props:      [],
  components: {ProductsEdit, ConnectionsEdit},

  created() {
    this.product_id  = this.$route.query.product_id // for initial render to scroll expanded
    this.property_id = this.$route.query.property_id
  },

  mounted() {
    this.load()
  },

  methods: {
    ...Db,

    async load() {
      this.profile    = await this.$store.dispatch('profile/fetch')
      this.categories = (await (await alova.Get(`/v1/product_categories`)).clone().json()).data
      await this.loadProperties()

      if (this.product_id) {
        const element = document.getElementById(`product-${this.product_id}`)
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }
    },

    async reload() {
      this.loadProperties()
    },

    async loadProperties() {
      this.properties = (await this.runQuery('properties', {
        with_products: true, with_connections: true,
      }))
    },

    hide(event) {
      event.target.style.display = 'none'
    },
    sourceImage(slug) {
      return Lib.sourceImage(slug)
    },

    async productSave(pd) {
      await alova.Patch(`/v1/products/${pd.id}`, pd)
    },
  },

  computed: {},
}
</script>

<template>
  <div class=container-fluid >
    <div class=row >
      <div v-for='(p,i) in properties' class=card :key=i >
        <div id=property-accordion class=accordion >
          <div class=accordion-item >
            <h5 class=accordion-header >
              <button class=accordion-button data-bs-toggle=collapse :data-bs-target='`#collapse-${i}`' aria-expanded=true :aria-controls='`#collapse-${i}`'  >
                {{p.name}}
                <div class='d-flex justify-content-end' style='flex: auto' >
                  <img class='me-1' v-for='c in p.connections' :title=c.source.name style='max-height: 20px' :src="sourceImage(c.source.slug)" :key=c >
                </div>
              </button>
            </h5>

            <div :id='`collapse-${i}`' class='collapse show' aria-labelledby=headingOne data-parent=#property-accordion >

              <div class='d-flex align-items-start'>
                <div class='nav flex-column nav-pills' role=tablist >
                  <button class='nav-link active' type=button role=tab data-bs-toggle=pill :aria-controls='`p-prods-${i}`' :data-bs-target='`#p-prods-${i}`' >
                    {{$t('properties.tabs.products')}}
                  </button>
                  <button class=nav-link type=button role=tab data-bs-toggle=pill :aria-controls='`p-conns-${i}`' :data-bs-target='`#p-conns-${i}`' >
                    {{$t('properties.tabs.connections')}}
                  </button>
                  <button class=nav-link type=button role=tab data-bs-toggle=pill :aria-controls='`p-comps-${i}`' :data-bs-target='`#p-conns-${i}`' >
                    {{$t('properties.tabs.competitors')}}
                  </button>
                </div>

                <div class='tab-content card-body pt-0' >

                  <div :id='`p-prods-${i}`' role=tabpanel class='tab-pane fade show active' >
                    <ProductsEdit :property=p :i=i :categories=categories />
                  </div>

                  <div :id='`p-conns-${i}`' role=tabpanel class='tab-pane fade' >
                    <ConnectionsEdit :property=p :connections=p.connections />
                  </div>

                  <div :id='`p-comps-${i}`' role=tabpanel class='tab-pane fade' >
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
