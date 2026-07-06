#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..');
const exportDir = path.join(root, '.exports');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
const supportedLanguages = new Set(['zh', 'en', 'ja', 'ko', 'ar', 'ru', 'fr', 'de', 'es', 'pt']);
const supportedRatios = new Set(['16:9', '4:3', 'a4-landscape', 'a4-portrait']);
const supportedFormats = new Set(['pdf', 'pptx']);
const supportedScopes = new Set(['full', 'investor', 'current']);
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

function validateExport(input) {
  const lang = String(input.lang || 'zh').toLowerCase();
  const ratio = String(input.ratio || '16:9').toLowerCase();
  const format = String(input.format || 'pdf').toLowerCase();
  const scope = String(input.scope || 'full').toLowerCase();
  const currentPage = Number.parseInt(input.currentPage, 10);

  if (!supportedLanguages.has(lang)) throw new Error('不支持的语言。');
  if (!supportedRatios.has(ratio)) throw new Error('不支持的页面比例。');
  if (!supportedFormats.has(format)) throw new Error('不支持的导出格式。');
  if (!supportedScopes.has(scope)) throw new Error('不支持的导出范围。');
  if (scope === 'current' && (!Number.isInteger(currentPage) || currentPage < 1 || currentPage > 200)) {
    throw new Error('当前页码无效。');
  }

  return { lang, ratio, format, scope, currentPage };
}

function downloadFilename(options) {
  const language = options.lang.toUpperCase();
  const ratio = options.ratio.replace(':', 'x').replace(/[^a-z0-9-]/gi, '');
  const scope = options.scope === 'investor'
    ? 'Investor'
    : options.scope === 'current'
      ? `P${options.currentPage}`
      : 'Full';
  return `OpenCSG_Investor_Deck_2026_${language}_${ratio}_${scope}.${options.format}`;
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

  if (options.scope === 'current') {
    args.push(`--pages=${options.currentPage}`);
  } else {
    const sections = options.scope === 'investor' ? ['cover', 'main'] : allSections;
    args.push(`--sections=${sections.join(',')}`);
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

async function handleExport(request, response) {
  if (activeExports >= 2) {
    sendJson(response, 429, { error: '已有导出任务正在运行，请稍后再试。' });
    return;
  }

  let options;
  try {
    options = validateExport(await readJson(request));
  } catch (error) {
    sendJson(response, 400, { error: error.message });
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

    const filename = downloadFilename(options);
    const stat = fs.statSync(absoluteOutput);
    response.writeHead(200, {
      'Content-Type': options.format === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename="${filename}"`,
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

server.listen(port, host, () => {
  console.log(`OpenCSG deck server: http://${host}:${port}`);
});
