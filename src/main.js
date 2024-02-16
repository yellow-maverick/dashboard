import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/index.js";
import router from "./router/index.js";
import { i18n } from "./js/locales";
import DataTable from "vue3-easy-data-table";

import ArgonDashboard from "./argon-dashboard.js";

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faStar } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faStar)

const appInstance = createApp(App);
appInstance.component('font-awesome-icon', FontAwesomeIcon)
appInstance.use(store);
appInstance.component("datatable", DataTable);
appInstance.use(i18n);
appInstance.use(router);
appInstance.use(ArgonDashboard);

router.isReady().then(() => {
  appInstance.mount("#app");
})
