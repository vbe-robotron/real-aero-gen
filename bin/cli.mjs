#!/usr/bin/env node
/**
 * windows-ux-guide — 配布 CLI (依存パッケージなし / Node 18+ / ESM)
 *
 *   npx windows-ux-guide install   エージェント スキルを探索パスへ配置する
 *   npx windows-ux-guide demo      同梱の Aero UI デモをローカル配信する
 *   npx windows-ux-guide list      パッケージ内容と配置先の候補を表示する
 *
 * 配置先の規約 (2025 時点の各エージェントの探索パス):
 *   Codex / OpenAI (agent skills 標準)
 *     プロジェクト: <repo>/.agents/skills
 *     ユーザー:     ~/.agents/skills
 *   Claude Code
 *     プロジェクト: <project>/.claude/skills
 *     ユーザー:     ~/.claude/skills
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_NAME = 'windows-ux-guide';
const SKILL_SRC = path.join(ROOT, 'skills', SKILL_NAME);
const DEMO_SRC = path.join(ROOT, 'demo');
const PKG = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

/** エージェントごとの探索パス (project = カレント、user = ホーム基点) */
const TARGETS = {
  agents: {
    label: 'Codex / OpenAI (agent skills 標準)',
    project: ['.agents', 'skills'],
    user: ['.agents', 'skills'],
    invoke: '$windows-ux-guide',
  },
  claude: {
    label: 'Claude Code',
    project: ['.claude', 'skills'],
    user: ['.claude', 'skills'],
    invoke: '/windows-ux-guide',
  },
};
/** codex は agents と同じ探索パス */
TARGETS.codex = { ...TARGETS.agents, label: 'Codex (agents と同じ探索パス)' };

const DEFAULT_TARGET = 'agents';

// ---------------------------------------------------------------- ユーティリティ

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);
const bold = (s) => c('1', s);
const dim = (s) => c('2', s);
const green = (s) => c('32', s);
const yellow = (s) => c('33', s);
const red = (s) => c('31', s);

function die(msg, code = 2) {
  console.error(red('エラー: ') + msg);
  process.exit(code);
}

function relToCwd(p) {
  const r = path.relative(process.cwd(), p);
  return r && !r.startsWith('..') ? r : p;
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

/** ディレクトリ内の全ファイルを relpath -> sha256 / link:<target> に落とす */
function hashTree(dir) {
  const map = new Map();
  if (!fs.existsSync(dir)) return map;
  const walk = (rel) => {
    const abs = rel ? path.join(dir, rel) : dir;
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      const r = rel ? path.join(rel, entry.name) : entry.name;
      if (entry.isDirectory()) walk(r);
      else if (entry.isSymbolicLink()) map.set(r, 'link:' + fs.readlinkSync(path.join(dir, r)));
      else if (entry.isFile()) map.set(r, sha256File(path.join(dir, r)));
    }
  };
  walk('');
  return map;
}

function diffTrees(srcMap, destMap) {
  const added = [];
  const changed = [];
  const same = [];
  for (const [file, hash] of srcMap) {
    if (!destMap.has(file)) added.push(file);
    else if (destMap.get(file) !== hash) changed.push(file);
    else same.push(file);
  }
  const extra = [...destMap.keys()].filter((f) => !srcMap.has(f));
  return { added, changed, same, extra };
}

// ---------------------------------------------------------------- 引数の解析

const VALUE_FLAGS = {
  '--dir': 'dir', '-d': 'dir',
  '--target': 'target', '-t': 'target',
  '--name': 'name', '-n': 'name',
  '--port': 'port', '-p': 'port',
  '--host': 'host',
  '--scope': 'scope',
};
const BOOL_FLAGS = {
  '--force': 'force', '-f': 'force',
  '--dry-run': 'dryRun',
  '--user': 'user', '--global': 'user',
  '--symlink': 'symlink',
  '--prune': 'prune',
  '--no-open': 'noOpen',
  '--yes': 'yes', '-y': 'yes',
  '--json': 'json',
  '--quiet': 'quiet', '-q': 'quiet',
  '--help': 'help', '-h': 'help',
  '--version': 'version', '-v': 'version',
};

