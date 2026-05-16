# Copy Creator — 开发日志

## 当前阶段

Phase 1 — 核心功能闭环 ✅ (已完成)
Phase 2 — 完善与优化 🔄 (进行中)

## 项目状态

| 维度 | 状态 |
|------|------|
| PRD | 已完成 |
| 产品架构 | 已完成 |
| 技术选型 | Tauri 2.x + React + TypeScript + Zustand + SQLite |
| UI 框架 | iOS 风格纯 CSS + Notification Card 组件体系 |
| 项目脚手架 | 已搭建，前后端编译通过 |
| 数据库 | 5 张表已建，CRUD 命令已注册 |
| 翻译引擎 | 百度 + Google（免费/官方 API）+ AI 三种引擎 |
| 粘贴模拟 | 已实现，聚焦可靠，闪烁已消除 |
| 图片剪切板 | 已支持监控、存储（PNG 文件）、展示、粘贴、悬浮预览 |
| 剪切板分类 | 文本 / 图片 / 链接 / 文件 四类自动识别 |
| 导航栏 | 圆角矩形按钮 + 右侧 tooltip，亮暗色模式适配 |
| 设置页 | 存储位置 + 语言 + 快捷键 + 翻译引擎整合模块 |
| 窗口置顶 | 已实现（Rust 侧 toggle_always_on_top） |
| 可运行 | 是（`pnpm tauri dev`） |

## 已完成事项

- [x] PRD 编写
- [x] 产品架构设计
- [x] 技术栈选型与论证
- [x] Rust 环境配置（MSVC 工具链）
- [x] Tauri + React + TypeScript 项目脚手架
- [x] SQLite 数据库建表 + 迁移
- [x] 剪切板监听模块
- [x] 快捷短语 CRUD 全部命令
- [x] 系统托盘（显示/退出菜单）
- [x] 全局快捷键 Alt+Shift+V
- [x] i18n 国际化（中/英）
- [x] 百度翻译 API 接入
- [x] Google 翻译接入（免费接口 + Cloud Translation API）
- [x] AI 翻译模块（OpenAI 兼容格式）
- [x] Windows/macOS 粘贴模拟（enigo）
- [x] 窗口置顶（Rust 侧命令，可靠）
- [x] 设置页百度/Google/AI 三引擎配置
- [x] 设置页语言切换按钮（中/英一键切换）
- [x] AI 翻译解析失败修复（读 body text + HTTP 状态检查）
- [x] UI 改为 iOS 风格 — 无边框透明窗口、磨砂玻璃、SF 字体、纯 CSS 组件
- [x] 前端组件全部去 MUI 化（App + 3 页面 + 设置弹窗）
- [x] 图片剪切板监控 + 存储（RGBA → PNG → 文件，缩略图展示）
- [x] 图片粘贴（PNG 文件 → Image → 剪切板 → Ctrl+V）
- [x] 粘贴闪烁消除（CSS opacity 0 → hide → paste → show → opacity 1）
- [x] 导航栏状态冲突修复（点击设置时主功能按钮取消选中）
- [x] 导航栏按钮重设计（圆形 → 矩形圆角16px + 右侧 tooltip + 亮暗色模式适配）
- [x] 剪切板/快捷短语卡片重设计（Notification Card 风格：左侧彩色条 + 内容位移动画）
- [x] 剪切板分类功能（文本/图片/链接/文件 四类自动识别 + 分类筛选标签）
- [x] Rust 后端链接/文件类型检测（is_url / is_file_path 函数）
- [x] 图片悬浮预览（hover 400ms 弹出大图，鼠标移开关闭）
- [x] 隐藏横向滚动条（全局 CSS）
- [x] 设置页翻译模块整合（4个 section → 1个 section，按引擎条件渲染配置项）
- [x] 设置页存储位置显示 + 自定义文件夹选择（tauri-plugin-dialog）
- [x] 剪切板时间格式改为日期+时分（5/14 14:30）
- [x] 快捷短语内容在前标题在后，标题小字，左对齐
- [x] 全局快捷键自定义（设置页录制快捷键 + Ctrl+Shift+右键鼠标钩子）
- [x] 过期记录自动清理（prune_old_records 启动时 + 每小时定时线程）
- [x] 图片悬浮预览修复（CSS :hover 在 overflow 容器中被裁剪，改用 fixed overlay + React state）
- [x] 图片粘贴优化（paste_with_defocus 改为后台线程 hide/paste/show，消除卡顿）
- [x] 短语按钮 100% 不透明度（亮色 #fff / 暗色 #3a3a3c）
- [x] 暗色模式短语卡片左侧竖条颜色修复（暗色下 #111 → #fff）
- [x] 前端代码重构 — CSS 模块化拆分（2488 行 index.css → 7 个模块化文件）
- [x] 前端代码重构 — 页面组件拆分（PhrasePage/ClipboardPage 拆分为多个子组件）
- [x] 前端代码重构 — 设置组件拆分（SettingsContent 拆分为 Language/Storage/Translation 三个 Section）
- [x] 前端代码重构 — 文件夹结构优化（pages 使用文件夹组织，新增 styles 目录）
- [x] 前端代码重构 — TypeScript 类型修复（所有编译错误已解决）

