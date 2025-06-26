<template>
  <view class="page-container">
    <!-- 活动头部信息 -->
    <view class="activity-header card">
      <view class="header-top">
        <text class="activity-title">{{ activity.title }}</text>
        <view class="activity-status" :class="activity.status">
          {{ getActivityStatusText(activity.status) }}
        </view>
      </view>
      
      <view class="activity-tags">
        <text class="tag" v-for="tag in activity.tags" :key="tag">{{ tag }}</text>
      </view>
      
      <view class="price-section">
        <text class="price-label">活动费用</text>
        <text class="price-value">¥{{ activity.price }}</text>
      </view>
    </view>

    <!-- 活动详情 -->
    <view class="activity-details card">
      <view class="detail-section">
        <view class="section-title">活动信息</view>
        
        <view class="detail-item">
          <image class="detail-icon" src="/static/icon-time.png" mode="aspectFit"></image>
          <view class="detail-content">
            <text class="detail-label">活动时间</text>
            <text class="detail-value">{{ activity.time }}</text>
          </view>
        </view>
        
        <view class="detail-item">
          <image class="detail-icon" src="/static/icon-location.png" mode="aspectFit"></image>
          <view class="detail-content">
            <text class="detail-label">活动地点</text>
            <text class="detail-value">{{ activity.location }}</text>
            <button class="location-btn" @click="openMap">查看地图</button>
          </view>
        </view>
        
        <view class="detail-item">
          <image class="detail-icon" src="/static/icon-utr.png" mode="aspectFit"></image>
          <view class="detail-content">
            <text class="detail-label">UTR要求</text>
            <text class="detail-value">{{ activity.utrRange }}</text>
          </view>
        </view>
        
        <view class="detail-item" v-if="activity.ageRange">
          <image class="detail-icon" src="/static/icon-age.png" mode="aspectFit"></image>
          <view class="detail-content">
            <text class="detail-label">年龄要求</text>
            <text class="detail-value">{{ activity.ageRange }}</text>
          </view>
        </view>
        
        <view class="detail-item" v-if="activity.gender">
          <image class="detail-icon" src="/static/icon-gender.png" mode="aspectFit"></image>
          <view class="detail-content">
            <text class="detail-label">性别要求</text>
            <text class="detail-value">{{ activity.gender }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 报名情况 -->
    <view class="participants-section card">
      <view class="section-title">报名情况</view>
      
      <view class="participants-stats">
        <view class="stat-item">
          <text class="stat-number">{{ activity.participants }}</text>
          <text class="stat-label">已报名</text>
        </view>
        <view class="stat-divider">/</view>
        <view class="stat-item">
          <text class="stat-number">{{ activity.maxParticipants }}</text>
          <text class="stat-label">总名额</text>
        </view>
      </view>
      
      <view class="progress-section">
        <view class="progress-bar">
          <view 
            class="progress-fill" 
            :style="{ width: (activity.participants / activity.maxParticipants * 100) + '%' }"
          ></view>
        </view>
        <text class="progress-text">
          还剩 {{ activity.maxParticipants - activity.participants }} 个名额
        </text>
      </view>
      
      <!-- 已报名用户列表 -->
      <view class="participants-list" v-if="participantsList.length > 0">
        <text class="list-title">已报名用户</text>
        <view class="participant-item" v-for="participant in participantsList" :key="participant.id">
          <image class="participant-avatar" :src="participant.avatar" mode="aspectFill"></image>
          <view class="participant-info">
            <text class="participant-name">{{ participant.name }}</text>
            <text class="participant-utr">UTR {{ participant.utr }}</text>
          </view>
          <view class="participant-level" :class="participant.level">
            {{ getLevelText(participant.level) }}
          </view>
        </view>
      </view>
    </view>

    <!-- 活动描述 -->
    <view class="description-section card" v-if="activity.description">
      <view class="section-title">活动描述</view>
      <text class="description-text">{{ activity.description }}</text>
    </view>

    <!-- 注意事项 -->
    <view class="notice-section card">
      <view class="section-title">注意事项</view>
      <view class="notice-list">
        <text class="notice-item">• 请提前15分钟到达场地</text>
        <text class="notice-item">• 请自备球拍和运动装备</text>
        <text class="notice-item">• 如需取消报名，请提前24小时联系客服</text>
        <text class="notice-item">• 活动期间请注意安全，量力而行</text>
        <text class="notice-item">• 遇恶劣天气活动可能延期或取消</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <button class="contact-btn" @click="contactOrganizer">联系主办方</button>
      <button 
        class="join-btn" 
        :class="{ disabled: activity.status !== 'open' }"
        @click="joinActivity"
        :disabled="activity.status !== 'open'"
      >
        {{ getJoinButtonText(activity.status) }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Activity {
  id: number
  title: string
  time: string
  location: string
  utrRange: string
  ageRange?: string
  gender?: string
  participants: number
  maxParticipants: number
  price: number
  status: 'open' | 'full' | 'closed' | 'cancelled'
  tags: string[]
  description?: string
  organizer: {
    name: string
    phone: string
    avatar: string
  }
  venue: {
    name: string
    address: string
    latitude: number
    longitude: number
  }
}

interface Participant {
  id: number
  name: string
  avatar: string
  utr: number
  level: 'beginner' | 'intermediate' | 'advanced'
}

// 响应式数据
const activity = ref<Activity>({
  id: 0,
  title: '',
  time: '',
  location: '',
  utrRange: '',
  participants: 0,
  maxParticipants: 0,
  price: 0,
  status: 'open',
  tags: [],
  organizer: {
    name: '',
    phone: '',
    avatar: ''
  },
  venue: {
    name: '',
    address: '',
    latitude: 0,
    longitude: 0
  }
})

const participantsList = ref<Participant[]>([])
const loading = ref(false)

// 页面加载
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  
  if (options.id) {
    loadActivityDetail(parseInt(options.id))
  }
})

