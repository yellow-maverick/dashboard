<script>
import Filter from "@/components/Filter.vue";
import Lib       from '../js/lib.js';
import { alova } from '../js/alova.js'
import XLSXExport from "@/components/XLSXExport.vue";

export default{
  data () {
    return {
      fields: {
        daterange:   { type: 'daterange', allowEmpty: false },
        property_id: { type: 'select', hash: true, allowEmpty: false },
        product_id:  { type: 'select', multiple: true, hash: true },
        period:      { type: 'select', default: 'week' },
        source_ids:  { type: 'select', multiple: true, hash: true },
      },
      filter: null,
      data: null,
      meta: null,
      Lib: Lib
    }
  },
  props:      [],
  components: {Filter, XLSXExport},
  methods: {
    async load (filter) {
      this.filter = filter
      let resp  = await alova.Get('/v1/prices', { params: { ...filter, per: filter.period } })
      let data  = await resp.clone().json()
      this.data = data.data
      this.meta = data.meta
    },
    priceTargetColor(price, pId) {
      let p = this.products[pId]
      if (!p?.target_price) return '';

      if (price >= p.target_price) return '#00BB00'
      return '#BB0000'
    }
  },
  computed: {
    columns () {
      if (!this.data) return
      return [ ... new Set(Object.values(this.data).flatMap(d => Object.values(d)).flatMap(a => Object.keys(a))) ].sort().reverse()
    },
    products() {
      return this.meta?.products?.reduce((r,e) => {
        r[e.id] = e
        return r
      }, {})
    }
  }
}
</script>

<template>
  <div class="container-fluid">
    <Filter :fields=fields emitUpdate=true @filter:submit='load' @filter:created='load'/>

    <div class="pt-3 table-responsive" id='price-info'>
      <div class=" d-flex justify-content-end">
        <XLSXExport v-if="filter" fileName="price-info" target='price-info' btnClass="btn btn-secondary text-nowrap mb-2" :hasData="true" />
      </div>
      <table class='table text-center' v-if='Object.keys(data || {}).length' >
        <thead>
          <tr class='bordered-side'>
            <th class='text-start'>{{ $t(`prices_table.product`) }}</th>
            <th class='text-center'>{{ $t(`prices_table.source`) }}</th>
            <template v-for='c in columns' :key='c'>
              <th class='text-center'>{{ c }}</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for='sources,product_id in data' :key='product_id'>
            <tr v-for='dates,source in sources' class='text-center' :key='source'>
              <td class='text-start'>{{ products[product_id]?.name }}
                <span v-b-tooltip.hover :title="`${$t('prices_table.target_price')}: ${products[product_id]?.target_price}`">
                  <font-awesome-icon class="ms-1" icon="fa-solid fa-circle-info" />
                </span></td>
                <td>
                  <a target=_blank :href='meta.connections[source]?.url'>
                    {{ source }} <small><font-awesome-icon class="ms-1" icon="fa-solid fa-external-link" /></small>
                  </a>
                </td>
                <td v-for='(c,i) in columns' :key='c' :style='{ color: priceTargetColor(dates[c]?.price, product_id) }'>
                  <template v-if='c.availability == false'>{{ $t('prices_table.out_of_stock') }}</template>
                  <template v-else >
                    {{ dates[c]?.currency }} {{ Lib.round(dates[c]?.price, 2) || '-' }}
                    <font-awesome-icon v-if='parseFloat(dates[c]?.price) > dates[columns[i+1]]?.price' style='color: #00BB00' class="ms-1" icon="fa-solid fa-arrow-up" />
                      <font-awesome-icon v-if='dates[c]?.price < dates[columns[i+1]]?.price' style='color: #BB0000' class="ms-1" icon="fa-solid fa-arrow-down" />
                  </template>
                </td>
            </tr>
          </template>
        </tbody>
      </table>
      <h4 class='text-center mt-4' v-else>{{ $t('prices_table.no_data') }}</h4>
    </div>
  </div>
</template>
