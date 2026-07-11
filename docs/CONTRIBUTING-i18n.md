# i18n 贡献规范 · 改文案必读

> **强制规则**:deck 任何可见文本(中文 / 英文)的修改、删除、新增,**必须同步** 8 国(ja/ko/ar/ru/fr/de/es/pt)翻译,缺一条都不允许合并。
>
> 违反这条规则的 PR / commit 会被 reviewer 直接打回。

---

## 0. 为什么有这条规则

OpenCSG 投资人 deck 是对外路演材料,目标受众包括**全球 LP / 海外战略投资人**。一旦某条文案在英文或中文下显示正确、但在日文 / 韩文 / 阿拉伯文下回退到英文,会直接被海外投资人读成"半成品",严重折损专业度。

仓库现状(2026-07-10):

| 语言包 | phrases 条数 | 覆盖率 |
| --- | --- | --- |
| `zh.json` (source of truth) | 2508 | 100% |
| `en.json` (兜底 / 英文 PPT) | 2508 | 100% |
| `ja/ko/ar/ru/fr/de/es/pt.json` | 2490 | 99.8% |

99.8% 那 0.2%(4 条)是 JS 模板占位符(`${item.en}` 等),**不是真正需要翻译的字符串**。

> **降覆盖率 = 视觉降级,这是产品问题,不是工程小事。**

---

## 1. 三条铁律

### 铁律 ① — 改字必改 `data-en`

任何 HTML / JS 里**对投资人可见**的字符串,都必须带 `data-en="<English source>"`。改中文时,英文源文必须**同步修订**,否则翻译 key 不变,8 国翻译就锁死在旧版英文上。

```html
<!-- 反例:只改中文,英文 data-en 锁死 -->
<b data-en="Data accumulation entry">数据接入入口</b>

<!-- 正例:中文 + data-en 一起改 -->
<b data-en="Data onboarding entry">数据接入入口</b>
```

### 铁律 ② — 8 国翻译缺一不可

新增 / 修改任何 `data-en` key,必须**同时**在 `scripts/i18n/translation-pack.json` 的 `TRANSLATIONS` 里追加 8 国翻译:

```json
{
  "Data onboarding entry": {
    "ja": "データオンボーディング",
    "ko": "데이터 온보딩",
    "ar": "مدخل البيانات",
    "ru": "Вход данных",
    "fr": "Point d'entrée des données",
    "de": "Daten-Onboarding",
    "es": "Entrada de datos",
    "pt": "Entrada de dados"
  }
}
```

如果新增的是**中文为主、英文为辅**的短语(例如城市名、机构名),但 phrasal key 是中文,也要按中文 key 走同样的流程。

### 铁律 ③ — 提交前必须跑 `audit`

```bash
bash scripts/i18n/run-all.sh audit
```

期望输出:

```
== 必须翻译 key (U) 覆盖情况 (key 存在 + value 非空) ==
  zh.json: <N>/<N> (100.0%)
  en.json: <N>/<N> (100.0%)
  ja.json: <N>-4/<N> (99.8%)  ← 8 国只能差 ≤4 条 JS 模板占位符
  ko.json: ...
  ...

===== 术语一致性体检 =====
✅ 全部中文术语对应唯一英文，无冲突。
```

两段都过才算 clean。**任何一行不是 100% / 99.8%,或术语一致性报冲突,禁止 commit。**

> **术语一致性**(`term-consistency.js`)会扫出"同一个中文在不同地方被映射到不同英文"的一词多译
> 情况(典型 bug:`主权控制面` 既是 `Sovereign control plane` 又是 `Sovereign control layer`)。
> 这类问题会让日文 / 韩文用户看到错位翻译,因为 8 国翻译是按英文 key 查的,
> 英文源文一旦分裂,翻译就分裂。**改文案前先确认同一中文术语在 deck 里只对应一个英文**。

---

## 2. 标准工作流(5 步)

> 假设你要新增一条文案 `OpenCSG launched X`(示例)。

### Step 1 · 在 HTML/JS 写好中英文源文

```html
<!-- 静态 HTML -->
<p data-en="OpenCSG launched X in 2026.">OpenCSG 在 2026 年发布 X。</p>

<!-- JS 动态注入 -->
tx("OpenCSG 在 2026 年发布 X。", "OpenCSG launched X in 2026.")
```

注意:

- `data-en` 是英文源文,**未 HTML 实体编码**(`&` 不是 `&amp;`,框架的 `normalizeKey()` 会做 decode)
- 中英字符串**必须一一对应**,别忘了句号、问号、换行
- 含品牌名时,英文源文直接写品牌字面(OpenCSG、CSGHub、AgenticHub 等),不要拼成 "Open C S G" 之类

