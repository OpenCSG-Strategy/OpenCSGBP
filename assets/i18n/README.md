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
  "slide03": { "title": "...", "milestone": { "0": "...", "1": "..." } }
}
```

- `_meta.dir` 写 `"ltr"` 或 `"rtl"`（阿拉伯语是 `"rtl"`）。
- `_meta.flag` 是顶栏胶囊上显示的两个字符（`中` / `EN` / `日` / `الع`）。
- 缺失 key 时，i18n.js 会回退中文，不会出现空白。

## 二、加一种新语言（假设要加越南语 `vi`）

1. **复制 `en.json`** → 重命名 `vi.json`。
2. **改 `_meta`**：`name: "Vietnamese"` / `nativeName: "Tiếng Việt"` / `dir: "ltr"` / `flag: "Vi"`。
3. **逐项翻** key 即可（结构必须保留）。
4. **在 `assets/deck-i18n.js` 顶部 `SUPPORTED`** 数组里加 `'vi'`。
5. 打开页面，右上角语言胶囊应自动出现 Tiếng Việt。

```js
const SUPPORTED = ['zh','en','ja','ko','ar','ru','fr','de','es','pt','vi'];
```

## 三、新增一段需要翻译的文案

在 HTML / JS 渲染出的元素上挂一个 `data-i18n`：

```html
<h2 data-i18n="slide07.caseTitle">海力士 12 寸晶圆缺陷分类</h2>
<p  data-i18n="slide07.caseLead">用 CSGHub 上的视觉模型把缺陷识别准确率拉到 99.2%。</p>
```

- 文本里**留中文原文**作为兜底（缺 key 时原样显示，不会空白）。
- 在 10 个 JSON 文件里同步加 `slide07.caseTitle` / `slide07.caseLead`，缺哪个就以中文兜底。

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
- QA：跑 `python3 assets/i18n/qa/qa_snap.py`（仓库根目录）能截 10 国菜单 + 中文版 03/04/05 三页。