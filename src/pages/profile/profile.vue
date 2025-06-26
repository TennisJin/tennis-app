<template>
  <view class="page-container">
    <!-- 用户信息卡片 -->
    <view class="user-card card">
      <view class="user-info">
        <image class="user-avatar" :src="userInfo.avatar" mode="aspectFill"></image>
        <view class="user-details">
          <text class="user-name">{{ userInfo.name }}</text>
          <view class="user-rating">
            <text class="rating-label">评级:</text>
            <text class="rating-value">{{ userInfo.rating }}</text>
            <view class="utr-score">UTR: {{ userInfo.utr }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷功能 -->
    <view class="quick-menu">
      <view class="menu-row">
        <view class="menu-item" @click="goToOrders">
          <image class="menu-icon" src="/static/icon-order.png" mode="aspectFit"></image>
          <text class="menu-text">订单</text>
        </view>
        <view class="menu-item" @click="goToWallet">
          <image class="menu-icon" src="/static/icon-wallet.png" mode="aspectFit"></image>
          <text class="menu-text">卡包</text>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="function-list">
      <view class="list-item" @click="goToMyActivities">
        <image class="item-icon" src="/static/icon-activity.png" mode="aspectFit"></image>
        <text class="item-text">我的活动</text>
        <text class="item-arrow">></text>
      </view>
      
      <view class="list-item" @click="goToMatchRecords">
        <image class="item-icon" src="/static/icon-match.png" mode="aspectFit"></image>
        <text class="item-text">比赛记录</text>
        <text class="item-arrow">></text>
      </view>
      
      <view class="list-item" @click="goToApplyClub">
        <image class="item-icon" src="/static/icon-club.png" mode="aspectFit"></image>
        <text class="item-text">申请创建俱乐部</text>
        <text class="item-arrow">></text>
      </view>
      
      <view class="list-item" @click="goToApplyCoach">
        <image class="item-icon" src="/static/icon-coach.png" mode="aspectFit"></image>
        <text class="item-text">申请成为教练或陪练</text>
        <text class="item-arrow">></text>
      </view>
      
      <view class="list-item" @click="goToHelp">
        <image class="item-icon" src="/static/icon-help.png" mode="aspectFit"></image>
        <text class="item-text">帮助&反馈</text>
        <text class="item-arrow">></text>
      </view>
    </view>

    <!-- 联系客服 -->
    <view class="contact-service">
      <button class="service-btn" @click="contactService">
        如有疑问？联系客服
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface UserInfo {
  id: number
  name: string
  avatar: string
  rating: number
  utr: string
  gender: string
}

// 响应式数据
const userInfo = ref<UserInfo>({
  id: 1,
  name: '吐丝',
  avatar: '/static/default-avatar.png',
  rating: 4.0,
  utr: '6.77',
  gender: 'male'
})

// 页面加载时获取用户信息
onMounted(() => {
  loadUserInfo()
})

// 加载用户信息
function loadUserInfo() {
  // 从本地存储获取用户信息
  const storedUserInfo = uni.getStorageSync('userInfo')
  if (storedUserInfo) {
    userInfo.value = storedUserInfo
  } else {
    // 如果没有本地存储，调用API获取
    fetchUserInfo()
  }
}

// 获取用户信息API
function fetchUserInfo() {
  // 这里应该调用实际的API
  // 暂时使用模拟数据
  console.log('获取用户信息')
}

// 跳转到订单页面
function goToOrders() {
  uni.navigateTo({
    url: '/pages/my-orders/my-orders'
  })
}

// 跳转到卡包页面
function goToWallet() {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 跳转到我的活动
function goToMyActivities() {
  uni.navigateTo({
    url: '/pages/my-activities/my-activities'
  })
}

// 跳转到比赛记录
function goToMatchRecords() {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 跳转到申请创建俱乐部
function goToApplyClub() {
  uni.navigateTo({
    url: '/pages/apply-club/apply-club'
  })
}

// 跳转到申请成为教练
function goToApplyCoach() {
  uni.navigateTo({
    url: '/pages/apply-coach/apply-coach'
  })
}

// 跳转到帮助页面
function goToHelp() {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 联系客服
function contactService() {
  uni.showModal({
    title: '联系客服',
    content: '客服微信：tennis-service\n客服电话：400-123-4567',
    showCancel: false,
    confirmText: '知道了'
  })
}
</script>

<style scoped>
.user-card {
  margin: 20rpx;
  padding: 32rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 32rpx;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 16rpx;
  display: block;
}

.user-rating {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.rating-label {
  font-size: 28rpx;
  color: #666666;
  margin-right: 8rpx;
}

.rating-value {
  font-size: 28rpx;
  color: #333333;
  margin-right: 16rpx;
}

.quick-menu {
  background-color: #ffffff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 32rpx;
}

.menu-row {
  display: flex;
  justify-content: space-around;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.menu-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 16rpx;
}

.menu-text {
  font-size: 28rpx;
  color: #333333;
}

.function-list {
  background-color: #ffffff;
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.list-item:last-child {
  border-bottom: none;
}

.item-icon {
  width: 48rpx;
  height: 48rpx;
  margin-right: 24rpx;
}

.item-text {
  flex: 1;
  font-size: 32rpx;
  color: #333333;
}

.item-arrow {
  font-size: 32rpx;
  color: #cccccc;
}

.contact-service {
  padding: 40rpx 20rpx;
  text-align: center;
}

.service-btn {
  background: none;
  border: none;
  color: #07c160;
  font-size: 28rpx;
  text-decoration: underline;
}
</style>