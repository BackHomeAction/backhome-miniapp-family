<template>
  <view class="form-item">
    <view
      class="label"
      :style="{width: `${labelWidth}rpx`}"
    >
      {{ label }}
    </view>
    <view class="content">
      <slot />
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    label: {
      type: String,
      default: "",
    },
    labelWidth: {
      type: Number,
      default: 120,
    },
  },
  setup() {},
});
</script>

<style lang="scss" scoped>
.form-item {
  display: flex;
  height: 80rpx;
  align-items: center;
  padding: 0 30rpx;
  border-bottom: 1px solid #f0f0f0;

  & + & {
    border-top: 1px solid #f0f0f0;
  }

  .label {
    margin-right: 20rpx;
    font-size: 28rpx;
  }

  .content {
    flex: 1;
  }
}
</style>
