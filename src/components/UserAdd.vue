<script>
import ArgonAlert  from "@/components/ArgonAlert.vue";
import ArgonInput  from "@/components/ArgonInput.vue";

import { alova }   from '../js/alova.js'

export default{
  data () {
    return {
      data: { properties: [], is_manager: false },
      alert: null
    }
  },
  props:      ['properties', 'user'],
  components: { ArgonInput, ArgonAlert },
  beforeMount() {
    if (this.user) {
      this.data = JSON.parse(JSON.stringify(this.user))
      this.data.properties = this.user.properties.map(up => up.id)
      this.data.is_manager = this.user.permissions.find(p => p.name == 'manager') != undefined
    }
  },
  methods: {
    async save() {
      if (!Object.keys(this.data.properties).length) {
        this.alert = this.$t('users.required_at_least_one_property')
        return
      }
      let req;

      if (this.data.id)
        req = await alova.Put(`/v1/users/${this.data.id}`, { user: this.data })
      else
        req = await alova.Post('/v1/users', { user: this.data })

      const json = await req.json()
      if (req.status == 200) {
        if (this.data.id)
          this.$emit('updatedUser', json)
        else
          this.$emit('newUser', json)
        this.$emit('close')
      } else {
        console.error(json);
        this.alert = json.error
      }
    },
  },
}
</script>

<template>
  <div class="modal fade" tabindex="-1" id='UsersAddModal'>
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('users.edit_user_modal') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ArgonAlert v-if='alert' color='danger' >{{  alert }}</ArgonAlert>
          <form role="form">
            <div class="mb-3">
              <label>{{ $t('users.email') }}</label>
              <argon-input v-model='data.email' type="email" :placeholder="$t('users.email')" name="email" size="lg" />
            </div>

            <div class="mb-3">
              <div class="form-check">
                <input v-model='data.is_manager' class="form-check-input" type="checkbox" name="is_manager" id="is_manager" />
                <label for='is_manager'>{{ $t('users.manager_permission') }}</label>
              </div>
            </div>

            <div class="mb-3">
              <label>{{ $t('users.properties') }}</label>

              <template  v-for='p in properties' :key=p>
                <div class="form-check">
                  <input v-model='data.properties' class="form-check-input" type="checkbox" :value=p.property_id :name="`property${p.property_id}`" :id="p.property_id" />
                  <label :for="p.property_id" class="custom-control-label">{{ p.name }}</label>
                </div>
              </template>
            </div>

          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal" @click='() => $emit("close")'>{{ $t('users.cancel') }}</button>
          <button type="button" class="btn btn-primary" @click='save'>
            <template v-if='data.id'>{{ $t('users.save') }}</template>
            <template v-else>{{ $t('users.invite') }}</template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
