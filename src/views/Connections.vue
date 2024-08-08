<script>
import Db from '../js/db.js'
import Lib from '../js/lib.js'
import Multiselect from 'vue-multiselect'
import { alova } from '../js/alova'

export default {
  data() {
    return {
      properties: [],
      categories: [],
    }
  },
  props:      [],
  components: {Multiselect},

  mounted() {
    this.load()
  },

  methods: {
    ...Db,
    async load() {
      this.profile = await this.$store.dispatch('profile/fetch')
      this.properties = (await this.runQuery('properties', {
        with_products: true, with_connections: true,
      }))
      this.categories = (await (await alova.Get(`/v1/product_categories`)).clone().json()).data
    },

    hide(event) {
      event.target.style.display = 'none'
    },
    sourceImage(slug) {
      return Lib.sourceImage(slug)
    },
  },

  computed: {},
}
</script>

<style lang=scss >
  .accordion-header .multiselect {
    width: auto;
    cursor: auto;

    .multiselect__select, .multiselect__tag-icon, .multiselect__content {
      display: none !important;
    }
    .multiselect__tags {
      border: none;
      .multiselect__tag {
        padding-right: 10px;
      }
    }
  }
</style>

<template>
  <div class='container-fluid'>
    <div class='row'>
      <div v-for='(p,i) in properties' class=card :key=i >
        <div id=property-accordion class=accordion >
          <div class=accordion-item >
            <h5 class=accordion-header >
              <button class=accordion-button data-bs-toggle=collapse :data-bs-target='`#collapse-${i}`' aria-expanded=true :aria-controls='`#collapse-${i}`'  >
                {{p.name}}
                <div class='d-flex justify-content-end' style='flex: auto' >
                  <img class='me-1' v-for='c in p.connections' style='max-height: 20px' :src="sourceImage(c.source.slug)" :key=c >
                </div>
              </button>
            </h5>

            <div :id='`collapse-${i}`' class='collapse show' aria-labelledby=headingOne data-parent=#property-accordion >

              <div class='d-flex justify-content-start' >
                <h6 class='card-subtitle mb-2 text-muted lh-3'>Products</h6>
                <router-link :to="{path: 'add-product', query: {...$route.query, property_id: p.property_id}}" >
                  <button class='btn ms-3' >Add new</button>
                </router-link>
              </div>

              <div :id='`property-${i}-accordion`' class=accordion >
                <div v-for='(pd,j) in p.products' class=accordion-item :key=j >
                  <h6 class=accordion-header >
                    <button class=accordion-button data-bs-toggle=collapse :data-bs-target='`#collapse-${i}-${j}`' aria-expanded=true :aria-controls='`#collapse-${i}-${j}`'  >
                      {{pd.name}}
                      <multiselect :options=categories :readonly=true v-model=pd.categories track-by=id label=name :taggable=true :multiple=true :searchable=false />
                      <div class='d-flex justify-content-end' style='flex: auto' >
                        <img v-for='c in pd.connections' @error="hide" style='max-height: 20px' class='me-1' :title=c.source.name :src="sourceImage(c.source.slug)" :key=c >
                      </div>
                    </button>
                  </h6>

                  <div :id='`collapse-${i}-${j}`' class=collapse aria-labelledby=headingOne :data-parent='`#property-${i}-accordion`' >

                    <div class=btn-toolbar role=toolbar >
                      <div class=btn-group role=group >
                        <input class=btn-check type=radio :name='`tb${i}${j}`' :id='`conns-${i}-${j}`' checked />
                        <label class='btn btn-outline-primary' :for='`conns-${i}-${j}`' > Connections </label>

                        <input class=btn-check type=radio :name='`tb${i}${j}`' :id='`comps-${i}-${j}`' />
                        <label class='btn btn-outline-primary' :for='`comps-${i}-${j}`' > Competitors </label>
                      </div>
                    </div>

                    <div class=card-body >
                      <div class=form-group v-for='c in pd.connections' :key=c.source.slug >
                        <label :for='`source_${c.source.slug}`' >
                          <a :href='c.url' target=_blank >
                            <img @error='hide' style='max-height: 20px' class='me-1' :title=c.source.name :src="sourceImage(c.source.slug)" >
                            <span> {{c.source.name}} </span>
                            <small><font-awesome-icon class="ms-1" icon="fa-solid fa-external-link" /></small>
                          </a>
                        </label>
                        <input name='`source_${c.source.slug}`' v-model=c.url type=text class=form-control />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
