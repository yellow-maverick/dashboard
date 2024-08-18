<script>
import Filter from "@/components/Filter.vue";
import { alova } from '../js/alova.js'

export default{
  data () {
    return {
      fields: {
        daterange:   { type: 'daterange' },
        property_id: { type: 'select' },
        product_id:  { type: 'select', multiple: true, customLabel: function (id) { return this.products[id]?.name } },
        period:      { type: 'select', default: 'week' },
        source_ids:  { type: 'select', multiple: true, customLabel: function (id) { return this.sources[id]?.name } },
      },
      filter: null,
      data: null,
      meta: null
    }
  },
  props:      [],
  components: {Filter},
  methods: {
    async load (filter) {
      this.filter = filter
      let resp  = await alova.Get('/v1/prices', { params: { ...filter, per: filter.period } })
      let data  = await resp.clone().json()
      this.data = data.data
      this.meta = data.meta
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
  <div>
    <Filter :fields=fields emitUpdate=true @filter:submit='load' @filter:created='load'/>

    <div class="p-3 card-body table-responsive">
      <table class='table text-center' v-if='data' >
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
              <td class='text-start'>{{ products[product_id].name }}</td>
              <td>
                <a :href='meta.connections[source]?.url'>
                  {{ source }} <small><font-awesome-icon class="ms-1" icon="fa-solid fa-external-link" /></small>
                </a>
              </td>
              <td v-for='c in columns' :key='c'>
                <template v-if='c.availability == false'>{{ $t('prices_table.out_of_stock') }}</template>
                <template v-else >
                  {{ dates[c]?.currency }} {{ dates[c]?.price || '-' }}
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
