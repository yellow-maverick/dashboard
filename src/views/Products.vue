<script>
import Db from '../js/db.js'
import { alova } from '../js/alova'

import PropertiesEdit from '@/components/PropertiesEdit.vue'

export default {
  data() {
    return {
      open_property_id: null,
      properties:  [],
      categories:  [],
    }
  },
  props:      [],
  components: {PropertiesEdit},

  provide() {
    return {
      reload: this.reload,
    }
  },

  created() {
    this.open_product_id  = this.$route.query.product_id
  },

  mounted() {
    this.load()
  },

  methods: {
    ...Db,

    async load() {
      this.profile    = await this.$store.dispatch('profile/fetch')
      this.categories = (await (await alova.Get(`/v1/product_categories`)).clone().json()).data
      await this.loadProperties()

      if (this.open_product_id) {
        const element = document.getElementById(`product-${this.product_id}`)
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }
    },

    async reload() {
      this.loadProperties()
    },

    async loadProperties() {
      this.properties = (await this.runQuery('properties', {
        with_products: true, with_connections: true, with_competitors: true,
      }))
    },

  },

  computed: {},
}
</script>

<template>
  <div class=container-fluid >
    <div class=row >
      <PropertiesEdit :properties=properties :categories=categories />
    </div>
  </div>
</template>
