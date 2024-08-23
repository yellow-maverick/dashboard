<template>
  <footer class="py-3 footer">
    <div class="container-fluid">
      <div class="row align-items-center justify-content-lg-between">
        <div class="mb-4 col-lg-6 mb-lg-0">
          <div
            class="text-sm text-center copyright text-muted"
            :class="this.$store.state.isRTL ? 'text-lg-end' : 'text-lg-start'"
          >
          © {{ new Date().getFullYear() }},
          <i18n-t keypath="general.made_with" tag="span" scope='global'>
            <template v-slot:by>
              <a href="https://yellowmaverick.com" class="font-weight-bold" target="_blank" >Yellow Maverick</a>
            </template>
            <template v-slot:with>
              <i class="fa fa-heart"></i>
            </template>
          </i18n-t>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "app-footer",
};
</script>
