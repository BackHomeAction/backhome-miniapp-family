<template>
  <view
    class="item"
    @click="handleClick"
  >
    <view class="body">
      <view class="content">
        <view class="content-icon" />
        <view class="content-text">
          添加老人
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { navigateTo } from "@/utils/helper";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const handleClick = () => {
      navigateTo("/pagesA/editOldMan/index");
    };

    return { handleClick };
  },
});
</script>

<style lang="scss" scoped>
.item {
  width: 320rpx;
  height: 480rpx;
  background: #e4e4e4;
  border-radius: 12rpx;
  flex: 1;
  margin-bottom: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding: 6rpx;
  box-sizing: border-box;

  .body {
    background: #ffffff;
    width: 308rpx;
    height: 468rpx;
    border-radius: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;

      &-icon {
        background-image: url("@/static/images/myOldMan/add.png");
        width: 120rpx;
        height: 120rpx;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: 50% 50%;
      }

      &-text {
        font-size: 24rpx;
        font-weight: 400;
        color: #979797;
        line-height: 34rpx;
        letter-spacing: 5rpx;
      }
    }
  }
}
</style>
