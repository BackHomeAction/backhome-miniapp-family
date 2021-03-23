<template>
  <view
    v-if="currentMissionInfo"
    class="map"
  >
    <tabs @select="handleTabClick" />
    
    <map
      id="map"
      class="map__content"
      enable-3D
      enable-traffic
      show-location
      show-scale
      :min-scale="12"
      :max-scale="18"
      :subkey="mapSettings.key"
      :circles="circles"
      :markers="markers"
      @updated="handleMapUpdated"
      @regionchange="handleRegionChange"
      @markertap="handleMarkerClick"
    />
    
    <view class="map-bottom">
      <man
        :current="currentMissionInfo"
        @show-more-info="handleTabClick('info')"
        @select="handleChangeCase"
      />
    </view>

    <view class="map__control">
      <view
        class="map__control-item map__control-item-location-me"
        :class="{'map__control-item--active': isMapRegionCenterIsCurrentPlace}"
        @click.stop="handleToCurrentPosition"
      />
      <view
        class="map__control-item map__control-item-location-lost"
        :class="{'map__control-item--active': isMapRegionCenterIsLostPlace}"
        @click.stop="handleToLostPosition"
      />
    </view>

    <view class="map__util map__util-help" />

    <!-- popups below -->
    <place-info-modal
      v-model:value="showPlaceInfoModal"
      :place-data="placeInfoData"
    />
    <!-- <volunteer-info-modal
      v-model:value="showVolunteerInfoModal"
      :volunteer-data="volunteerInfoData"
    /> -->
    <timeout-modal
      v-model:value="showTimeoutModal"
    />

    <u-popup
      v-model:value="showPopup"
      mode="bottom"
      height="80%"
      :border-radius="20"
    >
      <view class="popup-wrapper safe-area-inset-bottom">
        <mission-information
          v-show="popupName === 'info'"
          :data="currentMissionInfo"
        />
        <view
          v-if="popupName === 'info'"
          class="action"
        >
          <u-button
            type="success"
            shadow
            shape="circle"
            @click="handleClickEdit"
          >
            修改信息
          </u-button>
        </view>
        <chat
          v-show="popupName === 'chat'"
          :show="showPopup && popupName === 'chat'"
          :data="currentMissionInfo"
        />
        <face-recognition
          v-show="popupName === 'face'"
          :data="currentMissionInfo"
        />
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  Ref,
  ref,
  reactive,
} from "vue";
import mapSettings from "@/config/map";
import { searchPlacesNearby } from "@/api/tencentMap";
import PlaceInfoModal from "./components/PlaceInfoModal/index.vue";
import { IPlaceInfo } from "@/types/placeInfo";
import { useStore } from "vuex";
import { ICurrentMission } from "@/store/types";
import store from "@/store";
import { ActionTypes } from "@/enums/actionTypes";
import {
  hideLoading,
  navigateBack,
  navigateTo,
  showLoading,
  showModal,
  showModalError,
  showToast,
} from "@/utils/helper";
import { Case, Volunteer } from "@/api/types/models";
import { SocketStateTypes } from "@/enums/socketStateTypes";
import { MutationTypes } from "@/enums/mutationTypes";
import Tabs from "./components/Tabs/index.vue";
import UPopup from "@/components/UPopup/index.vue";
import MissionInformation from "@/components/MissionInformation/index.vue";
import FaceRecognition from "./components/FaceRecognition/index.vue";
import Chat from "./components/Chat/index.vue";
import Man from "./components/Man/index.vue";
import { checkoutGroup, resetGroup } from "@/service/timService";
// import VolunteerInfoModal from "./components/VolunteerInfoModal/index.vue";
import UButton from "@/components/UButton/index.vue";
import TimeoutModal from "./components/TimeoutModal/index.vue";
import dayjs from "@/utils/dayjs";

let mapContext: any;

const POLICE_STATION_MARKER_SIZE = 30;
const POLICE_STATION_MARKER_ID_START = 20000000;
const LOST_PLACE_MARKER_SIZE = 35;
const LOST_PLACE_MARKER_ID_START = 30000000;
const OFFEN_PLACE_MARKER_SIZE = 35;
const OFFEN_PLACE_MARKER_ID_START = 40000000;
const VOLUNTEER_MARKER_SIZE = 50;
const VOLUNTEER_MARKER_ID_START = 50000000;

