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
      <div v-for='p in properties' class='card'>
        <h5 class='card-title'>{{p.name}}</h5>
        <h6 class='card-subtitle mb-2 text-muted'>Products</h6>

        <div id=accordion >
          <div v-for='(pd,i) in p.products' class=accordion-item >
            <h2 class=accordion-header >
               <button class='btn btn-link' data-bs-toggle=collapse :data-bs-target='`#collapse${i}`' aria-expanded=true aria-controls=collapseOne >
                 {{pd.name}}
                 <img v-for='c in pd.connections' width='32px' class='mr-3' :src="sourceImage(c.source.slug)" >
               </button>
             </h2>
              <div :id='`collapse${i}`' class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
               <div class=card-body >
                 ...
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