function parseArgs(argv) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const raw = argv[i];
    if (raw === '--') { opts._.push(...argv.slice(i + 1)); break; }
    const eq = raw.indexOf('=');
    const flag = eq === -1 ? raw : raw.slice(0, eq);
    const inline = eq === -1 ? undefined : raw.slice(eq + 1);
    if (VALUE_FLAGS[flag]) {
      const key = VALUE_FLAGS[flag];
      const value = inline ?? argv[++i];
      if (value === undefined) die(`${flag} には値が必要です`);
      opts[key] = value;
    } else if (BOOL_FLAGS[flag]) {
      opts[BOOL_FLAGS[flag]] = true;
    } else if (raw.startsWith('-') && raw !== '-') {
      die(`不明なオプション: ${raw} (--help を参照)`);
    } else {
      opts._.push(raw);
    }
  }
  return opts;
}

function helpText() {
  return `${bold('windows-ux-guide')} v${PKG.version} — Windows 7/Vista UX Guide スキル + Aero デモ

${bold('使い方')}
  npx ${PKG.name} [command] [options]

${bold('コマンド')}
  install   スキルをエージェントの探索パスへ配置する ${dim('(既定)')}
  demo      同梱の Aero UI デモをローカル HTTP で配信する
  list      パッケージ内容と配置先の候補を表示する
  version   バージョンを表示する
  help      このヘルプを表示する

${bold('install のオプション')}
  -t, --target <name>   配置先: agents | codex | claude | all | auto ${dim('(既定: agents)')}
      --user            プロジェクトではなくホーム配下へ配置する
                         ${dim('例: ~/.agents/skills、~/.claude/skills')}
  -d, --dir <path>      スキル群の親ディレクトリを直接指定する
  -n, --name <dir>      配置先のフォルダー名 ${dim('(既定: ' + SKILL_NAME + ')')}
  -f, --force           既存の配置先を上書きする
      --prune           --force 時に配置先の余分なファイルも削除する
      --symlink         コピーせずシンボリック リンクを張る ${dim('(開発用)')}
      --dry-run         書き込まずに実行内容だけを表示する
      --json            結果を JSON で出力する
  -q, --quiet           冗長な出力を抑える

${bold('demo のオプション')}
  -p, --port <n>        待ち受けポート ${dim('(既定: 8080 / 使用中なら自動で +1)')}
      --host <addr>     待ち受けアドレス ${dim('(既定: 127.0.0.1)')}
      --no-open         ブラウザーを自動で開かない

${bold('配置先の探索パス')}
  agents / codex   ${dim('<repo>/.agents/skills')}   ${dim('~/.agents/skills')}
  claude           ${dim('<project>/.claude/skills')} ${dim('~/.claude/skills')}

${bold('例')}
  npx ${PKG.name}                       ${dim('# cwd の既定パスへ install')}
  npx ${PKG.name} install -t claude     ${dim('# Claude Code のプロジェクトへ')}
  npx ${PKG.name} install --user        ${dim('# ホーム配下へ (全プロジェクト共通)')}
  npx ${PKG.name} demo -p 5173          ${dim('# デモを 5173 で配信')}
`;
}

function printHelp() {
  process.stdout.write(helpText());
}

// ---------------------------------------------------------------- install

function targetDir(target, userScope) {
  const base = userScope ? os.homedir() : process.cwd();
  return path.join(base, ...(userScope ? target.user : target.project));
}

