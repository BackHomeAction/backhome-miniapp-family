import http from "@/utils/request";
import { JavaList, OldMan, ResponseData } from "./types/models";

/**
 * 添加老人
 *
 * @param {OldMan} params
 * @return {*}
 */
export const requestAddOldMan = (params: OldMan) => {
  return http.request<ResponseData<object>>({
    url: `family/oldMan`,
    method: "POST",
    params: {},
    data: params,
  });
};

/**
 * 查询我的老人列表
 *
 * @return {*}
 */
export const requestGetOldMen = () => {
  return http.request<ResponseData<JavaList<OldMan>>>({
    url: `family/oldMan`,
    method: "GET",
    params: {},
    data: {},
  });
};

/**
 * 修改老人
 *
 * @param {OldMan} params
 * @return {*}
 */
export const requestEditOldMan = (params: OldMan) => {
  return http.request<ResponseData<object>>({
    url: `family/oldMan`,
    method: "PUT",
    params: {},
    data: params,
  });
};