### Step 2 · 翻译 8 国,追加到 translation-pack.json

打开 `scripts/i18n/translation-pack.json`,在 `TRANSLATIONS` 里追加一条:

```json
"OpenCSG launched X in 2026.": {
  "ja": "OpenCSG が X を 2026 年にリリース。",
  "ko": "OpenCSG, 2026년 X 출시.",
  "ar": "أطلقت OpenCSG منتج X في عام 2026.",
  "ru": "OpenCSG запустила X в 2026 году.",
  "fr": "OpenCSG a lancé X en 2026.",
  "de": "OpenCSG hat X 2026 veröffentlicht.",
  "es": "OpenCSG lanzó X en 2026.",
  "pt": "OpenCSG lançou X em 2026."
}
```

**品牌名 / 专有名词保留不译**(白名单见 §4)。

### Step 3 · 写回 8 国语言包

```bash
bash scripts/i18n/run-all.sh apply
```

期望输出:`共新增 N 条短语到 8 国语言包`。

### Step 4 · 跑 audit 验证

```bash
bash scripts/i18n/run-all.sh audit
```

期望输出:见 §1 铁律 ③。

### Step 5 · 浏览器复核(可选但建议)

```bash
npm run serve
# 打开 http://127.0.0.1:4173/?lang=ja
# 切到日文 / 韩文 / 阿拉伯文,目视确认新文案翻译到位
```

特别注意:

- 阿拉伯文(`?lang=ar`)是否 RTL 排版正常
- 长德语 / 长俄语是否会撑破卡片,需要调 CSS
- 中文 / 英文模式下不应出现翻译回退(双 100%)

---

## 3. 批量新增(例如新增一整页 slide)

如果一次新增 ≥ 20 条短语(例如新增一页 slide),不要逐条手动翻译,**用 general agent 批量**走以下流程:

1. 把新英文 key 列表写到 `/tmp/translate-source.json`(JSON 数组)
2. 用 general agent + §4 的品牌白名单 prompt,一次性输出 8 国 JSON
3. 保存为 `/tmp/translated-all.json`
4. 跑一次性 patch 脚本:

   ```js
   // /tmp/patch-i18n.cjs(模板,改 SRC 路径即可)
   const fs = require('fs');
   const path = require('path');
   const ROOT = '/Users/fangchen/Baidu/GitHub/OpenCSG_BP_HTML_2026';
   const data = JSON.parse(fs.readFileSync('/tmp/translated-all.json', 'utf8'));
   ['ja','ko','ar','ru','fr','de','es','pt'].forEach(code => {
     const p = path.join(ROOT, `assets/i18n/${code}.json`);
     const json = JSON.parse(fs.readFileSync(p, 'utf8'));
     json.phrases = json.phrases || {};
     data.items.forEach(item => {
       if (item[code] && !json.phrases[item.en]) json.phrases[item.en] = item[code];
     });
     fs.writeFileSync(p, JSON.stringify(json, null, 2) + '\n');
   });
   ```

5. 跑 `audit` 验证

> 真实案例见 git log `2026-07-10: 补 309 条新短语到 8 国语言包`。

---

## 4. 品牌名 / 专有名词白名单(必须保留不译)

**技术 / 产品 / 平台**(10 国全保留字面):

OpenCSG、CSGHub、CSGHub-Lite、CSGClaw、AgenticHub、AgenticOps、CSGLite、OPC、OpenCore、DevOps、GitLab、MongoDB、Elastic、Grafana、Confluent、HashiCorp、Hugging Face、ModelScope、Notebook、Notebooks、LLaMA-Factory、MS-SWIFT、OpenCompass、EvalScope、llama.cpp、GGUF、SafeTensors、Ollama、Claude Code、Codex、OpenClaw、Dify、MCP、MCP Gateway、AI Gateway、LLM、LLMOps、Prompt、Prompts、Spaces、Skills、XNet、MultiSync、DataFlow、Manager-Worker、Sandbox

**协议 / 规范 / 协议栈**:SSO、LDAP、RBAC、SLA、HA、CDN、REST API、STT、SDK、API、JSON、CSV、PDF、PPTX、HTML、CSS

**企业名**:miHoYo、Bilibili、CATL、CALB、China Mobile、China Unicom、WuXi AppTec、Tencent、Amazon、Kunlun、Letv、Kaya Medical、Paradise Ventures、Fanta、Lenovo Capital、Guoxin Zhongshu、Sugon、D2iQ、Mesosphere、IBM、HP、EleutherAI、YC、Linux Foundation、CNCF、OGA

