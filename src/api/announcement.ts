import http from "@/utils/request";
import { Banner, JavaList, Notice, ResponseData } from "./types/models";

/**
 * 获取公告列表
 *
 * @return {*}
 */
export const requestGetAnnouncements = () => {
  return http.request<ResponseData<JavaList<Notice>>>({
    url: `notice`,
    method: "GET",
    params: { roleId: 1, display: 1 },
    data: {},
    custom: { noAuth: true },
  });
};

/**
 * 获取特定公告
 *
 * @param {number} id
 * @return {*}
 */
export const requestGetAnnouncementByID = (id: number) => {
  return http.request<ResponseData<JavaList<Notice>>>({
    url: `notice`,
    method: "GET",
    params: { roleId: 1, id },
    data: {},
    custom: { noAuth: true },
  });
};

/**
 * 获取 Banner 列表
 *
 * @return {*}
 */
export const requestGetBanners = () => {
  return http.request<ResponseData<JavaList<Banner>>>({
    url: `notice/banner`,
    method: "GET",
    params: { roleId: 1 },
    data: {},
    custom: { noAuth: true },
  });
};
