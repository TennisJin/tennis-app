// API 服务类 - 封装所有业务接口调用
import request, { type ApiResponse } from '@/utils/request';
import { API_ENDPOINTS } from '@/config/api';

// 数据类型定义 - 根据后端API文档更新
export interface User {
  id: string;
  phone?: string;
  email?: string;
  openId?: string;
  unionId?: string;
  nickname?: string;
  avatar?: string;
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN';
  birthDate?: string;
  city?: string;
  province?: string;
  country?: string;
  isCoach: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Club {
  id: string;
  name: string;
  description?: string;
  city: string;
  address: string;
  contactPhone?: string;
  contactEmail?: string;
  membershipFee: number;
  facilities: string[];
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Venue {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  type: 'INDOOR' | 'OUTDOOR';
  courts: number;
  hourlyRate: number;
  images: string[];
  facilities: string[];
  openTime: string;
  closeTime: string;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  venueId: string;
  courtNumber: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  playerCount: number;
  notes?: string;
  user?: User;
  venue?: Venue;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  type: 'TRAINING' | 'MATCH' | 'TOURNAMENT';
  venueId: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants?: number;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  requirements?: string[];
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  organizerId?: string;
  organizer?: User;
  venue?: Venue;
  participants?: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderNumber: string;
  type: 'BOOKING' | 'EVENT' | 'MEMBERSHIP';
  relatedId: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'WECHAT' | 'ALIPAY';
  description?: string;
  paymentUrl?: string;
  qrCode?: string;
  paidAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  venueName: string;
  venueImage?: string;
  courtType: string;
  courtNumber: number;
  date: string;
  timeSlot: string;
  totalPrice: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  createTime: string;
  userId?: string;
  venueId?: string;
  bookingId?: string;
}

export interface UploadFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  category?: 'avatar' | 'document' | 'image';
  uploadedAt: string;
}

// 认证相关数据类型
export interface WechatLoginData {
  code: string;
  encryptedData?: string;
  iv?: string;
}

export interface SmsCodeData {
  phone: string;
  type: 'REGISTER' | 'LOGIN' | 'RESET_PASSWORD';
}

export interface ResetPasswordData {
  phone?: string;
  email?: string;
  code: string;
  newPassword: string;
}

// 微信登录数据
export interface WechatLoginData {
  code: string;
  userInfo: {
    nickName: string;
    avatarUrl: string;
    gender: number;
    city: string;
    province: string;
    country: string;
  };
}

// 手机号/邮箱登录数据
export interface LoginData {
  phone?: string;
  email?: string;
  password: string;
}

// 注册数据
export interface RegisterData {
  phone?: string;
  email?: string;
  password: string;
  nickname?: string;
  code: string;
}

// 认证响应
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}



// 认证服务
export class AuthService {
  // 微信登录/注册
  static async wechatLogin(data: WechatLoginData): Promise<ApiResponse<AuthResponse>> {
    return request.post(API_ENDPOINTS.AUTH.WECHAT, data);
  }

  // 手机号/邮箱注册
  static async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return request.post(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  // 手机号/邮箱登录
  static async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    return request.post(API_ENDPOINTS.AUTH.LOGIN, data);
  }

  // 刷新访问令牌
  static async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string; expiresIn: number }>> {
    return request.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  }

  // 用户登出
  static async logout(refreshToken: string): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  }

  // 发送短信验证码
  static async sendSmsCode(phone: string): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.AUTH.SEND_SMS_CODE, { phone });
  }

  // 验证短信验证码
  static async verifySmsCode(data: SmsCodeData): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.AUTH.VERIFY_SMS_CODE, data);
  }

  // 重置密码
  static async resetPassword(data: ResetPasswordData): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }
}

// 用户服务
export class UserService {
  // 获取用户资料
  static async getProfile(): Promise<ApiResponse<User>> {
    return request.get(API_ENDPOINTS.USERS.PROFILE);
  }

