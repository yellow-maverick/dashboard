<script>
import Lib from '../js/lib.js';

export default{
  props: ["data", 'title'],
  components: { },
  data() {
    return {
      lib: Lib,
    }
  },
  methods: {},
  mounted () {},
};
</script>

<template>
  <div class="mb-4 card">
    <div class="p-3 card-body kpi_list">
      <h6 class='mb-3'>{{ title }} </h6>
      <div class="d-flex justify-content-between" v-for='d in data' :key='d' >
        <div class=row >
          <strong style='line-height: 2'>{{ d.name }}</strong>
          <div class='small text-secondaty' style='font-size: 0.8em' v-if=d.subtitle >{{ d.subtitle }}</div>
        </div>
        <span style='width: 32px; height: 32px; text-align: center; color: #eee; border-radius: 4px; font-weight: bold' class='p-1 m-1' :class='lib.ratingColor(d.value * (100.0/d.max_scale))'>{{ lib.round(d.value) }}</span>
      </div>
    </div>
  </div>
</template>
