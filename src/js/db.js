import { alova } from '../js/alova.js'

const db = {
  async runQuery(id, data) {
    if (data) {
      if (!data.start_date)  data.start_date  = this.$route.query.start_date
      if (!data.end_date)    data.end_date    = this.$route.query.end_date
      if (!data.property_id) data.property_id = this.$route.query.property_id
    }

    if (id == 'base_analytics' && !data.start_date) {
      console.warn('Missing required params');
      return []
    }

    let params = {
      row: 'property', segment: null,
      subscription_id: this.$route.query.subscription_id,
      format:          "hash",
      periods:         {},
      ...(data || {})
    }
    let r = await alova.Post(`/v1/queries/${id}/run`, params)
    r     = await r.clone().json()
    return r.data
  }
}

export default db;