**机构 / 大学 / 城市**:MIIT、CAICT、NDRC、State Council、Tsinghua、USTC、HUST、Beihang、Wharton、Stanford、Y Combinator、Yichang、Dongfang、Longgang、Chongqing、Leshan、Yancheng、Shanghai、Shenzhen、Hainan、Hainan FTP、Hong Kong、Singapore、Southeast Asia、Sanxia

**项目代号 / 内部命名**:OPC-ready、TAM、ACV、ARPU、ROI、TCO、SLI、SLO

---

## 5. 提交前 Checklist(自检用)

把这一段贴到 PR 描述里,逐条打勾:

- [ ] 新增 / 修改的文案都有 `data-en` 或 `tx(zh, en)`
- [ ] `data-en` 放在**叶子节点**上,不是放在有子元素的结构化父元素上(见 §6 错误 F)
- [ ] `scripts/i18n/translation-pack.json` 已追加 8 国翻译
- [ ] 已跑 `bash scripts/i18n/run-all.sh apply`
- [ ] 已跑 `bash scripts/i18n/run-all.sh audit`,zh/en 是 100%,8 国 ≥ 99.8%
- [ ] 浏览器目视复检至少一个非英文语言(建议 `?lang=ja`)
- [ ] 没有引入新的 HTML 实体污染(`&amp;` 出现在 phrases key 里,见 §6 常见错误)
- [ ] 没有改 `data-en` 的值而忘了改 8 国翻译(会让旧翻译持续命中,误导海外投资人)
- [ ] 没有把品牌名翻译成当地语言(违反 §4 白名单)
- [ ] 中英文模式下没有出现回退 / 空白 / 错位
- [ ] 任何新引入的字体声明都用 `var(--body-font)` / `var(--display-font)`,没用孤儿字体(Arial / Playfair / serif / italic)

---

## 6. 常见错误(踩过坑,务必避免)

### 错误 A · phrases key 里出现 `&amp;`

```jsonc
// 反例:key 含未解码 HTML 实体
"Open search → cloud &amp; security": "オープン検索 → クラウド＆amp;セキュリティ"
//                      ^^^^^^                                          ^^^^^^
// lookup 时 normalizeKey() 把 &amp; → &,这个 key 永远命中不了

// 正例:key 不含 HTML 实体
"Open search → cloud & security": "オープン検索 → クラウド＆セキュリティ"
```

修正:跑一次 `/tmp/decode-fix.cjs`(见 `scripts/i18n/_archive/`,提交到 `scripts/i18n/` 后调用),把 10 国 phrases 字典统一 decode。

### 错误 B · 改了 `data-en` 但没改 8 国翻译

旧 key 仍在 phrases 里、命中后显示旧翻译;但 HTML 已经是新文案,**结果**:data-en 是新版英文,显示的是旧版翻译,**割裂**。

修正:必须改 8 国翻译,不能只改 `data-en`。

### 错误 C · JS 动态 HTML 没扫到

```js
// 这种 tx() 调用,默认 gen-phrases.js 不会扫
"治理主体"："Governance body"  // tx(zh, en) 形式
"数据接入入口"："Data accumulation entry"  // data-en="X">中文</X> 形式
```

结果:zh.json phrases 缺这些 key,zh 模式会 fallback 到 `en || zh`,但有时会显示空。

修正:跑 `/tmp/zh-patch-v2.cjs`,把 `data-en="X">中文<` + `tx("中文","English")` 两种模式都扫进 zh.json。

### 错误 D · 新增 `${...}` 占位符

```js
`${tx("治理主体", "Governance body")}`  // OK,这是变量
`<b>${item.title}</b>`  // OK,JS 变量
```

但如果你写 `data-en="${item.title}"`,audit 会把它当 key,报缺翻译。

修正:**禁止** 把 JS 变量拼到 `data-en` 里。需要用 tx() 或在渲染时手动 setText。

### 错误 E · 翻译里加了引号 / 换行

```json
"OpenCSG launched X": {
  "ja": "「OpenCSG が X をリリース」"  // ✗ 加了日文引号
  "fr": "OpenCSG a lancé X\nen 2026"   // ✗ 加了换行
}
```

引号会破坏 JSON 解析,换行会破坏 CSS 单行布局。

修正:翻译里禁止双引号 `"`、禁止换行 `\n`、禁止 `</...>` HTML 标签。

### 错误 F · `data-en` 放在有子节点的父元素上,会把子元素吞掉

`translateLegacyElements()` 的实现是 `el.textContent = value` —— **整段子节点会被清空**。如果父元素是 `<div class="grid-3">` 之类的结构,切到非中文模式后,子元素会全部消失,父元素的 textContent 被替换成一坨长文本,直接挤成多行 / 折叠。

