<script>
import { alova } from '../js/alova.js'
import Lib from '../js/lib.js'

import Multiselect from 'vue-multiselect'
import ProductForm from '@/components/ProductForm.vue'
import ConnectionsEdit from '@/components/ConnectionsEdit.vue'
import ProductCompetitorsEdit from '@/components/ProductCompetitorsEdit.vue'

export default {
  data() {
    return {
      open_product_id: null,
    }
  },

  props:      ['property', 'products', 'categories', 'isComp', 'inline'],
  components: {Multiselect, ProductForm, ConnectionsEdit, ProductCompetitorsEdit},

  created() {
    this.open_product_id = this.$route.query.product_id // for initial render to scroll expanded
  },

  methods: {
    hide(event) {
      event.target.style.display = 'none'
    },
    sourceImage(slug) {
      return Lib.sourceImage(slug)
    },

    async save(pd) {
      await alova.Patch(`/v1/products/${pd.id}`, {product: pd})
    },

  }
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
  <div>
    <router-link v-if=!inline :to="{path: '/products/add', query: {...$route.query, property_id: property.id}}" >
      <button class=btn >{{$t('products.add_new')}}</button>
    </router-link>

    <div :id='`property-${property.id}-accordion`' class=accordion >
      <div v-for='pd in products' :id='`product-${pd.id}`' class=accordion-item :key='`${pd.property_id}-${pd.id}`' >
        <div class=card >
          <h6 class=accordion-header >
            <button class=accordion-button data-bs-toggle=collapse :data-bs-target='`#collapse-${pd.property_id}-${pd.id}`' aria-expanded=false :aria-controls='`#collapse-${pd.property_id}-${pd.id}`'  >
              {{pd.name}}
              <multiselect :options=categories :readonly=true v-model=pd.categories label=name :taggable=true :multiple=true :searchable=false />
              <div class='d-flex justify-content-end col-5 flex-wrap' style='flex: auto' >
                <a v-for='c in pd.connections' :key=c :href=c.url target=_blank >
                  <img @error="hide" style='max-height: 20px' class='me-1' :title=c.source.name :src="sourceImage(c.source.slug)" >
                </a>
              </div>
            </button>
          </h6>

          <div :id='`collapse-${pd.property_id}-${pd.id}`' :class='{collapse: open_product_id != pd.id, show: open_product_id == pd.id}' aria-labelledby=headingOne :data-parent='`#property-${pd.property_id}-accordion`' >

            <div class='d-flex align-items-start mb-4' >
              <div class='flex-column nav nav-pills nav-pills-primary' role=tablist >
                <div class=moving-tab >
                  <button class='nav-link active' type=button role=tab data-bs-toggle=pill :aria-controls='`pd-bi-${pd.property_id}-${pd.id}`' :data-bs-target='`#pd-bi-${pd.property_id}-${pd.id}`' >
                    {{$t('products.tabs.details')}}
                  </button>

                  <button class=nav-link type=button role=tab data-bs-toggle=pill :aria-controls='`pd-conns-${pd.property_id}-${pd.id}`' :data-bs-target='`#pd-conns-${pd.property_id}-${pd.id}`' >
                    {{$t('products.tabs.connections')}}
                  </button>

                  <button v-if=!isComp class=nav-link type=button role=tab data-bs-toggle=pill :aria-controls='`pd-comps-${pd.property_id}-${pd.id}`' :data-bs-target='`#pd-comps-${pd.property_id}-${pd.id}`' >
                    {{$t('products.tabs.competitors')}}
                  </button>
                </div>
              </div>

                <div class='tab-content card-body pt-0' >

                  <div :id='`pd-bi-${pd.property_id}-${pd.id}`' role=tabpanel class='tab-pane fade show active' >
                    <ProductForm :product=pd :categories=categories :isComp=isComp />
                    <button type=button class='btn btn-primary' @click='save(pd)' >
                      {{$t('products.save')}}
                    </button>
                  </div>

                  <div :id='`pd-conns-${pd.property_id}-${pd.id}`' role=tabpanel class='tab-pane fade' >
                    <ConnectionsEdit :connections=pd.connections :product=pd />
                  </div>

                  <div v-if=!isComp :id='`pd-comps-${pd.property_id}-${pd.id}`' role=tabpanel class='tab-pane fade' >
                    <ProductCompetitorsEdit :property=property :product=pd :categories=categories />
                  </div>

                </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

