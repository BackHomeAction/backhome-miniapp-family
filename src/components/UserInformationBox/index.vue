<template>
  <view class="information">
    <view
      class="box"
    >
      <view class="left">
        <view
          class="avatar"
          :class="{'avatar--nologin': status === 'unlogin' || !avatarUrl}"
          :style="{backgroundImage: status !== 'unlogin' && avatarUrl ? `url(${avatarUrl})` : null}"
        />
        <view
          v-if="status === 'unlogin'"
          class="tag tag--nologin"
        >
          未登录
        </view>
        <view
          v-if="status !== 'unlogin' && registerTimeFromNow"
          class="tag tag--time"
        >
          {{ `加入 ${registerTimeFromNow}` }}
        </view>
      </view>
      <view class="right">
        <view class="name">
          {{ status !== 'unlogin' && name ? name : "家属" }}
          <!-- <view
            v-if="status !== 'unlogin'"
            class="sex-icon"
            :class="[sex === 1 ? 'sex-icon-man' : sex === 2 ? 'sex-icon-woman' : '']"
          /> -->
        </view>
        
        <button
          v-if="status === 'unlogin'"
          class="action-btn"
          hover-class="none"
          @click="handleLogin"
        >
          <view class="action-btn-text">
            去登录
            <text
              class="iconfont icon-arrow-right"
            />
          </view>
        </button>
        <button
          v-if="status === 'user'"
          class="action-btn"
          @click="handleClickPhone"
        >
          <view class="action-btn-text">
            TEL: {{ phone }}
            <text
              class="iconfont icon-arrow-right"
            />
          </view>
        </button>
        <button
          v-if="status === 'me'"
          class="action-btn"
          @click="handleEditProfile"
        >
          <view class="action-btn-text">
            修改个人信息
            <text
              class="iconfont icon-arrow-right"
            />
          </view>
        </button>

        <view class="divider" />
        <view class="tasks">
          <view
            class="task"
          >
            <u-count-to
              :end-val="doingMissionsNumber"
              font-size="44"
              line-height="60"
              color="#000000"
            />
            <view class="task-description">
              正在进行
            </view>
          </view>
          <view class="task">
            <u-count-to
              :end-val="endedMissionsNumber"
              font-size="44"
              line-height="60"
              color="#000000"
            />
            <view class="task-description">
              历史报案
            </view>
          </view>
          <view
            v-if="status === 'me'"
            class="task"
          >
            <u-count-to
              :end-val="allMissionsNumber"
              font-size="44"
              line-height="60"
              color="#000000"
            />
            <view class="task-description">
              我报过的
            </view>
          </view>
        </view>
      </view>
    </view>

    <view
      v-if="historyMissions"
      class="list"
    >
      <view
        v-for="item in historyMissions"
        :key="item.id"
        class="list-item"
      >
        <view
          v-if="item.state === 1"
          class="list-item-badge badge-running"
        >
          进行中
        </view>
        <view
          v-if="item.state === 2"
          class="list-item-badge badge-complete"
        >
          已完成
        </view>
        <view
          v-if="item.state === 3"
          class="list-item-badge badge-timeout"
        >
          已归档
        </view>
        <view
          v-if="item.state === 4"
          class="list-item-badge badge-canceled"
        >
          已取消
        </view>
        <view class="list-item-content">
          <image
            v-if="item.oldMan"
            class="list-item-content-photo"
            :src="item.oldMan.identificationPhoto"
            mode="aspectFill"
          />
          <view class="list-item-content-info">
            <view class="list-item-content-info-title">
              {{ item.district }}走失老人
            </view>
            <view
              v-if="item.lostTime"
              class="list-item-content-info-desc"
            >
              于 {{ item.lostTime }}
            </view>
            <view class="list-item-content-info-desc">
              走失于{{ item.place }}附近
            </view>
          </view>
        </view>
        <view
          v-if="item.state === 1"
          class="list-item-icon icon-running"
        />
        <view
          v-if="item.state === 2"
          class="list-item-icon icon-complete"
        />
        <view
          v-if="item.state === 3"
          class="list-item-icon icon-timeout"
        />
        <view
          v-if="item.state === 4"
          class="list-item-icon icon-canceled"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ComputedRef } from "vue";
import authService from "@/service/authService";
import dayjs from "@/utils/dayjs";
import { navigateTo } from "@/utils/helper";
import UCountTo from "../UCountTo/index.vue";
import { Case, Family } from "@/api/types/models";
import { useStore } from "vuex";

const useLogin = () => {
  const handleLogin = () => {
    authService.login(true);
  };

  return { handleLogin };
};

const useHistory = () => {
  const store = useStore();

  const historyMissions: ComputedRef<Array<Case>> = computed(() => {
    return store.getters.myAllMissions.reverse();
  });

  const doingMissionsNumber = computed(() => {
    return historyMissions.value.filter((item) => item.state === 1).length;
  });

  const endedMissionsNumber = computed(() => {
    return historyMissions.value.filter(
      (item) => item.state === 2 || item.state === 3
    ).length;
  });

  const allMissionsNumber = computed(() => {
    return historyMissions.value.length;
  });

  return {
    historyMissions,
    doingMissionsNumber,
    endedMissionsNumber,
    allMissionsNumber,
  };
};

