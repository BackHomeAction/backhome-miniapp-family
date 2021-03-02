<template>
  <view class="form">
    <slot />
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.form {
  background: #ffffff;
}
</style>
