<template>
  <view class="body">
    <view
      v-if="current.oldMan"
      class="content"
    >
      <view class="wrapper">
        <view class="man">
          <image
            class="man-photo"
            :src="current.oldMan.identificationPhoto"
            mode="aspectFill"
          />
          <view class="man-info">
            <view class="man-info-row">
              <view class="man-info-row-name">
                {{ current.oldMan.name }}
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
                {{ `${current.city}·${current.district}` }}
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
        <!-- 有且只有另一个进行中案件时，在这里显示另一个案件的图像 -->
        <image
          v-if="mansWithoutSelected && mansWithoutSelected.length === 1 && mansWithoutSelected[0].oldMan"
          class="man-photo man-photo--another"
          :src="mansWithoutSelected[0].oldMan.identificationPhoto"
          mode="aspectFill"
          @click.stop="handleSelect(mansWithoutSelected[0])"
        />
        <!-- 当存在多个其他进行中案件时，显示展开按钮 -->
        <view
          v-if="mansWithoutSelected && mansWithoutSelected.length > 1"
          class="more"
          @click.stop="showMore = !showMore"
        >
          <text class="iconfont icon-ellipsis" />
        </view>
      </view>
      <view class="divider" />
      <view class="description">
        <view class="description-row">
          <view class="description-row-icon icon-time" />
          <view class="description-row-time">
            {{ current.startTime && getCalendarTime(current.startTime) }}
          </view>
        </view>
        <view
          class="description-row"
          style="margin-top: 16rpx;"
        >
          <view class="description-row-icon icon-point" />
          <view class="description-row-address">
            走失于 {{ current.place }}
          </view>
        </view>
      </view>
    </view>

    <!-- 存在多个其他进行中案件时的弹出选择器 -->
    <view
      v-if="mansWithoutSelected && mansWithoutSelected.length > 1"
      class="other-man"
      :class="{show: showMore}"
    >
      <view class="other-mans">
        <view
          v-for="item in mansWithoutSelected"
          :key="item.id"
          class="other-mans-item"
          @click="handleSelect(item)"
        >
          <image
            v-if="item.oldMan"
            :src="item.oldMan.identificationPhoto"
            class="other-mans-item-image"
            mode="aspectFill"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Case } from "@/api/types/models";
import dayjs from "@/utils/dayjs";
import { computed, ComputedRef, defineComponent, PropType, ref } from "vue";
import { useStore } from "vuex";
import { useTime } from "@/uses/useTime";

export default defineComponent({
  props: {
    current: {
      type: Object as PropType<Case>,
      default: null,
    },
  },
  emits: ["show-more-info", "select"],
  setup(props, { emit }) {
    const store = useStore();

    const myMissions: ComputedRef<Array<Case>> = computed(() => {
      return store.getters.myMissions;
    });

    const selected = computed(() => {
      return myMissions.value.findIndex((item) => item.id === props.current.id);
    });

    const mansWithoutSelected = computed(() => {
      return myMissions.value
        .slice(0, selected.value)
        .concat(myMissions.value.slice(selected.value + 1));
    });

    // 计算年龄
    const manAge = computed(() => {
      return parseInt(dayjs(props?.current?.oldMan?.birthDate).fromNow(), 10);
    });

    // 查看更多
    const handleClickShowmore = () => {
      emit("show-more-info", props.current);
    };

    const handleSelect = (item: Case) => {
      emit("select", item);
    };

    const showMore = ref(false);

    return {
      ...useTime(),
      myMissions,
      mansWithoutSelected,
      manAge,
      handleClickShowmore,
      handleSelect,
      showMore,
    };
  },
});
</script>

<style lang="scss" scoped>
.body {
  width: 716rpx;
  height: 250rpx;
  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.5);
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  position: relative;
}

.content {
  padding: 0 20rpx;
  width: 100%;

  .wrapper {
    padding: 0 10rpx;
    display: flex;
    justify-content: space-between;

    .man {
      width: 100%;
      display: flex;
      align-items: flex-end;
      flex: 1;

      &-photo {
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;

        &--another {
          opacity: 0.75;
        }
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
    }
  }
}

.divider {
  margin: 20rpx 0;
  background-color: #e4e4e4;
  display: block;
  width: 100%;
  height: 1px;
  transform: scale(1, 0.5);
}

.more {
  width: 100rpx;
  height: 100rpx;
  background: #d8d8d8;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .iconfont {
    color: #000000;
    font-size: 70rpx;
  }
}

.other-man {
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  transform: scale(1, 0) translate(0, -70%);
  transition: all 0.2s ease-in-out;
  filter: drop-shadow(2rpx 4rpx 8rpx rgba(0, 0, 0, 0.5));

  &.show {
    opacity: 1;
    transform: scale(1, 1) translate(0, 0);
    height: auto;
  }

  .other-mans {
    position: absolute;
    bottom: 30rpx;
    right: 21.5rpx;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 10rpx;
    padding: 16rpx 8rpx;
    box-sizing: border-box;

    &-item {
      width: 100rpx;
      height: 100rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      &-image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;
      }
    }

    .other-mans-item + .other-mans-item {
      margin-top: 20rpx;

      &::after {
        position: absolute;
        /* #ifndef APP-NVUE */
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        border-top: 1px solid #e4e4e4;
        /* #endif */
        right: 0;
        left: 0;
        top: -10rpx;
        transform: scaleY(0.5);
        margin: 0;
      }
    }

    &::after {
      content: " ";
      margin: 0;
      border-width: 26rpx 15rpx 0 15rpx;
      border-style: solid;
      border-color: #ffffff transparent transparent transparent;
      padding: 0;
      width: 0;
      height: 0;
      left: 44rpx;
      bottom: -26rpx;
      position: absolute;
    }
  }
}
</style>
