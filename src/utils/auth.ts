// 认证工具类
import { AuthService, type User } from '@/services/api';

// 存储键名
const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo'
};

// 认证状态管理
export class AuthManager {
  // 获取token
  static getToken(): string | null {
    try {
      return uni.getStorageSync(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('获取token失败:', error);
      return null;
    }
  }

  // 设置token
  static setToken(token: string): void {
    try {
      uni.setStorageSync(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('设置token失败:', error);
    }
  }

  // 获取刷新token
  static getRefreshToken(): string | null {
    try {
      return uni.getStorageSync(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('获取refreshToken失败:', error);
      return null;
    }
  }

  // 设置刷新token
  static setRefreshToken(refreshToken: string): void {
    try {
      uni.setStorageSync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    } catch (error) {
      console.error('设置refreshToken失败:', error);
    }
  }

  // 获取用户信息
  static getUserInfo(): User | null {
    try {
      const userInfo = uni.getStorageSync(STORAGE_KEYS.USER_INFO);
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  // 设置用户信息
  static setUserInfo(userInfo: User): void {
    try {
      uni.setStorageSync(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    } catch (error) {
      console.error('设置用户信息失败:', error);
    }
  }

  // 检查是否已登录
  static isLoggedIn(): boolean {
    const token = this.getToken();
    const userInfo = this.getUserInfo();
    return !!(token && userInfo);
  }

  // 登录
  static async login(email: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const response = await AuthService.login({ email, password });
      
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        
        // 保存认证信息
        this.setToken(token);
        this.setRefreshToken(refreshToken);
        this.setUserInfo(user);
        
        return { success: true, user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('登录失败:', error);
      return { success: false, message: error.message || '登录失败' };
    }
  }

  // 注册
  static async register(username: string, email: string, password: string, phone?: string): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const response = await AuthService.register({ username, email, password, phone });
      
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        
        // 保存认证信息
        this.setToken(token);
        this.setRefreshToken(refreshToken);
        this.setUserInfo(user);
        
        return { success: true, user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('注册失败:', error);
      return { success: false, message: error.message || '注册失败' };
    }
  }

  // 登出
  static async logout(): Promise<void> {
    try {
      // 调用后端登出接口
      await AuthService.logout();
    } catch (error) {
      console.error('登出接口调用失败:', error);
    } finally {
      // 清除本地存储
      this.clearAuth();
      
      // 跳转到登录页
      uni.reLaunch({
        url: '/pages/login/login'
      });
    }
  }

  // 刷新token
  static async refreshToken(): Promise<boolean> {
    try {
      const response = await AuthService.refreshToken();
      
      if (response.success) {
        const { token, refreshToken } = response.data;
        this.setToken(token);
        this.setRefreshToken(refreshToken);
        return true;
      } else {
        // 刷新失败，清除认证信息
        this.clearAuth();
        return false;
      }
    } catch (error) {
      console.error('刷新token失败:', error);
      this.clearAuth();
      return false;
    }
  }

  // 更新用户信息
  static async updateProfile(): Promise<User | null> {
    try {
      const response = await AuthService.getProfile();
      
      if (response.success) {
        this.setUserInfo(response.data);
        return response.data;
      } else {
        console.error('获取用户信息失败:', response.message);
        return null;
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  // 清除认证信息
  static clearAuth(): void {
    try {
      uni.removeStorageSync(STORAGE_KEYS.TOKEN);
      uni.removeStorageSync(STORAGE_KEYS.REFRESH_TOKEN);
      uni.removeStorageSync(STORAGE_KEYS.USER_INFO);
    } catch (error) {
      console.error('清除认证信息失败:', error);
    }
  }

  // 检查登录状态并跳转
  static checkAuthAndRedirect(redirectUrl: string = '/pages/login/login'): boolean {
    if (!this.isLoggedIn()) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      
      setTimeout(() => {
        uni.navigateTo({
          url: redirectUrl
        });
      }, 1500);
      
      return false;
    }
    return true;
  }
}

// 导出默认实例
export default AuthManager;