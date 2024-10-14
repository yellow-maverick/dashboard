<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav mt-5">
      <li class="nav-item">
        <sidenav-item
          url="/dashboard"
          :class="getRoute() === 'dashboard' ? 'active' : ''"
          :navText="$t('routes.dashboard')"
        >
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          url="/analytics"
          :class="getRoute() === 'analytics' ? 'active' : ''"
          :navText="$t('routes.analytics')"
        >
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          url="/reviews"
          :class="getRoute() === 'reviews' ? 'active' : ''"
          :navText="$t('routes.reviews')"
        >
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          url="/price_info"
          :class="getRoute() === 'price_info' ? 'active' : ''"
          :navText="$t('routes.price_info')"
        >
        </sidenav-item>
      </li>

      <template v-if=isManager >
        <li class="nav-item mt-3">
          <h6 class='class="ps-4 ms-4 text-uppercase text-xs font-weight-bolder opacity-6"'>
            {{ $t('routes.settings.title') }}
          </h6>
        </li>
        <li class="nav-item">
          <sidenav-item
            url="/brands"
            :class="getRoute() === 'brands' ? 'active' : ''"
            :navText="$t('routes.settings.brands')"
            >
          </sidenav-item>
        </li>

        <li class="nav-item">
          <sidenav-item
            url="/products"
            :class="getRoute() === 'products' ? 'active' : ''"
            :navText="$t('routes.settings.products')"
            >
          </sidenav-item>
        </li>

        <li class="nav-item">
          <sidenav-item
            url="/users"
            :class="getRoute() === 'users' ? 'active' : ''"
            :navText="$t('routes.settings.users')"
          >
          </sidenav-item>
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
import SidenavItem from "./SidenavItem.vue";
import Lib         from '../../js/lib.js'

export default {
  name: "SidenavList",
  props: {
    cardBg: String,
    user: Object
  },
  data() {
    return {
      title: "Argon Dashboard 2",
      controls: "dashboardsExamples",
      isActive: "active"
    };
  },
  components: {
    SidenavItem,
  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    }
  },
  computed: {
    isManager() {
      return Lib.isManager(this.user)
    }
  },
};
</script>
