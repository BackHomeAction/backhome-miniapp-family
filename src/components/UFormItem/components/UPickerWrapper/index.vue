<template>
  <view class="u-picker">
    <view class="picker">
      <view class="picker__value">
        <slot />
      </view>
      <view class="picker__tip">
        选择
      </view>
      <span class="outline" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.u-picker {
  height: 66rpx;
}

.picker {
  display: flex;
  justify-content: space-between;
  margin: 22rpx 0;
  box-sizing: border-box;
  height: 44rpx;
  position: relative;

  &__value {
    font-size: 32rpx;
    font-weight: 400;
    color: #000000;
    line-height: 50rpx;
    flex: 1;
  }

  &__tip {
    font-size: 32rpx;
    font-weight: 400;
    color: #539eb7;
    line-height: 50rpx;
  }

  .outline {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -22rpx;
    height: 1px;
    transform: scaleY(0.5);
    background-color: #f0f0f0;
  }
}
</style>
