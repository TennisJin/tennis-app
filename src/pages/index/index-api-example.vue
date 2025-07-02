<template>
  <view class="index-page">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <uni-icons type="search" size="18" color="#999"></uni-icons>
        <input 
          type="text" 
          placeholder="搜索俱乐部、场馆、活动" 
          v-model="searchKeyword"
          @confirm="handleSearch"
        />
      </view>
      <view class="location" @click="selectCity">
        <uni-icons type="location" size="16" color="#007AFF"></uni-icons>
        <text>{{ currentCity }}</text>
      </view>
    </view>

    <!-- 功能导航 -->
    <view class="nav-grid">
      <view class="nav-item" @click="navigateTo('/pages/booking/booking')">
        <image src="/static/icons/action/icon-booking.svg" class="nav-icon"></image>
        <text>预订场地</text>
      </view>
      <view class="nav-item" @click="navigateTo('/pages/coaches/coaches')">
        <image src="/static/icons/action/icon-coach.svg" class="nav-icon"></image>
        <text>找教练</text>
      </view>
      <view class="nav-item" @click="navigateTo('/pages/activities/activities')">
        <image src="/static/icons/action/icon-activity.svg" class="nav-icon"></image>
        <text>活动</text>
      </view>
      <view class="nav-item" @click="navigateTo('/pages/clubs/clubs')">
        <image src="/static/icons/action/icon-club.svg" class="nav-icon"></image>
        <text>俱乐部</text>
      </view>
    </view>

    <!-- 推荐教练 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">推荐教练</text>
        <text class="section-more" @click="navigateTo('/pages/coaches/coaches')">更多</text>
      </view>
      
      <!-- 加载状态 -->
      <view v-if="coachLoading" class="loading-container">
        <uni-load-more status="loading" content-text="{ contentText: { contentdown: '加载中...', contentrefresh: '加载中...', contentnomore: '加载中...' } }"></uni-load-more>
      </view>
      
      <!-- 教练列表 -->
      <scroll-view v-else scroll-x class="coach-scroll">
        <view class="coach-list">
          <view 
            v-for="coach in coachList" 
            :key="coach.id" 
            class="coach-item"
            @click="navigateTo(`/pages/coach-detail/coach-detail?id=${coach.id}`)"
          >
            <image :src="coach.avatar || '/static/images/avatars/default-avatar.svg'" class="coach-avatar"></image>
            <text class="coach-name">{{ coach.username }}</text>
            <text class="coach-level">{{ coach.level || '教练' }}</text>
            <text class="coach-utr">UTR: {{ coach.utrRating || 'N/A' }}</text>
          </view>
        </view>
      </scroll-view>
      
      <!-- 空状态 -->
      <view v-if="!coachLoading && coachList.length === 0" class="empty-state">
        <image src="/static/placeholders/empty-coach.png" class="empty-icon"></image>
        <text class="empty-text">暂无推荐教练</text>
      </view>
    </view>

    <!-- 热门活动 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">热门活动</text>
        <text class="section-more" @click="navigateTo('/pages/activities/activities')">更多</text>
      </view>
      
      <!-- 加载状态 -->
      <view v-if="activityLoading" class="loading-container">
        <uni-load-more status="loading"></uni-load-more>
      </view>
      
      <!-- 活动列表 -->
      <view v-else class="activity-list">
        <view 
          v-for="activity in activityList" 
          :key="activity.id" 
          class="activity-item"
          @click="navigateTo(`/pages/activity-detail/activity-detail?id=${activity.id}`)"
        >
          <view class="activity-info">
            <text class="activity-title">{{ activity.title }}</text>
            <text class="activity-time">{{ formatDateTime(activity.startTime) }}</text>
            <text class="activity-location">{{ activity.location }}</text>
            <view class="activity-meta">
              <text class="activity-type">{{ getActivityTypeText(activity.type) }}</text>
              <text class="activity-level">{{ activity.level }}</text>
              <text class="activity-price">¥{{ activity.price }}</text>
            </view>
          </view>
          <view class="activity-participants">
            <text class="participant-count">{{ activity.currentParticipants }}/{{ activity.maxParticipants }}</text>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="!activityLoading && activityList.length === 0" class="empty-state">
        <image src="/static/placeholders/empty-activity.png" class="empty-icon"></image>
        <text class="empty-text">暂无热门活动</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UserService, ActivityService, type User, type Activity } from '@/services/api';
import AuthManager from '@/utils/auth';

// 响应式数据
const searchKeyword = ref('');
const currentCity = ref('北京');
const coachList = ref<User[]>([]);
const activityList = ref<Activity[]>([]);
const coachLoading = ref(false);
const activityLoading = ref(false);

// 页面加载
onMounted(() => {
  loadCoachList();
  loadActivityList();
  checkUserAuth();
});

