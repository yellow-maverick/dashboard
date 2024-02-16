<script>
import Card from "@/examples/Cards/Card.vue";
import { alove } from '../js/alova.js';

export default{
  props: ["start_date", "end_date", 'segment', "company_id", "group_id", 'show_trend'],
  components: { Card },
  data() {
    return {
      data: {
        numerical:    { current: 0, change: null },
        sentiment:    { current: 0, change: null },
        review_count: { current: 0, change: null },
      },

    }
  },
  methods: {
    async load() {
      let data = {};

      data = await alove("/v1/kpi", { ...this.computedSettings });
      const valueField = /reviews_count|mentions_count/.test(segment) ? "review_count" : "value";
      this.data.current = data[segOption]?.current?.[valueField];
      if (segment == "numerical_rating") this.data.current /= 10;
      this.data.current = !/reviews_count|mentions_count/.test(segment) ? Utils.round(this.data.current) : this.data.current;
      this.data.change  = this.change(data[segOption]?.current?.[valueField], data[segOption]?.previous?.[valueField]);
    },
    change(current, previous) {
      if (!current || !previous) return;
      return Utils.round((current / previous - 1) * 100);
    },
    changedStatus(change) {
      if (change == null) return "";
      if (change > 1) return "success";
      if (change < 1) return "danger";
      return "text-muted";
    },
    title() {
      return this.$t(`segments.${this.segment}`);
    }
  },
  computed: {
    contract() {
      return this.$store.getters["contract/currentContract"];
    },
    computedSettings() {
      let company_id = this.company_id, group_ids = this.group_id;
      return {
        ratingType:       this.settings.segment,
        subscription_ids: this.contract?.id,
        start_date:       this.start_date ? dayjs(this.start_date).format("YYYY-MM-DD") : undefined,
        end_date:         this.end_date   ? dayjs(this.end_date).format("YYYY-MM-DD")   : undefined,
        trends:           this.settings.trend_range || "yoy",
        sources:          this.settings.filters?.source,
        company_ids:      company_id,
        group_ids,
      };
    },
    statData() {
      return {
        title:   this.computedSettings.show_title ? undefined : this.title(),
        icon:   "ion ion-md-star",
        current: this.data.current,
        change:  this.computedSettings.show_trend && this.data.change ? Utils.round(this.data.change) : null
      };
    }
  },
};
</script>

<template>
  <div>
    <Card
      :title="stats.money.title"
      :value="stats.money.value"
      :percentage="stats.money.percentage"
      :iconClass="stats.money.iconClass"
      :iconBackground="stats.money.iconBackground"
      :detail="stats.money.detail"
      directionReverse
      />
  </div>
</template>
