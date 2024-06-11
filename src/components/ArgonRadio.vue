<template>
  <div class="form-check">
    <input class="form-check-input" :value='value' type="radio" :name="name" :id="id" :checked="checked" :model-value='modelValue' @input="$emit('update:modelValue', $event.target.value)" />
    <label class="custom-control-label ms-0" :for="id">
      <slot />
    </label>
  </div>
</template>

<script>
export default {
  name: "argon-radio",
  props: {
    name: String,
    value: String,
    id: String,
    modelValue: String
  },
  computed: {
    checked () {
      return this.value == this.modelValue
    }
  },
  emits: ['update:modelValue']
};
</script>
