<template>
  <view
    v-if="data"
    class="item"
  >
    <image
      class="item-image"
      :src="data.identificationPhoto"
      mode="aspectFill"
    />
    <view class="item-info">
      <view class="item-info-first">
        <view class="item-info-first-address">
          111
        </view>
        <view class="item-info-first-distance">
          222
        </view>
      </view>
      <view class="item-info-second">
        333
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useTime } from "@/uses/useTime";
import { OldMan } from "@/api/types/models";

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<OldMan>,
      default: undefined,
    },
  },
  setup() {
    return {
      ...useTime(),
    };
  },
});
</script>

<style lang="scss" scoped>
.item {
  width: 320rpx;
  height: 480rpx;
  background: #e4e4e4;
  border-radius: 12rpx;
  border: 0rpx solid #979797;
  flex: 1;
  margin-bottom: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding: 6rpx;
  box-sizing: border-box;

  &-image {
    width: 308rpx;
    height: 392rpx;
    border-radius: 10rpx 10rpx 0 0;
  }

  &-info {
    width: 308rpx;
    height: 76rpx;
    background: #ffffff;
    border-radius: 0 0 10rpx 10rpx;
    padding: 8rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    &-first {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      min-width: 280rpx;

      &-address {
        font-size: 24rpx;
        color: #000000;
        line-height: 34rpx;
      }

      &-distance {
        font-size: 18rpx;
        color: #979797;
        line-height: 26rpx;
      }
    }

    &-second {
      margin-top: 8rpx;
      text-align: center;
      font-size: 16rpx;
      color: #979797;
      line-height: 22rpx;
    }
  }
}
</style>
