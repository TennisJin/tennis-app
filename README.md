# 网球 UTR 积分小程序

基于 UTR 积分系统的网球小程序，使用 Uni-app + Vue3 + TypeScript 开发。

## 项目特色

- 🎾 **UTR 积分系统集成** - 全球通用网球技能评估标准
- 🏟️ **场馆预订** - 便捷的网球场地预订功能
- 👨‍🏫 **教练陪练** - 专业教练和陪练信息展示与预约
- 🏆 **UTR 活动** - 丰富的网球活动和比赛
- 🏛️ **俱乐部管理** - 俱乐部信息展示和成员管理
- 📱 **多端支持** - 支持微信小程序、H5、App 等多个平台

## 技术栈

- **前端框架**: Uni-app + Vue3 + TypeScript
- **构建工具**: Vite
- **样式**: CSS3 + Flexbox
- **开发工具**: HBuilderX / VS Code

## 项目结构

```
src/
├── pages/                    # 页面目录
│   ├── index/               # 首页
│   ├── booking/             # 订场页面
│   ├── clubs/               # 俱乐部列表
│   ├── club-detail/         # 俱乐部详情
│   ├── coaches/             # 教练陪练
│   ├── coach-detail/        # 教练详情
│   ├── activities/          # UTR活动
│   ├── activity-detail/     # 活动详情
│   ├── venue-detail/        # 场馆详情
│   └── profile/             # 我的页面
├── styles/                  # 样式文件
│   └── common.css          # 公共样式
├── App.vue                  # 应用入口
├── main.ts                  # 主入口文件
├── manifest.json           # 应用配置
└── pages.json              # 页面路由配置
```

## 功能模块

### 首页功能

- 🔍 **搜索订场** - 快速搜索网球场馆
- 🎯 **快捷功能** - 订场、找教练、UTR 活动、俱乐部
- 👨‍🏫 **教练推荐** - 优质教练和陪练展示
- 🏆 **活动展示** - 最新 UTR 活动信息

### 俱乐部板块

- 🌍 **城市筛选** - 按地理位置筛选俱乐部
- 📋 **我的俱乐部** - 已加入俱乐部列表
- 💡 **智能推荐** - 基于位置和偏好的俱乐部推荐
- 📍 **地图展示** - 俱乐部位置和导航

### 我的板块

- 👤 **个人信息** - UTR 评级、个人资料管理
- 📦 **订单卡包** - 订单历史和会员卡管理
- 🏃‍♂️ **活动记录** - 参与活动和比赛记录
- 🎯 **申请功能** - 创建俱乐部、成为教练申请
- 💬 **帮助反馈** - 客服支持和意见反馈

## 安装和运行

### 环境要求

- Node.js 16+
- npm 或 yarn
- HBuilderX (推荐) 或 VS Code

### 安装依赖

```bash
npm install
```

### 开发运行

```bash
# 微信小程序
npm run dev:mp-weixin

# H5
npm run dev:h5

# App
npm run dev:app
```

### 构建发布

```bash
# 微信小程序
npm run build:mp-weixin

# H5
npm run build:h5

# App
npm run build:app
```

## 开发说明

### 微信小程序开发

1. 使用微信开发者工具导入 `dist/dev/mp-weixin` 目录
2. 配置小程序 AppID
3. 启用开发模式进行调试

### 注意事项

- 确保 Node.js 版本兼容性
- 微信小程序需要配置合法域名
- 地图功能需要申请高德地图 API 密钥
- 支付功能需要配置微信支付

## 核心特性

### UTR 积分系统

- 实时 UTR 评级查询
- 比赛数据分析
- 积分变化历史
- 个性化训练建议

### 智能匹配

- 基于 UTR 评级的对手匹配
- 教练技能标签筛选
- 地理位置智能推荐
- 个性化活动推送

### 社交功能

- 俱乐部成员互动
- 活动报名和组织
- 比赛成绩分享
- 经验交流平台

## 商业价值

### 对俱乐部

- 💰 **增加收入** - 场地预订和课程销售
- 👥 **拓展客户** - 智能推荐和营销
- 📊 **数据分析** - 运营数据和用户行为分析

### 对个人用户

- 🎯 **便捷参赛** - 一键报名和赛事管理
- 📈 **技能提升** - 专业教练和训练资源
- 🤝 **社交网络** - 网球爱好者社区

## 技术亮点

- **跨平台兼容** - 一套代码多端运行
- **响应式设计** - 适配各种屏幕尺寸
- **模块化架构** - 易于维护和扩展
- **TypeScript 支持** - 类型安全和开发效率
- **组件化开发** - 可复用的 UI 组件

## 后续优化

- [ ] 实时聊天功能
- [ ] 视频教学模块
- [ ] AI 智能推荐
- [ ] 数据可视化
- [ ] 多语言支持
- [ ] 离线功能支持

## 联系我们

如有问题或建议，请联系开发团队。

---

_基于 UTR 积分系统，让网球运动更专业、更有趣！_ 🎾
