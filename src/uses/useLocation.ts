import { computed } from "vue";
import { useStore } from "vuex";
import gcoord from "gcoord";

export const useLocation = () => {
  const store = useStore();

  const currentLocation = computed(() => {
    return store.getters.location;
  });

  // const currentLocationGCJ02 = computed(() => {
  //   const res = <[number, number]>(
  //     transformWGS84ToGCJ02([
  //       currentLocationWGS84.value.longitude,
  //       currentLocationWGS84.value.latitude,
  //     ])
  //   );
  //   return {
  //     longitude: res[0],
  //     latitude: res[1],
  //   };
  // });

  const transformWGS84ToGCJ02 = (location: [number, number]) => {
    return gcoord.transform(
      location, // 经纬度坐标
      gcoord.WGS84, // 当前坐标系
      gcoord.GCJ02 // 目标坐标系
    );
  };

  const transformGCJ02ToWGS84 = (location: [number, number]) => {
    return gcoord.transform(
      location, // 经纬度坐标
      gcoord.GCJ02, // 当前坐标系
      gcoord.WGS84 // 目标坐标系
    );
  };

  const getDistance = (
    location1: [number, number],
    location2: [number, number],
    unit: "m" | "km" = "km",
    isLocation1GCJ02 = false,
    isLocation2GCJ02 = false
  ) => {
    // console.log(location1, location2);

    const toRadians = (d: number) => {
      return (d * Math.PI) / 180;
    };

    let lng1 = 0,
      lng2 = 0,
      lat1 = 0,
      lat2 = 0;

    if (isLocation1GCJ02) {
      // 如果 location1 是 GCJ02 坐标系
      const res = <[number, number]>transformGCJ02ToWGS84(location1);
      lng1 = res[0];
      lat1 = res[1];
    } else {
      lng1 = location1[0];
      lat1 = location1[1];
    }
    if (isLocation2GCJ02) {
      // 如果 location2 是 GCJ02 坐标系
      const res = <[number, number]>transformGCJ02ToWGS84(location2);
      lng2 = res[0];
      lat2 = res[1];
    } else {
      lng2 = location2[0];
      lat2 = location2[1];
    }

    const radLat1 = toRadians(lat1);
    const radLat2 = toRadians(lat2);
    const deltaLat = radLat1 - radLat2;
    const deltaLng = toRadians(lng1) - toRadians(lng2);
    let dis =
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(deltaLat / 2), 2) +
            Math.cos(radLat1) *
              Math.cos(radLat2) *
              Math.pow(Math.sin(deltaLng / 2), 2)
        )
      );

    if (unit === "km") {
      dis = dis / 1000;
    }

    // console.log(dis * 6378137);

    return dis * 6378137;
  };

  const getDistanceFromMe = (
    location: [number, number],
    unit: "m" | "km" = "km",
    isGCJ02 = false
  ) => {
    return getDistance(
      location,
      [currentLocation.value.longitude, currentLocation.value.latitude],
      unit,
      isGCJ02
    );
  };

  return {
    currentLocation,
    // currentLocationGCJ02,
    transformWGS84ToGCJ02,
    transformGCJ02ToWGS84,
    getDistance,
    getDistanceFromMe,
  };
};
