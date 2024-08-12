<script>
import Multiselect from 'vue-multiselect'
import { alova } from '../js/alova'

export default {
  props: ['product', 'categories'],
  data() {
    return {
      profile: {},
    }
  },

  components: {Multiselect},

  mounted() {
    this.load()
  },

  methods: {

    createCategory(name) {
      let cat = {id: null, name: name,
        subscription_id: this.profile.subscriptions[0].id, 
        product_ids:     this.product.id ? [this.product.id] : [],
      }
      this.categories.push(cat)
      this.product.categories.push(cat)
    },
    addCategory(cat) {
      cat.product_ids.push(this.product.id)
      console.log(cat)
    },
    removeCategory(cat) {
      cat.product_ids = cat.product_ids.filter((id) => id != this.product.id)
      console.log(cat)
    },

    async load() {
      this.profile      = await this.$store.dispatch("profile/fetch");
      this.categories ||= (await (await alova.Get(`/v1/product_categories`)).clone().json()).data
    },

  },
}
</script>

<template>
  <div class=row>
    <div class=col >
      <h6> {{ $t('products.basic_info') }} </h6>
      <div class=form-group >
        <label for=name >{{ $t('products.fields.name') }}</label>
        <input name=name v-model=product.name type=text class=form-control />
      </div>
      <div class=form-group >
        <label for=sku >{{ $t('products.fields.sku') }}</label>
        <input name=sku v-model=product.sku type=text class=form-control />
      </div>
      <div class=form-group >
        <label for=internal_id >{{ $t('products.fields.internal_id') }}</label>
        <input name=internal_id v-model=product.sku type=text class=form-control />
      </div>
      <div class=form-group >
        <label for=categories >{{ $t('products.fields.categories') }}</label>
        <multiselect :options=categories v-model=product.categories track-by=name label=name 
          :taggable=true :multiple=true @tag=createCategory @select=addCategory @remove=removeCategory />
      </div>
      <div class=form-group >
        <label for=targeted_price >{{ $t('products.fields.targeted_price') }}</label>
        <input name=targeted_price v-model=product.targeted_price type=number class=form-control />
      </div>
    </div>

    <div class=col >
      <h6> {{ $t('products.additional_info') }} </h6>
    
      <div class=form-group >
        <label for=brand >{{ $t('products.fields.brand') }}</label>
        <input name=brand v-model=product.brand type=text class=form-control />
      </div>
      <div class=form-group >
        <label for=supplier >{{ $t('products.fields.supplier') }}</label>
        <input name=supplier v-model=product.supplier type=text class=form-control />
      </div>
      <div class=form-group >
        <label for=cost_price >{{ $t('products.fields.cost_price') }}</label>
        <input name=cost_price v-model=product.cost_price type=number class=form-control />
      </div>
    </div>
  </div>
</template>
