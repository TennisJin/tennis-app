<template>
  <view class="page-container">
    <!-- 活动状态筛选 -->
    <view class="status-tabs">
      <view 
        class="tab-item" 
        :class="{ active: currentStatus === status.key }"
        v-for="status in statusOptions" 
        :key="status.key"
        @click="switchStatus(status.key)"
      >
        {{ status.label }}
      </view>
    </view>

    <!-- 活动列表 -->
    <view class="activity-list" v-if="activityList.length > 0">
      <view 
        class="activity-item card" 
        v-for="activity in filteredActivities" 
        :key="activity.id"
        @click="goToActivityDetail(activity.id)"
      >
        <view class="activity-header">
          <text class="activity-title">{{ activity.title }}</text>
          <view class="activity-status" :class="activity.status">
            {{ getStatusText(activity.status) }}
          </view>
        </view>
        
        <view class="activity-info">
          <view class="info-row">
            <text class="info-label">时间:</text>
            <text class="info-value">{{ activity.time }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">地点:</text>
            <text class="info-value">{{ activity.location }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">UTR要求:</text>
            <text class="info-value">{{ activity.utrRange }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">参与人数:</text>
            <text class="info-value">{{ activity.participants }}/{{ activity.maxParticipants }}</text>
          </view>
        </view>
        
        <view class="activity-actions">
          <button 
            class="action-btn" 
            v-if="activity.status === 'registered'"
            @click.stop="cancelActivity(activity.id)"
          >
            取消报名
          </button>
          <button 
            class="action-btn primary" 
            v-if="activity.status === 'completed'"
            @click.stop="rateActivity(activity.id)"
          >
            评价活动
          </button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-text">暂无活动记录</text>
      <text class="empty-tip">去参加一个UTR活动吧</text>
      <button class="go-activities-btn" @click="goToActivities">查看活动</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

interface Activity {
  id: number
  title: string
  time: string
  location: string
  utrRange: string
  participants: number
  maxParticipants: number
  status: 'registered' | 'completed' | 'cancelled'
  registerTime: string
  fee: number
}

interface StatusOption {
  key: string
  label: string
}

// 响应式数据
const activityList = ref<Activity[]>([])
const currentStatus = ref('all')
const loading = ref(false)

// 状态选项
const statusOptions = ref<StatusOption[]>([
  { key: 'all', label: '全部' },
  { key: 'registered', label: '已报名' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' }
])

// 过滤后的活动列表
const filteredActivities = computed(() => {
  if (currentStatus.value === 'all') {
    return activityList.value
  }
  return activityList.value.filter(activity => activity.status === currentStatus.value)
})

// 页面加载
onMounted(() => {
  loadActivityList()
})

// 页面参数处理
onLoad((options: any) => {
  if (options.status) {
    currentStatus.value = options.status
  }
})

// 加载活动列表
function loadActivityList() {
  loading.value = true
  
  // 模拟数据
  setTimeout(() => {
    activityList.value = [
      {
        id: 1,
        title: '周末UTR积分赛',
        time: '2024-01-20 14:00-18:00',
        location: '星河网球俱乐部',
        utrRange: '4.0-6.0',
        participants: 8,
        maxParticipants: 16,
        status: 'registered',
        registerTime: '2024-01-15 10:30:00',
        fee: 100
      },
      {
        id: 2,
        title: '新手友谊赛',
        time: '2024-01-18 16:00-18:00',
        location: '蓝天网球中心',
        utrRange: '2.0-4.0',
        participants: 12,
        maxParticipants: 12,
        status: 'completed',
        registerTime: '2024-01-14 15:20:00',
        fee: 50
      }
    ]
    loading.value = false
  }, 1000)
}

// 切换状态
function switchStatus(status: string) {
  currentStatus.value = status
}

// 获取状态文本
function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    'registered': '已报名',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知状态'
}

// 取消报名
function cancelActivity(activityId: number) {
  uni.showModal({
    title: '确认取消',
    content: '确定要取消报名吗？',
    success: (res) => {
      if (res.confirm) {
        // 处理取消逻辑
        console.log('取消报名:', activityId)
      }
    }
  })
}

// 评价活动
function rateActivity(activityId: number) {
  console.log('评价活动:', activityId)
  // 跳转到评价页面
}

// 查看活动详情
function goToActivityDetail(activityId: number) {
  uni.navigateTo({
    url: `/pages/activity-detail/activity-detail?id=${activityId}`
  })
}

// 去查看活动
function goToActivities() {
  uni.navigateTo({
    url: '/pages/activities/activities'
  })
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.status-tabs {
  display: flex;
  background-color: #ffffff;
  padding: 0 20rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  font-size: 28rpx;
  color: #666666;
  position: relative;
}

.tab-item.active {
  color: #07c160;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background-color: #07c160;
  border-radius: 2rpx;
}

.activity-list {
  padding: 20rpx;
}

.activity-item {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.activity-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  flex: 1;
}

.activity-status {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #ffffff;
}

.activity-status.registered {
  background-color: #07c160;
}

.activity-status.completed {
  background-color: #576b95;
}

.activity-status.cancelled {
  background-color: #fa5151;
}

.activity-info {
  margin-bottom: 20rpx;
}

.info-row {
  display: flex;
  margin-bottom: 12rpx;
}

.info-label {
  font-size: 28rpx;
  color: #666666;
  width: 140rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333333;
  flex: 1;
}

.activity-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}

.action-btn {
  padding: 16rpx 32rpx;
  border-radius: 24rpx;
  font-size: 28rpx;
  border: 1rpx solid #e5e5e5;
  background-color: #ffffff;
  color: #333333;
}

.action-btn.primary {
  background-color: #07c160;
  color: #ffffff;
  border-color: #07c160;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;
  text-align: center;
}

.empty-text {
  font-size: 32rpx;
  color: #999999;
  margin-bottom: 16rpx;
}

.empty-tip {
  font-size: 28rpx;
  color: #cccccc;
  margin-bottom: 40rpx;
}

.go-activities-btn {
  padding: 20rpx 40rpx;
  background-color: #07c160;
  color: #ffffff;
  border-radius: 24rpx;
  font-size: 28rpx;
  border: none;
}

.card {
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}
</style>