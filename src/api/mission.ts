import http from "@/utils/request";
import {
  Case,
  ConfirmResult,
  Face,
  JavaList,
  ResponseData,
  Volunteer,
} from "./types/models";

/**
 * 获取开启的案件数量
 *
 * @return {*}
 */
export const requestGetOpenCaseNumber = () => {
  return http.request<ResponseData<number>>({
    url: `case/number`,
    method: "GET",
    params: {},
    data: {},
    custom: { noAuth: true },
  });
};

/**
 * 获取案件列表
 *
 * @param {{ id?: number }} params
 * @return {*}
 */
export const requestGetCases = (params: { id?: number }) => {
  return http.request<ResponseData<JavaList<Case>>>({
    url: `case`,
    method: "GET",
    params: params,
    data: {},
  });
};

/**
 * 查询本人正在执行的案件
 *
 * @return {*}
 */
export const requestGetMyCases = () => {
  return http.request<ResponseData<JavaList<Case>>>({
    url: `case/family/ing`,
    method: "GET",
    params: {},
    data: {},
  });
};

/**
 * 查询本人发布的所有案件
 *
 * @return {*}
 */
export const requestGetMyAllCases = () => {
  return http.request<ResponseData<JavaList<Case>>>({
    url: `case/family/all`,
    method: "GET",
    params: {},
    data: {},
  });
};

/**
 *  获取参与某任务的志愿者列表
 *
 * @param {{ caseId: number }} params
 * @return {*}
 */
export const requestGetVolunteersInCase = (params: { caseId: number }) => {
  return http.request<ResponseData<JavaList<Volunteer>>>({
    url: `case/volunteer`,
    method: "GET",
    params: params,
    data: {},
  });
};

/**
 * 获取人脸识别历史记录
 *
 * @param {{ caseId: number }} params
 * @return {*}
 */
export const requestGetFaceIdentificationRecords = (params: {
  oldManId: number;
}) => {
  return http.request<ResponseData<JavaList<Face>>>({
    url: `face`,
    method: "GET",
    params: params,
    data: {},
  });
};

/**
 * 发布案件
 *
 * @param {Case} params
 * @return {*}
 */
export const requestCreateNewCase = (params: Case) => {
  return http.request<ResponseData<object>>({
    url: `case`,
    method: "POST",
    params: {},
    data: params,
  });
};

/**
 * 判别有效人脸
 *
 * @param {{ imgUrl: string }} params
 * @return {*}
 */
export const requestCheckFaceValidity = (params: { imgUrl: string }) => {
  return http.request<ResponseData<any>>({
    url: `face/isOldMan`,
    method: "POST",
    params: {},
    data: params,
  });
};

/**
 * 家属确认人脸识别结果,state为3是成功，4是失败
 *
 * @param {ConfirmResult} params
 * @return {*}
 */
export const requestConfirmFaceResult = (params: ConfirmResult) => {
  return http.request<ResponseData<object>>({
    url: `face/result`,
    method: "POST",
    params: {},
    data: params,
  });
};
