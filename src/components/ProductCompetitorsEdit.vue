<script>
import _ from 'lodash'
import { defineAsyncComponent } from 'vue'
import AddPropertyCompetitor from '@/components/AddPropertyCompetitor.vue'

export default {
  data() {
    return {
      adding: false,
      competitors: {},
    }
  },
  props:      ['property', 'product', 'categories'],
  components: {
    AddPropertyCompetitor,
    PropertiesEdit: defineAsyncComponent(() => import('@/components/PropertiesEdit.vue')), // async due recursion
  },

  watch: {
    'property.competitors': {
      handler() {
        this.competitors = _.cloneDeep(this.property.competitors)
        let competitorsGrouped = _.keyBy(this.competitors, 'property_id')
        this.competitors.forEach(pc => pc.products = [])
        this.product.competitors.forEach(pdc => {
          let pc = competitorsGrouped[pdc.property_id]
          if (!pc) return // product competitor without a property competitor
          pc.products.push(pdc)
        })
      },
      immediate: true,
    }
  },
  
  methods: {
    add() {
      this.adding = true
    },
  },
}
</script>

<template>
  <div>
    <AddPropertyCompetitor :property=property v-if=adding />
    <button v-else class=btn @click=add >{{$t('competitors.add_new')}}</button>

    <PropertiesEdit :properties=competitors :categories=categories :isComp=true :forProducts=true />
  </div>
</template>

