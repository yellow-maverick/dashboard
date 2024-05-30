<script>
import Filter from "@/components/Filter.vue";
import SentimentKpi from "@/components/SentimentKpi.vue";
import SourceRatingsKpi from "@/components/SourceRatingsKpi.vue";
import GradientLineChart from "@/components/MixedChart.vue";
import Reviews from "@/components/Reviews.vue";

export default{
  data: () => {
    return {
      fields: {
        //'analytics_type': { type: 'select', default: 'brand' },
        'daterange':   { type: 'daterange' },
        'property_id': { type: 'select' },
        'group_id':    { type: 'select' },
      },
      filter: null,
    };
  },
  props:      [],
  components: { Filter, SentimentKpi, SourceRatingsKpi, GradientLineChart, Reviews },
  methods: {
    load (filter) {
      this.filter = filter
      this.filter.for_properties = true
    }
  }
}
</script>

<template>
  <div class="container-fluid">
    <Filter :fields=fields emitUpdate=true @filter:submit='load' @filter:created='load'/>

    <div class="row">
      <div class="col-lg-12 mb-lg">
        <!-- line chart -->
        <div class="card z-index-2">
          <gradient-line-chart title='reviews-ratings' :filter='filter' />
        </div>
      </div>
    </div>

    <div class="row mt-5">
      <div class="offset-2 col-lg-3 col-md-4 col-3">
        <SentimentKpi :filter="filter" v-if='filter' ></SentimentKpi>
      </div>
      <div class="offset-2 col-lg-3 col-md-4 col-3">
        <SourceRatingsKpi :filter="filter" v-if='filter' ></SourceRatingsKpi>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 mb-lg">
        <div class="mt-3">
          <reviews :filter='filter' />
        </div>
      </div>
    </div>
  </div>
</template>