// 检查用户认证状态
function checkUserAuth() {
  if (AuthManager.isLoggedIn()) {
    // 已登录，可以获取个性化推荐
    console.log('用户已登录，获取个性化推荐');
  } else {
    // 未登录，显示通用推荐
    console.log('用户未登录，显示通用推荐');
  }
}

// 加载教练列表 - 使用真实API
async function loadCoachList() {
  try {
    coachLoading.value = true;
    
    // 调用用户服务获取教练列表
    const response = await UserService.getUsers({
      page: 1,
      limit: 10,
      // 可以添加筛选条件，比如只获取教练用户
      // role: 'coach'
    });
    
    if (response.success) {
      // 过滤出教练用户（假设有role字段或其他标识）
      coachList.value = response.data.users.filter(user => 
        user.utrRating && user.utrRating > 3.0 // 简单的教练筛选逻辑
      ).slice(0, 6); // 只显示前6个
    } else {
      console.error('获取教练列表失败:', response.message);
      uni.showToast({
        title: response.message || '获取教练列表失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('获取教练列表失败:', error);
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    });
  } finally {
    coachLoading.value = false;
  }
}

// 加载活动列表 - 使用真实API
async function loadActivityList() {
  try {
    activityLoading.value = true;
    
    // 调用活动服务获取热门活动
    const response = await ActivityService.getActivities({
      page: 1,
      limit: 5,
      status: 'upcoming' // 只获取即将开始的活动
    });
    
    if (response.success) {
      activityList.value = response.data.activities;
    } else {
      console.error('获取活动列表失败:', response.message);
      uni.showToast({
        title: response.message || '获取活动列表失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('获取活动列表失败:', error);
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    });
  } finally {
    activityLoading.value = false;
  }
}

// 搜索处理
function handleSearch() {
  if (!searchKeyword.value.trim()) {
    uni.showToast({
      title: '请输入搜索关键词',
      icon: 'none'
    });
    return;
  }
  
  // 跳转到搜索结果页面
  uni.navigateTo({
    url: `/pages/search/search?keyword=${encodeURIComponent(searchKeyword.value)}&city=${encodeURIComponent(currentCity.value)}`
  });
}

// 选择城市
function selectCity() {
  uni.showActionSheet({
    itemList: ['北京', '上海', '广州', '深圳', '杭州', '成都'],
    success: (res) => {
      const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都'];
      currentCity.value = cities[res.tapIndex];
      
      // 重新加载数据
      loadCoachList();
      loadActivityList();
    }
  });
}

// 页面导航
function navigateTo(url: string) {
  uni.navigateTo({ url });
}

// 格式化日期时间
function formatDateTime(dateTime: string): string {
  const date = new Date(dateTime);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  
  return `${month}月${day}日 ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

// 获取活动类型文本
function getActivityTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    'match': '比赛',
    'training': '训练',
    'tournament': '锦标赛',
    'social': '社交'
  };
  return typeMap[type] || type;
}
</script>

<style scoped>
.index-page {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  gap: 20rpx;
}

.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 25rpx;
  padding: 15rpx 20rpx;
  gap: 10rpx;
}

.search-input input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.location {
  display: flex;
  align-items: center;
  gap: 5rpx;
  color: #007AFF;
  font-size: 26rpx;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 15rpx;
  padding: 30rpx 20rpx;
  gap: 15rpx;
}

.nav-icon {
  width: 60rpx;
  height: 60rpx;
}

.nav-item text {
  font-size: 24rpx;
  color: #333;
}

.section {
  margin-bottom: 40rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 26rpx;
  color: #007AFF;
}

.loading-container {
  padding: 40rpx 0;
  text-align: center;
}

.coach-scroll {
  white-space: nowrap;
}

.coach-list {
  display: flex;
  gap: 20rpx;
  padding-bottom: 10rpx;
}

.coach-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 15rpx;
  padding: 25rpx 20rpx;
  min-width: 160rpx;
  gap: 10rpx;
}

.coach-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.coach-name {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
}

.coach-level {
  font-size: 22rpx;
  color: #666;
}

.coach-utr {
  font-size: 22rpx;
  color: #007AFF;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 15rpx;
  padding: 25rpx;
}

.activity-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.activity-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.activity-time {
  font-size: 24rpx;
  color: #666;
}

.activity-location {
  font-size: 24rpx;
  color: #666;
}

.activity-meta {
  display: flex;
  gap: 15rpx;
  margin-top: 5rpx;
}

.activity-type,
.activity-level {
  font-size: 22rpx;
  color: #007AFF;
  background: #f0f8ff;
  padding: 4rpx 12rpx;
  border-radius: 10rpx;
}

.activity-price {
  font-size: 24rpx;
  color: #ff6b35;
  font-weight: bold;
}

.activity-participants {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.participant-count {
  font-size: 22rpx;
  color: #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
  gap: 20rpx;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 26rpx;
  color: #999;
}
</style>