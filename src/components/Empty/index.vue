<template>
  <view class="empty">
    <text class="empty-icon iconfont icon-empty" />
    <view class="empty-text">
      {{ message }}
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    message: {
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
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $uni-text-color-grey;
  padding: 30rpx 0;

  &-icon {
    font-size: 128rpx;
  }

  &-text {
    margin-top: 10rpx;
    font-size: $uni-font-size-base;
  }
}
</style>
