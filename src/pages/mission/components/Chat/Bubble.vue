<!-- TODO: 还须处理系统消息、管理员消息、家属消息 -->
<template>
  <view
    v-if="data"
    class="body"
    :class="{'body-send': data.flow === 'out', 'body-receive': data.flow === 'in'}"
  >
    <view class="avatar">
      <image
        class="avatar-image"
        mode="aspectFill"
        :src="getUserAvatar()"
        @tap.stop="handleClickAvatar"
      />
    </view>
    <view class="content">
      <view class="info">
        <view
          v-if="getUserRole() === 1"
          class="info-tag tag-volunteer"
        >
          志愿者
        </view>
        <view
          v-if="getUserRole() === 2"
          class="info-tag tag-family"
        >
          家属
        </view>
        <view
          v-if="getUserRole() === 3"
          class="info-tag tag-admin"
        >
          管理员
        </view>
        <view class="info-name">
          {{ data.nick }}
        </view>
      </view>
      <view>
        <view
          v-if="data.type === TIM.TYPES.MSG_TEXT"
          class="bubble bubble-text"
        >
          {{ data.payload.text }}
        </view>
        <image
          v-if="data.type === TIM.TYPES.MSG_IMAGE"
          class="bubble bubble-image"
          :src="data.payload.imageInfoArray[1].url"
          :style="{width: data.payload.imageInfoArray[1].width <= 200 ? `${data.payload.imageInfoArray[1].width}px` : '400rpx'}"
          mode="widthFix"
          @click="handlePreviewImage(data.payload.imageInfoArray[0].url)"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TIM from "tim-wx-sdk";
import { useStore } from "vuex";

const handlePreviewImage = (path: string) => {
  uni.previewImage({
    urls: [path],
  });
};

export default defineComponent({
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  emits: ["click-avatar"],
  setup(props, { emit }) {
    const store = useStore();

    // 获取用户身份
    const getUserRole = () => {
      const imUserID = props.data.from;

      if (imUserID.indexOf("volunteer") !== -1) {
        return 1;
      } else if (imUserID.indexOf("family") !== -1) {
        return 2;
      } else if (imUserID.indexOf("admin") !== -1) {
        return 3;
      }
    };

    // 获取用户 ID
    const getUserID = () => {
      const imUserID = props.data.from;
      const idStr = imUserID.match(/_(.*)/)[1];

      return parseInt(idStr, 10);
    };

    // 获取用户头像
    const getUserAvatar = () => {
      const role = getUserRole();

      if (role === 1) {
        const users = store.getters.currentMission.teamMembers;
        for (let i = 0; i < users.length; i++) {
          if (users[i].id === getUserID()) {
            return users[i].avatarUrl;
          }
        }
        return 1;
      }
    };

    // 获取用户信息
    const getUserInfo = () => {
      const role = getUserRole();

      if (role === 1) {
        const users = store.getters.currentMission.teamMembers;
        for (let i = 0; i < users.length; i++) {
          if (users[i].id === getUserID()) {
            return users[i];
          }
        }
        return 1;
      }
    };

    // 点击头像事件
    const handleClickAvatar = () => {
      emit("click-avatar", getUserInfo());
    };

    return {
      TIM,
      handlePreviewImage,
      getUserRole,
      getUserID,
      getUserAvatar,
      handleClickAvatar,
    };
  },
});
</script>

<style lang="scss" scoped>
.body {
  display: flex;
  align-items: flex-start;
  margin-bottom: 36rpx;
  padding: 0 48rpx;

  .avatar {
    &-image {
      margin-top: 16rpx;
      width: 88rpx;
      height: 88rpx;
      border-radius: 100%;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    max-width: 450rpx;

    .info {
      display: flex;
      align-items: center;

      &-tag {
        box-sizing: border-box;
        padding: 0 16rpx;
        height: 32rpx;
        border-radius: 16rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16rpx;
        font-weight: 400;
        color: #ffffff;

        &.tag-admin {
          background: #ffd937;
        }

        &.tag-volunteer {
          background: #3de0a2;
        }

        &.tag-family {
          background: #f6eec9;
        }
      }

      &-name {
        margin-left: 8rpx;
        font-size: 20rpx;
        color: #000000;
        line-height: 28rpx;
      }
    }

    .bubble {
      margin-top: 16rpx;
      display: inline-block;

      &-text {
        padding: 20rpx 28rpx;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 40rpx;
        word-break: break-all;
      }
    }
  }
}

.body-send {
  flex-direction: row-reverse;

  .avatar {
    padding-left: 24rpx;
  }

  .content {
    align-items: flex-end;

    .bubble {
      border-radius: 30rpx 0 30rpx 30rpx;

      &-text {
        background: #409eff;
        color: #ffffff;
      }
    }
  }
}

.body-receive {
  .avatar {
    padding-right: 24rpx;
  }

  .content {
    .bubble {
      border-radius: 0rpx 30rpx 30rpx 30rpx;

      &-text {
        background: #f8f8f8;
        color: #000000;
      }
    }
  }
}
</style>
