<template>
  <view class="page-container">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">申请成为教练</text>
      <text class="page-subtitle">加入我们的教练团队，分享您的网球技能</text>
    </view>

    <!-- 申请表单 -->
    <view class="form-container">
      <!-- 个人基本信息 -->
      <view class="form-section">
        <text class="section-title">个人基本信息</text>

        <view class="form-item">
          <text class="form-label">真实姓名 *</text>
          <input
            class="form-input"
            v-model="formData.realName"
            placeholder="请输入真实姓名"
            maxlength="20"
          />
        </view>

        <view class="form-item">
          <text class="form-label">性别 *</text>
          <picker
            class="form-picker"
            :value="genderIndex"
            :range="genders"
            @change="onGenderChange"
          >
            <view class="picker-text">
              {{ genders[genderIndex] || "请选择性别" }}
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="form-label">年龄 *</text>
          <input
            class="form-input"
            v-model="formData.age"
            placeholder="请输入年龄"
            type="number"
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

        <view class="form-item">
          <text class="form-label">所在城市 *</text>
          <input
            class="form-input"
            v-model="formData.city"
            placeholder="请输入所在城市"
            maxlength="20"
          />
        </view>
      </view>

      <!-- 教学经验 -->
      <view class="form-section">
        <text class="section-title">教学经验</text>

        <view class="form-item">
          <text class="form-label">教学年限 *</text>
          <picker
            class="form-picker"
            :value="experienceIndex"
            :range="experienceOptions"
            @change="onExperienceChange"
          >
            <view class="picker-text">
              {{ experienceOptions[experienceIndex] || "请选择教学年限" }}
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="form-label">擅长领域 *</text>
          <view class="checkbox-group">
            <view
              class="checkbox-item"
              v-for="(skill, index) in skillOptions"
              :key="index"
              @click="toggleSkill(skill)"
            >
              <view
                class="checkbox"
                :class="{ checked: formData.skills.includes(skill) }"
              >
                <text v-if="formData.skills.includes(skill)" class="check-icon"
                  >✓</text
                >
              </view>
              <text class="checkbox-label">{{ skill }}</text>
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">个人简介 *</text>
          <textarea
            class="form-textarea"
            v-model="formData.introduction"
            placeholder="请介绍您的教学理念、特色和成就"
            maxlength="500"
          />
        </view>
      </view>

      <!-- 资质证书 -->
      <view class="form-section">
        <text class="section-title">资质证书</text>

        <view class="form-item">
          <text class="form-label">教练等级 *</text>
          <picker
            class="form-picker"
            :value="levelIndex"
            :range="levelOptions"
            @change="onLevelChange"
          >
            <view class="picker-text">
              {{ levelOptions[levelIndex] || "请选择教练等级" }}
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="form-label">证书照片 *</text>
          <view class="upload-grid">
            <view
              class="upload-item"
              v-for="(image, index) in formData.certificates"
              :key="index"
              @click="previewImage(image)"
            >
              <image class="upload-image" :src="image" mode="aspectFill" />
              <view class="delete-btn" @click.stop="deleteCertificate(index)"
                >×</view
              >
            </view>
            <view
              v-if="formData.certificates.length < 3"
              class="upload-item upload-placeholder"
              @click="uploadCertificate"
            >
              <text class="upload-icon">+</text>
              <text class="upload-text">添加证书</text>
            </view>
          </view>
          <text class="upload-tip">最多上传3张证书照片</text>
        </view>

        <view class="form-item">
          <text class="form-label">身份证照片 *</text>
          <view class="id-upload">
            <view class="id-item">
              <text class="id-label">身份证正面</text>
              <view class="upload-area" @click="uploadIdFront">
                <image
                  v-if="formData.idCardFront"
                  class="upload-image"
                  :src="formData.idCardFront"
                  mode="aspectFill"
                />
                <view v-else class="upload-placeholder">
                  <text class="upload-icon">+</text>
                  <text class="upload-text">上传正面</text>
                </view>
              </view>
            </view>
            <view class="id-item">
              <text class="id-label">身份证反面</text>
              <view class="upload-area" @click="uploadIdBack">
                <image
                  v-if="formData.idCardBack"
                  class="upload-image"
                  :src="formData.idCardBack"
                  mode="aspectFill"
                />
                <view v-else class="upload-placeholder">
                  <text class="upload-icon">+</text>
                  <text class="upload-text">上传反面</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 收费标准 -->
      <view class="form-section">
        <text class="section-title">收费标准</text>

        <view class="form-item">
          <text class="form-label">一对一私教课 *</text>
          <view class="price-input">
            <input
              class="form-input price-field"
              v-model="formData.privatePrice"
              placeholder="请输入价格"
              type="number"
            />
            <text class="price-unit">元/小时</text>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">小组课程</text>
          <view class="price-input">
            <input
              class="form-input price-field"
              v-model="formData.groupPrice"
              placeholder="请输入价格"
              type="number"
            />
            <text class="price-unit">元/小时</text>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">陪练服务</text>
          <view class="price-input">
            <input
              class="form-input price-field"
              v-model="formData.sparringPrice"
              placeholder="请输入价格"
              type="number"
            />
            <text class="price-unit">元/小时</text>
          </view>
        </view>
      </view>

      <!-- 可授课时间 -->
      <view class="form-section">
        <text class="section-title">可授课时间</text>

        <view class="form-item">
          <text class="form-label">工作日时间</text>
          <input
            class="form-input"
            v-model="formData.weekdayTime"
            placeholder="例如：18:00-21:00"
            maxlength="20"
          />
        </view>

        <view class="form-item">
          <text class="form-label">周末时间</text>
          <input
            class="form-input"
            v-model="formData.weekendTime"
            placeholder="例如：09:00-18:00"
            maxlength="20"
          />
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-container">
      <button
        class="submit-btn"
        @click="submitApplication"
        :disabled="!isFormValid"
      >
        提交申请
      </button>
      <text class="submit-tip">提交后我们将在3个工作日内审核并回复</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { UserService, UploadService } from "@/services/api";
