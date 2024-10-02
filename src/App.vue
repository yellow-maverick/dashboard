<script>
import Sidenav from "./examples/Sidenav/index.vue";
import Configurator from "@/examples/Configurator.vue";
import Navbar from "@/components/Navbar.vue";
import Signin from "@/components/Signin.vue";
import AppFooter from "@/components/Footer.vue";
import { mapMutations } from "vuex";

export default {
  name: "App",
  components: {
    Sidenav,
    Configurator,
    Navbar,
    AppFooter,
    Signin
  },
  methods: {
    ...mapMutations(["toggleConfigurator", "navbarMinimize"])
  },
  computed: {
    navClasses() {
      return {
        "position-sticky bg-white left-auto top-2 z-index-sticky":
          this.$store.state.isNavFixed && !this.$store.state.darkMode,
        "position-sticky bg-default left-auto top-2 z-index-sticky":
          this.$store.state.isNavFixed && this.$store.state.darkMode,
        "position-absolute px-4 mx-0 w-100 z-index-2": this.$store.state
          .isAbsolute,
        "px-0 mx-4": !this.$store.state.isAbsolute
      };
    }
  },
  beforeMount() {
    this.$store.state.isTransparent = "bg-transparent";
  }
};
</script>

<template>
  <div v-if="this.$store.state.token.loggedIn === true" >
    <div
      v-show="this.$store.state.layout === 'landing'"
      class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
      ></div>
    <sidenav
      :custom_class="this.$store.state.mcolor"
      v-if="this.$store.state.showSidenav"
      />
    <main
      class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
      >
      <!-- nav -->
      <navbar
        :class="[navClasses]"
        :textWhite="
        this.$store.state.isAbsolute ? 'text-white opacity-8' : 'text-white'
        "
        :minNav="navbarMinimize"
        v-if="this.$store.state.showNavbar"
        />
      <div style='min-height: 90vh'>
        <router-view />
      </div>
      <app-footer v-show="this.$store.state.showFooter" />
        <configurator
          :toggle="toggleConfigurator"
          :class="[
          this.$store.state.showConfig ? 'show' : '',
          this.$store.state.hideConfigButton ? 'd-none' : ''
          ]"
          />
    </main>
  </div>
    <div v-else>
      <Signin />
    </div>
</template>
