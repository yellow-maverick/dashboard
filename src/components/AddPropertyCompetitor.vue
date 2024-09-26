<script>
import { alova } from '../js/alova.js'

export default {
  data() {
    return {
      saving:  false,
      name:    null,
      status:  null,
    }
  },
  props:      ['property'],
  components: { },
  inject:     ['reload'],

  methods: {

    cancel() {
      this.$parent.adding = false
    },

    async save() {
      this.saving = true
      let c = (await (await alova.Post(`/v1/property_competitors`, {property_id: this.property.id, name: this.name})).clone().json())
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
      <input name=url v-model=name type=text class=form-control />
    </div>

    <div class='d-flex align-items-center mb-3' >
      <button type=button class='btn btn-primary mb-0' @click=save() :disabled=saving >
        {{ $t('connections.add') }}
      </button>
      <a class='ms-3 text-bold' role=button @click=cancel() > {{ $t('connections.cancel') }} </a>
      <span class=ms-3 > {{status}} </span>
    </div>
  </div>
</template>
