<template>
  <div>
    <div class='dropdown'>
      <div class='btn mb-0' :class='{ "btn-outline-light": !btnBgColor }' data-bs-toggle='dropdown' :title="$t('general.change_language')" :style='`background-color: ${btnBgColor}`' >
        <div class="d-flex align-items-center">
          <FlagIcon :code="Lib.getLocale($i18n.locale, 'language').code" :size=18 />
          <span class="d-none d-md-block ms-2">{{ $t(`locales.${$i18n.locale}`) }} <i class="mdi mdi-chevron-down"></i></span>
        </div>
      </div>
      <ul class='dropdown-menu' style='left: -60px'>
        <li class="notify-item" @click='setLocale(l)' v-for='l in availableLocales' :key='l'>
          <div class="d-flex align-items-center dropdown-item">
            <FlagIcon :code="Lib.getLocale(l, 'language').code" :size=15 />
            <span class="ms-2">{{ $t(`locales.${l}`) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Lib from "@/js/lib";
import FlagIcon from 'vue3-flag-icons'

export default {
  name: "locale_selector",
  data() {
    return {
      availableLocales: Lib.locales,
      Lib: Lib
    };
  },
  props: ['btnBgColor'],
  async created() {
    this.$i18n.locale = await this.$store.dispatch('locale/fetch')
    if (!this.availableLocales.includes(this.$i18n.locale)) this.setLocale('en');
  },
  methods: {
    setLocale (locale) {
      this.$store.commit('locale/saveLocale', locale)
      this.$i18n.locale = locale
    },
  },
  components: { FlagIcon },
  computed: {
  }
};
</script>
