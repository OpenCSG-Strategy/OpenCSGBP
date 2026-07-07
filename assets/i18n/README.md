# Deck i18n · 加新语言 / 改文案

这套 HTML Deck 的所有可见文本都走 i18n 翻译包。新增一种语言、或者改一条文案，都按下面三步走。

## 一、目录结构

```
assets/i18n/
├── zh.json   # 中文（默认 / 兜底）
├── en.json   # English
├── ja.json   # 日本語
├── ko.json   # 한국어
├── ar.json   # العربية（RTL）
├── ru.json   # Русский
├── fr.json   # Français
├── de.json   # Deutsch
├── es.json   # Español
└── pt.json   # Português
```

每个 JSON 文件长这样：

```json
{
  "_meta": { "name": "English", "nativeName": "English", "dir": "ltr", "flag": "EN" },
  "toolbar": { ... },
  "slide03": { "title": "...", "milestone": { "0": "...", "1": "..." } },
  "phrases": { "English source text": "Translated text" }
}
```

- `_meta.dir` 写 `"ltr"` 或 `"rtl"`（阿拉伯语是 `"rtl"`）。
- `_meta.flag` 是顶栏胶囊上显示的两个字符（`中` / `EN` / `日` / `الع`）。
- `phrases` 覆盖静态页面、动态附录、路线图和弹窗正文。
- 非中文语言缺少词条时回退英文，不再回退中文，也不会出现空白。

## 二、加一种新语言（假设要加越南语 `vi`）

1. **复制 `en.json`** → 重命名 `vi.json`。
2. **改 `_meta`**：`name: "Vietnamese"` / `nativeName: "Tiếng Việt"` / `dir: "ltr"` / `flag: "Vi"`。
3. **逐项翻** key 即可（结构必须保留），并生成完整 `phrases`。
4. **在 `assets/deck-i18n.js` 顶部 `SUPPORTED`** 数组里加 `'vi'`。
5. 打开页面，右上角语言胶囊应自动出现 Tiếng Việt。

```js
const SUPPORTED = ['zh','en','ja','ko','ar','ru','fr','de','es','pt','vi'];
```

## 二点五、以中文 PPT 为第一版

> 工作流：**中文永远是 source of truth**，其他语言靠 phrases 字典翻译。

| 文件 | 角色 | 必须有 phrases？ |
| --- | --- | --- |
| `zh.json` | source of truth；HTML 直接写中文，frame 短路返回 | ❌（可省略，但有也无害） |
| `en.json` | 英文 PPT；HTML 里 data-en 优先匹配 phrases，否则 fallback 到 data-en 自身 | ✅ |
| `ja/ko/ar/ru/fr/de/es/pt.json` | 多国翻译 | ✅ |

i18n 框架（`assets/deck-i18n.js`）查找顺序：

```
zh 模式 → 直接返回传入的中文（frame 内 'if (lang === zh) return zh'）
en 模式 → phrases[en]  ||  fallback 到 en（即 data-en 原文）
其它    → phrases[en（已 HTML 实体 decode + 全角空格折叠 + trim）]  ||  phrases[zh]  ||  fallback 到 en
```

> key 归一化：phrases 字典的 key 一律存字面 `&` / `<` / `>` / `"` / `'`，**不要存 HTML 实体**。查找前 `normalizeKey()` 会把 `&amp;` / 全角空格等还原。

### 自检脚本

仓库 `scripts/i18n/` 目录存放体检/修复脚本：

| 脚本 | 作用 |
| --- | --- |
| `audit.js` | 收齐 S1（HTML/JS 的 `data-en`）/ TX（`tx(zh, en)`）/ EN 字典的 en 值，与 10 国 phrases 比对，输出 U 的覆盖率报告到 `/tmp/i18n-audit/` |
| `gen-phrases.js` | 给 `zh.json` / `en.json` 补 phrases 字段；en value=key，zh value 从 EN 字典反查 |
| `gen-en-phrases.js` | 合并 phrases 中剩余的 HTML 实体 key（如果有） |
| `apply-translations.js` | 把 `translation-pack.json` 中的手工翻译写进 8 国语言包 |
| `translation-pack.json` | 手工翻译对照表，新加短语后追加到这里再 apply 即可 |
| `normalize-check.js` | 临时调试工具：用归一化后的 key 检查 phrases 命中率 |
| `run-all.sh` | 一键入口：`audit / gen / apply / all` |

