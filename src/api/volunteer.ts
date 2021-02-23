import http from "@/utils/request";
import { JavaList, ResponseData, VolunteerInformation } from "./types/models";

/**
 * 查询志愿者列表
 *
 * @param {{
 *   province?: string;
 *   city?: string;
 *   district?: string;
 *   id?: number;
 * }} params
 * @return {*}
 */
export const requestGetVolunteers = (params: {
  province?: string;
  city?: string;
  district?: string;
}) => {
  return http.request<ResponseData<JavaList<VolunteerInformation>>>({
    url: `volunteer/information/all`,
    method: "GET",
    params: params,
    data: {},
  });
};

/**
 * 通过 ID 查询志愿者信息
 *
 * @param {{ informationId: number }} params
 * @return {*}
 */
export const requestGetVolunteerByID = (params: { informationId: number }) => {
  return http.request<ResponseData<VolunteerInformation>>({
    url: `volunteer/information/id`,
    method: "GET",
    params: params,
    data: {},
  });
};

/**
 * 获取志愿者总数
 *
 * @return {*}
 */
export const requestGetVolunteerNumber = () => {
  return http.request<ResponseData<number>>({
    url: `volunteer/number`,
    method: "GET",
    params: {},
    data: {},
    custom: { noAuth: true },
  });
};

/**
 * 获取在线志愿者数
 *
 * @return {*}
 */
export const requestGetOnlineVolunteerNumber = () => {
  return http.request<ResponseData<number>>({
    url: `volunteer/onlineNumber`,
    method: "GET",
    params: {},
    data: {},
    custom: { noAuth: true },
  });
};