/** 配置先 (スキル群の親ディレクトリ) を決定する */
function resolvePlacements(opts) {
  const userScope = !!(opts.user || opts.scope === 'user');
  if (opts.scope && !['user', 'project'].includes(opts.scope)) {
    die('--scope は "user" か "project" を指定してください');
  }

  if (opts.dir) {
    return [{
      key: 'custom',
      label: 'カスタム (--dir)',
      dir: path.resolve(userScope ? os.homedir() : process.cwd(), opts.dir),
      userScope,
      invoke: null,
    }];
  }

  const requested = String(opts.target ?? 'auto').toLowerCase();
  if (requested === 'all') {
    return [TARGETS.agents, TARGETS.claude].map((t, i) => ({
      key: i === 0 ? 'agents' : 'claude',
      label: t.label,
      dir: targetDir(t, userScope),
      userScope,
      invoke: i === 0 ? TARGETS.agents.invoke : TARGETS.claude.invoke,
    }));
  }
  if (requested === 'auto') {
    // 既存の探索パスがあれば尊重し、無ければ既定 (agents) にする
    const found = ['agents', 'claude'].find((k) => fs.existsSync(targetDir(TARGETS[k], userScope)));
    return resolvePlacements({ ...opts, target: found ?? DEFAULT_TARGET });
  }
  const target = TARGETS[requested];
  if (!target) die(`--target は agents | claude | codex | all | auto のいずれかです (指定: ${requested})`);
  return [{ key: requested, label: target.label, dir: targetDir(target, userScope), userScope, invoke: target.invoke }];
}

function makeSymlink(src, dest) {
  const type = process.platform === 'win32' ? 'junction' : 'dir';
  fs.symlinkSync(src, dest, type);
}

/** 1 か所への配置を実行し、結果オブジェクトを返す */
function applyPlacement(place, opts) {
  const dest = path.join(place.dir, opts.name || SKILL_NAME);
  const result = { ...place, dest, added: 0, changed: 0, unchanged: 0, extra: [], status: 'ok' };

  if (fs.existsSync(dest) && fs.statSync(dest).isFile()) {
    console.error(red('エラー: ') + `配置先がファイルです: ${dest}`);
    result.status = 'error';
    return result;
  }

  const src = hashTree(SKILL_SRC);
  const existing = fs.existsSync(dest) ? hashTree(dest) : new Map();
  const { added, changed, same, extra } = diffTrees(src, existing);
  result.added = added.length;
  result.changed = changed.length;
  result.unchanged = same.length;
  result.extra = extra;

  const exists = fs.existsSync(dest);
  const isUpToDate = exists && added.length === 0 && changed.length === 0 && (!opts.prune || extra.length === 0);

  if (opts.dryRun) {
    result.status = isUpToDate ? 'up-to-date' : exists ? 'would-update' : 'would-create';
    return result;
  }
  if (!opts.quiet && !opts.json) {
    if (added.length) console.log(`  追加 ${added.length}: ${added.slice(0, 4).join(', ')}${added.length > 4 ? ' …' : ''}`);
    if (changed.length) console.log(`  更新 ${changed.length}: ${changed.slice(0, 4).join(', ')}${changed.length > 4 ? ' …' : ''}`);
    if (extra.length) console.log(yellow(`  配置先のみ ${extra.length}: ${extra.slice(0, 4).join(', ')}${extra.length > 4 ? ' …' : ''}`));
  }

  if (isUpToDate && !opts.symlink) {
    result.status = 'up-to-date';
    return result;
  }

  // 既存の内容がパッケージと違う場合は、黙って壊さず --force を求める
  if (exists && !opts.force && !opts.symlink) {
    result.status = 'needs-force';
    return result;
  }

  fs.mkdirSync(place.dir, { recursive: true });
  if (opts.symlink) {
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
    makeSymlink(SKILL_SRC, dest);
    result.status = fs.existsSync(dest) ? 'linked' : 'error';
    return result;
  }

  fs.cpSync(SKILL_SRC, dest, { recursive: true, force: true });
  if (opts.prune) {
    for (const file of extra) fs.rmSync(path.join(dest, file), { force: true });
  }
  result.status = exists ? 'updated' : 'created';
  return result;
}

