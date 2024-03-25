<script>
import DatePicker  from "vue-datepicker-next";
import Multiselect from 'vue-multiselect'
import dayjs       from "dayjs";
import { alove }   from '../js/alova.js';
import Lib from '../js/lib.js';

export default{
  data () {
    return {
      dateShortcuts: Lib.dateShortcuts.call(this),
      daterange: Lib.defaultDateRange(),
      data: {},
      options: {}
    }
  },
  props:      ['fields', 'emitUpdate'],
  components: {DatePicker, Multiselect},
  mounted () {
    if (Object.keys(this.fields).includes('properties')) {
      alove.Post('/v1/queries/2/run').then(r => r.clone().json() ).then(async r => {
        this.options['properties'] = this.data = r.data?.slice(1).map(l => { return { id: l[2], name: l[3] } } )
      })
    }
    this.options['groups'] = [ {
      id: 1, name: 'Mepal Group'
    } ]
    this.loadParamsFromURL()
    Object.keys(this.fields).forEach(f => {
      if (this.fields[f].type == 'daterange' && !this.data[f])
        this.data[f] = Lib.defaultDateRange()
    })
    this.submit()
  },
  methods: {
    loadParamsFromURL() {
      const query = this.$route.query;
      Object.keys(this.fields).forEach(f => {
        if (!query[f]) return
        if (f == 'daterange') this.data[f] = [query.start_date, query.end_date]
        else if (this.fields[f].type == 'select') {
          if (Array.isArray(query[f]))
            this.data[f] = query[f].map(k => this.options[f]?.find(o => o.id == k))
          else
            this.data[f] = this.options[f]?.find(o => o.id == query[f])
        }
        else
          this.data[f] = query[f]

      })
    },
    prepareData () {
      let data = {}
      Object.keys(this.fields).forEach(f => {
        if (!this.data[f]) return
        if (this.fields[f].type == 'daterange')
          data[f] = {
            start_date: dayjs(this.data[f][0]).format('YYYY-MM-DD'),
            end_date:   dayjs(this.data[f][1]).format('YYYY-MM-DD'),
          }
        else if (this.fields[f].type == 'select' && this.data[f])
          data[f] = this.data[f].id
        else
          data[f] = this.data[f]
      })
      Object.assign(data, data.daterange)
      delete data.daterange
      return data
    },
    changed () {
      if (!this.emitUpdate) return
      let d = this.prepareData()
      this.$emit('filter:update', d)
    },
    submit () {
      let d = this.prepareData()
      this.$router.push({ path: this.$route.path, query: { token: this.$route.query.token, ...d } })
      this.$emit('filter:submit', d)
    },
    clear () {
      Object.keys(this.fields).forEach(f => {
        if (this.fields[f].type == 'daterange')
          this.data[f] = Lib.defaultDateRange()
        else
          this.data[f] = null
      })
    }
  }
}
</script>

<template>
  <div class="filter my-3">
    <div class='card'>
      <h5 class="card-title p-3">{{ $t("filter.title") }}</h5>
      <div class="card-body">
        <div class="row">
          <template v-for="(v,k) in fields" :key="k">
            <!-- daterange -->
            <div class="form-group mb-3 col-sm-6 col-md-3 col-lg-2 daterange" v-if="v.type == 'daterange'">
              <label class="form-label">{{ $t(`filter.${k}`) }}</label>
              <date-picker v-model:value="data[k]" :shortcuts="dateShortcuts" range append-to-body confirm @change="changed"></date-picker>
            </div>

            <!-- select -->
            <div class='form-group mb-3 col-sm-6 col-md-3 col-lg-2' v-if='v.type == "select" && options[k]'>
              <label class="form-label">{{ $t(`filter.${k}`) }}</label>
              <multiselect :options='options[k]' v-model='data[k]' track-by=id label=name @select=changed @remove=changed :showLabels=false :searchable=true />
            </div>

            <!-- checkbox -->
            <div class="form-group mb-3 col-sm-6 col-md-3 col-lg-2" v-if="v.type == 'checkbox'">
              <div class="d-flex justify-content-between align-items-center">
                <label class="form-label">{{ $t(`filter.${k}`) }}</label>
                <div class="form-check" v-if="context == 'reputation'">
                  <input class="form-check-input" type="checkbox" v-model="benchmark.source_exclusion" id="benchmark.source_exclusion">
                  <label class="form-label fw-light font-size-12" for="benchmark.source_exclusion">
                    {{ $t("general.exclusion") }}
                  </label>
                </div>
              </div>
            </div>
          </template>
          <div class="form-group col-sm-6 col-md-3 col-lg-3 d-print-none">
            <label class="form-label">&nbsp;</label><br>
            <button type="submit" class="btn btn-primary me-3 mb-2" @click='submit'>{{ $t("filter.submit") }}</button>
            <button type="submit" class="btn btn-outline-primary mb-2" @click='clear'>{{ $t("filter.clear") }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