// 加载活动详情
function loadActivityDetail(id: number) {
  loading.value = true
  
  // 模拟数据，实际应该调用API
  setTimeout(() => {
    activity.value = {
      id: id,
      title: 'UTR网球积分赛3.0（蒙马体育）',
      time: '06月26日 周四 09:30-12:00',
      location: '城东体育网球训练中心',
      utrRange: '2.0-4.0',
      participants: 5,
      maxParticipants: 8,
      price: 120,
      status: 'open',
      tags: ['有顶棚', '4人打', 'UTR2-4', '冠军300'],
      description: '本次活动是专为UTR 2.0-4.0水平的球友举办的积分赛，采用单打形式，每场比赛为抢七局制。比赛将严格按照UTR积分规则进行，获胜者将获得相应的UTR积分提升。活动提供专业裁判和计分服务，确保比赛的公平公正。',
      organizer: {
        name: '蒙马体育',
        phone: '400-123-4567',
        avatar: '/static/organizer-avatar.png'
      },
      venue: {
        name: '城东体育网球训练中心',
        address: '杭州市江干区城东路123号',
        latitude: 30.2741,
        longitude: 120.1551
      }
    }
    
    participantsList.value = [
      {
        id: 1,
        name: '张三',
        avatar: '/static/avatar1.png',
        utr: 3.2,
        level: 'intermediate'
      },
      {
        id: 2,
        name: '李四',
        avatar: '/static/avatar2.png',
        utr: 2.8,
        level: 'intermediate'
      },
      {
        id: 3,
        name: '王五',
        avatar: '/static/avatar3.png',
        utr: 3.5,
        level: 'intermediate'
      },
      {
        id: 4,
        name: '赵六',
        avatar: '/static/avatar4.png',
        utr: 2.5,
        level: 'beginner'
      },
      {
        id: 5,
        name: '钱七',
        avatar: '/static/avatar5.png',
        utr: 3.8,
        level: 'advanced'
      }
    ]
    
    loading.value = false
  }, 1000)
}

// 获取活动状态文本
function getActivityStatusText(status: string) {
  const statusMap = {
    'open': '报名中',
    'full': '已满员',
    'closed': '已结束',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知状态'
}

// 获取报名按钮文本
function getJoinButtonText(status: string) {
  const buttonMap = {
    'open': '立即报名',
    'full': '已满员',
    'closed': '已结束',
    'cancelled': '已取消'
  }
  return buttonMap[status] || '立即报名'
}

// 获取水平等级文本
function getLevelText(level: string) {
  const levelMap = {
    'beginner': '初级',
    'intermediate': '中级',
    'advanced': '高级'
  }
  return levelMap[level] || '未知'
}

// 报名活动
function joinActivity() {
  if (activity.value.status !== 'open') {
    return
  }
  
  uni.showModal({
    title: '确认报名',
    content: `确认报名参加「${activity.value.title}」？\n\n活动时间：${activity.value.time}\n活动地点：${activity.value.location}\n费用：¥${activity.value.price}`,
    success: (res) => {
      if (res.confirm) {
        // 模拟报名成功
        activity.value.participants++
        if (activity.value.participants >= activity.value.maxParticipants) {
          activity.value.status = 'full'
        }
        
        // 添加当前用户到参与者列表
        participantsList.value.push({
          id: Date.now(),
          name: '我',
          avatar: '/static/my-avatar.png',
          utr: 3.0,
          level: 'intermediate'
        })
        
        uni.showToast({
          title: '报名成功',
          icon: 'success'
        })
      }
    }
  })
}

// 联系主办方
function contactOrganizer() {
  uni.showActionSheet({
    itemList: ['拨打电话', '发送消息'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 拨打电话
        uni.makePhoneCall({
          phoneNumber: activity.value.organizer.phone
        })
      } else if (res.tapIndex === 1) {
        // 发送消息（跳转到客服页面）
        uni.navigateTo({
          url: '/pages/customer-service/customer-service'
        })
      }
    }
  })
}

