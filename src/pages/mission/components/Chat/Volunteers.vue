<template>
  <view>
    <view class="volunteers">
      <view
        v-for="item in teamMembers"
        :key="item.id"
        class="item"
      >
        <image
          :src="item.avatarUrl"
          class="item-image"
          @tap="handleClickVolunteer(item)"
        />
        <view
          v-if="checkOnline(item)"
          class="item-badge item-badge-online"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, PropType } from "vue";
import { Case, Volunteer } from "@/api/types/models";
import { useStore } from "vuex";

const useList = () => {
  const store = useStore();

  const teamMembers: ComputedRef<Array<Volunteer>> = computed(() => {
    return store.getters.currentMission.teamMembers;
  });

  const onlineTeamMembers: ComputedRef<Array<Volunteer>> = computed(() => {
    return store.getters.currentMission.onlineTeamMembers;
  });

  const checkOnline = (volunteer: Volunteer) => {
    return onlineTeamMembers.value.some((item) => item.id === volunteer.id);
  };

  return { teamMembers, checkOnline };
};

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<Case>,
      default: null,
    },
  },
  emits: ["selected"],
  setup(props, { emit }) {
    const handleClickVolunteer = (item: Volunteer) => {
      emit("selected", item);
    };
    return { ...useList(), handleClickVolunteer };
  },
});
</script>

<style lang="scss" scoped>
.volunteers {
  box-sizing: border-box;
  width: 750rpx;
  height: 76rpx;
  background: #f8f8f8;
  padding: 0 68rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .item {
    width: 60rpx;
    height: 60rpx;
    position: relative;

    &-image {
      width: 60rpx;
      height: 60rpx;
      border-radius: 100%;
    }

    &-badge {
      width: 16rpx;
      height: 16rpx;
      border-radius: 100%;
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: 1;

      &-online {
        background-color: #73fe46;
      }
    }
  }
}
</style>