  // 更新用户资料
  static async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return request.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
  }

  // 更新用户头像
  static async updateAvatar(avatar: string): Promise<ApiResponse<User>> {
    return request.put(API_ENDPOINTS.USERS.UPDATE_AVATAR, { avatar });
  }

  // 修改密码
  static async updatePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return request.put(API_ENDPOINTS.USERS.UPDATE_PASSWORD, { currentPassword, newPassword });
  }

  // 获取用户预订记录
  static async getUserBookings(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<{ bookings: Booking[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.USERS.BOOKINGS, params);
  }

  // 获取用户活动记录
  static async getUserEvents(params?: { page?: number; limit?: number }): Promise<ApiResponse<{ events: Event[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.USERS.EVENTS, params);
  }

  // 更新教练状态
  static async updateCoachStatus(isCoach: boolean, coachInfo?: any): Promise<ApiResponse<User>> {
    return request.put(API_ENDPOINTS.USERS.COACH_STATUS, { isCoach, coachInfo });
  }

  // 删除用户账户
  static async deleteAccount(): Promise<ApiResponse<void>> {
    return request.delete(API_ENDPOINTS.USERS.DELETE_ACCOUNT);
  }

  // 获取用户统计信息
  static async getUserStats(): Promise<ApiResponse<any>> {
    return request.get(API_ENDPOINTS.USERS.STATS);
  }
}

// 教练服务
export class CoachService {
  // 获取教练列表
  static async getCoaches(params?: { page?: number; limit?: number; search?: string; city?: string; level?: string; featured?: boolean }): Promise<ApiResponse<{ coaches: User[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.COACHES.LIST, params);
  }

  // 获取教练详情
  static async getCoachById(id: string): Promise<ApiResponse<User>> {
    return request.get(API_ENDPOINTS.COACHES.DETAIL(id));
  }

  // 创建教练资料
  static async createCoach(data: Partial<User>): Promise<ApiResponse<User>> {
    return request.post(API_ENDPOINTS.COACHES.CREATE, data);
  }

  // 更新教练信息
  static async updateCoach(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return request.put(API_ENDPOINTS.COACHES.UPDATE(id), data);
  }

  // 删除教练资料
  static async deleteCoach(id: string): Promise<ApiResponse<void>> {
    return request.delete(API_ENDPOINTS.COACHES.DELETE(id));
  }

  // 获取教练评价
  static async getCoachReviews(id: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<{ reviews: any[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.COACHES.REVIEWS(id), params);
  }

  // 添加教练评价
  static async addCoachReview(id: string, data: { rating: number; comment: string }): Promise<ApiResponse<any>> {
    return request.post(API_ENDPOINTS.COACHES.ADD_REVIEW(id), data);
  }

  // 获取教练统计信息
  static async getCoachStats(id: string): Promise<ApiResponse<any>> {
    return request.get(API_ENDPOINTS.COACHES.STATS(id));
  }
}

// 俱乐部服务
export class ClubService {
  // 获取俱乐部列表
  static async getClubs(params?: { page?: number; limit?: number; search?: string; city?: string; type?: string }): Promise<ApiResponse<{ clubs: Club[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.CLUBS.LIST, params);
  }

  // 获取俱乐部详情
  static async getClubById(id: string): Promise<ApiResponse<Club>> {
    return request.get(API_ENDPOINTS.CLUBS.DETAIL(id));
  }

  // 创建俱乐部
  static async createClub(data: Partial<Club>): Promise<ApiResponse<Club>> {
    return request.post(API_ENDPOINTS.CLUBS.CREATE, data);
  }

  // 更新俱乐部信息
  static async updateClub(id: string, data: Partial<Club>): Promise<ApiResponse<Club>> {
    return request.put(API_ENDPOINTS.CLUBS.UPDATE(id), data);
  }

  // 删除俱乐部
  static async deleteClub(id: string): Promise<ApiResponse<void>> {
    return request.delete(API_ENDPOINTS.CLUBS.DELETE(id));
  }

  // 加入俱乐部
  static async joinClub(id: string): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.CLUBS.JOIN(id));
  }

  // 退出俱乐部
  static async leaveClub(id: string): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.CLUBS.LEAVE(id));
  }

  // 获取俱乐部成员
  static async getClubMembers(id: string, params?: { page?: number; limit?: number; role?: string }): Promise<ApiResponse<{ members: User[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.CLUBS.MEMBERS(id), params);
  }

  // 获取俱乐部统计信息
  static async getClubStats(id: string): Promise<ApiResponse<any>> {
    return request.get(API_ENDPOINTS.CLUBS.STATS(id));
  }
}

// 场馆服务
export class VenueService {
  // 获取场馆列表
  static async getVenues(params?: { page?: number; limit?: number; city?: string; type?: string; search?: string }): Promise<ApiResponse<{ venues: Venue[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.VENUES.LIST, params);
  }

  // 获取场馆详情
  static async getVenueById(id: string): Promise<ApiResponse<Venue>> {
    return request.get(API_ENDPOINTS.VENUES.DETAIL(id));
  }

