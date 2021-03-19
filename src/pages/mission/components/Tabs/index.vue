<template>
  <view class="tabs">
    <view
      class="tabs-item"
      @click.stop="handleClick('info')"
    >
      <image
        class="tabs-item-image"
        src="@/static/images/map/tab_info.png"
      />
      <view class="tabs-item-text">
        走失信息
      </view>
    </view>
    <view
      class="tabs-item"
      @click.stop="handleClick('chat')"
    >
      <image
        class="tabs-item-image"
        src="@/static/images/map/tab_chat.png"
      />
      <view class="tabs-item-text">
        队伍沟通
      </view>
      <view
        v-if="unreadMessageNumber"
        class="tabs-item-dot"
      />
    </view>
    <view
      class="tabs-item"
      @click.stop="handleClick('face')"
    >
      <image
        class="tabs-item-image"
        src="@/static/images/map/tab_face.png"
      />
      <view class="tabs-item-text">
        人脸识别
      </view>
      <view
        v-if="hasUnchekedSuccessFaceRecognitionRecord"
        class="tabs-item-dot"
      />
    </view>
  </view>
</template>

<script lang="ts">
import { Face, JavaList } from "@/api/types/models";
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  emits: ["select"],
  setup(props, { emit }) {
    const store = useStore();

    const handleClick = (name: string) => {
      emit("select", name);
    };

    const unreadMessageNumber = computed(() => {
      return store.getters.tim.unreadMessageNumber;
    });

    const historyList: ComputedRef<JavaList<Face>> = computed(() => {
      return store.getters.currentMission.faceRecognitionHistory;
    });

    // 是否有 >=80 且家属未确认的人脸识别记录
    const hasUnchekedSuccessFaceRecognitionRecord = computed(() => {
      return historyList.value.some((item) => item.result && item.state === 2);
    });

    return {
      handleClick,
      unreadMessageNumber,
      hasUnchekedSuccessFaceRecognitionRecord,
    };
  },
});
</script>

<style lang="scss" scoped>
.tabs {
  box-sizing: border-box;
  position: absolute;
  top: 48rpx;
  left: 16rpx;
  width: 718rpx;
  height: 160rpx;
  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.5);
  border-radius: 10rpx;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 64rpx;

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90rpx;
    position: relative;

    &-image {
      width: 90rpx;
      height: 90rpx;
      object-fit: fill;
    }

    &-text {
      margin-top: 8rpx;
      font-size: 20rpx;
      color: #000000;
      line-height: 28rpx;
    }

    &-dot {
      width: 30rpx;
      height: 30rpx;
      background: #f55449;
      border-radius: 100%;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
