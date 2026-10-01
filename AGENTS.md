# AGENTS.md — new-api Admin 开发约定

本文件适用于整个独立 workspace。先阅读 [README.md](./README.md)、[COVERAGE.md](./COVERAGE.md) 和 [.agent/README.md](./.agent/README.md)，再按任务读取相关实现。

## 项目目的

这是从 new-api 前端提取的全功能 Admin 模板和共享组件库。默认提供充分、可操作的范例，供后续复制、删除多余部分和接入真实 API。不要把完整范例简化成空壳，也不要把页面重写为难以删减的统一配置引擎。

## 工作边界

- 工作仅在本仓库进行，不依赖或修改旁边的原 new-api 工程。
- `packages/admin-ui` 管理通用控件、交互、布局、主题和翻译；不得依赖应用路由、业务 store、Query key、后端响应格式或业务 schema。
- `apps/admin` 管理范例字段、列定义、分区、页面路由、数据服务与业务操作。仅被一个范例使用的业务逻辑优先留在这里。
- 不引入真实登录、服务端权限、支付或 AI 网关功能，除非用户明确扩大范围。
- 保留 new-api、QuantumNous 的名称、署名、版权头及许可证，不删除或替换这些归属信息。

## 复用与实现

1. 修改 UI 前，搜索共享组件及相关范例，阅读 props 和现有调用；优先复用、组合或兼容扩展。
2. 复制使用共享行为封装：`Dialog`、`ConfirmDialog`、`CopyButton`、状态组件、`DataTablePage`、`DataTableBulkActions`、`FormSectionLayout` 等；不要仅导入基础 Button 后重写已有交互。
3. 只有现有 API 无法表达需求时才新增共享组件，并在交付说明中解释能力缺口。
4. React 使用组合式组件和明确的 TypeScript 类型。避免 `any`、深层条件表达式和单纯为了缩短文件而抽取的单次 helper。
5. TanStack Table 的受控 data、columns、sorting 等引用应稳定，避免自动分页重置与重复渲染形成循环。
6. 应用通过公开包入口导入共享组件。不要添加指向原工程、临时目录或本机绝对路径的源码引用。
7. 消费应用使用库的编译 CSS；修改库后重新构建 `dist`。不要通过源码别名掩盖组件包导出或类型缺失。

## 数据与交互

- 项目范例的 API 边界集中在 `features/projects/service.ts`。列表、详情、编辑和批量操作使用同一份数据。
- 变更成功后使相关 Query 失效；失败保留用户输入与选择，不显示成功提示。
- 删除、重置及未保存关闭/离开页面使用现有确认机制；提交中避免重复提交和中途关闭。
- 表格独立使用时分页与操作区仍需可见。保持选择、筛选、分页、固定列、卡片视图和标签分组间的语义一致。
- 批量操作针对筛选后选中记录；批量标签为替换，空数组代表清除。不要无提示地改变这些约定。
- 弹层提供标题，表单控件关联 label；图标按钮有可访问名称。保留键盘焦点、Escape 行为、错误定位与移动端可操作性。

## 国际化与样式

- 所有新增界面文案使用英文原文作 key，通过 i18next 翻译；共享组件显式使用 `admin-ui` 命名空间。
- 七种资源语言为 `en`、`zh`、`zh-TW`、`fr`、`ja`、`ru`、`vi`。不要直接手改 locale JSON。
- 新增/修改翻译通过 `scripts/add-missing-keys.mjs` 的七语言表，然后执行 `bun scripts/add-missing-keys.mjs` 和 `bun run i18n:sync`。
- `i18n:sync` 会删除未被识别为使用中的词条；动态词条应登记到 `scripts/scan-i18n.mjs`。
- 界面语言 `zhCN` / `zhTW` 进入 Intl 前必须经过 `toIntlLocale`；复用现有数值格式化函数。
- 使用现有主题变量、Tailwind、字体、圆角和间距。不要绕过主题硬编码大面积颜色，也不要重复加载 Tailwind preflight。

## 工具与验证

从仓库根目录使用 Bun。依赖变更同时维护 `bun.lock`；不要混入 npm/yarn/pnpm 的锁文件。

- TypeScript 改动：`bun run typecheck`、`bun run lint`。
- 源码格式：`bun run format` / `bun run format:check`。根配置和 `e2e` 不在当前格式脚本范围内，修改时使用 `bun x oxfmt --check <文件>` 单独检查。
- 行为改动：运行相关 Vitest / Playwright；缺陷先补能复现问题的失败用例，再修复。不写只断言内部实现或机械提高覆盖率的测试。
- 新增测试放在模块专属 `__tests__/`。复用已有测试文件和 fixture，覆盖用户可见行为、关键失败路径与数据一致性。
- 调整布局、滚动、弹层、焦点或响应式行为：用浏览器验证桌面和手机；主题相关改动检查明暗主题。截图不能替代交互测试，交互测试也不能替代视觉检查。
- 交付功能前运行相关检查及 `bun run build`。组件包导出、类型、依赖或样式改变时，执行 `bun run pack:ui` 并在无源码别名的独立 React 宿主验证。
- 不把之前的通过记录当成本次验证；准确报告运行命令、结果和无法执行的检查。

## 文档、Git 与交付

- 页面、公共 API 或复用方式改变时同步 README。组件覆盖变化时更新 `scripts/generate-coverage.mjs` 并执行 `bun scripts/generate-coverage.mjs`，不要只改生成结果。
- 继续提取上游代码时保留版权头并更新 `extraction.json` 中的来源记录。
- 不提交 `node_modules`、`dist`、测试报告、安装包、机器路径、凭据或运行日志。生成产物由脚本重建。
- 保留用户已有修改，不执行强制推送、重置历史或覆盖远程内容。创建工作分支时默认使用 `codex/` 前缀；仓库主分支不受此限制。
- 只有用户授权时才推送、建仓库或发布；推送前确认目标 owner/repository 和可见性。不得擅自将私有仓库改为公开，也不得自动发布公共 npm 包。
- 交付说明写清实现入口、验证结果和剩余限制，保持简洁。
