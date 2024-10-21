<script>
import ArgonInput  from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonAlert  from "@/components/ArgonAlert.vue";
import { alova }   from '../js/alova.js'

export default{
  data () {
    return {
      token: this.$route.query.reset_token,
      user: {
        password: '',
        password_confirmation: '',
      },
      alert: null
    }
  },
  components: {
    ArgonInput,
    ArgonButton,
    ArgonAlert,
  },
  methods: {
    async submit () {
      if (!this.user.password.trim()) return alert(this.$t('signin.please_fill_the_pass'))

      if (this.user.password != this.user.password_confirmation)
        return alert(this.$t('signin.please_fill_the_same_pass'))
      let req = await alova.Post('/passwords/reset', { reset_token: this.token, user: this.user })
      if (req.status == 200) this.$router.push({ name: '/', query: {}, param: {} })
      else {
        let json = await req.close().json()
        this.alert = json.error
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="pb-0 card-header text-start">
      <h4 class="font-weight-bolder">{{ $t('signin.recover_password') }}</h4>
      <p class="mb-0">{{ $t('signin.enter_a_new_password') }}</p>
    </div>
    <div class="card-body">
      <ArgonAlert v-if='alert' color='danger' >{{  alert }}</ArgonAlert>
      <form role="form">
        <div class="mb-3">
          <argon-input v-model='user.password' type="password" :placeholder="$t('signin.password')" name="password" size="lg" :isRequired=true />
          <argon-input v-model='user.password_confirmation' type="password" :placeholder="$t('signin.password_confirmation')" name="password_confirmation" size="lg" :isRequired=true />
        </div>

        <div class="text-center">
          <argon-button @click.prevent='submit' class="mt-4 me-1" variant="gradient" color="success" fullWidth size="lg" >{{ $t('signin.submit') }}</argon-button>
        </div>
      </form>
    </div>
  </div>
</template>