import { AuthManager } from "@/utils/auth";

interface FormData {
  realName: string;
  gender: string;
  age: string;
  phone: string;
  city: string;
  experience: string;
  skills: string[];
  introduction: string;
  level: string;
  certificates: string[];
  idCardFront: string;
  idCardBack: string;
  privatePrice: string;
  groupPrice: string;
  sparringPrice: string;
  weekdayTime: string;
  weekendTime: string;
}

// 响应式数据
const formData = ref<FormData>({
  realName: "",
  gender: "",
  age: "",
  phone: "",
  city: "",
  experience: "",
  skills: [],
  introduction: "",
  level: "",
  certificates: [],
  idCardFront: "",
  idCardBack: "",
  privatePrice: "",
  groupPrice: "",
  sparringPrice: "",
  weekdayTime: "",
  weekendTime: "",
});

const genders = ref(["男", "女"]);
const genderIndex = ref(0);

const experienceOptions = ref([
  "1年以下",
  "1-3年",
  "3-5年",
  "5-10年",
  "10年以上",
]);
const experienceIndex = ref(0);

const skillOptions = ref([
  "基础教学",
  "技术提升",
  "战术指导",
  "体能训练",
  "青少年培训",
  "成人培训",
]);

const levelOptions = ref([
  "初级教练",
  "PTR认证",
  "ITF认证",
  "USPTA认证",
  "国家级教练",
]);
const levelIndex = ref(0);

// 计算属性
const isFormValid = computed(() => {
  return (
    formData.value.realName &&
    formData.value.gender &&
    formData.value.age &&
    formData.value.phone &&
    formData.value.city &&
    formData.value.experience &&
    formData.value.skills.length > 0 &&
    formData.value.introduction &&
    formData.value.level &&
    formData.value.certificates.length > 0 &&
    formData.value.idCardFront &&
    formData.value.idCardBack &&
    formData.value.privatePrice
  );
});

// 页面加载
onMounted(() => {
  // 初始化页面
});

// 页面参数处理
onLoad((options: any) => {
  // 处理页面参数
});

// 性别选择
function onGenderChange(e: any) {
  genderIndex.value = e.detail.value;
  formData.value.gender = genders.value[e.detail.value];
}

// 教学年限选择
function onExperienceChange(e: any) {
  experienceIndex.value = e.detail.value;
  formData.value.experience = experienceOptions.value[e.detail.value];
}

// 教练等级选择
function onLevelChange(e: any) {
  levelIndex.value = e.detail.value;
  formData.value.level = levelOptions.value[e.detail.value];
}

