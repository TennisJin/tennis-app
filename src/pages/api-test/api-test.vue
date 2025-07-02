<template>
  <view class="api-test-page">
    <view class="header">
      <text class="title">API连接测试</text>
      <text class="subtitle">测试前后端API连接状态</text>
    </view>

    <!-- 健康检查 -->
    <view class="test-section">
      <view class="section-title">
        <text>1. 健康检查</text>
        <view class="status" :class="healthStatus">
          <text>{{ healthStatusText }}</text>
        </view>
      </view>
      <button @click="testHealth" :disabled="healthTesting" class="test-btn">
        {{ healthTesting ? '检测中...' : '测试健康检查' }}
      </button>
      <view v-if="healthResult" class="result">
        <text class="result-title">结果：</text>
        <text class="result-content">{{ healthResult }}</text>
      </view>
    </view>

    <!-- 用户API测试 -->
    <view class="test-section">
      <view class="section-title">
        <text>2. 用户API测试</text>
        <view class="status" :class="userStatus">
          <text>{{ userStatusText }}</text>
        </view>
      </view>
      <button @click="testUserAPI" :disabled="userTesting" class="test-btn">
        {{ userTesting ? '测试中...' : '测试用户接口' }}
      </button>
      <view v-if="userResult" class="result">
        <text class="result-title">结果：</text>
        <text class="result-content">{{ userResult }}</text>
      </view>
    </view>

    <!-- 俱乐部API测试 -->
    <view class="test-section">
      <view class="section-title">
        <text>3. 俱乐部API测试</text>
        <view class="status" :class="clubStatus">
          <text>{{ clubStatusText }}</text>
        </view>
      </view>
      <button @click="testClubAPI" :disabled="clubTesting" class="test-btn">
        {{ clubTesting ? '测试中...' : '测试俱乐部接口' }}
      </button>
      <view v-if="clubResult" class="result">
        <text class="result-title">结果：</text>
        <text class="result-content">{{ clubResult }}</text>
      </view>
    </view>

    <!-- 活动API测试 -->
    <view class="test-section">
      <view class="section-title">
        <text>4. 活动API测试</text>
        <view class="status" :class="activityStatus">
          <text>{{ activityStatusText }}</text>
        </view>
      </view>
      <button @click="testActivityAPI" :disabled="activityTesting" class="test-btn">
        {{ activityTesting ? '测试中...' : '测试活动接口' }}
      </button>
      <view v-if="activityResult" class="result">
        <text class="result-title">结果：</text>
        <text class="result-content">{{ activityResult }}</text>
      </view>
    </view>

    <!-- 文件上传测试 -->
    <view class="test-section">
      <view class="section-title">
        <text>5. 文件上传测试</text>
        <view class="status" :class="uploadStatus">
          <text>{{ uploadStatusText }}</text>
        </view>
      </view>
      <button @click="testUpload" :disabled="uploadTesting" class="test-btn">
        {{ uploadTesting ? '测试中...' : '测试文件上传' }}
      </button>
      <view v-if="uploadResult" class="result">
        <text class="result-title">结果：</text>
        <text class="result-content">{{ uploadResult }}</text>
      </view>
    </view>

    <!-- 全部测试 -->
    <view class="test-section">
      <button @click="runAllTests" :disabled="allTesting" class="test-all-btn">
        {{ allTesting ? '全部测试中...' : '运行全部测试' }}
      </button>
    </view>

    <!-- 测试结果汇总 -->
    <view v-if="showSummary" class="summary">
      <text class="summary-title">测试结果汇总</text>
      <view class="summary-item">
        <text>健康检查：</text>
        <text :class="healthStatus">{{ healthStatusText }}</text>
      </view>
      <view class="summary-item">
        <text>用户接口：</text>
        <text :class="userStatus">{{ userStatusText }}</text>
      </view>
      <view class="summary-item">
        <text>俱乐部接口：</text>
        <text :class="clubStatus">{{ clubStatusText }}</text>
      </view>
      <view class="summary-item">
        <text>活动接口：</text>
        <text :class="activityStatus">{{ activityStatusText }}</text>
      </view>
      <view class="summary-item">
        <text>文件上传：</text>
        <text :class="uploadStatus">{{ uploadStatusText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  SystemService, 
  UserService, 
  ClubService, 
  ActivityService, 
  UploadService 
} from '@/services/api';
import { getBaseURL } from '@/config/api';

// 测试状态
const healthTesting = ref(false);
const userTesting = ref(false);
const clubTesting = ref(false);
const activityTesting = ref(false);
const uploadTesting = ref(false);
const allTesting = ref(false);

// 测试结果
const healthResult = ref('');
const userResult = ref('');
const clubResult = ref('');
const activityResult = ref('');
const uploadResult = ref('');

// 测试状态枚举
type TestStatus = 'pending' | 'success' | 'error';

const healthTestStatus = ref<TestStatus>('pending');
const userTestStatus = ref<TestStatus>('pending');
const clubTestStatus = ref<TestStatus>('pending');
const activityTestStatus = ref<TestStatus>('pending');
const uploadTestStatus = ref<TestStatus>('pending');

// 计算属性
const healthStatus = computed(() => healthTestStatus.value);
const userStatus = computed(() => userTestStatus.value);
const clubStatus = computed(() => clubTestStatus.value);
const activityStatus = computed(() => activityTestStatus.value);
const uploadStatus = computed(() => uploadTestStatus.value);

const healthStatusText = computed(() => {
  switch (healthTestStatus.value) {
    case 'success': return '✅ 正常';
    case 'error': return '❌ 失败';
    default: return '⏳ 待测试';
  }
});

const userStatusText = computed(() => {
  switch (userTestStatus.value) {
    case 'success': return '✅ 正常';
    case 'error': return '❌ 失败';
    default: return '⏳ 待测试';
  }
});

const clubStatusText = computed(() => {
  switch (clubTestStatus.value) {
    case 'success': return '✅ 正常';
    case 'error': return '❌ 失败';
    default: return '⏳ 待测试';
  }
});

const activityStatusText = computed(() => {
  switch (activityTestStatus.value) {
    case 'success': return '✅ 正常';
    case 'error': return '❌ 失败';
    default: return '⏳ 待测试';
  }
});

const uploadStatusText = computed(() => {
  switch (uploadTestStatus.value) {
    case 'success': return '✅ 正常';
    case 'error': return '❌ 失败';
    default: return '⏳ 待测试';
  }
});

const showSummary = computed(() => {
  return [healthTestStatus.value, userTestStatus.value, clubTestStatus.value, activityTestStatus.value, uploadTestStatus.value]
    .some(status => status !== 'pending');
});

// 测试健康检查
async function testHealth() {
  healthTesting.value = true;
  healthTestStatus.value = 'pending';
  healthResult.value = '';
  
  try {
    console.log('开始测试健康检查，API地址:', getBaseURL());
    const response = await SystemService.healthCheck();
    
    if (response.success) {
      healthTestStatus.value = 'success';
      healthResult.value = `连接成功！服务状态: ${response.data.status}, 时间: ${response.data.timestamp}`;
    } else {
      healthTestStatus.value = 'error';
      healthResult.value = `健康检查失败: ${response.message}`;
    }
  } catch (error: any) {
    console.error('健康检查失败:', error);
    healthTestStatus.value = 'error';
    healthResult.value = `连接失败: ${error.message || '网络错误'}`;
  } finally {
    healthTesting.value = false;
  }
}

// 测试用户API
async function testUserAPI() {
  userTesting.value = true;
  userTestStatus.value = 'pending';
  userResult.value = '';
  
  try {
    const response = await UserService.getUsers({ page: 1, limit: 5 });
    
    if (response.success) {
      userTestStatus.value = 'success';
      userResult.value = `获取用户列表成功！共 ${response.data.total} 个用户，当前页 ${response.data.users.length} 个`;
    } else {
      userTestStatus.value = 'error';
      userResult.value = `用户API失败: ${response.message}`;
    }
  } catch (error: any) {
    console.error('用户API测试失败:', error);
    userTestStatus.value = 'error';
    userResult.value = `用户API失败: ${error.message || '网络错误'}`;
  } finally {
    userTesting.value = false;
  }
}

// 测试俱乐部API
async function testClubAPI() {
  clubTesting.value = true;
  clubTestStatus.value = 'pending';
  clubResult.value = '';
  
  try {
    const response = await ClubService.getClubs({ page: 1, limit: 5 });
    
    if (response.success) {
      clubTestStatus.value = 'success';
      clubResult.value = `获取俱乐部列表成功！共 ${response.data.total} 个俱乐部，当前页 ${response.data.clubs.length} 个`;
    } else {
      clubTestStatus.value = 'error';
      clubResult.value = `俱乐部API失败: ${response.message}`;
    }
  } catch (error: any) {
    console.error('俱乐部API测试失败:', error);
    clubTestStatus.value = 'error';
    clubResult.value = `俱乐部API失败: ${error.message || '网络错误'}`;
  } finally {
    clubTesting.value = false;
  }
}

// 测试活动API
async function testActivityAPI() {
  activityTesting.value = true;
  activityTestStatus.value = 'pending';
  activityResult.value = '';
  
  try {
    const response = await ActivityService.getActivities({ page: 1, limit: 5 });
    
    if (response.success) {
      activityTestStatus.value = 'success';
      activityResult.value = `获取活动列表成功！共 ${response.data.total} 个活动，当前页 ${response.data.activities.length} 个`;
    } else {
      activityTestStatus.value = 'error';
      activityResult.value = `活动API失败: ${response.message}`;
    }
  } catch (error: any) {
    console.error('活动API测试失败:', error);
    activityTestStatus.value = 'error';
    activityResult.value = `活动API失败: ${error.message || '网络错误'}`;
  } finally {
    activityTesting.value = false;
  }
}

// 测试文件上传
async function testUpload() {
  uploadTesting.value = true;
  uploadTestStatus.value = 'pending';
  uploadResult.value = '';
  
  try {
    // 选择图片进行上传测试
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album']
    });
    
    if (res.tempFilePaths && res.tempFilePaths.length > 0) {
      const filePath = res.tempFilePaths[0];
      const response = await UploadService.uploadImage(filePath);
      
      if (response.success) {
        uploadTestStatus.value = 'success';
        uploadResult.value = `文件上传成功！URL: ${response.data.url}`;
      } else {
        uploadTestStatus.value = 'error';
        uploadResult.value = `文件上传失败: ${response.message}`;
      }
    } else {
      uploadTestStatus.value = 'error';
      uploadResult.value = '未选择文件';
    }
  } catch (error: any) {
    console.error('文件上传测试失败:', error);
    uploadTestStatus.value = 'error';
    uploadResult.value = `文件上传失败: ${error.message || '网络错误'}`;
  } finally {
    uploadTesting.value = false;
  }
}

