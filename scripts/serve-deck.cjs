#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { createHash, randomUUID } = require('crypto');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..');
const exportDir = path.join(root, '.exports');
const pdfCacheDir = path.join(exportDir, 'pdf-cache');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
const defaultWatermark = process.env.DECK_WATERMARK_TEXT || '';
const pdfCacheVersion = '20260707-single-custom-watermark-v1';
const supportedLanguages = new Set(['zh', 'en', 'ja', 'ko', 'ar', 'ru', 'fr', 'de', 'es', 'pt']);
const supportedRatios = new Set(['16:9', '4:3', 'a4-landscape', 'a4-portrait', 'letter-landscape']);
const supportedFormats = new Set(['pdf', 'pptx']);
const supportedScopes = new Set(['full', 'investor', 'current']);
const supportedDispositions = new Set(['attachment', 'inline']);
const allSections = ['cover', 'main', 'case', 'product', 'appendix'];
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

let activeExports = 0;
const pdfWarmJobs = new Map();

function sendJson(response, status, body) {
  const data = Buffer.from(JSON.stringify(body));
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': data.length,
    'Cache-Control': 'no-store'
  });
  response.end(data);
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > 64 * 1024) {
        reject(new Error('请求内容过大。'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(new Error('导出参数不是有效 JSON。'));
      }
    });
    request.on('error', reject);
  });
}

function parsePositiveInteger(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number.parseInt(value, 10);
  return Number.isInteger(number) ? number : NaN;
}

function validatePageList(raw) {
  const value = String(raw || '').trim();
  if (!value) return null;
  if (!/^\d+(?:\s*-\s*\d+)?(?:[\s,]+\d+(?:\s*-\s*\d+)?)*$/.test(value)) {
    throw new Error('页码列表格式无效，请使用 1,3,5-8。');
  }
  return value.replace(/\s*-\s*/g, '-').replace(/[\s,]+/g, ',');
}

function validateExport(input) {
  const lang = String(input.lang || 'zh').toLowerCase();
  const ratio = String(input.ratio || '16:9').toLowerCase();
  const format = String(input.format || 'pdf').toLowerCase();
  const scope = String(input.scope || 'full').toLowerCase();
  const disposition = String(input.disposition || 'attachment').toLowerCase();
  const currentPage = Number.parseInt(input.currentPage, 10);

  const pageFrom = parsePositiveInteger(input.pageFrom);
  const pageTo = parsePositiveInteger(input.pageTo);

  // 解析自定义 section 列表
  let sections = null;
  if (input.sections && Array.isArray(input.sections)) {
    sections = input.sections.filter(s => allSections.includes(s));
  }

  const pageList = validatePageList(input.pageList);

  // 水印相关
  const watermarkEnabled = Boolean(input.watermarkEnabled);
  const watermarkText = String(input.watermarkText || '').trim();

  if (!supportedLanguages.has(lang)) throw new Error('不支持的语言。');
  if (!supportedRatios.has(ratio)) throw new Error('不支持的页面比例。');
  if (!supportedFormats.has(format)) throw new Error('不支持的导出格式。');
  if (!supportedScopes.has(scope)) throw new Error('不支持的导出范围。');
  if (!supportedDispositions.has(disposition)) throw new Error('不支持的响应方式。');
  if (scope === 'current' && (!Number.isInteger(currentPage) || currentPage < 1 || currentPage > 200)) {
    throw new Error('当前页码无效。');
  }
  if (pageFrom !== null && (isNaN(pageFrom) || pageFrom < 1)) {
    throw new Error('起始页码无效。');
  }
  if (pageTo !== null && (isNaN(pageTo) || pageTo < 1)) {
    throw new Error('结束页码无效。');
  }
  if (pageFrom !== null && pageTo !== null && pageFrom > pageTo) {
    throw new Error('起始页码不能大于结束页码。');
  }

  return {
    lang, ratio, format, scope, disposition, currentPage,
    pageFrom, pageTo, sections, pageList,
    watermarkEnabled, watermarkText,
    filename: String(input.filename || '').trim()
  };
}

function downloadFilename(options) {
  const language = options.lang.toUpperCase();
  const ratio = options.ratio.replace(':', 'x').replace(/[^a-z0-9-]/gi, '');

  let scope = '';
  if (options.scope === 'investor') {
    scope = 'Investor';
  } else if (options.scope === 'current') {
    scope = `P${options.currentPage}`;
  } else if (options.pageList) {
    // 自定义页码列表，生成简短标识
    scope = 'Custom';
  } else if (options.sections && options.sections.length > 0 && options.sections.length < 5) {
    // 自定义 section，生成简短标识
    scope = options.sections.sort().join('+');
  } else {
    scope = 'Full';
  }

  const watermarkTag = options.watermarkEnabled && options.watermarkText ? '_Watermark' : '';
  return `OpenCSG_Investor_Deck_2026_${language}_${ratio}_${scope}${watermarkTag}.${options.format}`;
}

