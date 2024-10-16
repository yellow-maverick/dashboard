<script>
import Filter       from "@/components/Filter.vue";
import UserAddModal from "@/components/UserAdd.vue";
import ArgonButton  from "@/components/ArgonButton.vue";
import { alova }    from '../js/alova.js'
import { Modal }    from "bootstrap";
import Lib          from '../js/lib.js'
import Db           from '../js/db.js'

export default{
  data () {
    return {
      modal:        false,
      modalEl:      false,
      user:         null,
      edittedUser:  null,
      users:        [],
      properties:   null,
      filter:       null,
      columns:      ['id', 'first_name', 'last_name', 'email', 'created_at', 'properties' ],
      filterFields: {
        role: { type: 'select', customLabel: function (r) { return this.$t(`roles.${r}`) } },
        search: { type: 'input' }
      },
    }
  },
  props:      [],
  components: { Filter, ArgonButton, UserAddModal },
  async mounted() {
    this.user       = await this.$store.dispatch('profile/fetch')
    this.properties = await this.runQuery('properties', { with_products: false })
  },
  methods: {
    ...Db,
    async load(filter) {
      this.filter = filter
      let req = await alova.Get('/v1/users', { params: { subscription_id: this.user.subscriptions[0].id } })
      this.users = await req.clone().json()
    },
    userAdded(user) {
      this.users.push(user)
      this.modal = false
    },
    userUpdated(user) {
      let i = this.users.findIndex(u => u.id == user.id)
      this.users[i] = user
      this.modal = false
    },
    add () {
      this.edittedUser = null
      this.openModal()
    },
    async edit (user) {
      this.edittedUser = user
      this.openModal()
    },
    async remove (user) {
      if (confirm(this.$t('users.are_you_sure_delete'))) {
        let req = await alova.Delete(`/v1/users/${user.id}`)
        if (req.status == 200) {
          let i = this.users.findIndex(u => u == user)
          this.users.splice(i, 1)
        } else {
          let json = await req.json()
          alert(json.error)
        }
      }
    },
    async openModal () {
      this.modal = true
      await this.$nextTick()
      this.modalEl = new Modal('#UsersAddModal')
      this.modalEl.show()
    },
    closeModal () {
      this.modalEl.hide()
      this.modal = false
    }
  },
  computed: {
    isManager() {
      return Lib.isManager(this.user)
    },
    filteredUsers () {
      if (!this.filter || !this.filter.role) return this.users

      return this.users.filter(u => u.role == this.filter.role )
    }
  },
  watch: {
    filter () {
      this.filteredUsers
    }
  }
}
</script>

<template>
  <div class="container-fluid" v-if='isManager'>
    <Filter :fields=filterFields emitUpdate=true @filter:submit='load' @filter:created='load' @filter:update='load'/>

    <div class="d-flex justify-content-end">
      <argon-button class="mt-1 mb-1" variant="gradient" color="primary" size="md" type="button" @click='add' >{{ $t('users.add') }}</argon-button>
    </div>

    <div class="table-responsive card">
      <table class='table text-center mt-2' v-if='filteredUsers.length' >
        <thead>
          <tr class='bordered-side'>
            <template v-for='c in columns' :key='c' >
              <th class='text-center'>{{ $t(`users.${c}`) }}</th>
            </template>
            <th>{{ $t(`users.role`) }}</th>
            <th>{{ $t(`users.actions`) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='user in filteredUsers' :key='user'>
            <td v-for='c in columns' :key='c' >
              <template v-if='c == "properties"'>{{ user.properties.map(p => p.name).join(', ') }}</template>
              <template v-else>{{ user[c] }}</template>
            </td>
            <td>{{ $t(`users.permission_names.${user.role}`) }}</td>
            <td>
              <a @click.prevent='edit(user)' href='' > <font-awesome-icon class='ms-0' icon='fa-solid fa-pen' :title='$t("users.edit")' /></a>
              <a @click.prevent='remove(user)' href='' > <font-awesome-icon class='ms-3' icon='fa-solid fa-trash' :title='$t("users.delete")' /></a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <UserAddModal @newUser=userAdded  @updatedUser=userUpdated @close='closeModal' :user=edittedUser :properties=properties v-if=modal />
  </div>
</template>
