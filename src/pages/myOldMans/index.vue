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
import { defineComponent } from "vue";
import Item from "./components/Item/index.vue";
import Add from "./components/Add/index.vue";

const oldmanList: Array<OldMan> = [];

export default defineComponent({
  components: { Item, Add },
  setup() {
    const handleClickItem = (id: number) => {};

    return {
      oldmanList,
      handleClickItem,
    };
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
