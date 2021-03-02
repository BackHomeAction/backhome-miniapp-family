<template>
  <view class="body">
    <!-- TODO: 样式设计 -->
    <view class="text">
      请在弹出窗口中允许订阅，并勾选
    </view>
    <view class="text">
      “总是保持以上选择”
    </view>

    <u-button
      class="button"
      type="primary"
      shape="circle"
      round
      shadow
      @click="handleClickButton"
    >
      设置订阅
    </u-button>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UButton from "@/components/UButton/index.vue";
import { navigateBack, showModalError } from "@/utils/helper";
import templateMessageSettings from "@/config/templateMessage";

export default defineComponent({
  components: { UButton },
  setup() {
    const handleClickButton = () => {
      uni.requestSubscribeMessage({
        tmplIds: templateMessageSettings.tmplIds,
        success(res) {
          const status =
            // @ts-ignore
            res[templateMessageSettings.tmplIds[0]] === "accept" ? true : false;
          if (status) {
            navigateBack();
          } else {
            showModalError("授权失败");
          }
        },
        fail() {
          showModalError("授权失败");
        },
      });
    };

    return { handleClickButton };
  },
});
</script>

<style lang="scss" scoped>
.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50rpx;

  .button {
    margin-top: 80rpx;
  }
}
</style>