## 粘贴聚焦问题记录

**问题**：点击内容粘贴时，窗口消失/闪烁，且部分应用（浏览器、终端）粘贴不生效。

**根因**：Tauri 浮窗具有键盘焦点时，模拟的 Ctrl+V 会投递到自身窗口，必须先转移焦点到目标应用。转移焦点的不同方式有不同表现：

| 方案 | 效果 | 原因 |
|------|------|------|
| `window.hide()` / `window.show()` | 聚焦可靠 ✓ | Windows 隐藏前台窗口时，系统精确激活上一个焦点窗口 |
| `Alt+Escape`（Z 序推底） | 部分应用失效 ✗ | 激活的是 Z 序下一个窗口，不一定是用户之前使用的应用 |
| `SetForegroundWindow(HWND)` | 不可靠 ✗ | 跨进程前台窗口切换有权限限制，且背景线程追踪 HWND 有 800ms 延迟 |
| `window.minimize()` | 聚焦较可靠 △ | 动画比 hide/show 更平滑但仍有视觉变化 |
| `set_position(-9999,-9999)` | 完全不聚焦 ✗ | 移动窗口不改变焦点 |

**最终方案**：回到 `window.hide()` / `window.show()`（聚焦确定可靠），配合前端 CSS opacity 技巧消除视觉闪烁：

```
点击 → opacity:0 → requestAnimationFrame(等一帧确保重绘) → invoke
→ [后端: write clipboard → hide → sleep 120ms → Ctrl+V → sleep 40ms → show → focus]
→ opacity:1
```

窗口在 hide 之前已经全透明，show 之后才恢复可见。用户看不到 hide/show 过渡，视觉上窗口保持静止。

## 架构一致性审查（2026-05-14）

基于 `ARCHITECTURE.md` 逐项对照审查，发现以下不一致问题：

### 严重问题

| # | 问题 | 位置 | 说明 |
|---|------|------|------|
| 1 | API 凭证硬编码 | `db.rs:80-81` | 百度翻译 AppID 和 Secret 直接写入 `init_db` 的 SQL 语句，属于安全漏洞。应移除硬编码，改为用户在设置中自行配置 |
| 2 | SQL 注入风险 | `db.rs:143-152` | `get_clipboard_records` 中搜索关键词通过 `format!` 拼接构建 SQL，未使用参数化查询。应改用 `rusqlite::params!` |

### 主要问题