### 新增一条短语的最小工作流（以"以中文为第一版"为例）

1. **写中文 PPT**：
   ```html
   <h2 data-en="Founder &amp; Team">创始人与团队</h2>
   ```
2. **同步英文源文到 data-en**：浏览器会自动把 `&amp;` 解码成 `&`，i18n 框架的 `normalizeKey()` 也会做同样归一化。
3. **追加 8 国翻译到 `scripts/i18n/translation-pack.json`**：
   ```json
   {
     "Founder & Team": {
       "ja": "創業者 & チーム",
       "ko": "창업자 & 팀",
       "ar": "المؤسس والفريق",
       ...
     }
   }
   ```
4. **跑 apply**：
   ```bash
   bash scripts/i18n/run-all.sh apply
   ```
5. **验证**：
   ```bash
   bash scripts/i18n/run-all.sh audit    # 期望 8 国 100% 覆盖
   ```
   刷新页面，切到日文，应当看到「創業者 & チーム」。

## 三、新增一段需要翻译的文案

正文优先保留中英文源文案，生成脚本会为其他语言补齐 `phrases`：

```html
<h2 data-en="Enterprise production system">企业生产系统</h2>
```

动态页面使用同样的中英文参数：

```js
tx("企业生产系统", "Enterprise production system", "h2")
```

新增或修改文案后运行：

```bash
bash scripts/i18n/run-all.sh apply   # 把手工翻译写进 8 国语言包
bash scripts/i18n/run-all.sh audit   # 验证覆盖率（期望 8 国 100%）
```

结构化公共文案也可以继续使用 `data-i18n`：

```html
<h2 data-i18n="slide07.caseTitle">海力士 12 寸晶圆缺陷分类</h2>
<p  data-i18n="slide07.caseLead">用 CSGHub 上的视觉模型把缺陷识别准确率拉到 99.2%。</p>
```

- 文本里保留中文原文，`data-en` 提供统一英文源文案。
- `data-i18n` 的结构化 key 需在对应 JSON 中同步维护。

> 也支持 `data-i18n-placeholder="common.search"` 给 input 写 placeholder。

## 四、键名约定（推荐）

按"页面 → 区块 → 元素"用点号分隔，便于以后批量维护：

| 路径 | 用途 |
| --- | --- |
| `toolbar.overview` / `toolbar.fullscreen` | 顶部按钮 |
| `common.cancel` / `common.apply` | 全局通用按钮 |
| `slide03.title` | 第 03 页标题 |
| `slide03.milestone.0` … `6` | 时间线 7 段文案 |
| `slide07.caseTitle` | 第 07 页案例标题 |
| `nav.counter`（带 `{current}/{total}` 占位符） | 翻页计数器 |

## 五、阿拉伯语等 RTL

- 在 `_meta.dir` 写 `"rtl"` 即可。
- 顶栏、菜单、按钮这些全局结构仍然保持 LTR；只有正文文本方向会切换。
- 后续要做"纯 RTL 镜像布局"的话，给 `body.lang-rtl` 类写 CSS 覆盖即可，框架已经预留。

## 六、调试 / 验收

- 浏览器 console：`localStorage.getItem('opencsg.deck.lang')` 看当前语言。
- 想强制重置回中文：`localStorage.removeItem('opencsg.deck.lang'); location.reload()`。
- URL 也可以指定：`?lang=ja` 直接以日文进入。
- 覆盖率体检：`bash scripts/i18n/run-all.sh audit`，输出 `/tmp/i18n-audit/` 报告。
- 浏览器端查询：`window.__opencsgI18n.phrase(pack, lang, zh, en)` 手动测试某条翻译。
- 浏览器端全量审计：`window.__opencsgI18nAudit([...所有英文源文])` 会打印每个语言的命中率和缺失清单到 console（默认折叠）。
