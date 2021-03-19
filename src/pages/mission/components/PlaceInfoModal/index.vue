<template>
  <view class="modal">
    <u-popup
      v-model:value="showModal"
      custom-class="place-info-popup"
      mode="bottom"
      :border-radius="10"
    >
      <view
        v-if="placeData"
        class="wrapper"
      >
        <view class="main">
          <view
            v-if="placeData.type === 'policeStation'"
            class="icon icon-police"
          />
          <view
            v-if="placeData.type === 'lostPlace'"
            class="icon icon-lost"
          />
          <view
            v-if="placeData.type === 'offenPlace'"
            class="icon icon-offen"
          />
          <view class="info">
            <view class="title">
              {{ placeData.title }}
            </view>
            <view class="distance">
              距你 {{ (getDistanceFromMe([placeData.location.lng,placeData.location.lat], "km")).toFixed(1) }} 公里
            </view>
          </view>
        </view>
        <view class="divider" />
        <view class="address">
          {{ placeData.address }}
        </view>
        <view
          v-if="placeData.tel && placeData.tel.length"
          class="phone"
          @click="makePhoneCall(placeData.tel)"
        >
          <uni-icons
            type="phone-filled"
            size="14"
            color="#999"
            class="phone-icon"
          />
          {{ placeData.tel }}
        </view>
        <view class="divider" />
        <view class="action">
          <u-button
            type="func"
            size="medium"
            custom-style="width: 718rpx;"
            @click="handleClickRoutePlan"
          >
            路线
          </u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import UPopup from "@/components/UPopup/index.vue";
import mapSettings from "@/config/map";
import { useLocation } from "@/uses/useLocation";
import { IPlaceInfo } from "@/types/placeInfo";
import UButton from "@/components/UButton/index.vue";

export default defineComponent({
  components: {
    UPopup,
    UButton,
  },
  props: {
    value: {
      type: Boolean,
      require: true,
      default: false,
    },
    placeData: {
      type: Object as PropType<IPlaceInfo>,
      require: true,
      default: null,
    },
  },
  emits: ["input"],
  setup() {
    return { ...useLocation() };
  },
  data() {
    return {
      showModal: false,
    };
  },
  watch: {
    value() {
      this.updateVisible();
    },
    showModal() {
      this.$emit("input", this.showModal);
    },
  },
  methods: {
    updateVisible() {
      this.showModal = this.value;
    },
    makePhoneCall(tel: string) {
      uni.makePhoneCall({
        phoneNumber: tel,
      });
    },
    handleClickRoutePlan() {
      // let plugin = requirePlugin("routePlan");
      let key = mapSettings.key; //使用在腾讯位置服务申请的key
      let referer = mapSettings.appName; //调用插件的app的名称
      let endPoint = JSON.stringify({
        //终点
        name: this.placeData.title,
        latitude: this.placeData.location.lat,
        longitude: this.placeData.location.lng,
      });
      wx.navigateTo({
        url:
          "plugin://routePlan/index?key=" +
          key +
          "&referer=" +
          referer +
          "&endPoint=" +
          endPoint +
          `&themeColor=${mapSettings.color}` +
          "&navigation=1",
      });
    },
    // handleClickNavigation() {
    //   uni.openLocation({
    //     latitude: this.placeData.location.lat,
    //     longitude: this.placeData.location.lng,
    //     name: this.placeData.title,
    //     address: this.placeData.address,
    //   });
    // },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  $gap: ($uni-font-size-sm / 2);

  padding: 16rpx 16rpx 40rpx 16rpx;

  .main {
    display: flex;
    align-items: flex-start;

    .icon {
      width: 81rpx;
      height: 81rpx;
      background-size: cover;

      &.icon-police {
        background-image: url("@/static/images/map/police_station_round.png");
      }
      &.icon-lost {
        background-image: url("@/static/images/map/lost_place_round.png");
      }
      &.icon-offen {
        background-image: url("@/static/images/map/offen_place_round.png");
      }
    }

    .info {
      flex: 1;
      padding: 0 16rpx;

      .title {
        font-size: 32rpx;
        font-weight: 500;
        color: #000000;
        line-height: 44rpx;
      }

      .distance {
        font-size: 24rpx;
        font-weight: 400;
        color: #666666;
        line-height: 34rpx;
      }
    }
  }

  .address {
    font-size: 28rpx;
    font-weight: 400;
    color: #000000;
    line-height: 40rpx;
    padding: 0 16rpx;
  }

  .phone {
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
    line-height: 34rpx;
    padding: 0 16rpx;

    .phone-icon {
      margin-right: $gap;
    }
  }

  .action {
    display: flex;
    justify-content: center;
  }
}

.divider {
  margin: 14rpx 0;
  background-color: #e4e4e4;
  display: block;
  width: 100%;
  height: 1px;
  transform: scale(1, 0.5);
}
</style>