const caseId = ref(0); // 案件 ID

const showTimeoutModal = ref(false); // 是否展示

// 用于比对经纬度（舍弃部分精度）
function locationCompare(left: number, right: number) {
  return Math.abs(left - right) < 0.0001;
}

const useMap = () => {
  const store = useStore();
  mapContext = uni.createMapContext("map");

  // 地图的视区中心
  const mapRegion = reactive({
    latitude: 0,
    longitude: 0,
  });
  // 视区中心是否为当前位置
  const isMapRegionCenterIsCurrentPlace = computed(() => {
    if (
      !mapRegion.latitude ||
      !mapRegion.longitude ||
      !store.getters.location?.latitude ||
      !store.getters.location?.longitude
    ) {
      return false;
    }

    return (
      locationCompare(mapRegion.latitude, store.getters.location.latitude) &&
      locationCompare(mapRegion.longitude, store.getters.location.longitude)
    );
  });
  // 视区中心是否为走失位置
  const isMapRegionCenterIsLostPlace = computed(() => {
    if (
      !mapRegion.latitude ||
      !mapRegion.longitude ||
      !currentMissionInfo.value?.latitude ||
      !currentMissionInfo.value?.longitude
    ) {
      return false;
    }

    return (
      locationCompare(mapRegion.latitude, currentMissionInfo.value.latitude) &&
      locationCompare(mapRegion.longitude, currentMissionInfo.value.longitude)
    );
  });

  // 这个案件
  const currentMission: ComputedRef<ICurrentMission> = computed(() => {
    return store.getters.currentMission;
  });
  // 这个案件的案件信息
  const currentMissionInfo = computed(() => {
    return currentMission.value.missionInfo;
  });
  // 派出所位置
  const policeStations: Ref<Array<any>> = ref([]);
  // 老人常去地点
  const offenPlaces = computed(() => {
    return currentMissionInfo.value?.oldMan?.offerPlace
      ? JSON.parse(currentMissionInfo.value?.oldMan?.offerPlace)
      : [];
  });
  // 志愿者列表
  const volunteers: ComputedRef<Array<Volunteer>> = computed(() => {
    return currentMission.value.teamMembers;
  });
  // 在线志愿者列表
  const onlineVolunteers: ComputedRef<Array<Volunteer>> = computed(() => {
    return currentMission.value.onlineTeamMembers;
  });

  // 老人走失位置
  const lostPlace = computed(() => {
    return {
      name: currentMissionInfo.value?.place
        ? currentMissionInfo.value?.place
        : "",
      latitude: currentMissionInfo.value?.latitude
        ? currentMissionInfo.value?.latitude
        : 0,
      longitude: currentMissionInfo.value?.longitude
        ? currentMissionInfo.value?.longitude
        : 0,
      address: currentMissionInfo.value?.address
        ? currentMissionInfo.value?.address
        : "",
      province: currentMissionInfo.value?.province
        ? currentMissionInfo.value?.province
        : "",
      city: currentMissionInfo.value?.city
        ? currentMissionInfo.value?.city
        : "",
      district: currentMissionInfo.value?.district
        ? currentMissionInfo.value?.district
        : "",
    };
  });
  // 搜索圆域
  const circles = computed(() => {
    return [
      {
        latitude: lostPlace.value?.latitude,
        longitude: lostPlace.value?.longitude,
        radius: 5000,
        strokeWidth: 2,
        color: "#0099ff",
        fillColor: "#00448015",
      },
    ];
  });
  // 地图渲染事件
  const handleMapUpdated = async () => {
    console.info("map updated");
  };
  // 设置视野中心为自己的位置
  const handleToCurrentPosition = () => {
    mapContext.moveToLocation();
  };
  // 设置视野中心为走失位置
  const handleToLostPosition = () => {
    mapContext.moveToLocation({
      longitude: lostPlace.value.longitude,
      latitude: lostPlace.value.latitude,
    });
  };
  // 搜索附近派出所
  const searchPoliceStationsNearby = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const res = await searchPlacesNearby({
        keyword: "派出所",
        latitude,
        longitude,
        radius: 5000,
      });
      policeStations.value = res.data.data;
    } catch (e) {
      console.log(e);
    }
  };
  // 视野区域变化事件
  const handleRegionChange = (e: any) => {
    console.debug(e);
    if (e.type === "end") {
      searchPoliceStationsNearby(
        e.detail.centerLocation.latitude,
        e.detail.centerLocation.longitude
      );
      mapRegion.latitude = e.detail.centerLocation.latitude;
      mapRegion.longitude = e.detail.centerLocation.longitude;
    }
  };
  // 动态计算 markers
  const markers = computed(() => {
    let res: any[] = [];
    // 加入走失地点
    res = res.concat([
      {
        id: LOST_PLACE_MARKER_ID_START,
        latitude: lostPlace.value.latitude,
        longitude: lostPlace.value.longitude,
        title: lostPlace.value.name,
        zIndex: 100,
        iconPath: "/static/images/map/lost_place.png",
        width: LOST_PLACE_MARKER_SIZE,
        height: LOST_PLACE_MARKER_SIZE,
        anchor: {
          x: 0.5,
          y: 1,
        },
      },
    ]);
    // 加入派出所
    res = res.concat(
      policeStations.value.map((ele: any, index: number) => {
        return {
          id: POLICE_STATION_MARKER_ID_START + index,
          latitude: ele.location.lat,
          longitude: ele.location.lng,
          title: ele.title,
          zIndex: 1,
          iconPath: "/static/images/map/police_station.png",
          width: POLICE_STATION_MARKER_SIZE,
          height: POLICE_STATION_MARKER_SIZE,
          anchor: {
            x: 0.5,
            y: 1,
          },
        };
      })
    );
    // 加入老人常去地点
    res = res.concat(
      offenPlaces.value.map((ele: any, index: number) => {
        return {
          id: OFFEN_PLACE_MARKER_ID_START + index,
          latitude: ele.latitude,
          longitude: ele.longitude,
          title: ele.name,
          zIndex: 10,
          iconPath: "/static/images/map/offen_place.png",
          width: OFFEN_PLACE_MARKER_SIZE,
          height: OFFEN_PLACE_MARKER_SIZE,
          anchor: {
            x: 0.5,
            y: 1,
          },
        };
      })
    );
    // 加入志愿者
    res = res.concat(
      onlineVolunteers.value.map((ele, index: number) => {
        return {
          id: VOLUNTEER_MARKER_ID_START + index,
          latitude: ele.latitude,
          longitude: ele.longitude,
          title: ele.volunteerInformation?.name,
          zIndex: 5,
          iconPath: ele.avatarUrl
            ? `https://fwwb2020-fc-aliyun.tgucsdn.com/volunteer_avatar/get?url=${ele.avatarUrl}`
            : "",
          width: VOLUNTEER_MARKER_SIZE,
          height: VOLUNTEER_MARKER_SIZE,
          anchor: {
            x: 0.5,
            y: 1,
          },
        };
      })
    );
    console.debug(res);
    return res;
  });

  const showPlaceInfoModal = ref(false); // 是否展示地点信息弹框
  const placeInfoData: Ref<null | IPlaceInfo> = ref(null); // 地点信息数据
  const showVolunteerInfoModal = ref(false); // 是否展示志愿者信息弹框
  const volunteerInfoData: Ref<null | Volunteer> = ref(null); // 志愿者信息数据

  // markar 点击事件
  const handleMarkerClick = (e: any) => {
    const markerId = e.detail.markerId;
    // 判断是否为派出所
    if (
      markerId >= POLICE_STATION_MARKER_ID_START &&
      markerId < POLICE_STATION_MARKER_ID_START + 10000000
    ) {
      const index = markerId % POLICE_STATION_MARKER_ID_START;
      const placeData = policeStations.value[index];
      placeInfoData.value = {
        address: placeData.address,
        location: {
          lat: placeData.location.lat,
          lng: placeData.location.lng,
        },
        tel: placeData.tel,
        title: placeData.title,
        type: "policeStation",
      };
      console.log(placeInfoData.value);
      showPlaceInfoModal.value = true;
    }
    // 判断是否为老人常去地点
    if (
      markerId >= OFFEN_PLACE_MARKER_ID_START &&
      markerId < OFFEN_PLACE_MARKER_ID_START + 10000000
    ) {
      const index = markerId % OFFEN_PLACE_MARKER_ID_START;
      const placeData = offenPlaces.value[index];
      placeInfoData.value = {
        address: placeData.address,
        location: {
          lat: placeData.latitude,
          lng: placeData.longitude,
        },
        title: placeData.name,
        type: "offenPlace",
      };
      console.log(placeInfoData.value);
      showPlaceInfoModal.value = true;
    }
    // 判断是否为老人走失地点
    if (
      markerId >= LOST_PLACE_MARKER_ID_START &&
      markerId < LOST_PLACE_MARKER_ID_START + 10000000
    ) {
      const placeData = lostPlace.value;
      placeInfoData.value = {
        address: placeData.address,
        location: {
          lat: placeData.latitude,
          lng: placeData.longitude,
        },
        title: placeData.name,
        type: "lostPlace",
      };
      console.log(placeInfoData.value);
      showPlaceInfoModal.value = true;
    }
    // 判断是否为在线的志愿者
    if (
      markerId >= VOLUNTEER_MARKER_ID_START &&
      markerId < VOLUNTEER_MARKER_ID_START + 10000000
    ) {
      const index = markerId % VOLUNTEER_MARKER_ID_START;
      volunteerInfoData.value = onlineVolunteers.value[index];
      showVolunteerInfoModal.value = true;
    }
  };

  // 修改任务信息
  const handleClickEdit = () => {
    if (!currentMissionInfo.value?.oldMan?.id) return;

    navigateTo("/pages/editOldMan/index", {
      id: currentMissionInfo.value.oldMan.id,
    });
  };

  return {
    handleMapUpdated,
    handleToCurrentPosition,
    handleToLostPosition,
    circles,
    markers,
    handleRegionChange,
    handleMarkerClick,
    showPlaceInfoModal,
    placeInfoData,
    currentMissionInfo,
    isMapRegionCenterIsCurrentPlace,
    isMapRegionCenterIsLostPlace,
    showVolunteerInfoModal,
    volunteerInfoData,
    handleClickEdit,
  };
};