function cmdInstall(opts) {
  if (!fs.existsSync(path.join(SKILL_SRC, 'SKILL.md'))) {
    die(`スキル本体が見つかりません: ${SKILL_SRC}`);
  }
  const placements = resolvePlacements(opts);
  const results = [];
  if (!opts.json && !opts.quiet) {
    console.log(`${bold(PKG.name)} v${PKG.version} を配置します (${placements.length} か所)`);
  }
  for (const place of placements) {
    if (!opts.json && !opts.quiet) console.log(`${dim('→')} ${place.label}: ${bold(relToCwd(place.dir))}`);
    results.push(applyPlacement(place, opts));
  }

  const failed = results.filter((r) => r.status === 'error' || r.status === 'needs-force');
  if (opts.json) {
    console.log(JSON.stringify({
      package: PKG.name, version: PKG.version, dryRun: !!opts.dryRun, results,
    }, null, 2));
    process.exit(failed.length ? 1 : 0);
  }

  for (const r of results) {
    const where = bold(relToCwd(r.dest));
    if (r.status === 'created') console.log(green('  インストールしました') + ` ${where}`);
    else if (r.status === 'updated') console.log(green('  更新しました') + ` ${where}`);
    else if (r.status === 'linked') console.log(green('  リンクしました') + ` ${where} ${dim('→ ' + SKILL_SRC)}`);
    else if (r.status === 'up-to-date') console.log(green('  既に最新です') + ` ${where}`);
    else if (r.status === 'would-create') console.log(yellow('  [dry-run] 新規作成します') + ` ${where}`);
    else if (r.status === 'would-update') console.log(yellow(`  [dry-run] 追加 ${r.added} / 更新 ${r.changed} で上書きします`) + ` ${where}`);
    else if (r.status === 'needs-force') {
      console.log(yellow('  配置先に別の内容があります。上書きするには --force を付けてください') + ` ${where}`);
      const args = ['install', '--force'];
      if (opts.user) args.push('--user');
      if (opts.target) args.push('-t', opts.target);
      console.log(dim(`  ヒント: npx ${PKG.name} ${args.join(' ')}`));
      if (r.extra.length) console.log(dim('  余分なファイルも削除するには --prune を併用します'));
    }
  }
  if (failed.length) process.exit(1);

  if (!opts.quiet) {
    const invokes = [...new Set(results.map((r) => r.invoke).filter(Boolean))];
    console.log('');
    console.log(bold('次の手順'));
    console.log(`  ${dim('配置先の確認:')} npx ${PKG.name} list`);
    for (const invoke of invokes) {
      const host = invoke.startsWith('/') ? 'Claude Code' : 'Codex / ChatGPT デスクトップ';
      console.log(`  ${host} で ${bold(invoke)} として呼び出せます ${dim('(説明文が一致すれば自動でも起動します)')}`);
    }
    console.log(`  ${dim('見た目の確認:')} npx ${PKG.name} demo`);
  }
}

// ---------------------------------------------------------------- demo

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.pdf': 'application/pdf',
};

function serveStatic(docRoot, req, res) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('400 Bad Request');
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const abs = path.resolve(docRoot, '.' + pathname);

  // ディレクトリ外への脱出を防ぐ
  if (abs !== docRoot && !abs.startsWith(docRoot + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden');
  }

  fs.stat(abs, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end(`404 Not Found: ${pathname}\nデモの入口は / です。\n`);
    }
    const type = MIME[path.extname(abs).toLowerCase()] ?? 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': stat.size,
      'Cache-Control': 'no-store',
    });
    if (req.method === 'HEAD') return res.end();
    const stream = fs.createReadStream(abs);
    stream.on('error', () => res.end());
    return stream.pipe(res);
  });
  return undefined;
}

function openBrowser(url) {
  const [cmd, args] = process.platform === 'darwin'
    ? ['open', [url]]
    : process.platform === 'win32'
      ? ['cmd', ['/c', 'start', '', url]]
      : ['xdg-open', [url]];
  try {
    const child = spawn(cmd, args, { stdio: 'ignore', detached: true });
    child.on('error', () => {});
    child.unref();
  } catch {
    /* ブラウザーが開けなくても致命的ではない */
  }
}

