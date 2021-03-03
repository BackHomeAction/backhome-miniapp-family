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
        <view class="item-info-first-name">
          {{ data.name }}
        </view>
      </view>
      <view
        v-if="data.updatedAt"
        class="item-info-second"
      >
        上次修改于：{{ data.updatedAt }}
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
      justify-content: center;
      min-width: 280rpx;

      &-name {
        font-size: 24rpx;
        color: #000000;
        line-height: 34rpx;
        letter-spacing: 1rpx;
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
