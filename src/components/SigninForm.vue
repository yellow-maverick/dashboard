<script>
import ArgonInput  from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import { alova }   from '../js/alova.js'

export default{
  data () {
    return {
      user: {},
    }
  },
  props:      [],
  components: {
    ArgonInput,
    ArgonButton,
  },
  methods: {
    async login() {
      await alova.Post('/login', { user: this.user })
      //let data = await resp.clone().json()
    },
  }
}
</script>

<template>
  <div>
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
