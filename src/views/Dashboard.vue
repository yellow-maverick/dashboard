<script>
import Filter     from "@/components/Filter.vue";
import Kpi        from "@/components/Kpi.vue";
import TagCloud   from "@/components/TagCloud.vue";
import SentimentKpi from "@/components/SentimentKpi.vue";
import SourceRatingsKpi from "@/components/SourceRatingsKpi.vue";
import Multiselect from 'vue-multiselect'
import Lib   from '../js/lib.js';
import { alova } from '../js/alova.js'

export default {
  name: "dashboard",
  data() {
    return {
      filterCols: {
        daterange:   { type: 'daterange' },
        context:     { type: 'radio', default: 'brand' },
        property_id: { type: 'select', customLabel: function (id) { return this.products[id]?.name } },
        product_id:  { type: 'select', multiple: true, customLabel: function (id) { return this.products[id]?.name }, condition: (d) => d.context == 'product' },
      },
      filter: null,
      topics: [],
      tcTopic: 'delivery',
      past30Days: Lib.defaultDateRange(6)
    };
  },
  components: {
    Filter,
    Kpi,
    TagCloud,
    SentimentKpi,
    SourceRatingsKpi,
    Multiselect
  },
  mounted () {
    this.loadTopics()
  },
  methods: {
    async loadTopics () {
      let r = await alova.Get('/v1/sentiment/topics')
      this.topics = (await r.clone().json()).map(t => t.topic).filter(n => n != 'overall')
    },
    load(filter) {
      this.filter = filter
    }
  }
};
</script>
<template>
  <div class="container-fluid">
    <Filter :fields=filterCols emitUpdate=true @filter:submit='load' @filter:created='load'/>

    <div class="row">
      <div class="col-lg-12">
        <div class="row mt-4">
          <div class="col-lg-3 col-md-6 col-12">
            <Kpi :filter="filter" trend="yoy" segment="reviews_count" directionReverse v-if='filter' ></Kpi>
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <Kpi :filter="filter" trend="yoy" segment="numerical" directionReverse v-if='filter' ></Kpi>
          </div>
          <div class="col-lg-3 col-md-4 col-3">
            <SentimentKpi :filter="filter" v-if='filter' ></SentimentKpi>
          </div>
          <div class="col-lg-3 col-md-4 col-3">
            <SourceRatingsKpi :filter="filter" v-if='filter' ></SourceRatingsKpi>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-lg-12 mb-4">
            <div class="card">
              <div class="pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h6 class="mb-2">{{ $t('word_cloud.title') }}</h6>
                  <div class='form-group col-sm-6 col-md-3 col-lg-2'>
                    <label class="form-label">{{ $t(`filter.topic`) }}</label>
                    <multiselect :options='topics' v-model='tcTopic' :showLabels=false :searchable=true />
                  </div>
                </div>
              </div>
              <tag-cloud :filter='filter' :topic='tcTopic' v-if='tcTopic'/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
