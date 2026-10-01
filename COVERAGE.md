# 组件与交互覆盖清单

基线：new-api 的 `web/src/`。公共组件保留原实现，解除宿主路由、业务配置和接口依赖。

## 基础组件

| 来源（components/ui） | 示例入口 |
| --- | --- |
| accordion.tsx | /components → 内容与布局 |
| alert-dialog.tsx | /components → 反馈与弹层 |
| alert.tsx | /components → 反馈与弹层 |
| aspect-ratio.tsx | /components → 内容与布局 |
| avatar.tsx | /components → 基础组件 |
| badge.tsx | /components → 基础组件 |
| breadcrumb.tsx | /components → 导航 |
| button-group.tsx | /components → 基础组件 |
| button.tsx | /components → 基础组件 |
| calendar.tsx | /forms 两个页签及弹窗、抽屉变体 |
| card.tsx | 多个页面与展示页 |
| carousel.tsx | /components → 内容与布局 |
| chart.tsx | 概览图表 |
| checkbox.tsx | /forms 两个页签及弹窗、抽屉变体 |
| collapsible.tsx | /components → 内容与布局 |
| combobox-input.tsx | /components → 基础组件 |
| combobox.tsx | /forms 两个页签及弹窗、抽屉变体 |
| command.tsx | /components → 导航 |
| context-menu.tsx | /components → 导航 |
| dialog.tsx | /components → 反馈与弹层 |
| direction.tsx | /components → 内容与布局 |
| drawer.tsx | /components → 反馈与弹层 |
| dropdown-menu.tsx | /projects |
| empty.tsx | /components → 反馈与弹层 |
| field.tsx | /components → 基础组件 |
| form.tsx | /forms 两个页签及弹窗、抽屉变体 |
| hover-card.tsx | /components → 反馈与弹层 |
| icon-badge.tsx | /components → 基础组件 |
| input-group.tsx | /components → 基础组件 |
| input-otp.tsx | /components → 基础组件 |
| input.tsx | /forms 两个页签及弹窗、抽屉变体 |
| item.tsx | /components → 内容与布局 |
| kbd.tsx | /components → 基础组件 |
| label.tsx | /components → 基础组件 |
| markdown.tsx | /components → 内容与布局 |
| menubar.tsx | /components → 导航 |
| native-select.tsx | 后台布局 |
| navigation-menu.tsx | /components → 导航 |
| pagination.tsx | /components → 导航 |
| popover.tsx | /components → 反馈与弹层 |
| progress.tsx | /components → 反馈与弹层 |
| radio-group.tsx | /forms 两个页签及弹窗、抽屉变体 |
| resizable.tsx | /components → 内容与布局 |
| scroll-area.tsx | /components → 内容与布局 |
| select.tsx | /forms 两个页签及弹窗、抽屉变体 |
| separator.tsx | /components → 内容与布局 |
| sheet.tsx | /forms 两个页签及弹窗、抽屉变体 |
| sidebar.tsx | 后台布局 |
| skeleton.tsx | /components → 反馈与弹层 |
| slider.tsx | /forms 两个页签及弹窗、抽屉变体 |
| sonner.tsx | /components → 反馈与弹层 |
| spinner.tsx | /components → 反馈与弹层 |
| switch.tsx | /forms 两个页签及弹窗、抽屉变体 |
| table.tsx | /projects |
| tabs.tsx | 多个页面与展示页 |
| textarea.tsx | /forms 两个页签及弹窗、抽屉变体 |
| titled-card.tsx | 多个页面与展示页 |
| toggle-group.tsx | /components → 基础组件 |
| toggle.tsx | /components → 基础组件 |
| tooltip.tsx | /components → 反馈与弹层 |

## 通用封装

| 来源组件或交互 | 示例入口 |
| --- | --- |
| DataTablePage、DataTableView、分页、工具栏、筛选、列设置、固定列、列宽、展开行、批量操作 | /projects |
| MobileCardList、DataTableCardGrid、视图切换、移动筛选 | /projects 桌面/移动视图 |
| StaticDataTable | 概览最近项目、详情关联记录 |
| BadgeCell、BadgeListCell、StatusBadge、StaticRowActions | /components 基础组件 |
| DataTableRowActionMenu | /projects 行操作 |
| TruncatedCell、TruncatedText、LongText | 表格与 /components 内容与布局 |
| 渠道抽屉分区状态 → FormSectionLayout、FormSection | /forms/drawer；/forms 开启分区导航；完成度、错误状态、滚动定位和键盘焦点 |
| 渠道批量操作 → DataTableBulkActions + ProjectBulkActions | /projects 开启批量模式并选中记录：底部悬浮、计数、清空、启停、标签、归档、删除确认与失败保留 |
| ChannelsPrimaryButtons → DataTablePrimaryActions | /projects：批量开关、标签分组折叠、ID 排序；移动端更多菜单 |
| Form、字段错误、联动、动态数组、校验定位、异步提交 | /forms 两个页签 |
| DatePicker、DateTimePicker、MultiSelect、TagInput、PasswordInput、JsonEditor | /forms |
| JsonCodeEditor | 表单 JSON 模式、详情原始数据 |
| Dialog、ConfirmDialog、抽屉布局 | 表单弹窗、抽屉、关闭确认、删除确认 |
| CopyButton、MaskedValueDisplay、TableId、LearnMore | 列表、详情与基础组件页 |
| EmptyState、LoadingState、ErrorState | 演示状态、反馈与弹层 |
| FloatingWindow | 反馈与弹层：拖动、缩放、折叠、持久化 |
| RichContent、HtmlContent、Markdown | 内容与布局 |
| AnimateInView、PageTransition/FadeIn | 内容与布局 |
| ThemeSwitch、ThemeQuickSwitcher、ConfigDrawer、主题与布局 Provider | 页头、设置 → 外观（含七语言预设、HEX/取色器自定义颜色、即时预览与持久化） |
| SkipToMain | 键盘 Tab 进入跳转链接 |

## 页面流程

- 列表 → 详情 → 编辑 → 保存 → 详情与列表更新。
- 页面/弹窗/抽屉表单，新建与回填、重置、动态字段、联动、字段错误、保存失败、未保存关闭与路由跳转保护。
- 查询、搜索、排序、分页、选择、批量归档与删除、恢复演示数据。
- 设置分类、通知联动、保存与恢复默认、主题独立持久化。
- 概览指标、趋势、分布和关联列表；全部为演示数据。

## 提取边界

未携带 AI 聊天专用组件、模型/渠道/供应商/分组选择器、计费与额度、插件运行、真实认证/验证码/权限编辑、个人账号/通知后端、系统更新及站点业务页面。它们依赖原系统业务契约，对应的通用布局、控件、列表、内容展示和反馈已由范例承载。

底层工具如 portal-container、dropdown-menu-events、类型声明与内部行布局，通过其公开组件覆盖，不单独设置页面。
