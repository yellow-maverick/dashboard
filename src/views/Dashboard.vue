<script>
import Kpi from "@/components/Kpi.vue";
import TagCloud from "@/components/TagCloud.vue";
import MixedChart from "@/components/MixedChart.vue";

export default {
  name: "dashboard",
  data() {
    return {
      filter: null
    };
  },
  components: {
    Kpi,
    TagCloud,
    MixedChart,
  },
};
</script>
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row mt-4">
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
              <mixed-chart title='reviews-ratings' :filter='filter' v-if='filter' />
            </div>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-lg-12 mb-4">
            <div class="card">
              <div class="p-3 pb-0 card-header"><div class="d-flex justify-content-between"><h6 class="mb-2">{{ $t('word_cloud.title') }}</h6></div></div>
              <tag-cloud />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
