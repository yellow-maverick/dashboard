<script>
import Filter from "@/components/Filter.vue";
import Reviews from "@/components/Reviews.vue";

export default{
  data () {
    return {
      fields: {
        context:     { type: 'radio', default: 'brand' },
        daterange:   { type: 'daterange', allowEmpty: false },
        property_id: { type: 'select', hash: true, label:'name', allowEmpty: false },
        product_id:  { type: 'select', multiple: true, hash: true, label:'name', condition: (d) => d.context == 'product' },
        group_id:    { type: 'select' },
        source_ids:  { type: 'select', multiple: true, hash: true, label: 'name' },
        rating:      { type: 'select', multiple: false, customLabel: function (r) { return this.$t(`rating_ranges.${r}`) } },
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
