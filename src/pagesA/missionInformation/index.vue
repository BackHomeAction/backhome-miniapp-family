<template>
  <view class="body safe-area-inset-bottom">
    <mission-information
      v-if="caseInfo"
      :data="caseInfo"
    />
    <view
      v-if="caseInfo"
      class="action"
    >
      <u-button
        type="success"
        shadow
        shape="circle"
        @click="handleClickEnterMission"
      >
        进入搜救
      </u-button>
    </view>
  </view>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  reactive,
  Ref,
  ref,
} from "vue";
import MissionInformation from "@/components/MissionInformation/index.vue";
import { Case } from "@/api/types/models";
import { requestGetCases } from "@/api/mission";
import { useStore } from "vuex";
import UButton from "@/components/UButton/index.vue";
import { navigateTo, showToast } from "@/utils/helper";

const caseInfo: Ref<Case | null> = ref({});

const isLoading = ref(true);

const getCaseInfo = async (id: number) => {
  uni.showNavigationBarLoading();
  isLoading.value = true;
  try {
    const res = await requestGetCases({ id });
    if (res.data.data) {
      caseInfo.value = res.data.data[0];
      console.debug(caseInfo.value);
    }
  } catch (e) {
    console.log(e);
  }
  uni.hideNavigationBarLoading();
  isLoading.value = false;
};

export default defineComponent({
  components: { MissionInformation, UButton },
  setup() {
    const store = useStore();

    // 我加入的任务的 id 集合
    const myMissionIDs: ComputedRef<Set<number>> = computed(() => {
      return store.getters.myMissionIDs;
    });

    const handleClickEnterMission = () => {
      navigateTo("/pagesA/mission/index", { id: caseInfo?.value?.id });
    };

    return {
      caseInfo,
      handleClickEnterMission,
    };
  },
  onLoad(option) {
    if (option && option.id) {
      getCaseInfo(option.id);
    }
  },
});
</script>

<style lang="scss" scoped>
.body {
  padding-bottom: 40rpx;
}

.action {
  margin-top: 30rpx;
  display: flex;
  justify-content: center;
}
</style>
