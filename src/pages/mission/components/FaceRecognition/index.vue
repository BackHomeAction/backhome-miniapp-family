<template>
  <view class="face">
    <u-button
      class="button"
      type="success"
      shadow
      shape="circle"
      custom-style="width: 280rpx;"
      @click="handleClickHistory"
    >
      查看历史结果
    </u-button>
  </view>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import UButton from "@/components/UButton/index.vue";
import { Case } from "@/api/types/models";
import { navigateTo } from "@/utils/helper";

const useUpload = (caseId?: number) => {
  const handleClickHistory = () => {
    navigateTo("/pages/faceRecognitionHistory/index", { id: caseId });
  };

  return {
    handleClickHistory,
  };
};

export default defineComponent({
  components: { UButton },
  props: {
    data: {
      type: Object as PropType<Case>,
      default: null,
    },
  },
  setup(props) {
    return {
      ...useUpload(props.data.id),
    };
  },
});
</script>

<style lang="scss" scoped>
.face {
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-size: 34rpx;
    font-weight: 500;
    color: #000000;
    line-height: 48rpx;
  }

  .photo {
    margin-top: 48rpx;
    width: 432rpx;
    height: 576rpx;

    &-empty {
      background: #d8d8d8;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon-picture {
        color: #959595;
        font-size: 120rpx;
      }
    }
  }

  .actions {
    margin-top: 48rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .button {
      & + .button {
        margin-top: 32rpx;
      }
    }
  }
}
</style>
