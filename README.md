# EneDataVisionStudio

**Ene数据视觉工作室** — 一个开源的数据可视化大屏项目，旨在帮助开发者从 0 到 1 学习如何动手制作属于自己的数据可视化大屏。

## 项目简介

本项目从零开始，循序渐进地带你掌握数据可视化大屏的开发全流程，包括但不限于：

- 🎨 大屏布局设计与自适应缩放
- 📊 图表组件的选型与使用（ECharts 5）
- 🔄 数据获取、处理与绑定（Pinia 状态管理）
- 🎯 Mock 数据驱动的开发模式，可平滑切换至真实 API
- 🎭 动效与装饰（科技感深色主题 + 紫色/金色/绿色配色）
- 🧪 完善的测试系统（Vitest 单元测试 + Playwright E2E 测试）
- 📝 日志系统、代码质量管控（ESLint + Prettier + Stylelint）

每一个阶段都有清晰的文档和可运行的代码示例，让你看得懂、学得会、用得着。

## 页面预览

数据大屏包含以下模块：

| 区域 | 内容 |
|------|------|
| 顶部 | 标题「如意数据大屏」+ 实时时钟 |
| 指标卡片 | 今日访问量、实时订单数、活跃用户数、系统健康度 |
| 左侧 | 访问趋势折线图、分类占比饼图 |
| 中间 | 全国态势总览图（散点地图）+ 实时动态列表 |
| 右侧 | 城市排名柱状图、能力雷达图 |

## 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 框架 | Vue 3 + Composition API | `<script setup>` 语法，逻辑复用性强 |
| 构建 | Vite 6 | 秒级热更新，ESM 原生 |
| 语言 | TypeScript | 类型安全，降低维护成本 |
| 状态管理 | Pinia | Vue 官方推荐，API 简洁 |
| 图表 | ECharts 5 + vue-echarts | 国内大屏事实标准 |
| HTTP | Axios | 请求拦截与统一错误处理 |
| Mock | MSW (Mock Service Worker) | Service Worker 拦截，零代码侵入切换真实 API |
| 测试 | Vitest + Playwright | 单元测试 + E2E 测试 |
| 代码质量 | ESLint + Prettier + Stylelint | 全链路质量管控 |
| 日志 | 自研 Logger 服务 | 分级输出（debug/info/warn/error） |

## 快速开始

```bash
# 克隆仓库
git clone git@github.com:entyame/EneDataVisionStudio.git

# 进入项目目录
cd EneDataVisionStudio

# 安装依赖
npm install

# 启动开发服务器（自动打开浏览器）
npm run dev

# 运行单元测试
npm test

# 运行 E2E 测试
npm run test:e2e

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 目录结构

```
src/
├── app/              # 应用入口（App.vue + main.ts）
├── assets/           # 静态资源（字体、图片、主题样式）
├── components/       # 通用组件
│   ├── BasePanel.vue     # 装饰边框面板
│   ├── MetricCard.vue    # 核心指标卡片
│   └── ScreenHeader.vue  # 大屏顶部标题栏
├── charts/           # 图表组件
│   ├── LineTrendChart.vue    # 访问趋势折线图
│   ├── BarRankingChart.vue   # 城市排名柱状图
│   ├── PieStatusChart.vue    # 分类占比饼图
│   ├── RadarAbilityChart.vue # 能力雷达图
│   └── MapOverviewChart.vue  # 全国态势总览图
├── views/            # 页面
│   └── DashboardView.vue
├── layouts/          # 布局
│   └── BigScreenLayout.vue  # 大屏整体布局
├── services/         # 数据访问层
│   ├── http.ts              # Axios 封装
│   ├── dashboardService.ts  # 业务服务
│   └── dataSource.ts        # 数据源切换（mock / api）
├── mocks/            # MSW Mock 数据
│   ├── browser.ts           # MSW 浏览器启动
│   ├── handlers.ts          # 请求拦截处理器
│   └── dashboardMock.ts     # Mock 数据生成器
├── stores/           # Pinia 状态管理
│   └── dashboardStore.ts
├── utils/            # 工具函数
│   ├── format.ts            # 格式化工具
│   └── resize.ts            # 大屏自适应缩放
├── logs/             # 日志系统
│   └── logger.ts
├── types/            # TypeScript 类型定义
│   └── dashboard.ts
└── tests/            # 测试
    ├── unit/
    │   ├── format.test.ts
    │   └── dashboardService.test.ts
    └── e2e/
        └── dashboard.spec.ts
```

## 数据源切换

项目支持通过环境变量 `VITE_DATA_SOURCE` 切换数据来源：

- `mock`（默认）：使用 MSW 拦截请求，返回本地 mock 数据
- `api`：通过 Axios 请求真实后端 API（需配置 `VITE_API_BASE_URL`）

```bash
# .env 文件中修改
VITE_DATA_SOURCE=mock   # 使用 mock 数据
VITE_DATA_SOURCE=api    # 切换到真实 API
```

页面组件不直接读取 mock 文件，必须通过 `services` 层获取数据，确保后期平滑切换。

## 贡献

欢迎提交 Issue 和 Pull Request 一起完善这个项目！

## 许可证

本项目基于 [MIT License](LICENSE) 开源。
