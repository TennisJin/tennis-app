// API 配置文件

// API 配置
const config = {
  // 开发环境
  development: {
    baseURL: "http://localhost:3000/api/v1",
  },
  // 生产环境
  production: {
    baseURL: "https://your-api-domain.com/api",
  },
};

// 获取当前环境配置
let currentEnv: keyof typeof config;
// #ifdef MP-WEIXIN
currentEnv = "production"; // 微信小程序默认为生产环境
// #endif
// #ifdef H5
currentEnv = location.hostname === "localhost" ? "development" : "production";
// #endif
// #ifndef H5 || MP-WEIXIN
currentEnv = "development"; // 其他平台默认为开发环境
// #endif

const apiConfig = config[currentEnv];

// 获取当前环境的API基础URL
export const getBaseURL = (): string => {
  return apiConfig.baseURL;
};

// API 接口路径配置 - 根据后端API文档整理
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    // 微信登录/注册
    WECHAT: "/auth/wechat",
    // 手机号/邮箱注册
    REGISTER: "/auth/register",
    // 手机号/邮箱登录
    LOGIN: "/auth/login",
    // 刷新访问令牌
    REFRESH: "/auth/refresh",
    // 用户登出
    LOGOUT: "/auth/logout",
    // 发送短信验证码
    SEND_SMS_CODE: "/auth/send-sms-code",
    // 验证短信验证码
    VERIFY_SMS_CODE: "/auth/verify-sms-code",
    // 重置密码
    RESET_PASSWORD: "/auth/reset-password",
  },

  // 用户相关
  USERS: {
    // 获取用户资料
    PROFILE: "/users/profile",
    // 更新用户资料
    UPDATE_PROFILE: "/users/profile",
    // 更新用户头像
    UPDATE_AVATAR: "/users/avatar",
    // 修改密码
    UPDATE_PASSWORD: "/users/password",
    // 获取用户预订记录
    BOOKINGS: "/users/bookings",
    // 获取用户活动记录
    EVENTS: "/users/events",
    // 更新教练状态
    COACH_STATUS: "/users/coach-status",
    // 删除用户账户
    DELETE_ACCOUNT: "/users/account",
    // 获取用户统计信息
    STATS: "/users/stats",
  },

  // 场馆相关
  VENUES: {
    // 获取场馆列表
    LIST: "/venues",
    // 获取场馆详情
    DETAIL: (id: string) => `/venues/${id}`,
    // 创建场馆
    CREATE: "/venues",
    // 更新场馆信息
    UPDATE: (id: string) => `/venues/${id}`,
    // 删除场馆
    DELETE: (id: string) => `/venues/${id}`,
    // 查询场馆可用性
    AVAILABILITY: (id: string) => `/venues/${id}/availability`,
    // 获取场馆预订记录
    BOOKINGS: (id: string) => `/venues/${id}/bookings`,
    // 获取场馆统计信息
    STATS: (id: string) => `/venues/${id}/stats`,
  },

  // 预订相关
  BOOKINGS: {
    // 获取预订列表
    LIST: "/bookings",
    // 获取预订详情
    DETAIL: (id: string) => `/bookings/${id}`,
    // 创建预订
    CREATE: "/bookings",
    // 更新预订信息
    UPDATE: (id: string) => `/bookings/${id}`,
    // 取消预订
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
    // 确认预订
    CONFIRM: (id: string) => `/bookings/${id}/confirm`,
    // 完成预订
    COMPLETE: (id: string) => `/bookings/${id}/complete`,
    // 获取预订统计摘要
    STATS_SUMMARY: "/bookings/stats/summary",
  },

  // 活动模块 (events)
  EVENTS: {
    // 获取活动列表
    LIST: "/events",
    // 获取活动详情
    DETAIL: (id: string) => `/events/${id}`,
    // 创建活动
    CREATE: "/events",
    // 更新活动信息
    UPDATE: (id: string) => `/events/${id}`,
    // 删除活动
    DELETE: (id: string) => `/events/${id}`,
    // 参加活动
    JOIN: (id: string) => `/events/${id}/join`,
    // 退出活动
    LEAVE: (id: string) => `/events/${id}/leave`,
    // 获取活动参与者
    PARTICIPANTS: (id: string) => `/events/${id}/participants`,
    // 获取用户参与的活动
    USER_EVENTS: (userId: string) => `/events/user/${userId}/events`,
  },

  // 教练相关
  COACHES: {
    // 获取教练列表
    LIST: "/coaches",
    // 获取教练详情
    DETAIL: (id: string) => `/coaches/${id}`,
    // 创建教练资料
    CREATE: "/coaches",
    // 更新教练信息
    UPDATE: (id: string) => `/coaches/${id}`,
    // 删除教练资料
    DELETE: (id: string) => `/coaches/${id}`,
    // 获取教练评价
    REVIEWS: (id: string) => `/coaches/${id}/reviews`,
    // 添加教练评价
    ADD_REVIEW: (id: string) => `/coaches/${id}/reviews`,
    // 获取教练统计信息
    STATS: (id: string) => `/coaches/${id}/stats`,
  },

  // 俱乐部相关
  CLUBS: {
    // 获取俱乐部列表
    LIST: "/clubs",
    // 获取俱乐部详情
    DETAIL: (id: string) => `/clubs/${id}`,
    // 创建俱乐部
    CREATE: "/clubs",
    // 更新俱乐部信息
    UPDATE: (id: string) => `/clubs/${id}`,
    // 删除俱乐部
    DELETE: (id: string) => `/clubs/${id}`,
    // 加入俱乐部
    JOIN: (id: string) => `/clubs/${id}/join`,
    // 退出俱乐部
    LEAVE: (id: string) => `/clubs/${id}/leave`,
    // 获取俱乐部成员
    MEMBERS: (id: string) => `/clubs/${id}/members`,
    // 更新成员信息
    UPDATE_MEMBER: (clubId: string, userId: string) =>
      `/clubs/${clubId}/members/${userId}`,
    // 获取俱乐部统计信息
    STATS: (id: string) => `/clubs/${id}/stats`,
  },

  // 支付相关
  PAYMENTS: {
    // 获取支付记录
    LIST: "/payments",
    // 获取支付详情
    DETAIL: (id: string) => `/payments/${id}`,
    // 创建支付订单
    CREATE: "/payments",
    // 微信支付回调
    WECHAT_NOTIFY: "/payments/wechat/notify",
    // 支付宝支付回调
    ALIPAY_NOTIFY: "/payments/alipay/notify",
    // 取消支付
    CANCEL: (id: string) => `/payments/${id}/cancel`,
    // 申请退款
    REFUND: (id: string) => `/payments/${id}/refund`,
    // 处理退款
    PROCESS_REFUND: (refundId: string) => `/payments/refunds/${refundId}`,
    // 获取支付统计
    ADMIN_STATS: "/payments/admin/stats",
  },

  // 文件上传相关
  UPLOADS: {
    // 单文件上传
    SINGLE: "/uploads/single",
    // 多文件上传
    MULTIPLE: "/uploads/multiple",
    // 头像上传
    AVATAR: "/uploads/avatar",
    // 获取文件列表
    LIST: "/uploads",
    // 获取文件信息
    DETAIL: (id: string) => `/uploads/${id}`,
    // 删除文件
    DELETE: (id: string) => `/uploads/${id}`,
    // 批量删除文件
    BATCH_DELETE: "/uploads/batch",
    // 获取文件信息
    INFO: (id: string) => `/uploads/${id}`,
    // 获取上传统计
    STATS: "/uploads/stats",
    // 清理无用文件
    CLEANUP: "/uploads/cleanup",
  },

  // 系统相关
  SYSTEM: {
    // 健康检查
    HEALTH: "/health",
    // API版本信息
    VERSION: "/",
  },
} as const;

// 请求超时时间（毫秒）
export const REQUEST_TIMEOUT = 10000;

// 请求重试次数
export const RETRY_COUNT = 3;
