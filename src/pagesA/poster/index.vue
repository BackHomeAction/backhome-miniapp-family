<template>
  <view>
    <painter
      style="position:fixed; top:-9999rpx"
      :palette="data"
      use2-d
      @imgOK="onImgOK"
      @imgErr="onImgErr"
    />
    <scroll-view
      v-if="!isLoading"
      class="poster"
      scroll-y
      enable-flex
    >
      <image
        v-if="posterUrl"
        :src="posterUrl"
        class="poster__image"
      />
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { requestGetCases } from "@/api/mission";
import { Case } from "@/api/types/models";
import {
  hideLoading,
  navigateBack,
  showLoading,
  showModalError,
} from "@/utils/helper";
import { computed, defineComponent, Ref, ref } from "vue";

const posterUrl = ref("");
const isLoading = ref(true);
const caseInfo: Ref<null | Case> = ref(null);

const usePoster = () => {
  const startTop = 50;
  const gapSize = 70;
  const common = {
    left: "20rpx",
    fontSize: "60rpx",
  };

  const data = computed(() => {
    return {
      background: "#eee",
      width: "900px",
      height: "1600px",
      borderRadius: "40px",
      views: [
        // 老人照片
        {
          type: "image",
          url: caseInfo.value?.oldMan?.identificationPhoto,
          css: {
            width: "300px",
            height: "400px",
            top: "150px",
            left: "100px",
            borderRadius: "20px",
          },
        },
        // {
        //   type: "text",
        //   text: caseInfo.value?.oldMan?.name,
        //   css: [
        //     {
        //       top: `${startTop + 4 * gapSize}rpx`,
        //       fontWeight: "bold",
        //     },
        //     common,
        //   ],
        // },
      ],
    };
  });

  const onImgOK = (e: any) => {
    console.log(e);
    posterUrl.value = e.detail.path;
    isLoading.value = false;
  };

  const onImgErr = async (e: any) => {
    console.log(e);
    await showModalError("海报生成失败");
    navigateBack();
  };

  return { data, onImgOK, onImgErr };
};

const getCaseInfo = async (id: number) => {
  showLoading();
  try {
    const res = await requestGetCases({ id });
    if (!res.data?.data || !res.data.data.length) {
      throw new Error();
    }
    console.log(res.data.data[0]);
    caseInfo.value = res.data.data[0];
  } catch (e) {
    console.log(e);
  }
  hideLoading();
};

export default defineComponent({
  setup() {
    return { ...usePoster(), posterUrl, isLoading, caseInfo };
  },
  onLoad(params: { id: string }) {
    getCaseInfo(parseInt(params.id, 10));
  },
});
</script>

<style lang="scss" scoped>
.poster {
  box-sizing: border-box;
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__image {
    width: 675rpx;
    height: 1120rpx;
  }
}
</style>
