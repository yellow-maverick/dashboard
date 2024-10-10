<script>
import AddProduct from '@/components/AddProduct.vue'

export default {
  data() {
    return {
      product: {},
    }
  },
  props: [],
  components: {AddProduct},
}
</script>

<template>
  <AddProduct :product=product />
</template>

