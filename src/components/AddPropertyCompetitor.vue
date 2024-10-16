<script>
import { alova } from '../js/alova.js'

export default {
  data() {
    return {
      saving:  false,
      status:  null,
    }
  },
  props:      {
    property: Object, inline: Boolean,
    competitor: {type: Object, default: {}}
  },
  components: { },
  inject:     ['reload'],

  methods: {

    cancel() {
      this.$parent.adding = false
    },

    async save() {
      this.saving = true
      let p = {property_id: this.property.id, competitor: this.competitor}
      let c = (await (await alova.Post(`/v1/property_competitors`, p)).clone().json())
      if (c.id) {
        this.$parent.adding = false
        this.reload()
      } else {
        this.status = this.$t('competitors.save_error', {error: c.error})
      }
      this.saving = false
    },
  }

}
</script>

<template>
  <div>
    <div class=form-group >
      <label for=url >{{ $t('competitors.name') }}</label>
      <input name=url v-model=competitor.name type=text class=form-control />
    </div>

    <div v-if=!inline class='d-flex align-items-center mb-3' >
      <button type=button class='btn btn-primary mb-0' @click=save() :disabled=saving >
        {{ $t('connections.add') }}
      </button>
      <a class='ms-3 text-bold' role=button @click=cancel() > {{ $t('connections.cancel') }} </a>
      <span class=ms-3 > {{status}} </span>
    </div>
  </div>
</template>