export default defineComponent({
  components: { UCountTo },
  props: {
    status: {
      type: String as PropType<"unlogin" | "me" | "user">,
      default: "unlogin",
    },
    userInfo: {
      type: Object as PropType<Family>,
      default: undefined,
    },
  },
  setup(props) {
    const name = computed(() => {
      return props?.userInfo?.name;
    });

    const sex = computed(() => {
      return props?.userInfo?.sex;
    });

    const registerTimeFromNow = computed(() => {
      const time = props?.userInfo?.registerTime;

      return dayjs(time).fromNow(true);
    });

    const avatarUrl = computed(() => {
      return props?.userInfo?.avatarUrl;
    });

    const phone = computed(() => {
      return props?.userInfo?.phone;
    });

    const handleEditProfile = () => {
      navigateTo("/pagesA/editProfile/index");
    };

    const handleClickPhone = () => {
      if (!phone.value) return;
      uni.makePhoneCall({
        phoneNumber: phone.value,
      });
    };

    return {
      ...useLogin(),
      name,
      sex,
      registerTimeFromNow,
      avatarUrl,
      phone,
      handleEditProfile,
      handleClickPhone,
      ...useHistory(),
    };
  },
});
</script>

<style lang="scss" scoped>
.tag {
  border-radius: 16rpx;
  font-size: 16rpx;
  font-weight: $uni-font-weight-base;
  line-height: 32rpx;
  padding: 0 16rpx;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;

  &--nologin {
    background: #d0d0d0;
  }

  &--time {
    background: #f6eec9;
  }
}

.box {
  margin: 0 auto 20rpx auto;
  width: 672rpx;
  height: 320rpx;
  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.5);
  border-radius: 10rpx;
  display: flex;

  .left {
    box-sizing: border-box;
    width: 202rpx;
    padding: 32rpx 32rpx 0 42rpx;
    text-align: center;

    .avatar {
      width: 128rpx;
      height: 128rpx;
      border-radius: 100%;
      background-size: cover;

      &--nologin {
        background: #666666;
      }
    }

    .tag {
      margin-top: 16rpx;
    }
  }

  .right {
    padding: 52rpx 0 18rpx 0;

    .name {
      font-size: $uni-font-size-lg;
      font-weight: $uni-font-weight-bold;
      color: #000000;
      line-height: 44rpx;

      .sex-icon {
        display: inline-block;
        margin-left: 10rpx;
        width: 24rpx;
        height: 24rpx;
        background-image: url("@/static/images/profile/man.png");
        background-size: cover;

        &-man {
          background-image: url("@/static/images/profile/man.png");
        }
        &-woman {
          background-image: url("@/static/images/profile/woman.png");
        }
      }
    }

    .action-btn {
      margin-top: 16rpx;
      padding: 0;
      border-radius: 10rpx;
      border: 2rpx solid #979797;
      color: #000000;
      position: relative;
      display: inline-block;
      background-color: #ffffff;

      &-text {
        font-size: 18rpx;
        font-weight: $uni-font-weight-base;
        line-height: 40rpx;
        margin: 0 5rpx 0 15rpx;

        .icon-arrow-right {
          vertical-align: middle;
          font-size: 26rpx;
          line-height: 40rpx;
          color: #979797;
        }
      }

      &::after {
        border: none;
      }
    }
  }

  .divider {
    width: 416rpx;
    height: 2rpx;
    background-color: #979797;
    margin: 20rpx 0;
  }

  .tasks {
    width: 416rpx;
    display: flex;

    .task {
      flex-shrink: 1;
      width: 100%;

      // &-number {
      //   font-size: 44rpx;
      //   color: #000000;
      //   line-height: 60rpx;
      // }
      &-description {
        font-size: 24rpx;
        color: #000000;
        line-height: 34rpx;
      }
    }
  }
}

.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80rpx;

  &-item {
    width: 672rpx;
    height: 176rpx;
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.5);
    border-radius: 10rpx;
    margin-bottom: 48rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 32rpx 24rpx 42rpx;
    box-sizing: border-box;
    position: relative;

    &-content {
      display: flex;

      &-photo {
        width: 128rpx;
        height: 128rpx;
        border-radius: 100%;
      }

      &-info {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-left: 40rpx;

        &-title {
          font-size: 36rpx;
          font-weight: 400;
          color: #000000;
          line-height: 50rpx;
          margin-bottom: 14rpx;
        }

        &-desc {
          font-size: 20rpx;
          font-weight: 400;
          color: #303133;
          line-height: 28rpx;
        }
      }
    }

    &-badge {
      width: 96rpx;
      height: 32rpx;
      border-radius: 10rpx 10rpx 10rpx 0rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20rpx;
      font-weight: 400;
      line-height: 28rpx;
      position: absolute;
      top: 0;
      right: 0;

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

    &-icon {
      width: 60rpx;
      height: 60rpx;
      background-size: contain;
      background-position: 50% 50%;
      background-repeat: no-repeat;

      &.icon-running {
        background-image: url("@/static/images/icon/clock.png");
      }
      &.icon-complete {
        background-image: url("@/static/images/icon/done.png");
      }
    }
  }
}
</style>
