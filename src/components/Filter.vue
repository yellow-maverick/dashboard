<script>
import DatePicker  from "vue-datepicker-next";
import Multiselect from 'vue-multiselect'
import dayjs       from "dayjs";
import _           from 'lodash'
import Db          from '../js/db.js'
import Lib from '../js/lib.js';
import ArgonRadio from "@/components/ArgonRadio.vue";

export default{
  data () {
    return {
      dateShortcuts: Lib.dateShortcuts.call(this),
      options: {
        context: ['brand', 'product'],
        product_id: [],
      },
      products_per_property: {},
      data: {
        property_id: null,
      },
      profile: null
    }
  },

  props:      ['fields', 'emitUpdate'],
  components: {DatePicker, Multiselect, ArgonRadio},

  async mounted () {
    this.loadData()
  },

  methods: {
    ...Db,

    async loadData() {
      this.profile = await this.$store.dispatch("profile/fetch");
      if (!this.property_id)
        this.data.property_id = { id: this.profile.subscriptions[0].property_id }

      let k = 'property_id'
      if (k in this.fields) {
        this.options[k] = (await this.runQuery('properties')).map((p) => {
          return _.mapKeys(p, (v,k) => k == 'property_id' ? 'id' : k)
        })
        if (!this.data[k]) this.data[k] = this.options[k][0] //first property
      }
      if ((k = 'product_id') in this.fields) {
        this.products_per_property = _.groupBy(await this.runQuery('products'), 'property_id')
        if (this.data.property_id) this.selectProduct()
      }

      this.loadParamsFromURL()

      Object.keys(this.fields).forEach(k => {
        if (this.fields[k].default && !this.data[k])
          if (this.fields[k].type == 'select') {
            this.data[k] = this.options[k].find(o => o.id == this.fields[k].default )
          } else {
            this.data[k] = this.options[k].find(o => o == this.fields[k].default )
          }

        if (this.fields[k].type == 'daterange' && !this.data[k]) {
          this.data[k] = Lib.defaultDateRange()
        }
      })
      this.submit()
    },

    selectProduct() {
      this.options.product_id = this.products_per_property[parseInt(this.data.property_id.id)]
      if (!this.data.product_id && this.options.product_id) this.data.product_id = this.options.product_id[0]
    },

    loadParamsFromURL() {
      const query = this.$route.query;
      Object.keys(this.fields).forEach(f => {
        if (f == 'daterange' && query.start_date) this.data[f] = [dayjs(query.start_date).toDate(), dayjs(query.end_date).toDate()]
        if (!query[f]) return
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
      let fields = { ... this.fields, property_id: { type: 'select' } }
      Object.keys(fields).forEach(f => {
        if (!this.data[f]) return
        if (fields[f].type == 'daterange')
          data[f] = {
            start_date: dayjs(this.data[f][0]).format('YYYY-MM-DD'),
            end_date:   dayjs(this.data[f][1]).format('YYYY-MM-DD'),
          }
        else if (fields[f].type == 'select' && this.data[f]) {
          if ((!fields[f].condition || fields[f].condition(this.data))) data[f] = this.data[f].id
        }
        else {
          if ((!fields[f].condition || fields[f].condition(this.data))) data[f] = this.data[f]
        }
      })

      if (this.data.context == 'brand') data.for_properties = true
      if (this.data.context == 'product') data.for_products = true

      Object.assign(data, data.daterange)
      delete data.daterange
      return data
    },
    changed () {
      this.selectProduct()
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
  <div class="filter">
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
            <div class='form-group mb-3 col-sm-6 col-md-3 col-lg-2' v-if='v.type == "select" && options[k] && (!v.condition || v.condition(data))'>
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

            <!-- radio -->
            <div class="form-group col-sm-6 col-md-3 col-lg-2" v-if="v.type == 'radio'">
              <label class="form-label">{{ $t(`filter.${k}`) }}</label>
              <div class="mt-2 d-flex justify-content-start">
                <argon-radio v-for='o in options[k]' name='`filter-${k}`' id='`filter-${k}-${o}`' :value='o' v-model='data[k]' class='me-3' :key='o' >{{ $t(`filter.${o}`) }}</argon-radio>
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
