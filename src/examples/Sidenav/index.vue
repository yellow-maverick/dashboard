<template>
  <div
    v-show="this.$store.state.layout === 'default'"
    class="min-height-250 position-absolute w-100"
    :class="`${this.$store.state.darkMode ? 'bg-transparent' : 'sidebar-bg'}`"
  />
  <div class="sidenav-header">
    <router-link class="m-0 navbar-brand" to="/">
      <img
        :src="
          this.$store.state.darkMode ||
          this.$store.state.sidebarType === 'bg-default'
            ? logoWhite
            : logo
        "
        class="navbar-brand-img h-100"
        alt="main_logo"
      />
    </router-link>
  </div>
  <aside
    class="my-3 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl"
    :class="`${
      this.$store.state.isRTL
        ? 'me-3 rotate-caret fixed-end'
        : 'fixed-start ms-3'
    } 
    ${
      this.$store.state.layout === 'landing'
        ? 'bg-transparent shadow-none'
        : ' '
    } ${this.$store.state.sidebarType}`"
    id="sidenav-main"
  >
    <sidenav-list :cardBg="custom_class" />
  </aside>
</template>
<script>
import SidenavList from "./SidenavList.vue";
import logo from "@/assets/img/logo-yellow.png";
import logoWhite from "@/assets/img/logo-yellow.png";

export default {
  name: "index",
  components: {
    SidenavList
  },
  data() {
    return {
      logo,
      logoWhite
    };
  },
  props: ["custom_class", "layout"]
};
</script>
