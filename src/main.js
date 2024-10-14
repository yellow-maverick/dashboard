import { createApp } from "vue";

import { Tooltip }       from "bootstrap";
import App from "./App.vue";
import store from "./store/index.js";
import router from "./router/index.js";
import { i18n } from "./js/locales";
import DataTable from "vue3-easy-data-table";

import 'vue3-flag-icons/styles'

import ArgonDashboard from "./argon-dashboard.js";
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faStar, faExternalLink, faCircleInfo, faArrowUp, faArrowDown, faDownload, faTrash, faPen  } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faStar)
library.add(faExternalLink)
library.add(faCircleInfo)
library.add(faArrowUp)
library.add(faArrowDown)
library.add(faDownload)
library.add(faTrash)
library.add(faPen)

const appInstance = createApp(App);
appInstance.component('font-awesome-icon', FontAwesomeIcon)
appInstance.use(store);
appInstance.component("data-table", DataTable);
appInstance.use(i18n);
appInstance.use(router);
appInstance.use(ArgonDashboard);

appInstance.directive("b-tooltip", {
  mounted(el) {
    const tooltip = new Tooltip(el, { trigger: "hover", placement: "auto" });
    el.addEventListener("click", () => tooltip.hide());
  }
});

router.isReady().then(() => {
  appInstance.mount("#app");
})
