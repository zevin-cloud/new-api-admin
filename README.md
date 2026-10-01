# new-api Admin

从 [new-api](https://github.com/QuantumNous/new-api) 前端提取的 **Admin 全功能模板与 React 共享组件库**。保留原有组件、主题和交互风格，按页面类型提供完整、可操作的范例，方便后续：

**复制页面 → 删除多余字段和功能 → 替换业务数据 → 接入接口。**

本工程独立安装、启动和构建，无需 Go 服务、数据库或原项目目录。保留 new-api、QuantumNous 的署名、源码版权声明及许可证信息。

[快速开始](#快速开始) · [页面入口](#页面入口) · [复制与删减](#复制与删减) · [接入-api](#接入-api) · [组件库](#单独使用组件库) · [组件覆盖清单](./COVERAGE.md) · [Agent 开发说明](./AGENTS.md)

## 包含什么

| 页面类型 | 已实现的范例 |
| --- | --- |
| 表格列表 | 搜索、组合筛选、重置、排序、分页、列显隐、列宽调整、固定列、展开行、行操作、复制、卡片视图及移动布局 |
| 批量操作 | 开关控制选择列；选中后显示底部悬浮条，支持清空、启用、停用、设置标签、归档和删除确认 |
| 标签模式 | 按首个标签分组、折叠分组；可叠加 ID 降序；小屏开关收进更多菜单 |
| 完整表单 | 文本、数字、密码、长文本、单选、多选、搜索选择、标签、复选框、开关、滑块、日期时间、JSON、动态数组和字段联动 |
| 表单布局 | 独立页面、弹窗、抽屉；分组卡片、分栏、标签页、左侧分区导航、完成度、错误定位及未保存确认 |
| 详情 | 页面和抽屉、摘要、分组字段、关联表格、操作记录、原始 JSON，以及编辑后刷新 |
| 设置 | 分类表单、条件子选项、保存、恢复默认、未保存提示和完整外观设置 |
| 概览与展示 | 指标、趋势图、分布图、最近记录，以及基础组件、导航、反馈、弹层的交互展示 |

技术栈：React 19、TypeScript、Rsbuild 2、Base UI、Tailwind CSS 4、TanStack Router / Query / Table、React Hook Form、Zod、i18next。使用 Bun workspace 管理依赖，精确解析版本记录在 `bun.lock`。

## 快速开始

环境要求：

- Bun，当前验证版本为 **1.4.0**。
- Node.js **20.19.x 及以上的 20.x**，或 **22.12+**，与 Rsbuild 的 engines 要求一致；当前验证版本为 22.14.0。
- 现代浏览器。

在仓库根目录执行：

```sh
bun install --frozen-lockfile
bun run dev
```

打开 [http://127.0.0.1:4175](http://127.0.0.1:4175)。`dev` 会先构建共享组件包，再启动模板应用。默认简体中文，无需账号或环境变量。

修改 `packages/admin-ui/src` 后执行 `bun run build:ui`，应用会读取新的包产物；修改 `apps/admin/src` 则由开发服务直接热更新。

生产构建与本地预览：

```sh
bun run build
bun run --cwd apps/admin preview
```

应用产物位于 `apps/admin/dist`，组件产物位于 `packages/admin-ui/dist`。部署静态应用时，服务器需要把 `/projects`、`/forms/drawer` 等前端路由回退到 `index.html`。

## 页面入口

| 路由 | 用途 |
| --- | --- |
| `/` | 概览、指标、趋势、分布和最近项目 |
| `/projects` | 完整表格、标签分组、批量操作、卡片视图 |
| `/forms` | 完整表单；支持加载编辑数据和切换分区导航 |
| `/forms/dialog` | 弹窗表单入口，点击「打开表单」体验 |
| `/forms/drawer` | 抽屉表单入口，默认采用左侧分区导航 |
| `/projects/PRJ-001` | 详情、关联记录、操作历史及原始数据 |
| `/settings` | 分类设置与外观 |
| `/components` | 基础组件、反馈与弹层、导航、内容与布局 |

列表行菜单提供详情、快速查看、弹窗编辑、抽屉编辑与删除。列表、详情与表单使用同一份模拟数据。

### 关键交互

- **分区导航**：左侧显示摘要和各分区的完成/错误状态；点击分区滚动定位并转移键盘焦点。抽屉页头和保存区保持可见，字段区独立滚动；移动端导航横向排列。
- **批量操作**：开启开关后勾选记录，底部出现操作条。统计和操作对象是筛选后选中的记录，跨分页保留选择；关闭批量模式会清空选择。
- **批量标签**：替换选中记录的标签，留空表示清除；失败保留输入和选择。删除需二次确认。
- **标签分组**：当前范例按首个标签归组，分组计数对应当前页记录数，分页单位仍为记录。
- **键盘操作**：悬浮操作条支持左右方向键、Home / End 切换可用按钮；在操作条内按 Escape 清空选择。

## 目录结构

```text
.
├── apps/admin/                  模板应用与业务范例
│   └── src/
│       ├── main.tsx             路由、菜单、应用 Provider
│       ├── components/          演示状态、页头、未保存导航保护
│       └── features/
│           ├── projects/        列表、表单、详情、模拟服务
│           ├── settings/        分组设置与外观
│           ├── gallery/         组件展示
│           └── overview.tsx     概览
├── packages/admin-ui/           new-api-admin-ui 共享组件包
│   └── src/
│       ├── components/          UI 基础组件与通用交互
│       ├── context/             主题、布局和偏好
│       ├── i18n/locales/        七语言词条
│       └── styles/              主题、字体与样式入口
├── e2e/                         Playwright 浏览器流程
├── scripts/                     样式构建、翻译、覆盖清单和测试设置
├── .agent/README.md             Agent 维护手册与改动路径
├── AGENTS.md                    Agent 开发约定
├── COVERAGE.md                  原组件/交互 → 示例入口
└── extraction.json             上游基线、提取文件与源码哈希
```

## 复制与删减

建议先复制整个 workspace，保留共享库和一个完整页面，再做删减。字段、列定义、分区和操作都留在应用里，组件库不掌握业务 schema。

### 表单

1. 复制 `apps/admin/src/features/projects` 中需要的表单文件。
2. 在 `form-basic.tsx` 或 `form-advanced.tsx` 删除不需要的字段/卡片。
3. 同步调整 `schema.ts` 的校验、类型和默认值，以及 `service.ts` 的模拟数据。
4. 使用分区布局时，同步删除 `form-sections.tsx` 的导航项、对应 `FormSection` 和字段状态映射。
5. 使用标签页布局时，同步删除 `project-form.tsx` 中对应页签和错误定位规则。

提交、重置、字段错误和未保存保护仍由 `project-form.tsx`、`form-overlay.tsx` 与 `UnsavedGuard` 组合完成，无需修改共享组件。

### 表格与批量操作

在 `project-list.tsx` 删除列定义及相关筛选项；同时移除已经不存在的固定列、初始显隐或排序引用。批量按钮集中在 `project-bulk-actions.tsx`，可以直接删除某个操作。

新业务应使用独立的列宽、列显隐和视图偏好 storage key，避免沿用项目示例的浏览器配置。

### 详情

在 `project-detail.tsx` 成对删除 `TabsTrigger` 与 `TabsContent`，再移除对应数据读取。摘要、字段分组和关联数据都可单独裁剪。

最后在 `apps/admin/src/main.tsx` 注册业务路由与菜单，接入自己的服务层。

## 接入 API

接口替换点是 `apps/admin/src/features/projects/service.ts`，当前契约为：

| 方法 | 返回值/行为 |
| --- | --- |
| `list(query, mode?)` | `{ items: Project[], total: number }`；查询支持搜索、状态、优先级、排序和分页 |
| `get(id, mode?)` | 返回单条记录 |
| `save(values, id?, mode?)` | 无 ID 新建，有 ID 更新，返回完整记录 |
| `updateMany(ids, changes, mode?)` | 批量更新启用状态或标签 |
| `remove(ids, mode?)` | 批量删除 |
| `archive(ids, mode?)` | 批量归档 |
| `reset()` | 恢复演示数据；接真实业务时移除 |

`mode` 只用于演示，接入真实接口时删除。把 URL、请求头、认证、响应包裹格式与错误转换留在应用数据层，组件库不依赖这些约定。

当前列表一次读取模拟数据，使用前端筛选、排序和分页。改为服务端分页时，将 TanStack 的 `pagination`、`sorting`、`columnFilters` 状态加入 Query key 和请求参数，并配置 `manualPagination`、`manualSorting`、`manualFiltering` 与 `totalCount`。

成功变更后使 `['projects']` 查询失效，以更新列表和详情。字段错误映射到 `form.setError`；普通请求失败展示反馈并保留输入，不按成功处理。

## 单独使用组件库

组件包名为 `new-api-admin-ui`，当前版本 `0.2.0`。暂未发布公共 npm 包，在本地构建 tarball 使用：

```sh
bun run pack:ui
# 生成 artifacts/new-api-admin-ui-0.2.0.tgz
```

在其他 React 19 工程安装（将路径替换为实际位置）：

```sh
bun add /absolute/path/new-api-admin-ui-0.2.0.tgz
bun add react react-dom react-hook-form react-i18next i18next @tanstack/react-table
```

这些共享运行时的支持范围见组件包 `peerDependencies`；不要在宿主中同时安装两份 React。

```tsx
import 'new-api-admin-ui/styles.css'
import { AdminProvider } from 'new-api-admin-ui'
import { Button } from 'new-api-admin-ui/ui/button'

export function App() {
  return (
    <AdminProvider language="zhCN">
      <Button onClick={() => window.alert('Hello')}>Example</Button>
    </AdminProvider>
  )
}
```

| 导出入口 | 内容 |
| --- | --- |
| `new-api-admin-ui` | `AdminProvider`、`AdminLayout`、弹窗、确认、复制、状态、选择控件、分区布局等 |
| `new-api-admin-ui/ui/*` | 按需导入基础组件，例如 `ui/button`、`ui/input` |
| `new-api-admin-ui/data-table` | 表格、列、工具栏、分页、`useDataTable`、`DataTablePrimaryActions`、`DataTableBulkActions` |
| `new-api-admin-ui/form` | React Hook Form 组合组件 |
| `new-api-admin-ui/layout` | `AdminLayout` 及相关类型 |
| `new-api-admin-ui/theme` | 主题 Provider 和 hooks |
| `new-api-admin-ui/utils` | `cn`、格式化、Intl 语言转换 |
| `new-api-admin-ui/styles.css` | 编译后的 CSS 与字体引用 |
| `new-api-admin-ui/theme.css` | 主题样式源入口，供 Tailwind 宿主组合使用 |

包内提供 ESM、类型声明、编译样式和字体。普通 React 宿主只需加载一次 `styles.css`，无需扫描组件源码。`AdminLayout` 可选，表格独立使用时也会显示分页。

若宿主也使用 Tailwind CSS 4，参考 `apps/admin/src/styles.css`：加载组件 CSS 后，追加 Tailwind 的 theme/utilities 和组件主题，避免再次加载 preflight。宿主自己的 class 由宿主编译。

`AdminLayout` 接收 `menu`、`currentPath`、`onNavigate`、可选 `renderLink`、`title`、`header`、`footer`；路由由宿主管理。菜单 `label` 和 `group` 是翻译键，业务菜单词条由宿主补充。

分区布局使用 `FormSectionLayout` / `FormSection`；分区字段与校验规则由页面提供。批量操作条默认悬浮，也可以设置 `placement="inline"`；`entityName` 应传入已翻译的展示文本。

## 主题与国际化

`AdminProvider` 组合主题、语言、布局偏好、方向、Tooltip 和 Toast。通过页头主题按钮、外观抽屉或设置页调整明暗主题、配色、字体、圆角、密度和布局。

在「颜色预设 → 自定义颜色」中使用取色器或输入 HEX 色值（`#RRGGBB`，也接受 `#RGB`）。颜色即时生效并保存到当前浏览器，刷新后保留；无效输入会提示并保留上次有效颜色。切换预设保留自定义色，「重置全部设置」恢复默认值。明暗模式均可使用。

宿主组件可从 `new-api-admin-ui/theme` 导入 `useThemeCustomization()`，调用 `setCustomColor("#167a65")` 和 `setPreset("custom")`，通过 `customization.customColor` 读取当前色值。

支持简体中文、英语、繁体中文、法语、日语、俄语和越南语。界面代码使用 `zhCN` / `zhTW`，资源文件对应 `zh.json` / `zh-TW.json`；独立命名空间为 `admin-ui`，默认简体中文，缺失词条回退英语。

- 在组件中用 `useTranslation('admin-ui')` 获取共享组件文案。
- 新词条先维护 `scripts/add-missing-keys.mjs` 的七语言表，再运行脚本和 `bun run i18n:sync`。同步脚本会裁掉未使用词条；动态词条同时登记到 `scripts/scan-i18n.mjs`。
- 宿主可通过 `createAdminI18n()` 创建实例、添加业务资源，再传给 `<AdminProvider i18n={instance}>`。
- 普通数值使用 `formatNumber` / `formatCompactNumber`；界面语言传给 Intl 之前使用 `toIntlLocale`。

## 演示数据边界

项目数据只保存在内存。刷新页面或点击「重置演示数据」恢复初始记录；设置表单保存在本次页面会话，主题、语言和布局偏好保存在浏览器。

顶部演示状态可切换加载、空数据、请求失败、保存失败、字段错误、只读和禁用，仅影响具备相应语义的范例。示例密码只展示控件，不保存为凭据。

首版没有真实登录、服务端权限、支付、邮件发送或 AI 网关业务。接入真实后台时移除演示工具栏与数据，并由自己的服务端提供业务与权限控制。

## 开发与验证

```sh
bun run typecheck        # TypeScript
bun run lint             # oxlint
bun run format:check     # oxfmt
bun run test             # Vitest
bun run i18n:sync         # 检查并同步七语言词条
bun run build            # 先构建库，再构建应用
bun run pack:ui          # 生成独立安装包
```

浏览器测试需要先在另一个终端执行 `bun run dev`。当前 Playwright 配置默认使用 macOS 上安装的 Google Chrome；其他系统或安装位置通过 `CHROME_PATH` 指定：

```sh
bun run test:e2e
# Linux 示例；请按实际浏览器位置修改
CHROME_PATH=/usr/bin/google-chrome bun run test:e2e
```

上次完整功能验证（2026-10-01）：16 个 Vitest 文件、82 个测试通过；9 个浏览器流程通过；类型、lint、格式、语言同步与生产构建通过。组件 tarball 已在无 workspace 源码别名的独立 React 项目中通过严格类型检查和构建。这是验证记录，后续改动应重新运行对应检查。

[AGENTS.md](./AGENTS.md) 定义 Agent 开发约定；[.agent/README.md](./.agent/README.md) 提供常见改动路径和交付核对流程。

## 来源与许可证

上游为 [QuantumNous/new-api](https://github.com/QuantumNous/new-api)，提取基线和文件哈希记录在 [extraction.json](./extraction.json)。本模板独立演进，不自动同步上游。

保留 new-api、QuantumNous 署名和提取文件中的版权头。许可证为 **AGPL-3.0-or-later**，详见 [LICENSE](./LICENSE) 及组件包内的 LICENSE。原源码中的商业许可联系信息也予以保留。