| # | 问题 | 位置 | 说明 |
|---|------|------|------|
| 3 | 前端未监听 `clipboard-update` 事件 | `clipboardStore.ts` | Rust 后端通过 `emit("clipboard-update")` 推送新记录，但前端无监听器，剪切板记录不会实时更新。需创建 `useTauriEvent` hook |
| 4 | React 版本不一致 | `package.json:16` | 架构文档指定 React 18，实际安装 React 19.2.6 |
| 5 | MUI 已安装但完全未使用 | `package.json:6-7` | 架构文档指定 MUI 为 UI 组件库，已安装但所有组件均使用自定义 CSS，无任何 MUI 导入。需移除依赖并更新架构文档 |
| 6 | `hooks/` 目录缺失 | `src/utils/paste.ts` | 架构文档指定 `src/hooks/useTauriEvent.ts` 和 `src/hooks/usePaste.ts`，实际为 `src/utils/paste.ts`，且 `useTauriEvent.ts` 不存在 |
| 7 | `types/index.ts` 类型定义不完整 | `types/index.ts:2-5` | `ClipboardRecord.type` 仅定义 `"text" \| "image"`，实际含 `"link"` 和 `"file"`；`TranslationRecord.engine` 仅定义 `"ai" \| "builtin"`，实际还有 `"google"` |

### 次要问题

| # | 问题 | 位置 | 说明 |
|---|------|------|------|
| 8 | 剪切板轮询间隔不一致 | `clipboard.rs:30` | 架构文档指定 500ms，实际代码为 800ms |
| 9 | 有道翻译未实现 | `translator.rs` | 架构文档提到"百度翻译/有道翻译"，实际仅实现百度+Google，无有道 |
| 10 | 面板路由方式不一致 | `App.tsx:17` | 架构文档指定 URL param `?p=` 路由，实际使用 React state |
| 11 | `toggle_always_on_top` 未实现 | `lib.rs` | 架构文档提到置顶切换命令，但未注册 Tauri Command（开发日志称已实现，需确认） |
| 12 | 托盘图标单击事件未实现 | `tray.rs` | 架构文档指定"单击托盘图标: 显示/隐藏悬浮窗"，实际仅右键菜单 |
| 13 | 过期数据定时清理未启用 | `db.rs:88-107` | `prune_old_records` 已编写但从未被调用（已在当前待处理 #5 中记录） |
| 14 | NavigationButton 组件未使用 | `NavigationButton.tsx` | 组件和样式文件存在但未被任何文件导入，属于死代码 |
| 15 | 默认快捷键未设置 | `db.rs:78` | 架构文档指定默认 `Alt+Shift+V`，实际默认为空字符串 |

## 当前待处理

1. **全局快捷键注册冲突** — `shortcut.rs` 和 `lib.rs` 中存在双重注册逻辑，需整理
2. **剪切板记录来源应用未获取** — `source_app` 字段始终为空
3. **翻译缓存策略单一** — 仅按精确匹配，不支持相似文本复用
4. **终端 Ctrl+V 兼容性** — 已深入调查，根因是 SendInput 的 LLMHF_INJECTED 标志被 Electron/Chromium 应用拦截。已尝试 Shift+Insert、AllowSetForegroundWindow、PostMessageW 多种方案。PostMessageW 方案（绕过 SendInput）理论可行但未充分测试，代码已回滚。详见「径向菜单开发记录」
5. ~~**过期记录未自动删除** — `prune_old_records()` 函数已实现但从未被调用，需在启动时或定时触发~~ ✅ 已解决
6. **API 凭证硬编码** — 百度 AppID/Secret 写入 init_db SQL，需移除（审查 #1）
7. **SQL 注入风险** — get_clipboard_records 搜索拼接 SQL，需参数化（审查 #2）
8. **前端未监听 clipboard-update 事件** — 剪切板记录不实时更新（审查 #3）
9. **types/index.ts 类型定义不完整** — 缺少 link/file/google 类型（审查 #7）
10. **托盘图标单击事件未实现** — 仅右键菜单，无单击行为（审查 #12）
11. **NavigationButton 死代码** — 未使用的组件需清理（审查 #14）

## 下一步规划

### Phase 2 — 完善与优化

| 任务 | 优先级 |
|------|--------|
| 调用 prune_old_records 实现过期记录自动清理 | P1 | ✅ 已完成 |
| 终端粘贴兼容（Shift+Insert / Ctrl+Shift+V 自动检测） | P1 |
| 应用内直接输入文本实时翻译 | P1 |
| 获取剪切板来源应用名 | P2 |
| 翻译引擎热切换（结果页切换引擎重新翻译） | P2 |
| 翻译缓存相似文本复用 | P2 |
| 开机启动 | P2 |

