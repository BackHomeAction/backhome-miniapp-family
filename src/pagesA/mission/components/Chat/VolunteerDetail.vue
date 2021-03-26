<template>
  <view
    class="detail"
    :style="{opacity: show ? 1 : 0}"
  >
    <view
      class="detail-item"
      @tap="navigateToPersonalPage"
    >
      <view class="detail-item-label">
        姓名
      </view>
      <view
        v-if="volunteer.volunteerInformation"
        class="detail-item-value"
      >
        {{ volunteer.volunteerInformation.name }}
      </view>
    </view>
    <view
      class="detail-item"
      @tap="makePhoneCall"
    >
      <view class="detail-item-label">
        电话
      </view>
      <view
        v-if="volunteer"
        class="detail-item-value"
      >
        {{ volunteer.phone }}
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Volunteer } from "@/api/types/models";
import { navigateTo } from "@/utils/helper";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: null,
    },
    volunteer: {
      type: Object as PropType<Volunteer>,
      default: null,
    },
  },
  setup(props) {
    // 跳转个人页
    const navigateToPersonalPage = () => {
      if (!props.volunteer.volunteerInformation?.id) return;

      navigateTo("/pages/volunteerInformation/index", {
        informationID: props.volunteer.volunteerInformation.id,
      });
    };

    // 电话拨号
    const makePhoneCall = () => {
      if (!props.volunteer.phone) return;

      uni.makePhoneCall({
        phoneNumber: props.volunteer.phone,
      });
    };

    return { navigateToPersonalPage, makePhoneCall };
  },
});
</script>

<style lang="scss" scoped>
.detail {
  position: absolute;
  transition: opacity 0.1s linear;

  &-item {
    box-sizing: border-box;
    width: 750rpx;
    height: 76rpx;
    background: #f8f8f8;
    padding: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    &-label {
      width: 100rpx;
      font-size: 32rpx;
      font-weight: 400;
      color: #000000;
      display: flex;
      align-items: center;
    }

    &-value {
      flex: 1;
      font-size: 32rpx;
      font-weight: 400;
      color: #979797;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    :after {
      position: absolute;
      /* #ifndef APP-NVUE */
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      border-top: 1px solid #f0f0f0;
      /* #endif */
      right: 0;
      left: 0;
      top: 0;
      transform: scaleY(0.5);
      margin: 0 20rpx;
    }
  }
}
</style>
