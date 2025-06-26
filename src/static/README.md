# 静态资源组织结构

本目录按照功能和类型重新组织了所有静态资源，提高了项目的可维护性和开发效率。

## 目录结构

```
static/
├── icons/                # 图标资源
│   ├── tab/             # 底部导航图标
│   ├── action/          # 功能图标
│   └── status/          # 状态图标（预留）
├── images/              # 图片资源
│   ├── avatars/         # 头像图片
│   ├── venues/          # 场馆相关图片
│   └── coaches/         # 教练相关图片
└── placeholders/        # 占位图片
```

## 使用规范

### 1. 图标使用

推荐使用 `src/config/icons.ts` 中定义的常量来引用图标：

```typescript
import { ICONS } from "@/config/icons";

// 使用底部导航图标
const homeIcon = ICONS.TAB.HOME;
const homeActiveIcon = ICONS.TAB.HOME_ACTIVE;

// 使用功能图标
const bookingIcon = ICONS.ACTION.BOOKING;
```

### 2. 图片使用

同样推荐使用配置文件中的常量：

```typescript
import { IMAGES } from "@/config/icons";

// 使用头像
const defaultAvatar = IMAGES.AVATARS.DEFAULT;

// 使用场馆图片
const venue1 = IMAGES.VENUES.VENUE1;
```

### 3. 命名规范

#### 图标命名

- 底部导航图标：`tab-{功能名}.png` 和 `tab-{功能名}-current.png`
- 功能图标：`icon-{功能名}.svg` 或 `icon-{功能名}.png`
- 状态图标：`status-{状态名}.svg`

#### 图片命名

- 头像：`{类型}-avatar{编号}.png`
- 教练图片：`coach{编号}.jpg`
- 场馆图片：`venue{编号}.jpg` 或 `club{编号}.png`
- 设施图片：`facility-{类型}.png`
- 占位图片：`empty-{类型}.png`

## 优势

1. **清晰的分类**：按功能和类型分类，便于查找和管理
2. **统一的配置**：通过配置文件统一管理路径，便于维护
3. **类型安全**：TypeScript 类型定义，减少路径错误
4. **易于扩展**：新增资源时有明确的分类规则
5. **主题支持**：为未来的主题切换功能做好准备

## 迁移指南

如果需要更新现有代码中的资源引用：

1. 将硬编码的路径替换为配置文件中的常量
2. 更新 `pages.json` 中的 tabBar 图标路径
3. 检查所有组件中的图片引用路径

## 注意事项

- 新增资源时请遵循命名规范
- 更新配置文件中的路径定义
- 优先使用 SVG 格式的图标（可缩放、体积小）
- 图片资源建议进行压缩优化