### Phase 3 — 发布准备

| 任务 | 优先级 |
|------|--------|
| Windows .msi 打包测试 | P0 |
| macOS .dmg 打包测试 | P0 |
| 自动更新（Tauri updater） | P1 |
| 开源准备（LICENSE、README、CONTRIBUTING） | P1 |

## 技术笔记

- Rust 工具链 `stable-x86_64-pc-windows-msvc`
- Tauri 2.x `tray-icon` 需在 Cargo.toml 显式开启 feature
- Tauri 2.x 系统托盘通过 Rust 代码（TrayIconBuilder）创建，tauri.conf.json 中 trayIcon 已废弃
- Tauri 2.x 插件配置 `clipboard-manager` / `global-shortcut` 接受 `null`（unit type），不接受 `{}`
- 数据库路径：Windows `%APPDATA%/copy-creator/data.db`
- 百度翻译签名算法：MD5(appid + query + salt + secretKey)
- Google 免费翻译：`translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=XX&dt=t&q=URL_ENCODED_TEXT`
- enigo 0.3 无需 feature flags，自动根据目标平台选择后端
- iOS 风格窗口：`decorations: false`, `transparent: true`, `shadow: true`, 440×500
- UI 已完全移除 MUI，使用纯 CSS 变量 + 类名体系（index.css）
- 百度默认凭据已内置（AppID: 20260513002612590）
- 剪切板图片处理流程：`read_image()` → `Image` (RGBA) → PNG 编码 → 保存 `app_data/images/{uuid}.png` → DB 存路径 → 前端 `get_image_base64` 转 base64 渲染缩略图
- 图片粘贴流程：读取 PNG → 解码 RGBA → `Image::new_owned()` → `write_image()` → Ctrl+V
- 粘贴聚焦唯一可靠方案：`window.hide()` + `window.show()`，配合前端 CSS opacity 消除视觉闪烁
- Notification Card 组件：`isolation: isolate` + `::before` 覆盖层在 WebView2 中会导致内容不可见，改用 `border-left` + `.notibar` 内部元素实现左侧彩色条
- Vite 8 (rolldown) 不支持跨模块 `export type` 导入，`import { Type }` 会导致 `MISSING_EXPORT` 错误，需在导入模块本地定义类型
- CSS `@font-face` 中含中文路径（如 `/字体/`）可能导致整个样式表解析失败（灰色窗口），应使用 JS `FontFace` API 动态加载或 URL 编码路径
- 剪切板类型检测：文本优先 → `is_url()` 检测 http/https/ftp 开头 → `is_file_path()` 检测盘符路径+存在性 → 兜底 text
- `tauri-plugin-dialog` 用于系统文件夹选择对话框，`app.dialog().file().pick_folder()` 返回 `FilePath` 类型，用 `.to_string()` 转换
- 导航栏 tooltip 箭头定位：用 `margin-top: -3px` 替代 `transform: translateY(-50%)`，避免与 `rotate(45deg)` 叠加导致错位
- `prune_old_records()` 函数已实现但从未被调用，过期记录不会自动删除
- 图片悬浮缩放 CSS `:hover` `transform: scale()` 在祖先容器有 `overflow-y: auto` 时被裁剪（overflow 强制作用于两轴），多次改 CSS 均无效，最终方案为 `onMouseEnter` 触发生成一个 fixed-position overlay（`pointer-events: none`），直接挂载到 DOM 顶层，完全绕过 overflow 和 stacking context 限制
- 图片粘贴 `window.minimize()` 在 Windows 11 上有约 300ms 动画导致明显卡顿，改为 `window.hide()` 即时无动画，配合 `std::thread::spawn` 将 hide/paste/show 放入后台线程执行，Tauri command 在 clipboard write 完成后立即返回，前端不阻塞
- 前端重构采用单一职责原则：每个组件只负责一个功能，页面组件负责组合子组件
- CSS 模块化策略：按功能域拆分（base/layout/components/clipboard/phrases/translation/settings），index.css 仅作为入口导入
- 页面文件夹组织：复杂页面使用文件夹（ClipboardPage/、PhrasePage/），简单页面保持单文件（TranslationPage.tsx）
- 设置组件拆分：按功能域分为 LanguageSection（语言+快捷键+保留时长）、StorageSection（存储位置）、TranslationSection（翻译引擎）

