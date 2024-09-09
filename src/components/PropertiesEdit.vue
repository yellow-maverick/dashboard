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
  props: ['properties', 'categories', 'compsShow'],
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
            <button class=accordion-button data-bs-toggle=collapse :data-bs-target='`#collapse-${p.id}`' :aria-expanded=!compsShow :aria-controls='`#collapse-${p.id}`'  >
              {{p.name}}
              <div class='d-flex justify-content-end' style='flex: auto' >
                <img class='me-1' v-for='c in p.connections' :title=c.source.name style='max-height: 20px' :src="sourceImage(c.source.slug)" :key=c >
              </div>
            </button>
          </h5>

          <div :id='`collapse-${p.id}`' :class='{collapse: true, show: !compsShow}' aria-labelledby=headingOne data-parent=#property-accordion >

            <div class='d-flex align-items-start'>
              <div class='nav flex-column nav-pills' role=tablist >
                <button class='nav-link active' type=button role=tab data-bs-toggle=pill :aria-controls='`p-prods-${p.id}`' :data-bs-target='`#p-prods-${p.id}`' >
                  {{$t('properties.tabs.products')}}
                </button>
                <button class=nav-link type=button role=tab data-bs-toggle=pill :aria-controls='`p-conns-${p.id}`' :data-bs-target='`#p-conns-${p.id}`' >
                  {{$t('properties.tabs.connections')}}
                </button>
                <button v-if=!compsShow class=nav-link type=button role=tab data-bs-toggle=pill :aria-controls='`p-comps-${p.id}`' :data-bs-target='`#p-comps-${p.id}`' >
                  {{$t('properties.tabs.competitors')}}
                </button>
              </div>

              <div class='tab-content card-body pt-0' >

                <div :id='`p-prods-${p.id}`' role=tabpanel class='tab-pane fade show active' >
                  <ProductsEdit :property=p :categories=categories :compsShow=compsShow />
                </div>

                <div :id='`p-conns-${p.id}`' role=tabpanel class='tab-pane fade' >
                  <ConnectionsEdit :property=p :connections=p.connections />
                </div>

                <div v-if=!compsShow :id='`p-comps-${p.id}`' role=tabpanel class='tab-pane fade' >
                  <PropertyCompetitorsEdit :competitors=p.competitors :categories=categories />
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>
