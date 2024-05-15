<script>
import Filter from "@/components/Filter.vue";
import Kpi from "@/components/Kpi.vue";
import GradientLineChart from "@/components/MixedChart.vue";
import Reviews from "@/components/Reviews.vue";

export default{
  data: () => {
    return {
      fields: {
        'daterange':   { type: 'daterange' },
        'property_id': { type: 'select' },
        'group_id':    { type: 'select' },
      },
      filter: null
    };
  },
  props:      [],
  components: { Filter, Kpi, GradientLineChart, Reviews },
  methods: {
    load (filter) {
      this.filter = filter
    }
  }
}
</script>

<template>
  <div class="py-4 container-fluid">
    <Filter :fields=fields emitUpdate=true @filter:submit='load' @filter:created='load'/>

    <div class="row">
      <div class="offset-2 col-lg-3 col-md-6 col-12">
        <Kpi :filter="filter" trend="yoy" segment="reviews_count" directionReverse v-if='filter' ></Kpi>
      </div>
      <div class="offset-2 col-lg-3 col-md-6 col-12">
        <Kpi :filter="filter" trend="yoy" segment="numerical" directionReverse v-if='filter' ></Kpi>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 mb-lg">
        <!-- line chart -->
        <div class="card z-index-2">
          <gradient-line-chart title='reviews-ratings' :filter='filter' />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 mb-lg">
        <!-- reviews -->
        <div class="mt-5">
          <reviews :filter='filter' />
        </div>
      </div>
    </div>
  </div>
</template>
