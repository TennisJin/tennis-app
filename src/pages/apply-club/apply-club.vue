<template>
  <view class="page-container">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">申请创建俱乐部</text>
      <text class="page-subtitle">填写以下信息，我们将尽快审核您的申请</text>
    </view>

    <!-- 申请表单 -->
    <view class="form-container">
      <!-- 俱乐部基本信息 -->
      <view class="form-section">
        <text class="section-title">俱乐部基本信息</text>
        
        <view class="form-item">
          <text class="form-label">俱乐部名称 *</text>
          <input 
            class="form-input" 
            v-model="formData.clubName" 
            placeholder="请输入俱乐部名称"
            maxlength="50"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">俱乐部简介 *</text>
          <textarea 
            class="form-textarea" 
            v-model="formData.description" 
            placeholder="请简要介绍俱乐部的特色和服务"
            maxlength="500"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">俱乐部地址 *</text>
          <input 
            class="form-input" 
            v-model="formData.address" 
            placeholder="请输入详细地址"
            maxlength="100"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">联系电话 *</text>
          <input 
            class="form-input" 
            v-model="formData.phone" 
            placeholder="请输入联系电话"
            type="number"
            maxlength="11"
          />
        </view>
      </view>

      <!-- 场地信息 -->
      <view class="form-section">
        <text class="section-title">场地信息</text>
        
        <view class="form-item">
          <text class="form-label">场地数量 *</text>
          <input 
            class="form-input" 
            v-model="formData.courtCount" 
            placeholder="请输入场地数量"
            type="number"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">场地类型 *</text>
          <picker 
            class="form-picker" 
            :value="courtTypeIndex" 
            :range="courtTypes" 
            @change="onCourtTypeChange"
          >
            <view class="picker-text">
              {{ courtTypes[courtTypeIndex] || '请选择场地类型' }}
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label">营业时间 *</text>
          <input 
            class="form-input" 
            v-model="formData.businessHours" 
            placeholder="例如：06:00-22:00"
            maxlength="20"
          />
        </view>
      </view>

      <!-- 资质证明 -->
      <view class="form-section">
        <text class="section-title">资质证明</text>
        
        <view class="form-item">
          <text class="form-label">营业执照 *</text>
          <view class="upload-area" @click="uploadLicense">
            <image 
              v-if="formData.licenseImage" 
              class="upload-image" 
              :src="formData.licenseImage" 
              mode="aspectFill"
            />
            <view v-else class="upload-placeholder">
              <text class="upload-icon">+</text>
              <text class="upload-text">上传营业执照</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">场地照片 *</text>
          <view class="upload-grid">
            <view 
              class="upload-item" 
              v-for="(image, index) in formData.courtImages" 
              :key="index"
              @click="previewImage(image)"
            >
              <image class="upload-image" :src="image" mode="aspectFill" />
              <view class="delete-btn" @click.stop="deleteImage(index)">×</view>
            </view>
            <view 
              v-if="formData.courtImages.length < 6" 
              class="upload-item upload-placeholder" 
              @click="uploadCourtImage"
            >
              <text class="upload-icon">+</text>
              <text class="upload-text">添加照片</text>
            </view>
          </view>
          <text class="upload-tip">最多上传6张场地照片</text>
        </view>
      </view>

      <!-- 联系人信息 -->
      <view class="form-section">
        <text class="section-title">联系人信息</text>
        
        <view class="form-item">
          <text class="form-label">联系人姓名 *</text>
          <input 
            class="form-input" 
            v-model="formData.contactName" 
            placeholder="请输入联系人姓名"
            maxlength="20"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">联系人职位</text>
          <input 
            class="form-input" 
            v-model="formData.contactPosition" 
            placeholder="请输入联系人职位"
            maxlength="30"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">微信号</text>
          <input 
            class="form-input" 
            v-model="formData.wechat" 
            placeholder="请输入微信号"
            maxlength="50"
          />
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-container">
      <button class="submit-btn" @click="submitApplication" :disabled="!isFormValid">
        提交申请
      </button>
      <text class="submit-tip">提交后我们将在3个工作日内审核并回复</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

