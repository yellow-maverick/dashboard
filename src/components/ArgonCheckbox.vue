<script>
export default {
  inheritAttrs: false,
  name: "argon-checkbox",
  props: {
    name:       String,
    id:         String,
    modelValue: [Number, String, Array, Object],
    value:      null
  },
  emits: ['update:modelValue'],
  mounted() {
    console.log(this.value, this.modelValue);
  },
  methods: {
    log(ev) {
      this.$emit('update:modelValue', ev.target.value)
      console.log(ev.target.value);
    }
  },
};
</script>

<template>
  <div class="form-check">
    <input class="form-check-input" type="checkbox" :name="name" :id="id" :value=value :model-value='modelValue' @input="log" />
    <label :for="id" class="custom-control-label">
      <slot />
    </label>
  </div>
</template>
