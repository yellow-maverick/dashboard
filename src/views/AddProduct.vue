<script>
export default {
  data() {
    return {
    }
  },
  props:      ['property_id'],
  components: {},

  mounted() {
  },

  methods: {

    save() {
      alova
    },

  },
}
</script>

<template>
  <div class=card >
    <div class=card-body >
      <form @submit=save() >
        <div class=form-group >
          <label for=url >{{ $t('products.url') }}</label>
          <input name=url type=text class=form-control />
        </div>

        <h5 role=button data-bs-toggle=collapse data-bs-target=#more-details aria-expanded=false aria-controls=more-details >
          {{ $t('products.more_details') }}
        </h5>
        <div id=more-details class='row collapse' >
          <div class=col >
            <h6> {{ $t('products.basic_info') }} </h6>
            <div class=form-group >
              <label for=sku >{{ $t('products.fields.sku') }}</label>
              <input name=sku type=text class=form-control />
            </div>
            <div class=form-group >
              <label for=internal_id >{{ $t('products.fields.internal_id') }}</label>
              <input name=internal_id type=text class=form-control />
            </div>
            <div class=form-group >
              <label for=category >{{ $t('products.fields.category') }}</label>
              <input name=category type=text class=form-control />
            </div>
            <div class=form-group >
              <label for=targeted_price >{{ $t('products.fields.targeted_price') }}</label>
              <input name=targeted_price type=text class=form-control />
            </div>
          </div >

          <div class=col >
            <h6> {{ $t('products.additional_info') }} </h6>
          
            <div class=form-group >
              <label for=brand >{{ $t('products.fields.brand') }}</label>
              <input name=brand type=number class=form-control />
            </div>
            <div class=form-group >
              <label for=supplier >{{ $t('products.fields.supplier') }}</label>
              <input name=supplier type=number class=form-control />
            </div>
            <div class=form-group >
              <label for=cost_price >{{ $t('products.fields.cost_price') }}</label>
              <input name=cost_price type=number class=form-control />
            </div>
          </div>
        </div>

        <button type=submit class='btn btn-primary' > Save </button>
      </form>
    </div>
  </div>
</template>

