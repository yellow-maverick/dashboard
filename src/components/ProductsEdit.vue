<script>
import Lib from '../js/lib.js'

import Multiselect from 'vue-multiselect'
import ProductForm from '@/components/ProductForm.vue'
import ConnectionsEdit from '@/components/ConnectionsEdit.vue'

export default {
  data() {
    return {
      open_product_id: null,
    }
  },

  props:      ['property', 'categories', 'compsShow'],
  components: {Multiselect, ProductForm, ConnectionsEdit},

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

    reload() {
      this.parent.reload()
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
    <router-link :to="{path: '/products/add', query: {...$route.query, property_id: property.id}}" >
      <button class=btn >{{$t('products.add_new')}}</button>
    </router-link>

    <div :id='`property-${property.id}-accordion`' class=accordion >
      <div v-for='(pd,j) in property.products' :id='`product-${pd.id}`' class=accordion-item :key=j >
        <div class=card >
          <h6 class=accordion-header >
            <button class=accordion-button data-bs-toggle=collapse :data-bs-target='`#collapse-${pd.property_id}-${j}`' aria-expanded=false :aria-controls='`#collapse-${pd.property_id}-${j}`'  >
              {{pd.name}}
              <multiselect :options=categories :readonly=true v-model=pd.categories label=name :taggable=true :multiple=true :searchable=false />
              <div class='d-flex justify-content-end' style='flex: auto' >
                <img v-for='c in pd.connections' @error="hide" style='max-height: 20px' class='me-1' :title=c.source.name :src="sourceImage(c.source.slug)" :key=c >
              </div>
            </button>
          </h6>

          <div :id='`collapse-${pd.property_id}-${j}`' :class='{collapse: open_product_id != pd.id, show: open_product_id == pd.id}' aria-labelledby=headingOne :data-parent='`#property-${pd.property_id}-accordion`' >

            <div class='d-flex align-items-start'>
              <div class='nav flex-column nav-pills' role=tablist >
                <button class='nav-link active' type=button role=tab data-bs-toggle=pill :aria-controls='`pd-bi-${pd.property_id}${j}`' :data-bs-target='`#pd-bi-${pd.property_id}${j}`' >
                  {{$t('products.tabs.details')}}
                </button>

                <button class=nav-link type=button role=tab data-bs-toggle=pill :aria-controls='`pd-conns-${pd.property_id}${j}`' :data-bs-target='`#pd-conns-${pd.property_id}${j}`' >
                  {{$t('products.tabs.connections')}}
                </button>

                <button v-if=!compsShow class=nav-link type=button role=tab data-bs-toggle=pill :aria-controls='`pd-comps-${pd.property_id}${j}`' :data-bs-target='`#pd-comps-${pd.property_id}${j}`' >
                  {{$t('products.tabs.competitors')}}
                </button>
              </div>

                <div class='tab-content card-body pt-0' >

                  <div :id='`pd-bi-${pd.property_id}${j}`' role=tabpanel class='tab-pane fade show active' >
                    <ProductForm :product=pd :categories=categories />
                    <button type=button class='btn btn-primary' @click='productSave(pd)' >
                      {{$t('products.save')}}
                    </button>
                  </div>

                  <div :id='`pd-conns-${pd.property_id}${j}`' role=tabpanel class='tab-pane fade' >
                    <ConnectionsEdit :connections=pd.connections :product=pd />
                  </div>

                  <div v-if=!compsShow :id='`pd-comps-${pd.property_id}${j}`' role=tabpanel class='tab-pane fade' >
                  </div>

                </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