---

## 径向菜单（Radial Menu）开发记录 — 2026-05-16

### 功能概述

径向菜单是一个独立 Tauri 窗口（`radial-menu`），通过 **Ctrl+Alt+右键长按** 触发，在鼠标位置弹出，显示剪切板和快捷短语的内容列表。用户按住右键移动鼠标到目标条目上，松开右键即可将内容粘贴到之前的应用中。

### 架构要点

```
shortcut.rs (WH_MOUSE_LL 低层鼠标钩子)
  ├── Ctrl+Alt+RightButtonDown → show radial-menu window at cursor position
  ├── MouseMove (while right down) → emit "radial-menu-move" (throttled 16ms)
  └── RightButtonUp → emit "radial-menu-up"
        └── 前端 RadialMenu/index.tsx
              ├── 根据坐标做 hover 检测 (document.elementFromPoint)
              ├── Hover 1000ms 自动切换 tab/分类 (useHoverSwitch hook)
              └── 调用 pasteRecord/pastePhrase → paste.rs
                    └── paste_with_defocus: hide windows → restore focus → Ctrl+V
```

- 窗口定位：`SetWindowPos(HWND_TOPMOST)` → `SWP_SHOWWINDOW` → `HWND_NOTOPMOST`（瞬时置顶后恢复，避免常驻置顶干扰）
- 坐标转换：`screen_to_css` 函数处理 DPI 缩放（physical → CSS pixels）
- 前端 hover 检测：`document.elementFromPoint` + `closest("[data-radial-item-id]")` / `[data-radial-nav]` / `[data-radial-category]`

### 已解决的问题

#### 1. 窗口位置偏移 / 页面未填充窗口
- **问题**：弹出窗口有间隙，内容未撑满
- **修复**：移除 `calculatePopupPosition` 和 `VIEWPORT_PADDING`，popup 设置 `width: 100%; height: 100%`，移除 `border` 和 `border-radius`（DWM 已做圆角）

#### 2. 双击粘贴（Double Paste）
- **问题**：内容被粘贴两次
- **根因链**：
  1. 剪切板监控器 800ms 轮询，paste 线程写剪切板后监控器检测到"新变化"→ 重复记录
  2. `PASTING.swap(false)` 过早清除了 PASTING 标志，监控器在 paste 线程写剪切板之前重新同步了旧缓存
  3. WM_RBUTTONUP 同时触发了 radial-menu-up 和系统右键菜单
- **修复**：
  1. 添加 `PasteGuard`（RAII 模式，drop 时重置 PASTING）
  2. 监控器改用 `PASTING.load(Ordering::SeqCst)` 只读不写，PASTING 仅由 PasteGuard 清除
  3. 将缓存状态外部化为模块级 `pub static Mutex`（`LAST_CLIPBOARD_TEXT`、`LAST_CLIPBOARD_IMAGE_HASH`、`LAST_CLIPBOARD_FILES_KEY`），paste 函数写入剪切板后调用 `sync_monitor_cache()` 同步
  4. WM_RBUTTONUP 处理中返回 `LRESULT(1)` 阻止消息继续传播

#### 3. 粘贴输出字符 'V' 而非执行粘贴
- **问题**：模拟的 Ctrl+V 被拆解为独立的 'V' 字符输入
- **修复**：将 `enigo.key(Key::V, Direction::Click)` 改为 `Press` → 10ms sleep → `Release`，Control 和 V 之间有 30ms 间隔

#### 4. 图片缩略图比例
- **修复**：`ImageThumb` 组件设置 `width: 48, height: 36, objectFit: "cover", borderRadius: 5`，与主窗口一致