interface FormData {
  clubName: string
  description: string
  address: string
  phone: string
  courtCount: string
  courtType: string
  businessHours: string
  licenseImage: string
  courtImages: string[]
  contactName: string
  contactPosition: string
  wechat: string
}

// 响应式数据
const formData = ref<FormData>({
  clubName: '',
  description: '',
  address: '',
  phone: '',
  courtCount: '',
  courtType: '',
  businessHours: '',
  licenseImage: '',
  courtImages: [],
  contactName: '',
  contactPosition: '',
  wechat: ''
})

const courtTypes = ref(['室内硬地', '室外硬地', '红土场', '草地场', '人工草场'])
const courtTypeIndex = ref(0)

// 计算属性
const isFormValid = computed(() => {
  return formData.value.clubName && 
         formData.value.description && 
         formData.value.address && 
         formData.value.phone && 
         formData.value.courtCount && 
         formData.value.courtType && 
         formData.value.businessHours && 
         formData.value.licenseImage && 
         formData.value.courtImages.length > 0 && 
         formData.value.contactName
})

// 页面加载
onMounted(() => {
  // 初始化页面
})

// 页面参数处理
onLoad((options: any) => {
  // 处理页面参数
})

// 场地类型选择
function onCourtTypeChange(e: any) {
  courtTypeIndex.value = e.detail.value
  formData.value.courtType = courtTypes.value[e.detail.value]
}

// 上传营业执照
function uploadLicense() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.licenseImage = res.tempFilePaths[0]
    },
    fail: (err) => {
      console.log('上传失败:', err)
    }
  })
}

// 上传场地照片
function uploadCourtImage() {
  const remainCount = 6 - formData.value.courtImages.length
  uni.chooseImage({
    count: remainCount,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.courtImages.push(...res.tempFilePaths)
    },
    fail: (err) => {
      console.log('上传失败:', err)
    }
  })
}

// 预览图片
function previewImage(image: string) {
  uni.previewImage({
    urls: [image],
    current: image
  })
}

// 删除图片
function deleteImage(index: number) {
  formData.value.courtImages.splice(index, 1)
}

// 提交申请
function submitApplication() {
  if (!isFormValid.value) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }
  
  uni.showLoading({
    title: '提交中...'
  })
  
  // 模拟提交
  setTimeout(() => {
    uni.hideLoading()
    uni.showModal({
      title: '申请提交成功',
      content: '我们将在3个工作日内审核您的申请，请耐心等待',
      showCancel: false,
      success: () => {
        uni.navigateBack()
      }
    })
  }, 2000)
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.page-header {
  background-color: #ffffff;
  padding: 40rpx 30rpx;
  text-align: center;
  border-bottom: 1rpx solid #e5e5e5;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 16rpx;
}

.page-subtitle {
  font-size: 28rpx;
  color: #666666;
}

.form-container {
  padding: 20rpx;
}

.form-section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 30rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #07c160;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 28rpx;
  color: #333333;
  display: block;
  margin-bottom: 16rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333333;
  background-color: #ffffff;
}

.form-textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 20rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333333;
  background-color: #ffffff;
}

.form-picker {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  background-color: #ffffff;
}

.picker-text {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333333;
}

.upload-area {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #e5e5e5;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.upload-item {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  position: relative;
  overflow: hidden;
}

.upload-image {
  width: 100%;
  height: 100%;
}

.upload-placeholder {
  border: 2rpx dashed #e5e5e5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
}

.upload-icon {
  font-size: 48rpx;
  color: #cccccc;
  margin-bottom: 8rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #999999;
}

.delete-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.upload-tip {
  font-size: 24rpx;
  color: #999999;
  margin-top: 16rpx;
}

.submit-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 30rpx;
  border-top: 1rpx solid #e5e5e5;
  text-align: center;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background-color: #07c160;
  color: #ffffff;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  margin-bottom: 16rpx;
}

.submit-btn:disabled {
  background-color: #cccccc;
}

.submit-tip {
  font-size: 24rpx;
  color: #999999;
}
</style>