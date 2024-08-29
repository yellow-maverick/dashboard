<script>
import Lib from '../js/lib.js'
import ScrapedConnection from '@/components/ScrapedConnection.vue'

export default {
  data() {
    return {
      adding: false,
      addUrl: null,
      scraped: {},
    }
  },
  props: ['connections'],
  components: {ScrapedConnection},

  methods: {

    add() {
      this.adding = true
    },

    sourceImage(slug) {
      return Lib.sourceImage(slug)
    },
  }
}
</script>

<template>
  <div>
    <div v-if=adding >
      <div class=form-group >
        <label for=url >{{ $t('connections.url') }}</label>
        <input name=url v-model=addUrl type=text class=form-control />
      </div>
      <ScrapedConnection :scraped=scraped :url=addUrl />
    </div>

    <div v-else >
      <button class=btn @click=add() >{{$t('connections.add_new')}}</button>

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
    </div>
  </div>
</template>