const usePopup = () => {
  const currentMission: ComputedRef<ICurrentMission> = computed(() => {
    return store.getters.currentMission;
  });

  const showPopup = ref(false);
  const popupName: Ref<"info" | "chat" | "face"> = ref("info");

  const handleTabClick = (name: "info" | "chat" | "face") => {
    if (!currentMission.value.missionInfo?.oldMan?.id) return;
    // 点击人脸识别按钮，直接跳到人脸识别历史记录
    if (name.localeCompare("face") === 0) {
      navigateTo("/pages/faceRecognitionHistory/index", {
        oldManId: currentMission.value.missionInfo?.oldMan?.id,
      });
      return;
    }
    popupName.value = name;
    showPopup.value = true;
  };

  return { showPopup, popupName, handleTabClick };
};

/**
 * 案件订阅回调处理
 *
 * @param {string} res
 */
const newCaseInfoCallback = async (res: any) => {
  const data = JSON.parse(res.body);
  console.log("Websocket case subscription callback data:", data);
  if (data.status === SocketStateTypes.MISSION_INFO_CHANGED) {
    await store.dispatch(ActionTypes.initCurrentMission, {
      id: caseId.value,
    });
    showModal("提示", "案件信息发生变化，请您留意！");
  } else if (data.status === SocketStateTypes.VOLUNTEER_LOCATION_CHANGED) {
    store.commit(MutationTypes.UPDATE_MISSION_VOLUNTEER_LOCATION, data.data);
  } else if (data.status === SocketStateTypes.VOLUNTEER_OFFLINE) {
    store.commit(MutationTypes.UPDATE_MISSION_VOLUNTEER_OFFLINE, data.data);
  } else if (data.status === SocketStateTypes.MISSION_TIMEOUT) {
    await showModal("提示", "案件已超时！");
    navigateBack();
  } else if (
    data.status === SocketStateTypes.VOLUNTEER_JOIN_MISSION ||
    data.status === SocketStateTypes.VOLUNTEER_QUIT_MISSION
  ) {
    await store.dispatch(ActionTypes.getCurrentMissionMembers, {
      id: caseId.value,
    });
  } else if (data.status === SocketStateTypes.FACE_PASS) {
    showToast("人脸比对成功，等待家属确认");
    store.dispatch(ActionTypes.getCurrentMissionFaceRecognitionHistories, {
      id: caseId.value,
    });
  } else if (data.status === SocketStateTypes.MISSION_COMPLETED) {
    await showModal("提示", "案件已成功结案！");
    navigateBack();
  } else if (data.status === SocketStateTypes.MISSION_CANCELED) {
    await showModal("提示", "案件已被关闭！");
    navigateBack();
  }
};

