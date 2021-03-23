<template>
  <view class="modal">
    <u-popup
      :value="value"
      closeable
      custom-class="timeout-popup"
      mode="bottom"
      :border-radius="10"
      @input="handleInput"
    >
      <view class="content safe-area-inset-bottom">
        <view class="title">
          超时提醒
        </view>
        <view
          class="icon"
          @click="makePhoneCall('110')"
        >
          <text class="iconfont icon-baojing" />
        </view>
        <view class="text">
          一键报警
        </view>
        <view class="tip">
          <text>
            距案件发布已超过 24 小时\n建议您立刻报警
          </text>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UPopup from "@/components/UPopup/index.vue";

export default defineComponent({
  components: {
    UPopup,
  },
  props: {
    value: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  emits: ["input"],
  setup(props, { emit }) {
    const handleInput = (e: any) => {
      emit("input", e);
    };

    // 电话拨号
    const makePhoneCall = (tel: string) => {
      uni.makePhoneCall({
        phoneNumber: tel,
      });
    };

    return { handleInput, makePhoneCall };
  },
});
</script>

<style lang="scss" scoped>
.content {
  background: linear-gradient(#fcfdff, #e9efff);
  padding: 30rpx 30rpx 60rpx 30rpx;
  display: flex;
  align-items: center;
  flex-direction: column;

  .title {
    align-self: flex-start;
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 40rpx;
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 160rpx;
    height: 160rpx;
    border-radius: 100%;
    background-color: #f76162;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.3);

    .icon-baojing {
      color: #ffffff;
      font-size: 60rpx;
    }
  }

  .text {
    margin-top: 20rpx;
    font-size: 28rpx;
    font-weight: bold;
  }

  .tip {
    margin-top: 30rpx;
    font-size: 26rpx;
    color: $uni-text-color-grey;
    text-align: center;
  }
}
</style>
