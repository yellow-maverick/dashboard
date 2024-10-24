<script>
import Filter from "@/components/Filter.vue";
import Kpi from "@/components/Kpi.vue";
import RatingsTable from "@/components/RatingsTable.vue";
import SentimentKpi from "@/components/SentimentKpi.vue";
import SourceRatingsKpi from "@/components/SourceRatingsKpi.vue";
import MixedChart from "@/components/MixedChart.vue";

export default{
  data: () => {
    return {
      fields: {
        context:     { type: 'radio', default: 'brand' },
        daterange:   { type: 'daterange', allowEmpty: false },
        property_id: { type: 'select', hash: true, label:'name', allowEmpty: false },
        product_id:  { type: 'select', multiple: true, hash: true, label:'name', condition: (d) => d.context == 'product' },
        group_id:    { type: 'select' },
        source_ids:  { type: 'select', multiple: true, hash: true, label: 'name' },
        enable_comp: { type: 'checkbox', default: false },
        competitors: {
          property_id: { type: 'select', hash: true, label:'name' },
          source_ids:  { type: 'select', multiple: true, hash: true, label: 'name' },
        }
      },
      filter: null,
    };
  },
  props:      [],
  components: { Filter, Kpi, MixedChart, SentimentKpi, SourceRatingsKpi, RatingsTable },
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

    <div class="row mt-4" v-if='filter'>
      <!-- main -->
      <label>{{ filter.property_objs?.main?.name }}</label>
      <div class="offset-2 col-lg-3 col-md-6 col-12">
        <Kpi :filter="filter" trend="yoy" segment="reviews_count" directionReverse v-if='filter' ></Kpi>
      </div>
      <div class="offset-2 col-lg-3 col-md-6 col-12">
        <Kpi :filter="filter" trend="yoy" segment="numerical" directionReverse v-if='filter' ></Kpi>
      </div>

      <!-- competitor -->
      <template v-if='filter.competitors?.property_id'>
        <label>{{ filter.property_objs?.competitor?.name }}</label>
        <div class="offset-2 col-lg-3 col-md-6 col-12">
          <Kpi :filter="filter.competitors" trend="yoy" segment="reviews_count" directionReverse v-if='filter?.competitors' ></Kpi>
        </div>
        <div class="offset-2 col-lg-3 col-md-6 col-12">
          <Kpi :filter="filter.competitors" trend="yoy" segment="numerical" directionReverse v-if='filter?.competitors' ></Kpi>
        </div>
      </template>
    </div>

    <div class="row">
      <div class="col-lg-12 mb-lg">
        <!-- line chart -->
        <div class="card z-index-2">
          <mixed-chart title='reviews-ratings' :filter='filter' v-if='filter' />
        </div>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-lg-12" id='sentiment-table'>
        <ratings-table :filter='filter' v-if='filter' type='sentiment' />
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-lg-12">
        <ratings-table :filter='filter' v-if='filter' segment='source' type='ratings' />
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-lg-12">
        <ratings-table :filter='filter' v-if='filter' segment='language' type='ratings' />
      </div>
    </div>

    <div class="row mt-5" v-if='false'>
      <div class="offset-2 col-lg-3 col-md-4 col-3">
        <SentimentKpi :filter="filter" v-if='filter' ></SentimentKpi>
      </div>
      <div class="offset-2 col-lg-3 col-md-4 col-3">
        <SourceRatingsKpi :filter="filter" v-if='filter' ></SourceRatingsKpi>
      </div>
    </div>
  </div>
</template>