  // 创建场馆
  static async createVenue(data: Partial<Venue>): Promise<ApiResponse<Venue>> {
    return request.post(API_ENDPOINTS.VENUES.CREATE, data);
  }

  // 更新场馆信息
  static async updateVenue(id: string, data: Partial<Venue>): Promise<ApiResponse<Venue>> {
    return request.put(API_ENDPOINTS.VENUES.UPDATE(id), data);
  }

  // 删除场馆
  static async deleteVenue(id: string): Promise<ApiResponse<void>> {
    return request.delete(API_ENDPOINTS.VENUES.DELETE(id));
  }

  // 查询场馆可用性
  static async getVenueAvailability(id: string, params: { date: string; startTime?: string; endTime?: string }): Promise<ApiResponse<{ availableSlots: string[] }>> {
    return request.get(API_ENDPOINTS.VENUES.AVAILABILITY(id), params);
  }

  // 获取场馆预订记录
  static async getVenueBookings(id: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<{ bookings: Booking[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.VENUES.BOOKINGS(id), params);
  }

  // 获取场馆统计信息
  static async getVenueStats(id: string): Promise<ApiResponse<any>> {
    return request.get(API_ENDPOINTS.VENUES.STATS(id));
  }
}

// 预订服务
export class BookingService {
  // 获取预订列表
  static async getBookings(params?: { page?: number; limit?: number; status?: string; venueId?: string; startDate?: string; endDate?: string }): Promise<ApiResponse<{ bookings: Booking[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.BOOKINGS.LIST, params);
  }

  // 获取预订详情
  static async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    return request.get(API_ENDPOINTS.BOOKINGS.DETAIL(id));
  }

  // 创建预订
  static async createBooking(data: { venueId: string; courtNumber: number; bookingDate: string; startTime: string; endTime: string; playerCount: number; notes?: string }): Promise<ApiResponse<Booking>> {
    return request.post(API_ENDPOINTS.BOOKINGS.CREATE, data);
  }

  // 更新预订信息
  static async updateBooking(id: string, data: Partial<Booking>): Promise<ApiResponse<Booking>> {
    return request.put(API_ENDPOINTS.BOOKINGS.UPDATE(id), data);
  }

  // 取消预订
  static async cancelBooking(id: string, reason?: string): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.BOOKINGS.CANCEL(id), { reason });
  }

  // 确认预订
  static async confirmBooking(id: string): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.BOOKINGS.CONFIRM(id));
  }

  // 完成预订
  static async completeBooking(id: string): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.BOOKINGS.COMPLETE(id));
  }

  // 获取预订统计摘要
  static async getBookingStatsSummary(): Promise<ApiResponse<any>> {
    return request.get(API_ENDPOINTS.BOOKINGS.STATS_SUMMARY);
  }
}

// 活动服务
export class ActivityService {
  // 获取活动列表
  static async getActivities(params?: { page?: number; limit?: number; type?: string; status?: string; venueId?: string; startDate?: string; endDate?: string }): Promise<ApiResponse<{ activities: Event[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.EVENTS.LIST, params);
  }

  // 获取活动详情
  static async getActivityById(id: string): Promise<ApiResponse<Event>> {
    return request.get(API_ENDPOINTS.EVENTS.DETAIL(id));
  }

  // 创建活动
  static async createActivity(data: Partial<Event>): Promise<ApiResponse<Event>> {
    return request.post(API_ENDPOINTS.EVENTS.CREATE, data);
  }

  // 更新活动信息
  static async updateActivity(id: string, data: Partial<Event>): Promise<ApiResponse<Event>> {
    return request.put(API_ENDPOINTS.EVENTS.UPDATE(id), data);
  }

  // 删除活动
  static async deleteActivity(id: string): Promise<ApiResponse<void>> {
    return request.delete(API_ENDPOINTS.EVENTS.DELETE(id));
  }

  // 参加活动
  static async joinActivity(id: string): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.EVENTS.JOIN(id));
  }

  // 退出活动
  static async leaveActivity(id: string): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.EVENTS.LEAVE(id));
  }

  // 获取活动参与者
  static async getActivityParticipants(id: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<{ participants: User[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.EVENTS.PARTICIPANTS(id), params);
  }

  // 获取用户参与的活动
  static async getUserActivities(userId: string, params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<{ activities: Event[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.EVENTS.USER_EVENTS(userId), params);
  }
}

// 订单服务
export class OrderService {
  // 获取我的订单列表
  static async getMyOrders(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<Order[]>> {
    return request.get(API_ENDPOINTS.BOOKINGS.LIST, params);
  }

  // 获取订单详情
  static async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return request.get(API_ENDPOINTS.BOOKINGS.DETAIL(id));
  }

  // 取消订单
  static async cancelOrder(id: string, reason?: string): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.BOOKINGS.CANCEL(id), { reason });
  }

  // 支付订单
  static async payOrder(id: string, paymentMethod: string): Promise<ApiResponse<any>> {
    return request.post(API_ENDPOINTS.PAYMENTS.CREATE, { 
      type: 'booking',
      relatedId: id,
      paymentMethod
    });
  }
}

