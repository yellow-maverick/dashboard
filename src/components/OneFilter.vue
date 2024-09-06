<script>
import DatePicker  from "vue-datepicker-next";
import Multiselect from 'vue-multiselect'
import ArgonRadio  from "@/components/ArgonRadio.vue";
import Lib         from '../js/lib.js';

export default{
  data () {
    return {
      dateShortcuts: Lib.dateShortcuts.call(this),
    }
  },
  props:      ['context', 'field', 'settings', 'option', 'data'],
  components: {DatePicker, Multiselect, ArgonRadio},
  mounted() {
  },
  methods: {
    changed() {
      this.$emit('changed')
    },
    optionDecider () {
      if (this.settings.hash) return Object.keys(this.option)
      return this.option
    },
    customLabel (id) {
      if (this.settings.customLabel) return this.settings.customLabel?.bind(this)(id)
      if (Array.isArray(this.option)) return this.option.find(o => o == id)[this.settings.label || 'name']
      return this.option[id][this.settings.label || 'name']
    }
  },
}
</script>

<template>
  <div class='form-group mb-3 col-sm-6 col-md-3 col-lg-2' >
    <!-- daterange -->
    <div class="daterange" v-if="settings.type == 'daterange'">
      <label class="form-label">{{ $t(`filter.${context}.${field}`) }}</label>
      <date-picker v-model:value="data[field]" :shortcuts="dateShortcuts" range append-to-body confirm @change="changed"></date-picker>
    </div>

    <!-- select -->
    <div class='' v-if='settings.type == "select"'>
      <label class="form-label">{{ $t(`filter.${context}.${field}`) }}</label>
      <multiselect :multiple='settings.multiple' :allowEmpty=settings.allowEmpty :options='optionDecider()' v-model='data[field]' :track-by="settings.trackBy" :label="settings.label || 'name'" @select=changed @remove=changed :showLabels=false :searchable=true :custom-label='customLabel' />
    </div>

    <!-- checkbox -->
    <div class="" v-if="settings.type == 'checkbox'">
      <div class="d-flex justify-content-between align-items-center">
        <label class="form-label">{{ $t(`filter.${context}.${field}`) }}</label>
        <div class="form-check" v-if="context == 'reputation'">
          <input class="form-check-input" type="checkbox" v-model="benchmark.source_exclusion" id="benchmark.source_exclusion">
          <label class="form-label fw-light font-size-12" for="benchmark.source_exclusion">
            {{ $t("general.exclusion") }}
          </label>
        </div>
      </div>
    </div>

    <!-- radio -->
    <div class="" v-if="settings.type == 'radio'">
      <label class="form-label">{{ $t(`filter.${context}.${field}`) }}</label>
      <div class="mt-2 d-flex justify-content-start">
        <argon-radio v-for='o in option' name='`filter-${field}`' id='`filter-${field}-${o}`' :value='o' v-model='data[field]' class='me-3' :key='o' >{{ $t(`filter.${o}`) }}</argon-radio>
      </div>
    </div>

  </div>
</template>
