<script>
import { alove } from '../js/alova.js';
import { useRequest } from 'alova';
import dayjs from 'dayjs'
import { VAceEditor } from 'vue3-ace-editor'
import Multiselect from 'vue-multiselect'

import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';

export default{
  data: () => {
    return {
      query: null,
      queries: [],
      error: null,
      editor: {
        options: { wrap: 92, fontSize: '14pt' },
      },
      paramsEditor: {
        options: { wrap: 60, fontSize: '14pt' },
      },
      startedAt:    null,
      durationTime: null,
      runner:       null,
      saveStatus:   null,
      execQuery:    null,
      firstRow:     null,
      params:  JSON.stringify({
        row: 'property', segment: null,
        subscription_id: [1],
        start_date: dayjs().add('-1', 'month').format('YYYY-MM-DD'), end_date: dayjs().format('YYYY-MM-DD'),
        periods: {yoy: 1, previous: 1},
        for_products: null, origin_sources: null,
        property_id: [1],// group_id: [1],

        with_response_rate: null,
        limit: 50, sort: null, order: null,
        period: 'month',

        release_date: dayjs().format('YYYY-MM-DD'),
      }, null, 2),
      result:   {},
      fields:   [],
    }
  },
  props:      [],
  components: {VAceEditor, Multiselect},
  mounted() {
    this.loadQueries()
    // Use Control + s to save the query
    document.addEventListener("keydown", this.controlS);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.controlS);
  },

  methods: {
    controlS (e) {
      if (!(e.keyCode === 83 && (e.ctrlKey || e.metaKey))) {
        return;
      }

      e.preventDefault();
      console.log("saving query!");
      this.save()
    },
    loadQueries() {
      alove.Get('/v1/queries/').then(r => r.clone().json() ).then(async r => { this.queries = r })
    },
    async run () {
      let params  = Object.assign({query: this.query.sql, format: 'hash'}, JSON.parse(this.params))

      this.startedAt  = dayjs()
      this.execQuery  = null
      this.error      = null
      this.result     = {}

      this.runner     = alove.Post(`/v1/queries/runSql`, params)
      this.duration()
      const r         = (await this.runner)
      r.clone().json().then(async r => {
        this.result    = r
        this.execQuery = r.meta?.query?.trim()
        this.error     = r.error
        this.firstRow  = this.result?.data ? this.result?.data[0] || {} : {}
        this.fields    = Object.keys(this.firstRow).map((k) => {
          return {value: k, text: `${k} (${typeof this.firstRow[k]})`}
        })
        this.clear()
      }).catch((e) => { console.log(e); this.error = e?.response?.data || e; this.clear() })
    },
    async save() {
      alove.Put(`/v1/queries/${this.query.id}`, {sql: this.query.sql}).then(() => {
        this.saveStatus = 'Saved...'
        setTimeout(() => this.saveStatus = null, 3*1000)
      })
    },
    cancel() {
      this.stop()
      this.clear()
    },
    clear() {
      this.runner    = null
      this.startedAt = null
    },
    stop() {
      if (!this.result) this.runner?.abort()
    },
    duration() {
      if (!this.runner) return
      this.durationTime = (dayjs().diff(this.startedAt) / 1000).toFixed(1)
      setTimeout(this.duration, 1)
    },
    changed() {
      this.result    = {}
      this.firstRow  = null
      this.execQuery = null
    },
  }
}
</script>

<template>
  <div class="py-4 container-fluid card">
    <div class='row'>
      <div class='col-7'>
        <h4>Queries</h4>
        <multiselect :options=queries v-model=query track-by=id label=slug @select=changed @remove=changed :showLabels=false :allow-empty=false :searchable=true />

        <button @click=run  :disabled=startedAt class='btn btn-secondary mt-3'>Run</button>
        <span v-if=runner>
          running for {{ durationTime }} seconds
          <button @click=cancel class='btn btn-secondary'>Cancel</button>
        </span>

        <span class='float-end mt-3'>
          <span class=mx-3>{{saveStatus}}</span>
          <button @click=save class='btn btn-secondary'>Save</button>
        </span>
        <div class="">
          <h4>Query</h4>
          <VAceEditor v-if='query' v-model:value=query.sql lang=sql theme="chrome" style="min-height: 1000px;" :options=editor.options></VAceEditor>
        </div>
      </div>


      <div class="col-5 h-100">
        <h4 class="mt-2"> Parameters </h4>
        <VAceEditor v-model:value=params lang=json theme="chrome" style="height: 200px;" class='border' :options=paramsEditor.options ></VAceEditor>

        <datatable class="thead-light" v-if='result.data' :items='result.data' :headers=fields :rows-per-page=result?.data?.length :fixed-header=true :table-height=760>
        <!-- this is to render big objects properly -->
        <template v-for="col in fields" #[`item-${col.value}`]="item" :key="col.value">
          <div class="p-3"> {{ item[col.value] }} </div>
        </template>
        </datatable>

        <div>
          <h4 class="mt-3"> Message </h4>
          <span v-if=error class='alert-warning'> {{ error }} </span>
          <span v-if='!firstRow && !error'> empty result </span>
        </div>
      </div>
    </div>

    <div class=row v-if=execQuery>
      <h4>Executed query in {{durationTime}} seconds</h4>
      <pre> {{ execQuery }} </pre>
    </div>

  </div>
</template>
