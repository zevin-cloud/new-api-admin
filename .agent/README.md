# Agent 维护手册

本目录保存 new-api Admin 的维护上下文。开发规则以根目录 [AGENTS.md](../AGENTS.md) 为准；面向使用者的启动、复制和接口说明见 [README.md](../README.md)。本手册不依赖某个 Agent 产品、插件或用户本机配置。

## 开始任务

1. 确认当前目录是 `new-api-admin`，阅读 Git 状态，保留已有修改。
2. 确定任务属于共享交互还是页面业务；读取 [组件覆盖清单](../COVERAGE.md) 和匹配组件的实现/调用。
3. 查看相关 `package.json`、公开导出和测试，而非根据上游版本猜 API。
4. 修改前明确验证路径；缺陷准备能够复现问题的用例。

## 架构与数据流

```text
main.tsx
  ├─ AdminProvider：语言 / 主题 / 偏好 / Tooltip / Toast
  ├─ QueryClientProvider：查询与失效
  ├─ DemoProvider：演示状态
  └─ TanStack Router → AdminLayout → 页面范例
                                      ↓
                             projectService（内存模拟）
                                      ↓
                            更新 → invalidateQueries
                                      ↓
                              列表 / 详情 / 表单
```

- 库不依赖具体路由；`AdminLayout` 的导航由宿主回调处理。
- `AdminProvider` 创建隔离的 i18next 实例，命名空间是 `admin-ui`；不要让共享组件隐式依赖宿主的全局实例。
- 运行时应用消费 `new-api-admin-ui` 的 `dist`。根 TypeScript/Vitest 配置有源码别名用于开发检查，不能据此认定打包后的类型和运行时入口正确。
- 页面刷新重置业务演示数据，浏览器偏好独立持久化。

## 按任务定位文件

| 任务 | 首先读取/修改 |
| --- | --- |
| 新页面、菜单、路由 | `apps/admin/src/main.tsx` |
| 表格列、筛选、标签分组、主操作开关 | `apps/admin/src/features/projects/project-list.tsx` |
| 底部批量操作、批量标签弹窗 | `apps/admin/src/features/projects/project-bulk-actions.tsx` |
| 表单提交、校验错误、重置 | `apps/admin/src/features/projects/project-form.tsx` |
| 基本字段与高级字段 | `form-basic.tsx`、`form-advanced.tsx` |
| 分区导航与完成度规则 | `form-sections.tsx`；库的 `components/form-section-layout.tsx` |
| 页面/弹窗/抽屉入口与关闭保护 | `form-page.tsx`、`form-overlay.tsx`、`components/unsaved-guard.tsx` |
| 详情标签页、关联表格 | `project-detail.tsx` |
| 类型、校验、默认值 | `schema.ts` |
| API、共享模拟数据、批量更新 | `service.ts` |
| 设置与外观 | `features/settings/`、共享 `config-drawer` 与 `context/` |
| 通用表格行为 | `packages/admin-ui/src/components/data-table/` |
| 公开包入口 | `packages/admin-ui/package.json`、`src/index.ts` 及各分组入口 |
| 翻译 | `scripts/add-missing-keys.mjs`、`scan-i18n.mjs`、`sync-i18n.mjs` |
| 主题、字体、编译 CSS | `packages/admin-ui/src/styles/`、`scripts/build-css.ts` |

表中未带前缀的页面文件均位于 `apps/admin/src/features/projects/`。

## 常见改动步骤

### 删除一个表单分区

删除字段组件及渲染位置，再删对应导航项、完成状态字段列表、schema/defaults 和服务映射。若保留标签页变体，同步调整它的内容与校验跳转。验证剩余字段提交、重置、编辑回填和错误定位。

### 添加一个批量操作

在服务层定义异步行为；页面组件决定目标 ID 和按钮内容，共享 `DataTableBulkActions` 只负责展示与选择交互。成功后更新查询，失败保留选择。需要参数时复用 `Dialog`，危险操作复用 `ConfirmDialog`。检查桌面、手机、空选择、失败和键盘路径。

### 接真实接口

替换 `projectService` 的实现；删掉演示 `mode` 与 reset 入口。服务端分页需把查询状态加入 Query key，开启相应 manual 模式，并使用服务端 total。不要把原项目响应格式、会话 store 或鉴权头传入共享库。

### 扩展共享组件

先评估现有 props/插槽；保持已有行为兼容，在 `/components` 或相关完整范例添加可访问的展示入口。维护导出、类型、覆盖清单和测试。运行 `pack:ui` 后，在独立宿主安装 tarball 验证，不使用本 workspace 的路径别名。

### 修改配色与预设

预设定义在 `lib/theme-customization.ts`；名称使用英文原文，翻译扫描器会识别这个有限注册表。不要恢复动态拼接的 `preset.*` key。自定义 HEX 色值由 `ThemeCustomizationProvider` 校验、持久化并注入 CSS 变量；`config-drawer` 只负责编辑与反馈，主题规则位于 `styles/theme-presets.css`。验证无效输入保留原色、预设切换、刷新恢复、重置，以及手机和明暗模式。

### 更新版本

修改组件包版本并同步锁文件与 README 的 tarball 示例。执行构建、打包、独立安装检查。安装验证时使用新的 tarball 文件名，避免同名本地包被包管理器缓存。没有默认 npm 发布流程。

## 验证清单

```sh
bun run typecheck
bun run lint
bun run format:check
bun run test
bun run i18n:sync
bun run build
```

浏览器：一个终端 `bun run dev`，另一个终端 `bun run test:e2e`。默认 Chrome 路径见 `playwright.config.ts`；其他系统设置 `CHROME_PATH`。

重点流程：

- 列表 → 详情 → 编辑 → 保存 → 数据更新。
- 表单必填/格式校验、字段联动、动态项、重置、只读/禁用、失败保留输入。
- 脏表单关闭与离开页面确认，弹层标题、焦点和 Escape。
- 分区导航滚动、当前区块、完成状态和错误状态，删除分区后仍能提交。
- 表格搜索/筛选/分页/选择，关闭批量模式清空选择，批量操作成功与失败。
- 悬浮条在桌面/手机可操作，不被页面滚动裁切；错误提示不遮挡底部按钮。
- 明暗主题、语言切换、独立组件类型和编译样式。

截图、trace、tarball 和构建目录均是生成产物，不提交到源码仓库。不要为了固定测试数量添加重复测试。

## 交付记录

说明改动落在哪个页面/公共组件、为什么需要、如何验证，以及尚未覆盖的限制。公开入口或页面行为变化同步 README/COVERAGE。推送以用户明确授权的仓库与可见性为准；只推送准备好的源码提交，不强推现有历史。
