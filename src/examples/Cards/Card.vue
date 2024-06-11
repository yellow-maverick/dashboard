<template>
  <div class="mb-4 card">
    <div class="p-3 card-body">
      <div class="d-flex justify-content-between">
        <div :class="contentClass">
          <div class="numbers" v-if="this.$store.state.isRTL">
            <p class="mb-0 text-sm text-uppercase font-weight-bold" :class="titleColor">{{ title }}</p>
            <h5 class="font-weight-bolder" :class="valueColor">{{ value }}
            <span v-if='percentage' :class="percentageColor">{{ percentage }}</span> 
            <span class="font-weight-light text-sm"> {{detail}}</span>
            </h5>
          </div>
          <div class="numbers" v-else>
            <p class="mb-0 text-sm text-uppercase font-weight-bold" :class="titleColor">{{ title }}</p>
            <h2 class="font-weight-bolder mb-0" :class="valueColor">{{ value }}</h2>
          </div>
        </div>
        <div>
          <div class="text-center icon icon-shape"
           :class="`${iconBackground} ${this.$store.state.isRTL ? 'border-radius-md' : 'border-radius-2xl'}`">
            <font-awesome-icon class="kpi-card-icon fs-4 mt-1" :icon="iconClass" />
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end flex-direction-row mt--20">
        <span :class="percentageColor">{{ percentage }}%</span> 
        <span class='text-sm ms-2' style='line-height: 1.7'>&nbsp;{{detail}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "card",
  data() {
    return {
      reverseDirection: "flex-row-reverse justify-content-between",
    };
  },
  props: {
    directionReverse: Boolean,
    title: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    titleColor: {
      type: String,
    },
    value: {
      required: true,
    },
    valueColor: {
      type: String,
    },
    percentage: String,
    iconClass: {
      type: String,
      required: true,
    },
    percentageColor: {
      type: String,
      default: "text-success",
    },
    iconBackground: {
      type: String,
      default: "bg-white",
    },
    contentClass: {
      type: String,
    },
  },
};
</script>
