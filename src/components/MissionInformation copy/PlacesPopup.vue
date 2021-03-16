<template>
  <view>
    <u-popup
      :value="value"
      custom-class="place-info-popup"
      mode="bottom"
      :border-radius="20"
      @input="handleInput"
    >
      <view class="safe-area-inset-bottom">
        <u-cell-group>
          <u-cell-item
            v-for="(item, index) in data"
            :key="index"
            :title="item.name"
            :label="item.address"
            @click="handleClickPlace(item)"
          />
        </u-cell-group>
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import UPopup from "@/components/UPopup/index.vue";
import UCellGroup from "@/components/UCellGroup/index.vue";
import UCellItem from "@/components/UCellItem/index.vue";

export default defineComponent({
  components: { UPopup, UCellGroup, UCellItem },
  props: {
    data: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["input"],
  setup(props, { emit }) {
    const handleInput = (e: any) => {
      emit("input", e);
    };

    const handleClickPlace = (item: any) => {
      uni.openLocation({
        latitude: item.latitude,
        longitude: item.longitude,
        name: item.name,
        address: item.address,
      });
    };

    return { handleInput, handleClickPlace };
  },
});
</script>
