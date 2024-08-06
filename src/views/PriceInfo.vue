<script>
import Filter from "@/components/Filter.vue";
import { alova } from '../js/alova.js'

export default{
  data () {
    return {
      fields: {
        daterange:   { type: 'daterange' },
        property_id: { type: 'select' },
        product_id:  { type: 'select' },
        period:      { type: 'select', default: 'week' }
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
      return [ ... new Set(Object.values(this.data).flatMap(a => Object.keys(a))) ].sort()
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
            <th class='text-center'>{{ $t(`prices_table.source`) }}</th>
            <template v-for='c in columns' :key='c'>
              <th class='text-center'>{{ c }}</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for='dates,source in data' class='text-center' :key='source'>
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
        </tbody>
      </table>
    </div>
  </div>
</template>