// 初始化任务
const init = async () => {
  uni.showNavigationBarLoading();
  // 初始化 store 数据
  try {
    await store.dispatch(ActionTypes.initCurrentMission, {
      id: caseId.value,
    });
    // 如果案件开启时间 >24h，就提示家属报警
    const startTime = store.getters.currentMission.missionInfo.startTime;
    if (dayjs().diff(startTime, "day", true) > 1) {
      showTimeoutModal.value = true;
    }
    // 设置视野中心为走失位置
    mapContext.moveToLocation({
      longitude: store.getters.currentMission.missionInfo.longitude,
      latitude: store.getters.currentMission.missionInfo.latitude,
    });
    // 启动 socket 订阅
    store.getters.ws.subscribe(`/case/${caseId.value}`, newCaseInfoCallback);
    // 切换当前 TIM 群组到该任务
    checkoutGroup(caseId.value);
  } catch (e) {
    console.log(e);
    showModalError("加载任务信息失败");
    navigateBack();
  }
  uni.hideNavigationBarLoading();
};

export default defineComponent({
  components: {
    PlaceInfoModal,
    Tabs,
    UPopup,
    MissionInformation,
    FaceRecognition,
    Chat,
    Man,
    UButton,
    // VolunteerInfoModal,
    TimeoutModal,
  },
  setup() {
    const handleChangeCase = async (item: Case) => {
      if (!item.id) return;

      caseId.value = item.id;
      showLoading("切换中");
      await init();
      hideLoading();
    };

    return {
      ...useMap(),
      mapSettings,
      ...usePopup(),
      handleChangeCase,
      showTimeoutModal,
    };
  },
  onLoad(query: { id: string }) {
    caseId.value = parseInt(query.id, 10);
  },
  async onReady() {
    await init();
  },
  onUnload() {
    console.debug("map unload");
    store.dispatch(ActionTypes.clearCurrentMission);
    // 取消 socket 订阅
    store.getters.ws.unsubscribe(`/case/${caseId.value}`);
    // 重置当前 TIM 群组
    resetGroup();
  },
});
</script>

