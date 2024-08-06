<script>
//import { alova } from '../js/alova.js'
//import _ from 'lodash'

export default {
  data() {
    return {
      data: {
        property_id: this.$route.query.property_id,
        url: null,
        sku: null, internal_id: null, category: null, targeted_price: null,
        brand: null, supplier: null, cost_price: null,
      },
    }
  },
  props: [],
  components: {},

  mounted() {
  },

  methods: {

    async save() {
      //let r = await alova.Post(`/v1/products`, _.merge(this.data, {property_id: this.property_id}))
    },

  },
}
</script>

<template>
  <div class=card >
    <div class=card-body >
      <form>
        <div class=form-group >
          <label for=url >{{ $t('products.url') }}</label>
          <input name=url v-model=data.url type=text class=form-control />
        </div>

        <h5 role=button data-bs-toggle=collapse data-bs-target=#more-details aria-expanded=false aria-controls=more-details >
          {{ $t('products.more_details') }}
        </h5>
        <div id=more-details class='row collapse' >
          <div class=col >
            <h6> {{ $t('products.basic_info') }} </h6>
            <div class=form-group >
              <label for=sku >{{ $t('products.fields.sku') }}</label>
              <input name=sku v-model=data.sku type=text class=form-control />
            </div>
            <div class=form-group >
              <label for=internal_id >{{ $t('products.fields.internal_id') }}</label>
              <input name=internal_id v-model=data.sku type=text class=form-control />
            </div>
            <div class=form-group >
              <label for=category >{{ $t('products.fields.category') }}</label>
              <input name=category v-model=data.category type=text class=form-control />
            </div>
            <div class=form-group >
              <label for=targeted_price >{{ $t('products.fields.targeted_price') }}</label>
              <input name=targeted_price v-model=data.targeted_price type=text class=form-control />
            </div>
          </div >

          <div class=col >
            <h6> {{ $t('products.additional_info') }} </h6>
          
            <div class=form-group >
              <label for=brand >{{ $t('products.fields.brand') }}</label>
              <input name=brand v-model=data.brand type=number class=form-control />
            </div>
            <div class=form-group >
              <label for=supplier >{{ $t('products.fields.supplier') }}</label>
              <input name=supplier v-model=data.supplier type=number class=form-control />
            </div>
            <div class=form-group >
              <label for=cost_price >{{ $t('products.fields.cost_price') }}</label>
              <input name=cost_price v-model=data.cost_price type=number class=form-control />
            </div>
          </div>
        </div>

        <button type=button class='btn btn-primary' @click=save() > Save </button>
      </form>
    </div>
  </div>
</template>

