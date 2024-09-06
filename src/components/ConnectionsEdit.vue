<script>
import Lib from '../js/lib.js'
import AddConnection from '@/components/AddConnection.vue'
import PhotoGallery from '@/components/PhotoCardGallery.vue'

export default {
  data() {
    return {
      adding: false,
      addUrl: null,
      scraped: {},
    }
  },
  props: ['connections', 'product'],
  components: {AddConnection, PhotoGallery},

  created() {
  },

  methods: {

    add() {
      this.adding = true
    },

    reload() {
      this.adding = false
      this.$parent.reload()
    },

    hide(event) {
      event.target.style.display = 'none'
    },
    sourceImage(slug) {
      return Lib.sourceImage(slug)
    },
  }
}
</script>

<template>
  <div>
    <div v-if=adding class='mb-5 border-bottom' >
      <AddConnection :product=product />
    </div>

    <div>
      <button v-if=!adding class=btn @click=add() >{{$t('connections.add_new')}}</button>

      <div class=form-group v-for='c in connections' :key=c.source.slug >
        <div class='d-flex align-items-center' >
          <label :for='`source_${c.source.slug}`' >
            <a :href=c.url target=_blank >
              <img @error=hide style='max-height: 20px' class='me-1' :title=c.source.name :src="sourceImage(c.source.slug)" >
              <span> {{c.source.name}} </span>
              <small><font-awesome-icon class='ms-1' icon='fa-solid fa-external-link' /></small>
            </a>
          </label>

          <div class='ms-3 pb-3' style='height: 50px' >
            <PhotoGallery :images=c.images />
          </div>
        </div>

        <input name='`source_${c.source.slug}`' v-model=c.url type=text class=form-control />
      </div>
    </div>
  </div>
</template>
