<template>
  <view
    class="item"
    :class="{border: borderBottom}"
    :style="customStyle"
  >
    <view
      v-if="label"
      class="label"
    >
      <span
        v-if="required"
        class="label__required"
      >*</span>
      <span class="label__text">{{ label }}</span>
    </view>
    <view class="content">
      <slot />
    </view>
    <span
      v-if="borderBottom"
      class="outline"
    />
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    borderBottom: {
      type: Boolean,
      default: false,
    },
    customStyle: {
      type: String,
      default: "",
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.item {
  background: #ffffff;
  padding: 16rpx 32rpx 0 32rpx;
  position: relative;

  & + & {
    margin-top: 32rpx;
  }

  &.border {
    padding-bottom: 22rpx;
  }

  .outline {
    box-sizing: border-box;
    position: absolute;
    left: 32rpx;
    right: 32rpx;
    bottom: 0;
    height: 1px;
    transform: scaleY(0.5);
    background-color: #f0f0f0;
  }
}

.label {
  font-size: 32rpx;
  font-weight: 400;
  color: #000000;
  line-height: 50rpx;

  &__required {
    color: #d0021b;
    margin-right: 8rpx;
  }
}
</style>
