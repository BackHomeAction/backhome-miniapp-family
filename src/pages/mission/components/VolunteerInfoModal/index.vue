<template>
  <view>
    <u-popup
      :value="value"
      custom-class="place-info-popup"
      mode="center"
      :border-radius="20"
      width="55%"
      @input="handleInput"
    >
      <view>
        <u-cell-group>
          <view class="avatar u-border-bottom">
            <image
              :src="volunteerData.avatarUrl"
              mode="aspectFill"
              class="avatar-image"
            />
          </view>
          <u-cell-item
            title="姓名"
            :value="volunteerData.volunteerInformation.name ? volunteerData.volunteerInformation.name : ''"
            :arrow="false"
            hover-class="none"
          />
          <u-cell-item
            title="电话"
            :value="volunteerData.phone ? volunteerData.phone : ''"
            @click="makePhoneCall(volunteerData.phone)"
          />
          <u-cell-item
            title="查看更多"
            @click="handleToVolunteerInformation"
          />
        </u-cell-group>
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import UPopup from "@/components/UPopup/index.vue";
import UCellGroup from "@/components/UCellGroup/index.vue";
import UCellItem from "@/components/UCellItem/index.vue";
import { Volunteer } from "@/api/types/models";
import { navigateTo } from "@/utils/helper";

export default defineComponent({
  components: { UPopup, UCellGroup, UCellItem },
  props: {
    volunteerData: {
      type: Object as PropType<Volunteer>,
      default: () => null,
    },
    value: {
      type: Boolean,
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

    const handleToVolunteerInformation = () => {
      if (!props.volunteerData?.volunteerInformation?.id) return;

      navigateTo("/pages/volunteerInformation/index", {
        informationID: props.volunteerData.volunteerInformation.id,
      });
    };

    return { handleInput, makePhoneCall, handleToVolunteerInformation };
  },
});
</script>

<style lang="scss" scoped>
.avatar {
  padding: 16rpx 0;
  display: flex;
  justify-content: center;

  &-image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 100%;
  }
}
</style>
