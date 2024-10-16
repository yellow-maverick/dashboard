<script>
import { defineAsyncComponent } from 'vue'
import AddPropertyCompetitor from '@/components/AddPropertyCompetitor.vue'

export default {
  data() {
    return {
      adding: false,
    }
  },
  props:      ['property', 'competitors', 'categories'],
  components: {
    PropertiesEdit: defineAsyncComponent(() => import('@/components/PropertiesEdit.vue')), // async due recursion
    AddPropertyCompetitor
  },

  methods: {
    add() {
      this.adding = true
    },
  },
}
</script>

<template>
  <div>
    <AddPropertyCompetitor :property=property v-if=adding />
    <button v-else class=btn @click=add >{{$t('competitors.add_new')}}</button>

    <PropertiesEdit :properties=competitors :categories=categories :isComp=true />
  </div>
</template>
