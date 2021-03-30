/* eslint-disable */
// @ts-nocheck
// generated by free-swagger-client

export type JavaMap<T, U> = Record<string, U>;

export type JavaList<T> = Array<T>;
export interface ResponseData<T> {
  data?: T; // 返回数据
  message?: string; // 状态信息
  refreshToken?: string; // refreshToken
  status?: number; // 状态码
  token?: string; // accessToken
}
export interface Admin {
  city?: string; // 管理员管辖区所在市
  district?: string; // 管理员管辖区
  id?: number; // 管理员ID
  password?: string;
  province?: string; // 管理员管辖区所在省
  registerTime?: string; // 注册时间
  role?: string; // 管理员角色
  roleId?: number; // 管理员角色ID
  userName?: string;
}
export interface Banner {
  description?: string; // 公告描述
  id?: number; // ID
  noticeId?: number; // 公告ID
  time?: string; // Banner生成时间
  title?: string; // 公告标题
  url?: string; // 图片地址
}
export interface BindVolunteerInformation {
  IDCard?: string; // 身份证号
  name?: string; // 姓名
}
export interface CancelCase {
  caseId?: string; // 案件ID(int)
  state?: string; // 结束案件状态
}
export interface Case {
  address?: string; // 详细地址
  city?: string; // 市
  distance?: number; // 案件发生地距自己的距离
  district?: string; // 区
  family?: Family; // 家属
  familyId?: number; // 家属ID
  id?: number; // 案件ID
  latitude?: number; // 走失点纬度
  longitude?: number; // 走失点经度
  lostTime?: string; // 走失时间
  oldMan?: OldMan;
  oldManId?: number; // 老人信息ID
  others?: string; // 其它信息
  place?: string; // 位置名
  province?: string; // 省
  startTime?: string; // 案件开始时间
  state?: number; // 案件状态（1为正在进行，2为已找到，3为已归档,4为已取消）
  volunteerCase?: VolunteerCase; // 志愿者-案件信息
}
export interface ConfirmResult {
  faceId?: number; // 人脸记录ID
  state?: number; // 确认结果，3为成功，4为失败
}
export interface DeleteOldManId {
  id?: string; // 老人信息ID
}
export interface Face {
  caseId?: number; // 案件ID
  id?: number; // ID
  imgUrl?: string; // 照片地址
  result?: number; // 比对结果
  state?: number; // 状态(1为比对结果小于80%，2为大于等于80%但家属未确认，3为确认成功，4为确认失败)
  time?: Timestamp; // 时间
  volunteerId?: number; // 志愿者ID
}
export interface FaceIdentification {
  caseId?: string; // 案件ID
  imgUrl?: string; // 照片地址
}
export interface Family {
  avatarUrl?: string; // 头像
  city?: string; // 城市
  country?: string; // 国家
  district?: string; // 区
  id?: number; // 家属ID
  name?: string; // 姓名
  nickName?: string; // 昵称
  phone?: string; // 手机号
  province?: string; // 省份
  registerTime?: string; // 注册时间
  sex?: number; // 性别
  state?: number; // 账号状态
}
export interface FamilyAvatarUrl {
  avatarUrl?: string; // 头像链接
}
export interface FamilyInformation {
  code?: string; // 短信验证码
  phone?: string; // 手机号
}
export interface FamilyLoginCode {
  code?: string; // 从微信获取的code
}
export interface FamilyRefreshToken {
  refreshToken?: string; // refreshToken
}
export interface FamilyUserinfo {
  encryptedData?: string; // 加密字符串
  iv?: string; // 从微信获取的iv
}
export interface Notice {
  content?: string; // 内容
  description?: string; // 描述
  display?: number; // 是否展示（1为展示，2为不展示）
  id?: number; // ID
  publisher?: string; // 发布人
  publisherId?: number; // 发布人ID
  roleId?: number; // 面向角色
  time?: string; // 时间
  title?: string; // 标题
}
export interface OldMan {
  address?: string; // 详细地址
  birthDate?: string; // 出生日期
  city?: string; // 城市
  createdAt?: string; // 创建时间
  disability?: string; // 残疾信息
  district?: string; // 区
  familyId?: number; // 家属ID
  height?: number; // 身高
  id?: number;
  idcard?: string;
  identificationPhoto?: string; // 证件照
  lifePhoto?: string; // 生活照
  name?: string; // 姓名
  offerPlace?: string; // 常去地点
  otherFeature?: string; // 其他体貌特征
  otherIllness?: string; // 其他疾病史
  others?: string; // 其他信息
  phone?: string; // 联系电话
  province?: string; // 省份
  senileDementia?: number; // 是否老年痴呆
  sex?: number; // 性别
  updatedAt?: string; // 修改时间
  weight?: number; // 体重
}
export interface Timestamp {
  date?: number;
  day?: number;
  hours?: number;
  minutes?: number;
  month?: number;
  nanos?: number;
  seconds?: number;
  time?: number;
  timezoneOffset?: number;
  year?: number;
}
export interface UpdatePassword {
  newPassword?: string; // 新密码
  oldPassword?: string; // 旧密码
}
export interface Volunteer {
  avatarUrl?: string; // 头像
  id?: number; // 志愿者ID
  latitude?: number; // 位置所在纬度
  longitude?: number; // 位置所在经度
  nickName?: string; // 昵称
  online?: number; // 是否在线
  phone?: string; // 手机号
  state?: number; // 用户状态
  userinfo?: object;
  volunteerInformation?: VolunteerInformation; // 志愿者信息
}
export interface VolunteerAvatarUrl {
  avatarUrl?: string; // 头像链接
}
export interface VolunteerBindPhone {
  code?: string; // 验证码
  phone?: string; // 手机号
}
export interface VolunteerCase {
  caseId?: number; // 案件ID
  equipment?: number; // 装备是否齐全，1为齐全，2为不齐全
  id?: number; // 关联表ID
  state?: number; // 状态（1为接受，2为拒绝，3为退出）
  traffic?: string; // 交通工具
  volunteer?: Volunteer; // 志愿者
  volunteerId?: number; // 志愿者ID
}
export interface VolunteerInformation {
  address?: string; // 详细地址
  city?: string; // 城市
  country?: string; // 国家
  district?: string; // 区
  id?: number; // ID
  idcard?: string;
  name?: string; // 姓名
  province?: string; // 省份
  registerTime?: string; // 注册时间
  sex?: number; // 性别
  volunteer?: Volunteer;
  volunteerId?: number;
}
export interface VolunteerLoginCode {
  code?: string; // 从微信获取的code
}
export interface VolunteerRefreshToken {
  refreshToken?: string; // refreshToken
}
export interface VolunteerUnbindCode {
  code?: string; // 验证码
}
export interface volunteerUserInfo {
  encryptedData?: string; // 加密字符串
  iv?: string; // 从微信获取的iv
}
export interface zzzzzzzzzzzzzzz {
  encryptedData?: string; // 加密字符串
  iv?: string; // 从微信获取的iv
}