#### 5. 剪切板时间显示
- **修复**：添加 `formatTime()` 函数（M/D HH:mm 格式），items 中包含 `createdAt` 字段

#### 6. 快捷短语备注显示
- **修复**：items 中包含 `title` 字段，渲染为 `.radial-menu-item-remark`

#### 7. 导航栏按钮圆角
- **修复**：`.radial-menu-nav-tab` 的 `border-radius` 从 `10px 10px 0 0` 改为 `10px`（四个角）

#### 8. 暗色模式同步
- **问题**：径向菜单窗口不跟随主窗口的亮暗色切换
- **修复**：在每次 `radial-menu-down` 和首次 `radial-menu-move` 事件中通过 `invoke("get_setting", { key: "theme" })` 重新读取主题并设置 `data-theme` 属性

#### 9. 悬浮进度条颜色
- **修复**：亮色模式 `rgba(0,0,0,0.35)`，暗色模式 `rgba(255,255,255,0.6)`

### 尚未解决的问题

#### 终端 / Electron 应用粘贴失败

**现状**：`paste_with_defocus` 使用 enigo 模拟 Ctrl+V。enigo 底层调用 Windows `SendInput` API，该 API 会在键盘事件中设置 `LLMHF_INJECTED` 标志。Chromium/Electron 应用（包括 Trae IDE、VS Code、Windows Terminal 等）可能检测此标志并忽略合成的键盘输入。

**已尝试的方案**：

| 方案 | 结果 | 原因 |
|------|------|------|
| Ctrl+V (SendInput) | 普通应用 ✅ / 终端 ❌ | SendInput 的 INJECTED 标志被 Electron 拦截 |
| Shift+Insert (SendInput) | 同 Ctrl+V | 同样使用 SendInput，同样被拦截 |
| Ctrl+V + AllowSetForegroundWindow | 焦点恢复改善，但终端仍不工作 | 焦点正确恢复，但仍走 SendInput 路径 |
| PostMessageW 直接向目标 HWND 发送 WM_KEYDOWN/WM_CHAR/WM_KEYUP | **已回滚**（未充分测试） | 绕过 SendInput 和 INJECTED 标志检测，理论可行 |

**下一步方向**：
1. **方案 A**：完成 `PostMessageW` 方案的测试。该方案的思路是放弃 `SendInput`（enigo），改用 Windows `PostMessageW` API 直接将 `WM_KEYDOWN`（VK_CONTROL）→ `WM_KEYDOWN`（'V'）→ `WM_CHAR`（0x16）→ `WM_KEYUP` 序列投递到目标窗口的消息队列，完全绕过系统输入队列和注入检测。代码已在 `paste_ctrl_v_to_hwnd()` 函数中实现后被回滚。
2. **方案 B**：同时发送 Ctrl+V 和 Shift+Insert 两种按键，覆盖更多终端
3. **方案 C**：使用 Windows UI Automation（`uiautomation` crate）在目标应用中执行粘贴操作
4. **方案 D**：调查 enigo 是否有不使用 `SendInput` 的后端（如 `keybd_event` 旧 API）

**关键文件**：
- `src-tauri/src/paste.rs:64-121` — `paste_with_defocus` 函数
- `src-tauri/src/shortcut.rs:10-11` — `save_foreground_window` / `LAST_FOREGROUND_HWND`
- `src-tauri/src/clipboard.rs:4-7` — `PASTING` / `LAST_CLIPBOARD_*` 静态缓存

### 当前 paste_with_defocus 最终状态（截至交接时）

```rust
fn paste_with_defocus(app: &AppHandle) -> Result<(), String> {
    // 1. AllowForegroundWindow (ASFW_ANY) — 在隐藏窗口前授权
    // 2. Hide radial-menu 窗口
    // 3. Hide main 窗口（如可见）
    // 4. SetForegroundWindow(saved_hwnd) — 恢复目标应用焦点
    // 5. Sleep 200ms
    // 6. enigo 模拟 Ctrl+V (Press Control → Click V → Release Control)
}
```

---

*最后更新：2026-05-16*
