<script>
//import { alova } from '../js/alova.js'
//import _ from 'lodash'
import ProductForm from '@/components/ProductForm.vue'

export default {
  data() {
    return {
      data: {
        property_id: this.$route.query.property_id,
        product: {
          url: null,
        }
      },
    }
  },
  props: [],
  components: {ProductForm},

  mounted() {
  },

  methods: {

    async save() {
      //let r = await alova.Post(`/v1/products`, _.merge(this.data, {property_id: this.property_id}))
    },

  },
}
</script>

<template>
  <div class=card >
    <div class=card-body >
      <form>
        <div class=form-group >
          <label for=url >{{ $t('products.url') }}</label>
          <input name=url v-model=product.url type=text class=form-control />
        </div>

        <h5 role=button data-bs-toggle=collapse data-bs-target=#more-details aria-expanded=false aria-controls=more-details >
          {{ $t('products.more_details') }}
        </h5>
        <div id=more-details class=collapse >
          <ProductForm product=product />
        </div>

        <button type=button class='btn btn-primary' @click=save() > Save </button>
      </form>
    </div>
  </div>
</template>

