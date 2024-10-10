<script>
import { defineAsyncComponent } from 'vue'
import AddProductCompetitor from '@/components/AddProductCompetitor.vue'

export default {
  data() {
    return {
      adding: false,
    }
  },
  props:      ['property', 'product', 'categories'],
  components: {
    AddProductCompetitor,
    ProductsEdit: defineAsyncComponent(() => import('@/components/ProductsEdit.vue')), // async due recursion
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
    <AddProductCompetitor :property=property :product=product v-if=adding />
    <button v-else class=btn @click=add >{{$t('competitors.add_new')}}</button>

    <ProductsEdit :property=property :products=product.competitors :categories=categories :isComp=true :inline=true />
  </div>
</template>

