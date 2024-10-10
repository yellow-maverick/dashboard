<script>
import { alova } from '../js/alova.js'
import AddPropertyCompetitor from '@/components/AddPropertyCompetitor.vue'
import AddProduct from '@/components/AddProduct.vue'

export default {
  data() {
    return {
      saving:  false,
      status:  null,
      to_product: {},
    }
  },
  props:      ['property', 'product'],
  components: {AddPropertyCompetitor, AddProduct},
  inject:     ['reload'],

  methods: {

    cancel() {
      this.$parent.adding = false
    },

    async save() {
      this.saving = true
      let p = {from_product_id: this.product.id, to_product: this.product}
      let c = (await (await alova.Post(`/v1/product_competitors`, p)).clone().json())
      if (c.id) {
        this.$parent.adding = false
        this.reload()
      } else {
        this.status = this.$t('competitors.save_error', {error: c.error})
      }
      this.saving = false
    },
  }

}
</script>

<template>
  <div>
    <AddPropertyCompetitor :property=property :pick=true :inline=true />

    <AddProduct :product=to_product :inline=true />
  </div>
</template>
