<script>
import Db from '../js/db.js'
import Lib from '../js/lib.js'
import { alova } from '../js/alova'

import Multiselect from 'vue-multiselect'
import ProductForm from '@/components/ProductForm.vue'
import ConnectionsEdit from '@/components/ConnectionsEdit.vue'

export default {
  data() {
    return {
      property_id: null, // open on mount
      product_id:  null, // open on mount
      properties: [],
      categories: [],
    }
  },
  props:      [],
  components: {Multiselect, ProductForm, ConnectionsEdit},

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

<style lang=scss >
  .accordion-header .multiselect {
    width: auto;
    cursor: auto;

    .multiselect__select, .multiselect__tag-icon, .multiselect__content-wrapper, .multiselect__placeholder {
      display: none !important;
    }
    .multiselect__tags {
      border: none;
      .multiselect__tag {
        padding-right: 10px;
      }
    }
  }
</style>

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
                    <router-link :to="{path: '/products/add', query: {...$route.query, property_id: p.property_id}}" >
                      <button class=btn >{{$t('products.add_new')}}</button>
                    </router-link>
                    <div :id='`property-${i}-accordion`' class=accordion >
                      <div v-for='(pd,j) in p.products' :id='`product-${pd.id}`' class=accordion-item :key=j >
                        <div class=card >
                          <h6 class=accordion-header >
                            <button class=accordion-button data-bs-toggle=collapse :data-bs-target='`#collapse-${i}-${j}`' aria-expanded=false :aria-controls='`#collapse-${i}-${j}`'  >
                              {{pd.name}}
                              <multiselect :options=categories :readonly=true v-model=pd.categories label=name :taggable=true :multiple=true :searchable=false />
                              <div class='d-flex justify-content-end' style='flex: auto' >
                                <img v-for='c in pd.connections' @error="hide" style='max-height: 20px' class='me-1' :title=c.source.name :src="sourceImage(c.source.slug)" :key=c >
                              </div>
                            </button>
                          </h6>

                            <div :id='`collapse-${i}-${j}`' :class='{collapse: product_id != pd.id, show: product_id == pd.id}' aria-labelledby=headingOne :data-parent='`#property-${i}-accordion`' >

                              <div class='d-flex align-items-start'>
                                <div class='nav flex-column nav-pills' role=tablist >
                                  <button class='nav-link active' type=button role=tab data-bs-toggle=pill :aria-controls='`pd-bi-${i}${j}`' :data-bs-target='`#pd-bi-${i}${j}`' >
                                    {{$t('products.tabs.details')}}
                                  </button>

                                  <button class=nav-link type=button role=tab data-bs-toggle=pill :aria-controls='`pd-conns-${i}${j}`' :data-bs-target='`#pd-conns-${i}${j}`' >
                                    {{$t('products.tabs.connections')}}
                                  </button>

                                  <button class=nav-link type=button role=tab data-bs-toggle=pill :aria-controls='`pd-comps-${i}${j}`' :data-bs-target='`#pd-comps-${i}${j}`' >
                                    {{$t('products.tabs.competitors')}}
                                  </button>
                                </div>

                                <div class='tab-content card-body pt-0' >

                                  <div :id='`pd-bi-${i}${j}`' role=tabpanel class='tab-pane fade show active' >
                                    <ProductForm :product=pd :categories=categories />
                                    <button type=button class='btn btn-primary' @click='productSave(pd)' >
                                      {{$t('products.save')}}
                                    </button>
                                  </div>

                                  <div :id='`conns-${i}${j}`' role=tabpanel class='tab-pane fade' >
                                    <ConnectionsEdit :connections=pd.connections :product=pd />
                                  </div>

                                  <div :id='`pd-comps-${i}${j}`' role=tabpanel class='tab-pane fade' >
                                  </div>

                                </div>
                              </div>

                            </div>

                        </div>
                      </div>
                    </div>

                    <div :id='`p-conns-${i}`' role=tabpanel class='tab-pane fade' >
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
  </div>
</template>