```html
<!-- 反例:data-en 在父元素,内部有 3 个子元素要分列展示 -->
<div class="sv7-equation" data-en="AI sovereignty is not building everything yourself. It is keeping the critical controls in your own hands.">
  <span>AI SOVEREIGNTY</span>
  <b>不是自研一切,而是关键环节始终掌握在自己手里。</b>
  <p>可选择·可控制·可审计·可演进</p>
</div>
<!-- 切到英文后:<b> 和 <p> 都被 textContent 覆盖,只显示一坨长文本 -->

<!-- 正例 1:把 data-en 下移到真正要翻译的子元素 -->
<div class="sv7-equation">
  <span>AI SOVEREIGNTY</span>
  <b data-en="AI sovereignty is not building everything yourself. It is keeping the critical controls in your own hands.">不是自研一切...</b>
  <p>
    <span data-en="Choice">可选择</span><i>·</i>
    <span data-en="Control">可控制</span><i>·</i>
    <span data-en="Audit">可审计</span><i>·</i>
    <span data-en="Evolution">可演进</span>
  </p>
</div>

<!-- 正例 2:如果父元素只有 1 个文本节点,放在父元素上是 OK 的 -->
<b data-en="Some headline">某标题</b>  <!-- 没有子元素,textContent 替换安全 -->
```

**判断规则**:父元素能否放 `data-en`,看 `element.children.length`。`> 0` → 拆到叶子;`=== 0` → 可以放。

**实战场景**:中央"主权控制面"之前 `<b>主权<br>控制面</b>` 没 `data-en`,所以英文下也显示中文。改成 `<b><span data-en="Sovereignty">主权</span><br><span data-en="Control Plane">控制面</span></b>`。`<br>` 在父元素没 `data-en` 时不会被清掉。

修正:**禁止** 把 `data-en` 放在有子元素的结构化父元素上。每个要翻译的叶子节点单独带 `data-en`,9 国翻译也按叶子粒度补全。

---

## 7. 自动化(CI / Pre-commit,可加)

未来如果想把规范硬性化,加以下任一:

### Pre-commit hook(`.git/hooks/pre-commit`)

```bash
#!/bin/bash
# 检查 index.html / assets/*.js 是否有 data-en 改动
git diff --cached --name-only | grep -E '(index.html|assets/.*\.(js|html))$' | while read f; do
  echo "[pre-commit] 检测到 $f 改动,跑 i18n audit..."
  bash scripts/i18n/run-all.sh audit || {
    echo "❌ i18n audit 失败,8 国翻译缺失,禁止提交"
    exit 1
  }
  break
done
```

### GitHub Actions(`.github/workflows/i18n-check.yml`)

```yaml
name: i18n
on: [pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: 18 }
      - run: node scripts/i18n/audit.js
      - name: 检查 8 国覆盖率 ≥ 99.8%
        run: |
          grep -E '^  (ja|ko|ar|ru|fr|de|es|pt)\.json:' /tmp/i18n-audit/report.txt
          for L in ja ko ar ru fr de es pt; do
            PCT=$(grep "^  $L.json:" /tmp/i18n-audit/report.txt | awk -F'[(%]' '{print $2}')
            if (( $(echo "$PCT < 99.8" | bc -l) )); then
              echo "❌ $L 覆盖率 $PCT% < 99.8%"; exit 1
            fi
          done
```

---

## 8. FAQ

**Q:能不能只改 zh.json 跑 zh 模式就够了?**
不行。zh 模式只服务中文投资人,海外 IR 路演是主要场景。

**Q:8 国翻译想交给 LLM 自动化行不行?**
可以,**但必须人工抽检**至少 5 条(尤其含数字 / 品牌名 / 长句)。LLM 会把 `3.5M+` 翻成 `350万+`、把 `AgenticHub` 翻成 `代理中心`,踩过。

**Q:删一条 HTML 文案后,phrases 里旧 key 要不要删?**
**不要删**。其他页面可能复用同一短语。phrases 是字典,不是 1:1 镜像。

**Q:`tx("中文", "English")` 改成 `data-en="English">中文</data-en>` 行不行?**
行,两者等价。但 tx() 在 JS 字符串拼接里更灵活,推荐优先 tx()。

---

## 9. 联系方式

- i18n 框架源码:`assets/deck-i18n.js`
- 体检 / 修复脚本:`scripts/i18n/`
- 详细 i18n 字典约定:`assets/i18n/README.md`
- 主 README 多语言章节:[README.md#多语言](./README.md#多语言)
- 任何不清楚的 case,@Frank(IR) 或 @OpenCSG Tech Team

---

> **TL;DR**:改一个中文字 → 改对应 `data-en` → 8 国翻译补到 translation-pack.json → `apply` → `audit` → 不达 100%/99.8% 不准 commit。
