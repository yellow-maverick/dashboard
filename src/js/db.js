import { alova } from '../js/alova.js'

const db = {
  async runQuery(id, data) {
    if (id == 'base_analytics' && !this.$route.query.start_date) {
      console.warn('Missing required params');
      return []
    }
    let params = {
      row: 'property', segment: null,
      subscription_id: this.$route.query.subscription_id,
      start_date:      this.$route.query.start_date,
      end_date:        this.$route.query.end_date,
      property_id:     this.$route.query.property_id,
      format:          "hash",
      //limit: 50,
      //order: null,
      periods: {},
      ...(data || {})
    }
    let r = await alova.Post(`/v1/queries/${id}/run`, params)
    r     = await r.clone().json()
    return r.data
  }
}

export default db;
