<script>
import _  from 'lodash'
import Db from '../js/db.js'
import Lib from '../js/lib.js'

export default {
  data() {
    return {
      properties: [],
    }
  },
  props:      [],
  components: {},

  mounted() {
    this.load()
  },

  methods: {
    ...Db,
    async load() {
      this.properties = (await this.runQuery('properties', {
        with_products: true, with_connections: true,
      }))
    },

    sourceImage(slug) {
      console.log(slug)
      return Lib.sourceImage(slug)
    },
  },

  computed: {},
}
</script>

<template>
  <div class='container-fluid'>
    <div class='row'>
      <div v-for='(p,i) in properties' class=card >
        <div id=property-accordion class=accordion >
          <div class=accordion-item >
            <h5 class=accordion-header >
              <button class=accordion-button data-bs-toggle=collapse :data-bs-target='`#collapse-${i}`' aria-expanded=true :aria-controls='`#collapse-${i}`'  >
                {{p.name}}
                <div class='d-flex justify-content-end' style='flex: auto' >
                  <img class='mr-3' v-for='c in p.connections' width='20px' :src="sourceImage(c.source.slug)" >
                </div>
              </button>
            </h5>
            <div :id='`collapse-${i}`' class='collapse show' aria-labelledby=headingOne data-parent=#property-accordion >

              <h6 class='card-subtitle mb-2 text-muted'>Products</h6>

              <div :id='`property-${i}-accordion`' class=accordion >
                <div v-for='(pd,j) in p.products' class=accordion-item >
                  <h6 class=accordion-header >
                    <button class=accordion-button data-bs-toggle=collapse :data-bs-target='`#collapse-${i}-${j}`' aria-expanded=true :aria-controls='`#collapse-${i}-${j}`'  >
                      {{pd.name}}
                      <div class='d-flex justify-content-end' style='flex: auto' >
                        <img v-for='c in pd.connections' width='20px' class='mr-3' :src="sourceImage(c.source.slug)" >
                      </div>
                    </button>
                  </h6>
                  <div :id='`collapse-${i}-${j}`' class=collapse aria-labelledby=headingOne :data-parent='`#property-${i}-accordion`' >
                    <div class=card-body >
                      ...
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