// 打开地图
function openMap() {
  uni.openLocation({
    latitude: activity.value.venue.latitude,
    longitude: activity.value.venue.longitude,
    name: activity.value.venue.name,
    address: activity.value.venue.address
  })
}
</script>

<style scoped>
.activity-header {
  margin-bottom: 20rpx;
  padding: 32rpx;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.activity-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  flex: 1;
  margin-right: 20rpx;
  line-height: 1.3;
}

.activity-status {
  padding: 12rpx 20rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #ffffff;
  white-space: nowrap;
}

.activity-status.open {
  background-color: #07c160;
}

.activity-status.full {
  background-color: #ff6b6b;
}

.activity-status.closed {
  background-color: #999999;
}

.activity-status.cancelled {
  background-color: #ff4757;
}

.price-section {
  display: flex;
  align-items: baseline;
  margin-top: 20rpx;
}

.price-label {
  font-size: 28rpx;
  color: #666666;
  margin-right: 16rpx;
}

.price-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #ff6b6b;
}

.activity-details {
  margin-bottom: 20rpx;
  padding: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 24rpx;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 16rpx;
  margin-top: 4rpx;
}

.detail-content {
  flex: 1;
}

.detail-label {
  font-size: 28rpx;
  color: #666666;
  display: block;
  margin-bottom: 8rpx;
}

.detail-value {
  font-size: 30rpx;
  color: #333333;
  display: block;
  line-height: 1.4;
}

.location-btn {
  background-color: #07c160;
  color: #ffffff;
  border-radius: 20rpx;
  padding: 8rpx 20rpx;
  font-size: 24rpx;
  border: none;
  margin-top: 12rpx;
}

.participants-section {
  margin-bottom: 20rpx;
  padding: 32rpx;
}

.participants-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 48rpx;
  font-weight: bold;
  color: #07c160;
}

.stat-label {
  font-size: 26rpx;
  color: #666666;
  margin-top: 8rpx;
}

.stat-divider {
  font-size: 36rpx;
  color: #cccccc;
  margin: 0 40rpx;
}

.progress-section {
  margin-bottom: 32rpx;
}

.progress-bar {
  width: 100%;
  height: 12rpx;
  background-color: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.progress-fill {
  height: 100%;
  background-color: #07c160;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 26rpx;
  color: #666666;
  text-align: center;
  display: block;
}

.participants-list {
  border-top: 1rpx solid #f0f0f0;
  padding-top: 24rpx;
}

.list-title {
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 20rpx;
  display: block;
}

.participant-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.participant-item:last-child {
  margin-bottom: 0;
}

.participant-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  margin-right: 16rpx;
}

.participant-info {
  flex: 1;
}

.participant-name {
  font-size: 28rpx;
  color: #333333;
  display: block;
  margin-bottom: 4rpx;
}

.participant-utr {
  font-size: 24rpx;
  color: #666666;
}

.participant-level {
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  font-size: 22rpx;
  color: #ffffff;
}

.participant-level.beginner {
  background-color: #52c41a;
}

.participant-level.intermediate {
  background-color: #1890ff;
}

.participant-level.advanced {
  background-color: #f5222d;
}

.description-section {
  margin-bottom: 20rpx;
  padding: 32rpx;
}

.description-text {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
}

.notice-section {
  margin-bottom: 120rpx;
  padding: 32rpx;
}

.notice-list {
  margin-top: 16rpx;
}

.notice-item {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 12rpx;
  display: block;
}

.notice-item:last-child {
  margin-bottom: 0;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  gap: 20rpx;
  z-index: 100;
}

.contact-btn {
  flex: 1;
  background-color: #f8f8f8;
  color: #333333;
  border-radius: 32rpx;
  padding: 20rpx;
  font-size: 30rpx;
  border: none;
}

.join-btn {
  flex: 2;
  background-color: #07c160;
  color: #ffffff;
  border-radius: 32rpx;
  padding: 20rpx;
  font-size: 30rpx;
  font-weight: bold;
  border: none;
}

.join-btn.disabled {
  background-color: #cccccc;
  color: #999999;
}
</style>