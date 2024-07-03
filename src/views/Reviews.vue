<script>
import Filter from "@/components/Filter.vue";
import Reviews from "@/components/Reviews.vue";

export default{
  data () {
    return {
      fields: {
        context:     { type: 'radio', default: 'brand' },
        daterange:   { type: 'daterange' },
        property_id: { type: 'select' },
        product_id:  { type: 'select', condition: (d) => d.context == 'product' },
        group_id:    { type: 'select' },
      },
      filter: null,
    }
  },
  props:      [],
  components: { Filter, Reviews },
  methods: {
    load (filter) {
      this.filter = filter
    }
  }
}
</script>

<template>
  <div class="container-fluid">
    <Filter :fields=fields emitUpdate=true @filter:submit='load' @filter:created='load'/>

    <div class="row mt-5">
      <div class="col-lg-12 mb-lg">
        <reviews :filter='filter' />
      </div>
    </div>
  </div>
</template>
