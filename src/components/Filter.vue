<script>
import dayjs       from "dayjs";
import _           from 'lodash'
import Db          from '../js/db.js'
import Lib         from '../js/lib.js';
import { alova }   from '../js/alova'
import OneFilter   from './OneFilter.vue';

export default {
  data () {
    return {
      loadedURL: false,
      options: {
        context: ['brand', 'product'],
        product_id: [],
        period: [],
        rating: ["", "100", "higher_than_7_5", "higher_than_6", "lower_than_6", "lower_than_3"],
        competitors: {
        },
        role: ['', 'admin', 'user', 'manager'],
      },
      products_per_property: {},
      competitors: null,
      data: {
        property_id: null,
      },
      profile: null
    }
  },
  components: { OneFilter },
  props:      ['fields', 'emitUpdate'],

  async mounted () {
    if (this.fields['period'])
      this.options.period = ['day', 'week', 'month', 'quarter', 'year'].map(o => { return { id: o, name: this.$t(`filter.periods.${o}`) } } )

    this.loadData()
  },

  methods: {
    ...Db,

    async loadSources () {
      this.sources = await this.runQuery('sources', { implemented: true })
      this.options.source_ids = this.sources.reduce((h,s) => { h[s.id] = s; return h }, {})
      if (this.hasCompetitors) this.options.competitors.source_ids = this.options.source_ids
    },

    async loadData() {
      this.loadParamsFromURL()

      if ('source_ids' in this.fields || 'source_ids' in (this.fields?.competitors || [])) this.loadSources();

      this.profile = await this.$store.dispatch('profile/fetch')

      if (!this.data.property_id)
        this.data.property_id = this.profile.subscriptions[0].property_id

      this.loadCompetitors()

      let k = 'property_id'
      if ('property_id' in this.fields || 'product_id' in this.fields) {
        this.properties = (await this.runQuery('properties', { with_products: true })).map((p) => {
          return _.mapKeys(p, (v,k) => k == 'property_id' ? 'id' : k)
        })
        this.options[k] = this.properties.reduce((r,e) => {r[e.id] = e; return r}, {})
        if (!this.data[k]) this.data[k] = Object.keys(this.options[k])[0] //first property id
      }
      if ('product_id' in this.fields) {
        this.products_per_property = this.properties.reduce((r,a) => {
          r[a.id] = r[a.id] || []
          r[a.id] = r[a.id].concat(a.products)
          return r
        }, {})
        if (this.data.property_id) this.selectProduct()
        if (this.data.product_id && this.options.product_id && !this.options.product_id[this.data.product_id]) this.data.product_id = Object.keys(this.options.product_id)[0]
      }

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
      this.loadedURL = true
      this.submit(false)
    },

    selectProduct() {
      let property_id         = this.data.property_id || this.$route.query.property_id
      this.options.product_id = this.products_per_property[parseInt(property_id)]?.reduce((h,p) => { if (p) h[parseInt(p.id)] = p; return h }, {}) || {}
    },

    loadParamsFromURL() {
      const query = this.$route.query;
      this.data.competitors ||= {}

      Object.keys(this.fields).forEach(f => {
        if (f == 'daterange' && query.start_date) this.data[f] = [dayjs(query.start_date).toDate(), dayjs(query.end_date).toDate()]

        if (f == 'competitors') {
          for (let c in this.fields.competitors) {
            if (!query[`c.${c}`]) return
            this.data.competitors[c] = this.loadParam(c, query[`c.${c}`], this.fields.competitors, this.options.competitors)
          }
        }
        else {
          if (!query[f]) return
          this.data[f] = this.loadParam(f, query[f], this.fields, this.options)
        }

      })
    },
    loadParam(f, queryValue, fields, options) {
      if (fields[f].type == 'select' && !fields[f].hash && !Array.isArray(this.options[f])) {
        if (Array.isArray(queryValue))
          return queryValue.map(k => options[f]?.find(o => o.id == parseInt(k)))
        else
          return options[f]?.find(o => o.id == queryValue)
      }
      else
        return queryValue
    },
    prepareData (data) {
      data ||= this.data
      let filterData = {}
      let fields = { property_id: { type: 'select' }, ... this.fields }
      Object.keys(fields).forEach(f => {
        if (!data[f]) return
        if (f == 'competitors' && this.data.enable_comp) {
          filterData.competitors = this.prepareData(data[f])
        } else if (fields[f].type == 'daterange')
          filterData[f] = {
            start_date: dayjs(data[f][0]).format('YYYY-MM-DD'),
            end_date:   dayjs(data[f][1]).format('YYYY-MM-DD'),
          }
        else if (fields[f].type == 'select' && !fields[f].hash && data[f]) {
          if ((!fields[f].condition || fields[f].condition(data))) filterData[f] = data[f].id || data[f]
        }
        else {
          if ((!fields[f].condition || fields[f].condition(data))) filterData[f] = data[f]
        }
      })

      if (this.data.context == 'brand') filterData.for_properties = true
      if (this.data.context == 'product') filterData.for_products = true

      Object.assign(filterData, filterData.daterange)
      delete filterData.daterange

      if (this.options.property_id)
        filterData.property_objs = { main: this.options.property_id[filterData.property_id], competitor: this.options.property_id[filterData.competitors?.property_id] }

      return filterData
    },
    changed () {
      this.selectProduct()
      if (!this.emitUpdate) return
      let d = this.prepareData()
      this.$router.push({ path: this.$route.path, query: { token: this.$route.query.token, ...d } })
      this.$emit('filter:update', d)
    },
    submit (push) {
      let d = this.prepareData()
      this.$emit('filter:submit', d)

      if (push) {
        d = this.adaptDataToQuery({...d})
        this.$router.push({ path: this.$route.path, query: { token: this.$route.query.token, ...d } })
      }
    },
    adaptDataToQuery(data) {
      if (data.enable_comp) {
        for (let k in data.competitors) {
          data[`c.${k}`] = data.competitors[k]
        }
      }
      delete data.competitors
      delete data.property_objs
      return data
    },
    clear () {
      Object.keys(this.fields).forEach(f => {
        if (this.fields[f].type == 'daterange')
          this.data[f] = Lib.defaultDateRange()
        else
          this.data[f] = null
      })
    },
    async loadCompetitors () {
      if (this.hasCompetitors) {
        this.data.competitors ||= {}
        if (!this.competitors) {
          let data         = await alova.Get(`/v1/property_competitors`, { params: {  } })
          this.competitors = (await data.clone().json()).data || []
        }
        if (this.data.property_id)
          this.options.competitors.property_id = this.competitors.find(c => c.id == this.data.property_id).competitors.reduce((h,c) => { h[c.id] = c; return h }, {})
      }
    }
  },
  computed: {
    hasCompetitors () {
      return Object.keys(this.fields).includes("competitors")
    }
  }
}
</script>

