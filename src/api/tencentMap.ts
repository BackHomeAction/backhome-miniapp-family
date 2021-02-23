import mapSettings from "@/config/map";
import http from "@/utils/request";

/**
 * 搜索附近位置
 *
 * @param {string} keyword 地点关键词
 * @param {(number | string)} latitude 维度
 * @param {(number | string)} longitude 经度
 * @param {(number | string)} radius 半径（米）
 */
export const searchPlacesNearby = (data: {
  keyword: string;
  latitude: number | string;
  longitude: number | string;
  radius: number | string;
}) => {
  return http.get("https://apis.map.qq.com/ws/place/v1/search", {
    params: {
      boundary: `nearby(${data.latitude},${data.longitude},${data.radius})`,
      page_size: "20",
      page_index: "1",
      keyword: data.keyword,
      orderby: "_distance",
      key: mapSettings.key,
    },
    custom: { noAuth: true, noInterceptor: true },
  });
};
