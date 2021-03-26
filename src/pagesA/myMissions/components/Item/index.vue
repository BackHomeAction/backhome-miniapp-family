<template>
  <view class="box">
    <view
      class="header"
    >
      <view
        v-if="data.state === 1"
        class="badge badge-running"
      >
        进行中
      </view>
      <view
        v-if="data.state === 2"
        class="badge badge-complete"
      >
        已完成
      </view>
      <view
        v-if="data.state === 3"
        class="badge badge-timeout"
      >
        已归档
      </view>
      <view
        v-if="data.state === 4"
        class="badge badge-canceled"
      >
        已取消
      </view>
    </view>
    <view
      v-if="data.oldMan"
      class="content"
    >
      <view class="man">
        <image
          class="man-photo"
          :src="data.oldMan.identificationPhoto"
          mode="aspectFill"
        />
        <view class="man-info">
          <view class="man-info-row">
            <view class="man-info-row-name">
              {{ data.oldMan.name }}
            </view>
            <view class="man-info-row-age">
              {{ manAge }} 岁
            </view>
          </view>
          <view
            class="man-info-row"
            style="margin: 16rpx 0 8rpx 0"
          >
            <view class="man-info-row-address">
              {{ `${data.city}·${data.district}` }}
            </view>
            <view
              class="man-info-row-showmore"
              @click="handleClickShowmore"
            >
              查看更多
              <text
                class="iconfont icon-arrow-right"
              />
            </view>
          </view>
        </view>
      </view>
      <view class="divider" />
      <view class="description">
        <view class="description-row">
          <view class="description-row-icon icon-time" />
          <view class="description-row-time">
            {{ data.startTime && getCalendarTime(data.startTime) }}
          </view>
        </view>
        <view
          class="description-row"
          style="margin-top: 16rpx;"
        >
          <view class="description-row-icon icon-point" />
          <view class="description-row-address">
            走失于 {{ data.place }}
          </view>
          <!-- <view
            v-if="currentLocation && currentLocation.longitude && currentLocation.latitude && data.longitude && data.latitude"
            class="description-row-distance"
          >
            距离 {{ (getDistanceFromMe([data.longitude, data.latitude], "km")).toFixed(1) }} km
          </view> -->
        </view>
      </view>
      <view
        class="divider"
        style="margin-bottom: 0"
      />
      <view class="action">
        <view
          v-if="data.state === 1 || data.state === 3"
          class="action-text"
          @click="handleClickEnterMission"
        >
          进入搜救
          <text
            class="iconfont icon-arrow-right"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref } from "vue";
import { useTime } from "@/uses/useTime";
import UButton from "@/components/UButton/index.vue";
import { navigateTo } from "@/utils/helper";
import { Case } from "@/api/types/models";
import dayjs from "@/utils/dayjs";

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<Case>,
      default: undefined,
    },
  },
  setup(props) {
    const handleClickShowmore = () => {
      navigateTo("/pagesA/missionInformation/index", { id: props.data.id });
    };

    const handleClickEnterMission = () => {
      navigateTo("/pagesA/mission/index", { id: props.data.id });
    };

    // 计算年龄
    const manAge = computed(() => {
      return parseInt(dayjs(props?.data?.oldMan?.birthDate).fromNow(), 10);
    });

    return {
      ...useTime(),
      handleClickShowmore,
      handleClickEnterMission,
      manAge,
    };
  },
});
</script>


<style lang="scss" scoped>
.box {
  box-sizing: border-box;
  width: 686rpx;
  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.5);
  border-radius: 10rpx;
  margin-bottom: 48rpx;
}

.divider {
  margin: 20rpx 0;
  background-color: #e4e4e4;
  display: block;
  width: 100%;
  height: 1px;
  transform: scale(1, 0.5);
}

.header {
  height: 32rpx;
  display: flex;
  justify-content: flex-end;

  .badge {
    width: 96rpx;
    height: 32rpx;
    border-radius: 10rpx 10rpx 10rpx 0rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20rpx;
    font-weight: 400;
    line-height: 28rpx;

    &.badge-running {
      color: #303133;
      background: #ffa36c;
    }

    &.badge-complete {
      color: #303133;
      background: #799351;
    }

    &.badge-timeout,
    &.badge-canceled {
      color: #303133;
      background: #b0b2b2;
    }
  }
}

.content {
  padding: 0 20rpx;

  .man {
    padding: 0 10rpx;
    width: 100%;
    display: flex;
    align-items: flex-end;

    &-photo {
      width: 100rpx;
      height: 100rpx;
      border-radius: 100%;
    }

    &-info {
      margin-left: 32rpx;
      display: flex;
      flex-direction: column;

      &-row {
        display: flex;
        align-items: flex-end;

        &-name {
          font-size: 32rpx;
          font-weight: 400;
          color: #000000;
          line-height: 1;
        }

        &-age {
          margin-left: 24rpx;
          font-size: 20rpx;
          font-weight: 400;
          color: #666666;
          line-height: 1;
        }

        &-address {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 12rpx;
          height: 32rpx;
          background: #409eff;
          border-radius: 16rpx;
          color: #ffffff;
          font-size: 16rpx;
        }

        &-showmore {
          margin-left: 16rpx;
          box-sizing: border-box;
          height: 32rpx;
          border-radius: 10rpx;
          border: 2rpx solid #979797;
          font-size: 16rpx;
          font-weight: 400;
          color: #000000;
          display: flex;
          padding: 0 9rpx 0 18rpx;
          display: flex;
          align-items: center;

          .icon-arrow-right {
            font-size: 28rpx;
            font-weight: normal;
            color: #979797;
            line-height: 28rpx;
          }
        }
      }
    }
  }

  .description {
    padding: 0 10rpx;
    width: 100%;
    display: flex;
    flex-direction: column;
    font-size: 24rpx;
    font-weight: 400;
    color: #000000;
    line-height: 1;

    &-row {
      display: flex;
      align-items: center;
      width: 100%;

      &-icon {
        width: 20rpx;
        height: 20rpx;
        margin-right: 16rpx;

        &.icon-time {
          background-image: url("@/static/images/myMission/time.png");
          background-size: cover;
          background-position: 50% 50%;
        }

        &.icon-point {
          border-radius: 100%;
          background: #ffa36c;
        }
      }

      &-distance {
        color: #666666;
        margin-left: 16rpx;
      }
    }
  }

  .action {
    padding: 8rpx 0 10rpx 10rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 48rpx;

    &-text {
      font-size: 24rpx;
      font-weight: 400;
      color: #000000;
      display: flex;
      align-items: center;
      height: 45rpx;
      line-height: 45rpx;

      .icon-arrow-right {
        line-height: 45rpx;
      }
    }

    &-button {
      margin-left: 16rpx;
    }
  }
}
</style>
