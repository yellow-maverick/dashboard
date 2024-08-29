<script>
import Lib from '../js/lib.js'

export default {
  data() {
    return {
    }
  },
  props: ['connections'],

  methods: {
    sourceImage(slug) {
      return Lib.sourceImage(slug)
    },
  }
}
</script>

<template>
  <div class=form-group v-for='c in connections' :key=c.source.slug >
    <label :for='`source_${c.source.slug}`' >
      <a :href=c.url target=_blank >
        <img @error='hide' style='max-height: 20px' class='me-1' :title=c.source.name :src="sourceImage(c.source.slug)" >
        <span> {{c.source.name}} </span>
        <small><font-awesome-icon class="ms-1" icon="fa-solid fa-external-link" /></small>
      </a>
    </label>
    <input name='`source_${c.source.slug}`' v-model=c.url type=text class=form-control />
  </div>
</template>