// 支付服务
export class PaymentService {
  // 获取支付订单列表
  static async getPaymentOrders(params?: { page?: number; limit?: number; status?: string; type?: string }): Promise<ApiResponse<{ orders: Payment[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.PAYMENTS.LIST, params);
  }

  // 创建支付订单
  static async createPaymentOrder(data: { type: string; relatedId: string; amount: number; description?: string }): Promise<ApiResponse<Payment>> {
    return request.post(API_ENDPOINTS.PAYMENTS.CREATE, data);
  }

  // 获取支付详情
  static async getPaymentDetail(id: string): Promise<ApiResponse<Payment>> {
    return request.get(API_ENDPOINTS.PAYMENTS.DETAIL(id));
  }

  // 微信支付回调
  static async wechatCallback(data: any): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.PAYMENTS.WECHAT_NOTIFY, data);
  }

  // 支付宝支付回调
  static async alipayCallback(data: any): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.PAYMENTS.ALIPAY_NOTIFY, data);
  }

  // 取消支付
  static async cancelPayment(id: string): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.PAYMENTS.CANCEL(id));
  }

  // 申请退款
  static async requestRefund(id: string, data: { reason: string; amount?: number }): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.PAYMENTS.REFUND(id), data);
  }

  // 处理退款
  static async processRefund(refundId: string, data: { approved: boolean; reason?: string }): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.PAYMENTS.PROCESS_REFUND(refundId), data);
  }
}

// 文件上传服务
export class UploadService {
  // 单文件上传
  static async uploadSingle(file: File, type?: string): Promise<ApiResponse<UploadFile>> {
    const formData = new FormData();
    formData.append('file', file);
    if (type) formData.append('type', type);
    return request.post(API_ENDPOINTS.UPLOADS.SINGLE, formData);
  }

  // 多文件上传
  static async uploadMultiple(files: File[], type?: string): Promise<ApiResponse<UploadFile[]>> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (type) formData.append('type', type);
    return request.post(API_ENDPOINTS.UPLOADS.MULTIPLE, formData);
  }

  // 头像上传
  static async uploadAvatar(file: File): Promise<ApiResponse<UploadFile>> {
    const formData = new FormData();
    formData.append('avatar', file);
    return request.post(API_ENDPOINTS.UPLOADS.AVATAR, formData);
  }

  // 获取文件列表
  static async getFileList(params?: { page?: number; limit?: number; type?: string }): Promise<ApiResponse<{ files: UploadFile[]; pagination: any }>> {
    return request.get(API_ENDPOINTS.UPLOADS.LIST, params);
  }

  // 获取文件信息
  static async getFileInfo(id: string): Promise<ApiResponse<UploadFile>> {
    return request.get(API_ENDPOINTS.UPLOADS.INFO(id));
  }

  // 删除文件
  static async deleteFile(id: string): Promise<ApiResponse<void>> {
    return request.delete(API_ENDPOINTS.UPLOADS.DELETE(id));
  }

  // 批量删除文件
  static async deleteFiles(ids: string[]): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.UPLOADS.BATCH_DELETE, { ids });
  }

  // 获取上传统计
  static async getUploadStats(): Promise<ApiResponse<any>> {
    return request.get(API_ENDPOINTS.UPLOADS.STATS);
  }

  // 清理无用文件
  static async cleanupFiles(): Promise<ApiResponse<void>> {
    return request.post(API_ENDPOINTS.UPLOADS.CLEANUP);
  }
}

// 系统服务
export class SystemService {
  // 健康检查
  static async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; version: string }>> {
    return request.get(API_ENDPOINTS.SYSTEM.HEALTH);
  }

  // 获取系统版本
  static async getSystemVersion(): Promise<ApiResponse<any>> {
    return request.get(API_ENDPOINTS.SYSTEM.VERSION);
  }
}

// 服务已通过class声明时的export关键字导出，无需重复导出