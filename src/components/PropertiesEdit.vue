<script>
import Lib from '../js/lib.js'

import ProductsEdit from '@/components/ProductsEdit.vue'
import ConnectionsEdit from '@/components/ConnectionsEdit.vue'
import PropertyCompetitorsEdit from '@/components/PropertyCompetitorsEdit.vue'

export default {
  data() {
    return {
    }
  },
  props: ['properties', 'categories', 'isComp', 'forProducts'],
  components: {ProductsEdit, ConnectionsEdit, PropertyCompetitorsEdit},

  methods: {

    hide(event) {
      event.target.style.display = 'none'
    },
    sourceImage(slug) {
      return Lib.sourceImage(slug)
    },

  },
}
</script>

<template>
  <div>
    <div v-for='p in properties' class=card :key=p.id >
      <div id=property-accordion class=accordion >
        <div class=accordion-item >
          <h5 class=accordion-header >
            <button class=accordion-button data-bs-toggle=collapse :data-bs-target='`#collapse-${p.id}`' :aria-expanded=!isComp :aria-controls='`#collapse-${p.id}`'  >
              {{p.name}}
              <div class='d-flex justify-content-end' style='flex: auto' >
                <a v-for='c in p.connections' :key=c :href=c.url target=_blank >
                  <img class='me-1' :title=c.source.name style='max-height: 20px' :src="sourceImage(c.source.slug)" >
                </a>
              </div>
            </button>
          </h5>

          <div :id='`collapse-${p.id}`' :class='{collapse: true, show: !isComp}' aria-labelledby=headingOne data-parent=#property-accordion >

            <div v-if=!forProducts class='d-flex align-items-start mb-4' >
              <div class='nav flex-column nav-pills nav-pills-primary' role=tablist >
                <div class=moving-tab >
                  <button class='nav-link active' type=button role=tab data-bs-toggle=pill :aria-controls='`p-conns-${p.id}`' :data-bs-target='`#p-conns-${p.id}`' >
                    {{$t('properties.tabs.connections')}}
                  </button>
                  <button v-if=!isComp class=nav-link type=button role=tab data-bs-toggle=pill :aria-controls='`p-comps-${p.id}`' :data-bs-target='`#p-comps-${p.id}`' >
                    {{$t('properties.tabs.competitors')}}
                  </button>
                </div>
              </div>

              <div class='tab-content card-body pt-0' >

                <div :id='`p-conns-${p.id}`' role=tabpanel class='tab-pane fade active show' >
                  <ConnectionsEdit :property=p :connections=p.connections :forProperty=true />
                </div>

                <div v-if=!isComp :id='`p-comps-${p.id}`' role=tabpanel class='tab-pane fade' >
                  <PropertyCompetitorsEdit :property=p :competitors=p.competitors :categories=categories />
                </div>

              </div>
            </div>
            <div v-else >
              <ProductsEdit :property=p :products=p.products :categories=categories :isComp=isComp />
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>
