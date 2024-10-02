<script>
import ArgonInput  from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";

export default{
  data () {
    return {
      email: null,
    }
  },
  props:      [],
  components: {
    ArgonInput,
    ArgonButton,
  },
  methods: {}
}
</script>

<template>
  <div>
    <div class="pb-0 card-header text-start">
      <h4 class="font-weight-bolder">{{ $t('signin.recover_password') }}</h4>
      <p class="mb-0">{{ $t('signin.enter_your_email_reset') }}</p>
    </div>
    <div class="card-body">
      <form role="form">
        <div class="mb-3">
          <argon-input v-model='email' type="email" :placeholder="$t('signin.email')" name="email" size="lg" />
        </div>

        <div class="text-center">
          <argon-button @click.prevent='() => { $emit("sendForgot", this.email) }' class="mt-4 me-1" variant="gradient" color="success" size="lg" >{{ $t('signin.submit') }}</argon-button>
          <argon-button @click.prevent='() => { $emit("cancel") }' class="mt-4 ms-1" variant="gradient" color="light" size="lg" >{{ $t('signin.cancel') }}</argon-button>
        </div>
      </form>
    </div>
  </div>
</template>