function cmdDemo(opts) {
  if (!fs.existsSync(path.join(DEMO_SRC, 'index.html'))) {
    die(`デモが見つかりません: ${DEMO_SRC}`);
  }
  const host = opts.host || '127.0.0.1';
  let port = Number.parseInt(opts.port ?? '8080', 10);
  if (!Number.isInteger(port) || port < 0 || port > 65535) die('--port は 0〜65535 の整数です');

  const server = http.createServer((req, res) => serveStatic(DEMO_SRC, req, res));
  let attempts = 0;
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempts < 20) {
      attempts += 1;
      port += 1;
      server.listen(port, host);
      return;
    }
    die(`配信を開始できません: ${err.message}`, 1);
  });
  server.on('listening', () => {
    const actual = server.address().port;
    const url = `http://${host}:${actual}/`;
    console.log(`${bold(PKG.name)} v${PKG.version} — Aero UI デモ`);
    console.log(`  URL: ${green(url)}`);
    console.log(dim(`  配信元: ${DEMO_SRC}`));
    console.log(dim('  停止: Ctrl+C'));
    if (!opts.noOpen && !opts.json) openBrowser(url);
  });
  server.listen(port, host);
}

// ---------------------------------------------------------------- list

function listFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const walk = (rel) => {
    const abs = rel ? path.join(dir, rel) : dir;
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      const r = rel ? path.join(rel, entry.name) : entry.name;
      if (entry.isDirectory()) walk(r);
      else out.push(r);
    }
  };
  walk('');
  return out.sort();
}

function cmdList(opts) {
  const skillFiles = listFiles(SKILL_SRC);
  const demoFiles = listFiles(DEMO_SRC);
  const candidates = [];
  for (const [key, target] of Object.entries(TARGETS)) {
    if (key === 'codex') continue; // agents と同じパスなので省略
    for (const userScope of [false, true]) {
      const dir = path.join(targetDir(target, userScope), opts.name || SKILL_NAME);
      candidates.push({
        target: key,
        scope: userScope ? 'user' : 'project',
        label: target.label,
        dir,
        installed: fs.existsSync(dir),
      });
    }
  }

  if (opts.json) {
    console.log(JSON.stringify({
      package: PKG.name,
      version: PKG.version,
      root: ROOT,
      skill: { dir: SKILL_SRC, files: skillFiles },
      demo: { dir: DEMO_SRC, files: demoFiles },
      targets: candidates,
    }, null, 2));
    return;
  }

  console.log(`${bold(PKG.name)} v${PKG.version}`);
  console.log(`  パッケージ: ${dim(ROOT)}`);
  console.log(`  スキル: ${bold(relToCwd(SKILL_SRC))} ${dim(`(${skillFiles.length} ファイル)`)}`);
  console.log(dim(`    ${skillFiles.join('\n    ')}`));
  console.log(`  デモ: ${bold(relToCwd(DEMO_SRC))} ${dim(`(${demoFiles.length} ファイル)`)}`);
  console.log('');
  console.log(bold('配置先の候補') + dim(' ([x] = 配置済み)'));
  for (const candidate of candidates) {
    const mark = candidate.installed ? green('[x]') : '[ ]';
    console.log(`  ${mark} ${relToCwd(candidate.dir)} ${dim(`(${candidate.scope} / ${candidate.label})`)}`);
  }
  console.log('');
  console.log(bold('使い方'));
  console.log(`  npx ${PKG.name} install -t claude ${dim('# Claude Code のプロジェクトへ')}`);
  console.log(`  npx ${PKG.name} demo             ${dim('# Aero デモを配信')}`);
}

// ---------------------------------------------------------------- エントリ

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.version) {
    console.log(PKG.version);
    return;
  }
  if (opts.help) {
    printHelp();
    return;
  }
  const command = (opts._.shift() ?? 'install').toLowerCase();
  switch (command) {
    case 'install':
    case 'add':
      cmdInstall(opts);
      break;
    case 'demo':
    case 'serve':
    case 'preview':
      cmdDemo(opts);
      break;
    case 'list':
    case 'ls':
    case 'info':
      cmdList(opts);
      break;
    case 'version':
      console.log(PKG.version);
      break;
    case 'help':
      printHelp();
      break;
    default:
      console.error(red('不明なコマンド: ') + command);
      printHelp();
      process.exit(2);
  }
}

main();

