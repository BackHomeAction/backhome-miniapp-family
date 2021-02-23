<template>
  <view
    class="box"
    @click="handleClick()"
  >
    <view class="border">
      <image
        style="width: 100rpx;height: 100rpx;"
        :src="icon"
        mode="aspectFill"
      />
      <view class="text">
        <view class="first-text">
          <view style="height: 56rpx;">
            {{ name }}
          </view>
        </view>
        <view class="second-text">
          <view style="height: 34rpx;">
            {{ description }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { navigateTo } from "@/utils/helper";

export default defineComponent({
  props: {
    icon: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    path: {
      type: String,
      default: "",
    },
    needLogin: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    function handleClick() {
      // TODO: check login
      if (props.path) {
        navigateTo(props.path);
      }
    }
    return { handleClick };
  },
});
</script>

<style lang="scss" scoped>
@mixin font($font, $color, $lineh) {
  font-size: $font;
  color: $color;
  line-height: $lineh;
}

.box {
  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.5);
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  box-sizing: border-box;
  width: 672rpx;
  height: 186rpx;

  .border {
    display: flex;
    width: 100%;

    .text {
      margin-left: 32rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;

      .first-text {
        max-width: 500rpx;
        height: 56rpx;
        @include font(40rpx, #000000, 56rpx);
        letter-spacing: 10rpx;
        display: flex;
        justify-content: center;
      }

      .second-text {
        max-width: 500rpx;
        height: 34rpx;
        margin-top: 16rpx;
        @include font(24rpx, #979797, 34rpx);
      }
    }
  }
}
</style>
