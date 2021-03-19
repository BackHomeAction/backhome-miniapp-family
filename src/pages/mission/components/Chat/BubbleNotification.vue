<template>
  <view class="body">
    <view
      v-if="data.type === TIM.TYPES.MSG_TEXT"
      class="wrapper"
    >
      {{ data.payload.text }}
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TIM from "tim-wx-sdk";

export default defineComponent({
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  setup() {
    return { TIM };
  },
});
</script>

<style lang="scss" scoped>
.body {
  display: flex;
  justify-content: center;
  margin-bottom: 36rpx;

  .wrapper {
    padding: 8rpx 16rpx;
    font-size: 24rpx;
    color: #ffffff;
    background-color: #e3e3e3;
    border-radius: 8rpx;
  }
}
</style>