function sanitizeFilename(input, fallback, extension) {
  let filename = String(input || '').trim();
  if (!filename) return fallback;
  filename = path.basename(filename)
    .replace(/[\x00-\x1f\x7f]/g, '')
    .replace(/[<>:"/\\|?*]+/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/^\.+/, '')
    .trim();
  if (!filename) return fallback;
  filename = filename.replace(/\.(pdf|pptx)$/i, '');
  filename = filename.slice(0, 140).trim();
  return filename ? `${filename}.${extension}` : fallback;
}

function contentDisposition(disposition, filename) {
  const asciiFilename = filename
    .replace(/[^\x20-\x7e]/g, '_')
    .replace(/["\\]/g, '_');
  return `${disposition}; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

function cacheKeyForPdf(options) {
  return createHash('sha256')
    .update(JSON.stringify({
      lang: options.lang,
      ratio: options.ratio,
      scope: options.scope,
      sections: options.sections || allSections,
      watermarkText: options.watermarkText || '',
      pdfCacheVersion
    }))
    .digest('hex')
    .slice(0, 24);
}

function defaultViewPdfOptions(lang, watermarkText = defaultWatermark) {
  return validateExport({
    lang,
    ratio: '16:9',
    format: 'pdf',
    scope: 'full',
    currentPage: 1,
    sections: allSections,
    pageFrom: null,
    pageTo: null,
    pageList: null,
    watermarkEnabled: Boolean(watermarkText),
    watermarkText,
    filename: `OpenCSG_Investor_Deck_2026_${String(lang).toUpperCase()}_16x9_Full_Watermark.pdf`,
    disposition: 'inline'
  });
}

function exporterArgs(options, relativeOutput) {
  const script = options.format === 'pdf' ? 'export-pdf.cjs' : 'export-pptx.cjs';
  const outputFlag = options.format === 'pdf' ? '--out' : '--file';
  const args = [
    path.join('scripts', script),
    `--lang=${options.lang}`,
    `--ratio=${options.ratio}`,
    `${outputFlag}=${relativeOutput}`
  ];

  // 优先级：pageList > sections > scope preset
  if (options.pageList) {
    // 直接指定页码列表
    args.push(`--pages=${options.pageList}`);
  } else if (options.scope === 'current') {
    // 当前页
    args.push(`--pages=${options.currentPage}`);
  } else if (options.sections && options.sections.length > 0) {
    // 自定义 section 列表
    args.push(`--sections=${options.sections.join(',')}`);
    // 如果还有页码范围限制
    if (options.pageFrom !== null || options.pageTo !== null) {
      if (options.pageFrom !== null) args.push(`--from=${options.pageFrom}`);
      if (options.pageTo !== null) args.push(`--to=${options.pageTo}`);
    }
  } else if (options.scope === 'investor') {
    // 投资人版：cover, main, case
    args.push('--sections=cover,main,case');
  } else {
    // 完整版
    args.push('--sections=cover,main,case,product,appendix');
  }

  // 水印参数
  if (options.watermarkEnabled && options.watermarkText) {
    args.push(`--watermark=${options.watermarkText}`);
  }

  return args;
}

function runExporter(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: root,
      env: { ...process.env, FORCE_COLOR: '0' },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let output = '';
    const append = (chunk) => {
      output += chunk.toString();
      if (output.length > 12000) output = output.slice(-12000);
    };
    child.stdout.on('data', append);
    child.stderr.on('data', append);
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error('导出超时，请稍后重试。'));
    }, 10 * 60 * 1000);
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(output);
      else reject(new Error(output.trim() || `导出程序退出，状态码 ${code}`));
    });
  });
}

async function streamExport(options, response) {
  if (activeExports >= 2) {
    sendJson(response, 429, { error: '已有导出任务正在运行，请稍后再试。' });
    return;
  }

  fs.mkdirSync(exportDir, { recursive: true });
  const extension = options.format;
  const jobName = `${Date.now()}-${randomUUID()}.${extension}`;
  const relativeOutput = path.join('.exports', jobName);
  const absoluteOutput = path.join(root, relativeOutput);
  activeExports += 1;

  try {
    await runExporter(exporterArgs(options, relativeOutput));
    if (!fs.existsSync(absoluteOutput)) throw new Error('导出程序没有生成文件。');

    const filename = sanitizeFilename(options.filename, downloadFilename(options), extension);
    const stat = fs.statSync(absoluteOutput);
    response.writeHead(200, {
      'Content-Type': options.format === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Length': stat.size,
      'Content-Disposition': contentDisposition(options.disposition, filename),
      'Cache-Control': 'no-store',
      'X-Export-Filename': filename
    });
    const stream = fs.createReadStream(absoluteOutput);
    stream.pipe(response);
    stream.on('error', (error) => {
      if (!response.headersSent) sendJson(response, 500, { error: error.message });
      else response.destroy(error);
    });
    response.on('finish', () => fs.rm(absoluteOutput, { force: true }, () => {}));
  } catch (error) {
    fs.rm(absoluteOutput, { force: true }, () => {});
    sendJson(response, 500, { error: error.message });
  } finally {
    activeExports -= 1;
  }
}

async function handleExport(request, response) {
  let options;
  try {
    options = validateExport(await readJson(request));
  } catch (error) {
    sendJson(response, 400, { error: error.message });
    return;
  }
  await streamExport(options, response);
}

async function ensureCachedPdf(options) {
  fs.mkdirSync(pdfCacheDir, { recursive: true });
  const key = cacheKeyForPdf(options);
  const absoluteOutput = path.join(pdfCacheDir, `${key}.pdf`);
  const relativeOutput = path.relative(root, absoluteOutput);
  const filename = sanitizeFilename(options.filename, downloadFilename(options), 'pdf');

  if (fs.existsSync(absoluteOutput)) {
    return { absoluteOutput, filename, key, cached: true };
  }
  if (pdfWarmJobs.has(key)) {
    await pdfWarmJobs.get(key);
    return { absoluteOutput, filename, key, cached: true };
  }
  if (activeExports >= 2) {
    throw new Error('已有导出任务正在运行，请稍后再试。');
  }

  const job = (async () => {
    activeExports += 1;
    try {
      await runExporter(exporterArgs(options, relativeOutput));
      if (!fs.existsSync(absoluteOutput)) throw new Error('导出程序没有生成文件。');
    } finally {
      activeExports -= 1;
      pdfWarmJobs.delete(key);
    }
  })();
  pdfWarmJobs.set(key, job);
  await job;
  return { absoluteOutput, filename, key, cached: false };
}

function viewPdfOptionsFromUrl(url) {
  const lang = String(url.searchParams.get('lang') || 'zh').toLowerCase();
  const watermarkText = String(url.searchParams.get('watermark') ?? defaultWatermark).trim();
  return defaultViewPdfOptions(lang, watermarkText);
}

async function handleWarmPdf(url, response) {
  let result;
  try {
    result = await ensureCachedPdf(viewPdfOptionsFromUrl(url));
  } catch (error) {
    sendJson(response, 500, { ok: false, error: error.message });
    return;
  }
  sendJson(response, 200, {
    ok: true,
    cached: result.cached,
    key: result.key,
    filename: result.filename
  });
}

async function handleViewPdf(url, response) {
  let result;
  try {
    result = await ensureCachedPdf(viewPdfOptionsFromUrl(url));
  } catch (error) {
    sendJson(response, 500, { error: error.message });
    return;
  }
  const stat = fs.statSync(result.absoluteOutput);
  response.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Length': stat.size,
    'Content-Disposition': contentDisposition('inline', result.filename),
    'Cache-Control': 'no-store',
    'X-Export-Filename': result.filename,
    'X-Export-Cache': result.cached ? 'HIT' : 'MISS'
  });
  fs.createReadStream(result.absoluteOutput).pipe(response);
}

function staticFilePath(urlPath) {
  const decoded = decodeURIComponent(urlPath === '/' ? '/index.html' : urlPath);
  const resolved = path.resolve(root, `.${decoded}`);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) return null;
  return resolved;
}

function serveStatic(request, response, pathname) {
  const filePath = staticFilePath(pathname);
  if (!filePath) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }
  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      'Content-Type': mimeTypes[extension] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': extension === '.html' || extension === '.js' || extension === '.css'
        ? 'no-cache'
        : 'public, max-age=3600'
    });
    fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);
  if (request.method === 'POST' && url.pathname === '/api/export') {
    await handleExport(request, response);
    return;
  }
  if (request.method === 'GET' && url.pathname === '/api/view-pdf') {
    await handleViewPdf(url, response);
    return;
  }
  if (request.method === 'GET' && url.pathname === '/api/warm-pdf') {
    await handleWarmPdf(url, response);
    return;
  }
  if (request.method === 'GET' && url.pathname === '/api/health') {
    sendJson(response, 200, { ok: true, activeExports });
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD, POST' });
    response.end('Method not allowed');
    return;
  }
  serveStatic(request, response, url.pathname);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`端口已被占用: http://${host}:${port}，请设置 PORT 使用其他端口。`);
    process.exit(1);
  }
  console.error(error);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`OpenCSG deck server: http://${host}:${port}`);
});