<style lang="scss" scoped>
.map {
  width: 750rpx;
  height: 100vh;
  position: relative;

  &__content {
    width: 750rpx;
    height: 100vh;
  }

  &-bottom {
    width: 100vw;
    position: fixed;
    bottom: calc(16rpx + env(safe-area-inset-bottom));
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  &__control {
    position: fixed;
    left: 17rpx;
    bottom: calc(16rpx + 250rpx + 30rpx + env(safe-area-inset-bottom));
    width: 80rpx;
    height: 160rpx;
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.5);
    border-radius: 10rpx;
    padding: 10rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &-item {
      width: 60rpx;
      height: 60rpx;
      background-size: cover;
      position: relative;

      &-location-me {
        background-image: url("@/static/images/map/control_place_me.png");

        &.map__control-item--active {
          background-image: url("@/static/images/map/control_place_me_active.png");
        }
      }

      &-location-lost {
        background-image: url("@/static/images/map/control_place_lost.png");

        &.map__control-item--active {
          background-image: url("@/static/images/map/control_place_lost_active.png");
        }
      }

      & + & {
        margin-top: 20rpx;

        &::after {
          position: absolute;
          /* #ifndef APP-NVUE */
          box-sizing: border-box;
          content: " ";
          pointer-events: none;
          border-top: 1px solid #e4e4e4;
          /* #endif */
          right: 0;
          left: 0;
          top: -10rpx;
          transform: scaleY(0.5);
          margin: 0 -4rpx;
        }
      }
    }
  }

  &__util {
    position: fixed;
    right: 17rpx;
    bottom: calc(16rpx + 250rpx + 30rpx + env(safe-area-inset-bottom));
    width: 48rpx;
    height: 48rpx;
    opacity: 0.8;

    & + & {
      margin-top: 24rpx;
    }

    &-help {
      background: url("@/static/images/map/help.png");
      background-size: cover;
    }
  }
}

.popup-wrapper {
  padding-top: 30rpx;
}

.action {
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
}
</style>
