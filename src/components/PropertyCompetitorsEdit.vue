<script>
import { defineAsyncComponent } from 'vue'

export default {
  data() {
    return {
    }
  },
  props:      ['competitors', 'categories'],
  components: {
    PropertiesEdit: defineAsyncComponent(() => import('@/components/PropertiesEdit.vue')),
  },
  
}
</script>

<template>
  <div>
    <PropertiesEdit :properties=competitors :categories=categories :compsShow=true />
  </div>
</template>
