<script>
export default {
  data() {
    return {
    }
  },
  props:      ['product', 'competitors', 'categories'],
  components: { },
  
}
</script>

<template>
  <div>
    <ul v-for='pdc in competitors' :key=pdc.id >
      <li> {{pdc.name}} </li>
    </ul>
  </div>
</template>

