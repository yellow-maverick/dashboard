<script>
import ArgonInput  from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonAlert     from "@/components/ArgonAlert.vue";
import { alova }   from '../js/alova.js'

export default{
  data () {
    return {
      user: {},
      alert: null,
    }
  },
  props:      [],
  components: {
    ArgonInput,
    ArgonButton,
    ArgonAlert
  },
  methods: {
    async login() {
      let req = await alova.Post('/login', { user: this.user })
      if (req.status == 200) this.$router.go(0)
      else {
        let json = await req.clone().json()
        this.alert = json.error
      }
    },
  }
}
</script>

<template>
  <div>
    <ArgonAlert v-if='alert' color='danger' :dismissible='true' >{{  alert }}</ArgonAlert>
    <div class="pb-0 card-header text-start">
      <h4 class="font-weight-bolder">{{ $t('signin.title') }}</h4>
      <p class="mb-0">{{ $t('signin.description') }}</p>
    </div>
    <div class="card-body">
      <form role="form">
        <div class="mb-3">
          <argon-input v-model='user.email' type="email" :placeholder="$t('signin.email')" name="email" size="lg" />
        </div>
        <div class="mb-3">
          <argon-input v-model='user.password' type="password" :placeholder="$t('signin.password')" name="password" size="lg" />
        </div>

        <div class="text-center">
          <argon-button @click.prevent="login" class="mt-4" variant="gradient" color="success" fullWidth size="lg" >{{ $t('signin.signin') }}</argon-button>
        </div>
        <div class="mt-3 text-center">
          <a href='' @click.prevent='() => { $emit("enableForgotPassword") }' class="text-primary text-gradient" >{{ $t('signin.forgot_password') }}</a>
        </div>
      </form>
    </div>
  </div>
</template>
