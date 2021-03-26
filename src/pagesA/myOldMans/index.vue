<template>
  <view class="content">
    <item
      v-for="item in oldmanList"
      :key="item.id"
      :data="item"
      @tap="handleClickItem(item.id ? item.id : 0)"
    />
    <add />
  </view>
</template>

<script lang="ts">
import { OldMan } from "@/api/types/models";
import { computed, ComputedRef, defineComponent } from "vue";
import Item from "./components/Item/index.vue";
import Add from "./components/Add/index.vue";
import { useStore } from "vuex";
import { navigateTo } from "@/utils/helper";
import { ActionTypes } from "@/enums/actionTypes";
import store from "@/store";

export default defineComponent({
  components: { Item, Add },
  setup() {
    const store = useStore();

    const handleClickItem = (id: number) => {
      navigateTo("/pagesA/editOldMan/index", { id });
    };

    const oldmanList: ComputedRef<Array<OldMan>> = computed(() => {
      return store.getters.oldmanList;
    });

    return {
      oldmanList,
      handleClickItem,
    };
  },
  onLoad() {
    store.dispatch(ActionTypes.getOldmanList);
  },
});
</script>

<style lang="scss" scoped>
.content {
  box-sizing: border-box;
  padding: 36rpx 36rpx 0 36rpx;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
