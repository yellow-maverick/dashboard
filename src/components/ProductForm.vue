<script>
export default {
  props: ['product'],
  data() {
    return {
    }
  },

  mounted() {
  },

  methods: {
  },
}
</script>

<template>
  <div class=row>
    <div class=col >
      <h6> {{ $t('products.basic_info') }} </h6>
      <div class=form-group >
        <label for=sku >{{ $t('products.fields.sku') }}</label>
        <input name=sku v-model=product.sku type=text class=form-control />
      </div>
      <div class=form-group >
        <label for=internal_id >{{ $t('products.fields.internal_id') }}</label>
        <input name=internal_id v-model=product.sku type=text class=form-control />
      </div>
      <div class=form-group >
        <label for=category >{{ $t('products.fields.category') }}</label>
        <input name=category v-model=product.category type=text class=form-control />
      </div>
      <div class=form-group >
        <label for=targeted_price >{{ $t('products.fields.targeted_price') }}</label>
        <input name=targeted_price v-model=product.targeted_price type=text class=form-control />
      </div>
    </div >

    <div class=col >
      <h6> {{ $t('products.additional_info') }} </h6>
    
      <div class=form-group >
        <label for=brand >{{ $t('products.fields.brand') }}</label>
        <input name=brand v-model=product.brand type=number class=form-control />
      </div>
      <div class=form-group >
        <label for=supplier >{{ $t('products.fields.supplier') }}</label>
        <input name=supplier v-model=product.supplier type=number class=form-control />
      </div>
      <div class=form-group >
        <label for=cost_price >{{ $t('products.fields.cost_price') }}</label>
        <input name=cost_price v-model=product.cost_price type=number class=form-control />
      </div>
    </div>
  </div>
</template>