// 运行全部测试
async function runAllTests() {
  allTesting.value = true;
  
  try {
    await testHealth();
    await new Promise(resolve => setTimeout(resolve, 500)); // 延迟500ms
    
    await testUserAPI();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testClubAPI();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testActivityAPI();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    uni.showToast({
      title: '全部测试完成',
      icon: 'success'
    });
  } catch (error) {
    console.error('批量测试失败:', error);
  } finally {
    allTesting.value = false;
  }
}
</script>

<style scoped>
.api-test-page {
  padding: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 26rpx;
  color: #666;
  display: block;
}

.test-section {
  background: white;
  border-radius: 15rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.status {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.status.pending {
  background: #f0f0f0;
  color: #666;
}

.status.success {
  background: #e8f5e8;
  color: #4caf50;
}

.status.error {
  background: #ffeaea;
  color: #f44336;
}

.test-btn {
  width: 100%;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 28rpx;
  margin-bottom: 20rpx;
}

.test-btn:disabled {
  background: #ccc;
}

.test-all-btn {
  width: 100%;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 10rpx;
  padding: 25rpx;
  font-size: 30rpx;
  font-weight: bold;
}

.test-all-btn:disabled {
  background: #ccc;
}

.result {
  background: #f8f9fa;
  border-radius: 8rpx;
  padding: 20rpx;
  border-left: 4rpx solid #007AFF;
}

.result-title {
  font-size: 24rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.result-content {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  word-break: break-all;
}

.summary {
  background: white;
  border-radius: 15rpx;
  padding: 30rpx;
  margin-top: 20rpx;
}

.summary-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
  text-align: center;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  font-size: 26rpx;
}

.summary-item:last-child {
  border-bottom: none;
}
</style>