// 切换技能选择
function toggleSkill(skill: string) {
  const index = formData.value.skills.indexOf(skill);
  if (index > -1) {
    formData.value.skills.splice(index, 1);
  } else {
    formData.value.skills.push(skill);
  }
}

// 上传证书
function uploadCertificate() {
  const remainCount = 3 - formData.value.certificates.length;
  uni.chooseImage({
    count: remainCount,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      formData.value.certificates.push(...res.tempFilePaths);
    },
    fail: (err) => {
      console.log("上传失败:", err);
    },
  });
}

// 删除证书
function deleteCertificate(index: number) {
  formData.value.certificates.splice(index, 1);
}

// 上传身份证正面
function uploadIdFront() {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      formData.value.idCardFront = res.tempFilePaths[0];
    },
    fail: (err) => {
      console.log("上传失败:", err);
    },
  });
}

// 上传身份证反面
function uploadIdBack() {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      formData.value.idCardBack = res.tempFilePaths[0];
    },
    fail: (err) => {
      console.log("上传失败:", err);
    },
  });
}

// 预览图片
function previewImage(image: string) {
  uni.previewImage({
    urls: [image],
    current: image,
  });
}

// 提交申请
async function submitApplication() {
  if (!isFormValid.value) {
    uni.showToast({
      title: "请填写完整信息",
      icon: "none",
    });
    return;
  }

  // 检查登录状态
  if (!AuthManager.isLoggedIn()) {
    uni.showModal({
      title: "提示",
      content: "请先登录后再申请成为教练",
      showCancel: false,
      success: () => {
        uni.navigateTo({
          url: "/pages/login/login"
        });
      }
    });
    return;
  }

  uni.showLoading({
    title: "提交中...",
  });

  try {
    // 上传身份证照片
    let idCardFrontUrl = "";
    let idCardBackUrl = "";
    
    if (formData.value.idCardFront) {
      const frontResult = await UploadService.uploadImage(formData.value.idCardFront);
      idCardFrontUrl = frontResult.url;
    }
    
    if (formData.value.idCardBack) {
      const backResult = await UploadService.uploadImage(formData.value.idCardBack);
      idCardBackUrl = backResult.url;
    }

    // 上传证书照片
    const certificateUrls: string[] = [];
    for (const certPath of formData.value.certificates) {
      const certResult = await UploadService.uploadImage(certPath);
      certificateUrls.push(certResult.url);
    }

    // 提交申请数据
    const applicationData = {
      realName: formData.value.realName,
      gender: formData.value.gender,
      age: parseInt(formData.value.age),
      phone: formData.value.phone,
      city: formData.value.city,
      experience: formData.value.experience,
      skills: formData.value.skills,
      introduction: formData.value.introduction,
      level: formData.value.level,
      certificates: certificateUrls,
      idCardFront: idCardFrontUrl,
      idCardBack: idCardBackUrl,
      privatePrice: parseFloat(formData.value.privatePrice),
      groupPrice: parseFloat(formData.value.groupPrice),
      sparringPrice: parseFloat(formData.value.sparringPrice),
      weekdayTime: formData.value.weekdayTime,
      weekendTime: formData.value.weekendTime
    };

    await UserService.createCoachApplication(applicationData);

    uni.hideLoading();
    uni.showModal({
      title: "申请提交成功",
      content: "我们将在3个工作日内审核您的申请，请耐心等待",
      showCancel: false,
      success: () => {
        uni.navigateBack();
      },
    });
  } catch (error: any) {
    uni.hideLoading();
    uni.showToast({
      title: error.message || "提交失败，请重试",
      icon: "none",
      duration: 2000
    });
  }
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

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 4rpx;
  margin-right: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox.checked {
  background-color: #07c160;
  border-color: #07c160;
}

.check-icon {
  color: #ffffff;
  font-size: 20rpx;
}

.checkbox-label {
  font-size: 28rpx;
  color: #333333;
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
  height: 100%;
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

.id-upload {
  display: flex;
  gap: 20rpx;
}

.id-item {
  flex: 1;
}

.id-label {
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 12rpx;
  display: block;
}

.upload-area {
  width: 100%;
  height: 160rpx;
  border: 2rpx dashed #e5e5e5;
  border-radius: 8rpx;
  overflow: hidden;
}

.price-input {
  display: flex;
  align-items: center;
}

.price-field {
  flex: 1;
  margin-right: 20rpx;
}

.price-unit {
  font-size: 28rpx;
  color: #666666;
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
