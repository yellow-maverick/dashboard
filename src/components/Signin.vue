<script>
import LocaleSelector from "@/components/LocaleSelector.vue";
import SigninForm     from "@/components/SigninForm.vue";
import ArgonAlert     from "@/components/ArgonAlert.vue";
import ForgotPassForm from "@/components/ForgotPassForm.vue";
import { alova }      from '../js/alova.js'

const body = document.getElementsByTagName("body")[0];
let images = [
  "retail_performance.jpg",
  "manufacturing_output.jpg",
  "inventory_management.jpg",
  "customer_data.jpg",
  "supply_chain.jpg",
];
const imagesGlob = import.meta.glob("@/assets/img/signin/*.jpg", { eager: true }); /* fix indentation */
images = images.map(i => imagesGlob[`/src/assets/img/signin/${i}`].default )

export default {
  name: "signin",
  data() {
    return {
      images: images,
      alert: null,
      enableForgotPassword: false
    };
  },
  components: {
    LocaleSelector,
    SigninForm,
    ForgotPassForm,
    ArgonAlert
  },
  created() {
    this.imagesIndex = Math.floor(Math.random()*5)
    this.$store.state.hideConfigButton = true;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.add("bg-gray-100");
  },
  methods: {
    async forgotPassword(email) {
      await alova.Post('/passwords/forgot', { email: email })
      this.disableForgotPasswordBlock()
      this.showAlert(this.$t('signin.an_email_was_sent'))
    },
    disableForgotPasswordBlock () {
      this.enableForgotPassword = false
    },
    showAlert(message) {
      this.alert = message
    }
  },
};
</script>

<template>
  <main class="mt-0 main-content">
    <section>
      <ArgonAlert v-if='alert' icon='info' :dismissible='true' >{{  alert }}</ArgonAlert>
      <div class="page-header min-vh-100">
        <div class="container">
          <LocaleSelector btnBgColor='#f9f9f9'/>
          <div class="row mt-2">
            <!-- form -->
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0" >
              <div class="card card-plain">
                <template v-if='$route.name == "reset-password"'>
                  <router-view />
                </template>
                <template v-else>
                  <SigninForm v-if='!enableForgotPassword' @enableForgotPassword='() => enableForgotPassword = true' />
                  <ForgotPassForm v-if='enableForgotPassword' @submit='forgotPassword' @cancel='disableForgotPasswordBlock' />
                </template>
              </div>
            </div>

            <!-- decoration -->
            <div class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column" >
              <div class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                :style='`background-image: url(${images[parseInt(imagesIndex)]}); background-size: cover; `'
              >
                <span class="mask bg-gradient-dark opacity-4"></span>
                <h3 class="mt-5 text-white font-weight-bolder position-relative" >
                  {{ $t(`signin.images${imagesIndex}.title`) }}
                </h3>
                <p class="text-white position-relative">
                  {{ $t(`signin.images${imagesIndex}.message`) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