<template>
  <div class="filter">
    <div class='card'>
      <h5 class="card-title px-3 pt-3 pb-0">{{ $t("filter.title") }}</h5>
      <div class="card-body px-3 pt-1">
        <div class="row" v-if='loadedURL'>
          <template v-for="(v,k) in fields" :key="k">
            <template v-if="k != 'competitors'" >
              <OneFilter context=main :field=k :settings=v :option=options[k] :data=data @changed=changed v-if='k == "daterange" || v.type == "checkbox" || (options[k] && (!v.condition || v.condition(data)))' />
            </template>
          </template>
        </div>
        <section class='benchmark row' v-if='data.enable_comp && Object.keys(fields).includes("competitors")' >
          <template v-for="(v,k) in fields.competitors" :key="k" >
            <OneFilter context=competitors :field=k :settings=v :option=options.competitors[k] :data=data.competitors @changed=changed v-if='options.competitors[k]' />
          </template>
        </section>
        <div class="row" v-if='loadedURL'>
          <div class="form-group col-sm-6 col-md-4 col-lg-3 d-print-none">
            <label class="form-label">&nbsp;</label><br>
            <button type="submit" class="btn btn-primary me-3 mb-2" @click='submit(true)'>{{ $t("filter.submit") }}</button>
            <button type="submit" class="btn btn-outline-primary mb-2" @click='clear'>{{ $t("filter.clear") }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
