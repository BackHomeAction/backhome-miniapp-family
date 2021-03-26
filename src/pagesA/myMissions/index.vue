<template>
  <view>
    <u-tabs
      :list="tabList"
      :is-scroll="false"
      :current="currentTab"
      bg-color="#F8F8F8"
      active-color="#000000"
      @change="handleTabChange"
    />

    <view class="list">
      <view
        v-if="currentTab === 0"
        class="list-item"
      >
        <item
          v-for="item in historyMissions"
          :key="item.id"
          :data="item"
        />
        <empty
          v-if="!historyMissions || !historyMissions.length"
          message="您还没有过报案哦"
        />
      </view>
      <view
        v-if="currentTab === 1"
        class="list-item"
      >
        <item
          v-for="item in doingMissions"
          :key="item.id"
          :data="item"
        />
        <empty
          v-if="!doingMissions || !doingMissions.length"
          message="没有进行中的案件"
        />
      </view>
      <view
        v-if="currentTab === 2"
        class="list-item"
      >
        <item
          v-for="item in archivedMissions"
          :key="item.id"
          :data="item"
        />
        <empty
          v-if="!archivedMissions || !archivedMissions.length"
          message="没有已归档的案件"
        />
      </view>
      <view
        v-if="currentTab === 3"
        class="list-item"
      >
        <item
          v-for="item in finishedMissions"
          :key="item.id"
          :data="item"
        />
        <empty
          v-if="!finishedMissions || !finishedMissions.length"
          message="没有已完成的案件"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref } from "vue";
import store from "@/store";
import { ActionTypes } from "@/enums/actionTypes";
import { useStore } from "vuex";
import { Case } from "@/api/types/models";
import Empty from "@/components/Empty/index.vue";
import UTabs from "@/components/UTabs/index.vue";
import Item from "./components/Item/index.vue";

const useTabs = () => {
  const tabList = [
    { name: "全部" },
    { name: "进行中" },
    { name: "已归档" },
    { name: "已完成" },
  ];

  const currentTab = ref(0);

  const handleTabChange = (index: number) => {
    currentTab.value = index;
  };

  return { tabList, currentTab, handleTabChange };
};

const useHistory = () => {
  const store = useStore();

  const historyMissions: ComputedRef<Array<Case>> = computed(() => {
    return store.getters.myAllMissions.reverse();
  });

  const doingMissions = computed(() => {
    return historyMissions.value.filter((item) => item.state === 1);
  });

  const finishedMissions = computed(() => {
    return historyMissions.value.filter((item) => item.state === 2);
  });

  const archivedMissions = computed(() => {
    return historyMissions.value.filter((item) => item.state === 3);
  });

  const canceledMissions = computed(() => {
    return historyMissions.value.filter((item) => item.state === 4);
  });

  return {
    historyMissions,
    doingMissions,
    finishedMissions,
    archivedMissions,
    canceledMissions,
  };
};

export default defineComponent({
  components: { Empty, UTabs, Item },
  setup() {
    return {
      ...useTabs(),
      ...useHistory(),
    };
  },
  onLoad() {
    store.dispatch(ActionTypes.getMyAllMissions);
    store.dispatch(ActionTypes.getMyMissions);
  },
});
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20rpx;
  box-sizing: border-box;

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
