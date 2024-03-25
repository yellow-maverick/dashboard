import { alove } from '../js/alova.js';
const db = {
  async runQuery(id, data) {
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
    let r = await alove.Post(`/v1/queries/${id}/run`, params)
    r     = await r.clone().json()
    return r.data
  }
}

export default db;
