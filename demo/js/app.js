/* ==========================================================================
   app.js — ウィンドウ管理、タスクバー、スタート メニュー、キーボード
   出典: references/windows.md (ウィンドウ管理 / ダイアログ / モーダル)
         references/interaction.md (キーボード / フォーカス / タッチ)
         references/windows-environment.md (タスクバー / スタート メニュー)
         references/modern-porting.md §3.1-§3.2 (Aero ガラスの合成とフォールバック)
   標準ボタン、標準のコミット順序、フォーカス、状態の永続化をそのまま実装する
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var icon = function (id, cls) {
    return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' aria-hidden="true"><use href="#' + id + '"></use></svg>';
  };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  /* ------------------------------------------------------------------ 状態 */
  var Demo = {
    scale: 1,                 // --s の値
    preset: 'free',           // 'free' | '800x600' など
    stage: { w: 0, h: 0, k: 1 },
    dpr: window.devicePixelRatio || 1,
    fontResolved: ''
  };
  window.__demo = Demo;
  window.__ui = { icon: icon, esc: esc, $: $, $$: $$ };

  var PRESETS = {
    '640x480': { w: 640, h: 480, label: '640x480 (4:3) セーフ モード相当' },
    '800x600': { w: 800, h: 600, label: '800x600 (4:3) 最小解像度' },
    '1024x768': { w: 1024, h: 768, label: '1024x768 (4:3) 設計の基準' },
    '1280x1024': { w: 1280, h: 1024, label: '1280x1024 (5:4)' },
    '1440x900': { w: 1440, h: 900, label: '1440x900 (16:10)' },
    '1366x768': { w: 1366, h: 768, label: '1366x768 (16:9) 高さの最悪ケース' }
  };

  /* -------------------------------------------------------- 想定画面の枠 */
  function applyPreset(name) {
    var stage = $('#stage');
    var wrap = $('#stagewrap');
    Demo.preset = name;

    if (name === 'free' || !PRESETS[name]) {
      stage.style.width = '100%';
      stage.style.height = '100%';
      stage.style.left = '0';
      stage.style.top = '0';
      stage.style.transform = '';
      Demo.stage = { w: wrap.clientWidth, h: wrap.clientHeight, k: 1 };
    } else {
      var p = PRESETS[name];
      var k = Math.min(1, (wrap.clientWidth - 32) / p.w, (wrap.clientHeight - 32) / p.h);
      /* 論理解像度のままレイアウトさせ、表示だけ縮尺する。
         これで「小さい解像度で本当に収まるか」を検証できる */
      stage.style.width = p.w + 'px';
      stage.style.height = p.h + 'px';
      stage.style.transform = 'scale(' + k + ')';
      stage.style.left = Math.max(0, Math.round((wrap.clientWidth - p.w * k) / 2)) + 'px';
      stage.style.top = Math.max(0, Math.round((wrap.clientHeight - p.h * k) / 2)) + 'px';
      Demo.stage = { w: p.w, h: p.h, k: k };
    }

    $('#stagetag').textContent = name === 'free'
      ? '自動 (実際のウィンドウ サイズ)'
      : PRESETS[name].label + ' / 表示倍率 ' + Demo.stage.k.toFixed(2) + 'x';

    drawGuide();
    document.dispatchEvent(new CustomEvent('demo:stagechange'));
    readout();
  }

  /* 800x600 の安全領域 (最小解像度) を点線で示す */
  function drawGuide() {
    var guide = $('#aspectguide');
    var p = PRESETS[Demo.preset];
    guide.innerHTML = '';
    if (!p || p.w <= 800) { guide.hidden = true; return; }
    guide.hidden = false;
    var safe = document.createElement('div');
    safe.className = 'aspectguide__safe';
    safe.style.left = '0';
    safe.style.top = '0';
    safe.style.width = '800px';
    safe.style.height = '600px';
    var label = document.createElement('span');
    label.className = 'aspectguide__label';
    label.style.left = '0';
    label.style.top = '0';
    label.textContent = '800x600 (最小解像度)';
    guide.appendChild(safe);
    guide.appendChild(label);
  }
  /* ------------------------------------------------------------ スケール */
  function applyScale(value) {
    Demo.scale = value;
    document.documentElement.style.setProperty('--s', String(value));
    $$('#seg-scale .seg__item').forEach(function (b) {
      b.setAttribute('aria-pressed', String(Number(b.dataset.scale) === value));
    });
    document.dispatchEvent(new CustomEvent('demo:scalechange'));
    readout();
  }

  /* -------------------------------------------------------------- 表示値 */
  function probeFont() {
    if (!document.fonts || !document.fonts.check) { return 'system-ui'; }
    var stack = ['Meiryo UI', 'Meiryo', 'Segoe UI', 'Segoe UI Variable Text', 'Myriad', 'Hind', 'Noto Sans'];
    for (var i = 0; i < stack.length; i++) {
      try {
        if (document.fonts.check('12px "' + stack[i] + '"')) { return stack[i]; }
      } catch (e) { /* 無効な名前は無視して次へ */ }
    }
    return 'system-ui';
  }

  function readout() {
    var cs = getComputedStyle(document.documentElement);
    var p = PRESETS[Demo.preset];
    var size = p ? (p.w + 'x' + p.h + ' / ' + Demo.stage.k.toFixed(2) + 'x') : '自動';
    if (!Demo.fontResolved) { Demo.fontResolved = probeFont(); }
    $('#readout').textContent =
      'UI スケール ' + cs.getPropertyValue('--s').trim() +
      ' | 想定画面 ' + size +
      ' | root font-size ' + cs.fontSize +
      ' | --hairline ' + cs.getPropertyValue('--hairline').trim() +
      ' | DPR ' + Demo.dpr +
      ' | 本文 ' + cs.getPropertyValue('--text-body').trim() +
      ' / メイン命令 ' + cs.getPropertyValue('--text-main').trim() +
      ' | 実測フォント ' + Demo.fontResolved +
      ' | ガラス ' + glassLabel();
  }

  /* ---------------------------------------------------------------------
     Aero ガラス (references/modern-porting.md §3.1-§3.2)
     ガラスは色ではなく、DWM がデスクトップを背後でぼかして合成した結果。
     ここでは枠の backdrop-filter (ぼかし + 彩度) がそれに当たる。
     ぼかしを持てない環境は、era の Vista Basic と同じく不透明へ落とす。
     --------------------------------------------------------------------- */
  var GLASS_OK = !!(window.CSS && window.CSS.supports &&
    (window.CSS.supports('backdrop-filter', 'blur(1px)') ||
     window.CSS.supports('-webkit-backdrop-filter', 'blur(1px)')));

  function glassOn() {
    return !document.documentElement.classList.contains('no-glass');
  }

  function glassLabel() {
    if (!GLASS_OK) { return '非対応 → 不透明 (Vista Basic 相当)'; }
    if (!glassOn()) { return '不透明 (Vista Basic 相当)'; }
    var cs = getComputedStyle(document.documentElement);
    return 'backdrop-filter blur(' + cs.getPropertyValue('--glass-blur').trim() +
      ') saturate(' + cs.getPropertyValue('--glass-sat').trim() + ')';
  }

  function setGlass(on) {
    on = !!on && GLASS_OK;
    document.documentElement.classList.toggle('no-glass', !on);
    document.body.classList.toggle('no-glass', !on);
    $('#btn-glass').setAttribute('aria-pressed', String(on));
    readout();
  }

  /* -------------------------------------------------------------- 時計 */
  function tickClock() {
    var now = new Date();
    /* 日付と時刻の書式はプラットフォームの慣習に従う (text.md「数字、日付、時刻」) */
    $('#clock-time').textContent = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    $('#clock-date').textContent = now.toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' });
  }

  /* ----------------------------------------------------------- 通知/バルーン */
  function notify(opts) {
    var node = document.createElement('div');
    node.className = 'toast';
    node.setAttribute('role', 'status');
    node.innerHTML =
      icon(opts.icon || 'i-info') +
      '<div><div class="toast__title">' + esc(opts.title) + '</div>' +
      '<div class="toast__text">' + esc(opts.text || '') + '</div></div>' +
      '<button class="balloon__close" type="button" aria-label="通知を閉じる"></button>';
    $('.balloon__close', node).addEventListener('click', function () { node.remove(); });
    $('#toastlayer').appendChild(node);
    window.setTimeout(function () { node.remove(); }, 9000);
    return node;
  }

  /* バルーン: 通知領域のアイコンを指して、特別な状態を 1 つだけ伝える */
  function balloon(anchor, opts) {
    var desktop = $('#desktop');
    if (!anchor) { return null; }
    var old = $('.balloon', desktop);
    if (old) { old.remove(); }
    var node = document.createElement('div');
    node.className = 'balloon';
    node.setAttribute('role', 'status');
    node.innerHTML =
      '<div class="balloon__head">' + icon(opts.icon || 'i-info') +
      '<div><div class="balloon__title">' + esc(opts.title) + '</div>' +
      '<div>' + esc(opts.text || '') + '</div>' +
      (opts.action ? '<p style="margin-top:.5em"><button class="link" type="button">' + esc(opts.action) + '</button></p>' : '') +
      '</div>' +
      '<button class="balloon__close" type="button" aria-label="バルーンを閉じる"></button></div>';
    desktop.appendChild(node);

    /* 対象 (通知領域のアイコン) を覆わない位置に出す */
    var d = desktop.getBoundingClientRect();
    var a = anchor.getBoundingClientRect();
    var left = Math.max(4, Math.min(d.width - node.offsetWidth - 4, (a.left - d.left) + a.width / 2 - 32));
    node.style.left = Math.round(left) + 'px';
    node.style.bottom = Math.round(d.height - (a.top - d.top) + 12) + 'px';

    $('.balloon__close', node).addEventListener('click', function () { node.remove(); });
    if (opts.onAction && $('.link', node)) { $('.link', node).addEventListener('click', opts.onAction); }
    return node;
  }
  /* ==================== ウィンドウ マネージャ ==================== */
  var WM = {
    wins: {},                 // id -> 記録
    order: [],                // 背面 → 前面
    z: 100,
    active: null,
    saved: {},                // 閉じたときの位置とサイズ (再表示時に復元)
    cascade: 0
  };
  window.__wm = WM;

  function workArea() {
    var layer = $('#winlayer');
    return { w: layer.clientWidth, h: layer.clientHeight };
  }

  /* era のピクセル寸法を UI スケールに追従させる */
  function sx(n) { return Math.round(n * Demo.scale); }

  function closeAllMenus() {
    $$('.ctxmenu').forEach(function (m) { m.remove(); });
    $$('[aria-expanded="true"][data-menu]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }

  /* 初期位置: 所有ウィンドウは所有者の中央 (所有者の下に隠さない)、
     それ以外は作業領域の左上から少しずつずらす */
  function positionFor(rec, size, saved) {
    var area = workArea();
    var w = Math.min(size.w, area.w);
    var h = Math.min(size.h, area.h);
    if (saved && typeof saved.x === 'number') {
      return {
        x: Math.min(Math.max(0, saved.x), Math.max(0, area.w - w)),
        y: Math.min(Math.max(0, saved.y), Math.max(0, area.h - h))
      };
    }
    var owner = rec.owner && WM.wins[rec.owner];
    if (owner) {
      var o = owner.rect();
      var x = o.x + (o.w - w) / 2 + sx(24);
      var y = o.y + (o.h - h) / 2 + sx(24);
      return { x: Math.max(0, Math.min(area.w - w, x)), y: Math.max(0, Math.min(area.h - h, y)) };
    }
    var n = WM.cascade++ % 6;
    var step = sx(24);
    return {
      x: Math.max(0, Math.min(area.w - w, sx(24) + n * step)),
      y: Math.max(0, Math.min(area.h - h, sx(16) + n * step))
    };
  }

  function chromeHTML(rec) {
    var def = rec.def;
    var menus = '';
    if (def.menus && def.menus.length) {
      menus = '<nav class="menubar' + (def.pinMenus ? ' is-pinned' : '') + '" aria-label="メニュー バー">' +
        def.menus.map(function (m, i) {
          return '<button class="menubar__item" type="button" data-menu="' + i + '" aria-haspopup="true" ' +
            'aria-expanded="false">' + esc(m.label) + '</button>';
        }).join('') + '</nav>';
    }
    var buttons = '<span class="titlebar__buttons">';
    if (!def.owner && def.minimizable !== false) {
      buttons += '<button class="captionbtn captionbtn--min" type="button" data-win="min" aria-label="最小化">' +
        '<span class="captionbtn__glyph" aria-hidden="true"></span></button>';
    }
    if (rec.resizable && !def.owner) {
      buttons += '<button class="captionbtn captionbtn--max" type="button" data-win="max" aria-label="最大化">' +
        '<span class="captionbtn__glyph" aria-hidden="true"></span></button>';
    }
    /* 閉じるボタンは常に有効のまま (ユーザーの制御を奪わない) */
    buttons += '<button class="captionbtn captionbtn--close" type="button" data-win="close" aria-label="閉じる">' +
      '<span class="captionbtn__glyph" aria-hidden="true"></span></button></span>';

    var grips = rec.resizable ? (
      '<span class="win__grip win__grip--e" data-resize="e" aria-hidden="true"></span>' +
      '<span class="win__grip win__grip--s" data-resize="s" aria-hidden="true"></span>' +
      '<span class="win__grip win__grip--se" data-resize="se" aria-hidden="true"></span>') : '';

    /* ダイアログには タイトル バー アイコンを付けない (一次ウィンドウと区別する) */
    return '<div class="win__frame">' +
      '<div class="titlebar" data-drag>' +
        (def.icon && !def.owner ? icon(def.icon, 'titlebar__icon') : '') +
        '<span class="titlebar__text">' + esc(def.title) + '</span>' +
        buttons +
      '</div>' +
      menus +
      (def.ribbon || '') +
      '<div class="client">' + (def.body || '') + '</div>' +
      grips +
      '</div>';
  }
  /* ------------------------------------------------------------- 開く/閉じる */
  function open(def) {
    if (WM.wins[def.id]) {
      var ex = WM.wins[def.id];
      if (ex.min) { setMinimized(ex, false); }
      focus(def.id);
      return ex;
    }

    var rec = {
      id: def.id,
      def: def,
      owner: def.owner || null,
      modal: !!def.modal,
      resizable: def.resizable !== false,
      taskbar: !def.owner,          // 所有ウィンドウはタスクバーに出さない
      max: false,
      min: false
    };
    if (rec.owner && !WM.wins[rec.owner]) { rec.owner = null; }

    var area = workArea();
    var size = { w: Math.min(sx(def.w || 640), area.w), h: Math.min(sx(def.h || 440), area.h) };
    var pos = positionFor(rec, size, WM.saved[def.id]);

    var root = document.createElement('section');
    root.className = 'win' + (def.winClass ? ' ' + def.winClass : '');
    root.id = 'win-' + def.id;
    root.dataset.win = def.id;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', def.title);
    root.setAttribute('aria-modal', rec.modal ? 'true' : 'false');
    root.tabIndex = -1;
    root.innerHTML = chromeHTML(rec);
    root.style.left = Math.round(pos.x) + 'px';
    root.style.top = Math.round(pos.y) + 'px';
    root.style.width = Math.round(size.w) + 'px';
    root.style.height = Math.round(size.h) + 'px';
    if (def.minW) { root.style.minWidth = sx(def.minW) + 'px'; }
    if (def.minH) { root.style.minHeight = sx(def.minH) + 'px'; }

    rec.root = root;
    rec.rect = function () {
      return { x: root.offsetLeft, y: root.offsetTop, w: root.offsetWidth, h: root.offsetHeight };
    };

    $('#winlayer').appendChild(root);
    WM.wins[def.id] = rec;
    WM.order.push(def.id);

    if (rec.modal) {
      var veiled = Object.keys(WM.wins).some(function (k) { return WM.wins[k].modal; });
      $('#modalveil').hidden = !veiled;
    }

    bindWindow(rec);
    focus(def.id);
    syncTaskbar();

    if (def.onMount) {
      def.onMount(root, rec, { close: close, focus: focus, notify: notify, balloon: balloon, icon: icon });
    }
    /* 初期フォーカスは「最初に使う可能性が最も高いコントロール」に置く */
    var initial = firstFocusable(root);
    if (initial) { initial.focus(); }
    document.dispatchEvent(new CustomEvent('demo:windowschange'));
    return rec;
  }

  function close(id) {
    var rec = WM.wins[id];
    if (!rec) { return; }
    /* 位置/サイズ/状態を覚え、次に同じウィンドウを開いたときに復元する (windows.md「永続化」) */
    WM.saved[id] = {
      x: rec.root.offsetLeft,
      y: rec.root.offsetTop,
      w: rec.root.offsetWidth,
      h: rec.root.offsetHeight,
      max: rec.max
    };
    if (rec.def.onClose) { rec.def.onClose(rec); }
    rec.root.remove();
    delete WM.wins[id];
    WM.order = WM.order.filter(function (x) { return x !== id; });
    if (WM.active === id) { WM.active = null; }
    var veiled = Object.keys(WM.wins).some(function (k) { return WM.wins[k].modal; });
    $('#modalveil').hidden = !veiled;
    syncTaskbar();
    /* モーダルを閉じたら操作元 (所有者) にフォーカスを戻す */
    if (rec.owner && WM.wins[rec.owner]) { focus(rec.owner); }
    else {
      var next = WM.order.filter(function (x) { return WM.wins[x] && !WM.wins[x].min; }).pop();
      if (next) { focus(next); }
    }
    document.dispatchEvent(new CustomEvent('demo:windowschange'));
  }

  function focus(id) {
    var rec = WM.wins[id];
    if (!rec || rec.min) { return; }
    WM.active = id;
    WM.z += 1;
    rec.root.style.zIndex = String(WM.z);
    $$('.win', $('#winlayer')).forEach(function (n) {
      n.classList.toggle('is-active', n.dataset.win === id);
      n.classList.toggle('is-inactive', n.dataset.win !== id);
    });
    syncTaskbar();
    document.dispatchEvent(new CustomEvent('demo:focuschange', { detail: { id: id } }));
  }

  function setMinimized(rec, on) {
    rec.min = on;
    rec.root.classList.toggle('is-minimized', on);
    if (on && WM.active === rec.id) { WM.active = null; }
    if (!on) { focus(rec.id); }
    syncTaskbar();
  }

  function toggleMaximize(id) {
    var rec = WM.wins[id];
    if (!rec || !rec.resizable) { return; }
    rec.max = !rec.max;
    rec.root.classList.toggle('is-maximized', rec.max);
    var btn = $('[data-win="max"]', rec.root);
    if (btn) {
      btn.classList.toggle('captionbtn--max', !rec.max);
      btn.classList.toggle('captionbtn--restore', rec.max);
      btn.setAttribute('aria-label', rec.max ? '元のサイズに戻す' : '最大化');
    }
    if (rec.max) {
      rec.pre = { x: rec.root.offsetLeft, y: rec.root.offsetTop, w: rec.root.offsetWidth, h: rec.root.offsetHeight };
      rec.root.style.left = '0';
      rec.root.style.top = '0';
      rec.root.style.width = '100%';
      rec.root.style.height = '100%';
    } else if (rec.pre) {
      rec.root.style.left = rec.pre.x + 'px';
      rec.root.style.top = rec.pre.y + 'px';
      rec.root.style.width = rec.pre.w + 'px';
      rec.root.style.height = rec.pre.h + 'px';
    }
    if (rec.def.onResize) { rec.def.onResize(rec); }
  }
  /* ------------------------------------------------------------- タスクバー */
  function syncTaskbar() {
    var list = $('#tasklist');
    var ids = WM.order.filter(function (id) { return WM.wins[id] && WM.wins[id].taskbar; });
    var html = ids.map(function (id) {
      var rec = WM.wins[id];
      var active = WM.active === id && !rec.min && !rec.modal;
      return '<button class="tbtn' + (active ? ' is-active' : '') + (rec.min ? ' is-minimized' : '') +
        '" type="button" data-task="' + esc(id) + '" aria-pressed="' + String(active) + '">' +
        icon(rec.def.icon || 'i-app', 'tbtn__icon') +
        '<span class="tbtn__label">' + esc(rec.def.title) + '</span>' +
        (rec.overlay ? '<span class="tbtn__overlay">' + icon(rec.overlay, '') + '</span>' : '') +
        (typeof rec.progress === 'number'
          ? '<span class="tbtn__progress"><i style="width:' + rec.progress + '%"' +
            (rec.progressState ? ' class="is-' + rec.progressState + '"' : '') + '></i></span>'
          : '') +
        '</button>';
    }).join('');
    if (list.innerHTML !== html) { list.innerHTML = html; }
  }

  /* 進行状況は「開始と終了が決まっている作業」だけ。ウィンドウが前面にある間は出さない */
  function setProgress(id, percent, state) {
    var rec = WM.wins[id];
    if (!rec) { return; }
    rec.progress = percent;
    rec.progressState = state || '';
    syncTaskbar();
  }

  function setOverlay(id, iconId) {
    var rec = WM.wins[id];
    if (!rec) { return; }
    rec.overlay = iconId;
    syncTaskbar();
  }

  /* ------------------------------------------------- 想定画面の変更に追従 */
  /* 小さな解像度では、はみ出すウィンドウが「ある」ことを報告する。
     ガイドは「700x600/1024x768 で完全に表示できること」を求めている */
  function fitReport() {
    var area = workArea();
    var out = { area: area, overflow: [], clipped: [] };
    WM.order.forEach(function (id) {
      var rec = WM.wins[id];
      if (!rec || rec.min) { return; }
      var w = rec.root.offsetWidth;
      var h = rec.root.offsetHeight;
      if (w > area.w || h > area.h) {
        out.overflow.push({ id: id, title: rec.def.title, w: w, h: h });
      } else if (rec.root.offsetLeft + w > area.w + 1 || rec.root.offsetTop + h > area.h + 1) {
        out.clipped.push({ id: id, title: rec.def.title });
      }
    });
    return out;
  }

  /* 画面サイズが変わったら、すべてのウィンドウを安全に収め直す */
  function relayout() {
    var area = workArea();
    WM.order.forEach(function (id) {
      var rec = WM.wins[id];
      if (!rec) { return; }
      if (rec.max) { return; }
      var w = Math.min(rec.root.offsetWidth, area.w);
      var h = Math.min(rec.root.offsetHeight, area.h);
      rec.root.style.width = Math.round(w) + 'px';
      rec.root.style.height = Math.round(h) + 'px';
      rec.root.style.left = Math.round(Math.max(0, Math.min(area.w - w, rec.root.offsetLeft))) + 'px';
      rec.root.style.top = Math.round(Math.max(0, Math.min(area.h - h, rec.root.offsetTop))) + 'px';
    });
    document.dispatchEvent(new CustomEvent('demo:stagechange'));
  }
  /* --------------------------------------------------- ウィンドウの操作 */
  function firstFocusable(root) {
    return $('[data-initial-focus]', root) ||
      $('button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', root);
  }

  function bindWindow(rec) {
    var root = rec.root;

    root.addEventListener('mousedown', function () { focus(rec.id); });

    /* タイトル バーのドラッグ移動 (マウス/タッチ/ペン共通) */
    var bar = $('.titlebar', root);
    bar.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') { return; }
      if (e.target.closest('.captionbtn') || rec.max) { return; }
      e.preventDefault();
      var start = { x: e.clientX, y: e.clientY, left: root.offsetLeft, top: root.offsetTop };
      var k = Demo.stage.k || 1;
      bar.setPointerCapture(e.pointerId);
      function move(ev) {
        var area = workArea();
        var nx = start.left + (ev.clientX - start.x) / k;
        var ny = start.top + (ev.clientY - start.y) / k;
        /* 完全に画面外へは出さない (見失わない程度の余白は許す) */
        root.style.left = Math.round(Math.max(-root.offsetWidth + 64, Math.min(area.w - 64, nx))) + 'px';
        root.style.top = Math.round(Math.max(0, Math.min(area.h - 24, ny))) + 'px';
      }
      function up() {
        bar.removeEventListener('pointermove', move);
        bar.removeEventListener('pointerup', up);
        bar.removeEventListener('pointercancel', up);
      }
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
      bar.addEventListener('pointercancel', up);
    });

    /* タイトル バーのダブルクリック = 最大化/元に戻す */
    bar.addEventListener('dblclick', function (e) {
      if (!e.target.closest('.captionbtn')) { toggleMaximize(rec.id); }
    });

    /* リサイズ (右辺・下辺・右下) */
    $$('[data-resize]', root).forEach(function (grip) {
      grip.addEventListener('pointerdown', function (e) {
        if (e.button !== 0 && e.pointerType === 'mouse') { return; }
        e.preventDefault();
        var dir = grip.dataset.resize;
        var k = Demo.stage.k || 1;
        var start = {
          x: e.clientX, y: e.clientY,
          w: root.offsetWidth, h: root.offsetHeight
        };
        grip.setPointerCapture(e.pointerId);
        function move(ev) {
          var area = workArea();
          if (dir.indexOf('e') >= 0) {
            root.style.width = Math.round(Math.max(parseFloat(getComputedStyle(root).minWidth) || 120,
              Math.min(area.w - root.offsetLeft, start.w + (ev.clientX - start.x) / k))) + 'px';
          }
          if (dir.indexOf('s') >= 0) {
            root.style.height = Math.round(Math.max(parseFloat(getComputedStyle(root).minHeight) || 120,
              Math.min(area.h - root.offsetTop, start.h + (ev.clientY - start.y) / k))) + 'px';
          }
          if (rec.def.onResize) { rec.def.onResize(rec); }
        }
        function up() {
          grip.removeEventListener('pointermove', move);
          grip.removeEventListener('pointerup', up);
          grip.removeEventListener('pointercancel', up);
        }
        grip.addEventListener('pointermove', move);
        grip.addEventListener('pointerup', up);
        grip.addEventListener('pointercancel', up);
      });
    });

    /* キャプション ボタンとコミット ボタン (タイトル バーの閉じる = キャンセル相当) */
    root.addEventListener('click', function (e) {
      var win = e.target.closest('[data-win]');
      if (win) {
        var act = win.dataset.win;
        if (act === 'min') { setMinimized(rec, true); }
        if (act === 'max') { toggleMaximize(rec.id); }
        if (act === 'close') { close(rec.id); }
        return;
      }
      var closer = e.target.closest('[data-close]');
      if (closer) {
        var value = closer.dataset.close;
        var ok = true;
        if (rec.def.onCommit) { ok = rec.def.onCommit(value, root, rec); }
        if (ok !== false && value !== 'none') { close(rec.id); }
      }
    });

    bindTabs(root);
    bindMenus(rec);
  }

  /* --------------------------------------------------------------- タブ */
  function selectTab(strip, index) {
    if (!strip) { return; }
    var tabs = $$('.tab, .ribbon__tab', strip);
    tabs.forEach(function (t, i) {
      var on = i === index;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (t.dataset.panel) {
        var panel = document.getElementById(t.dataset.panel);
        if (panel) { panel.dataset.active = String(on); }
      }
    });
  }

  function bindTabs(scope) {
    $$('[data-tabs]', scope).forEach(function (strip) {
      var tabs = $$('.tab, .ribbon__tab', strip);
      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { selectTab(strip, i); });
        tab.addEventListener('keydown', function (e) {
          var next = e.key === 'ArrowRight' ? (i + 1) % tabs.length
            : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : -1;
          if (next >= 0) {
            e.preventDefault();
            selectTab(strip, next);
            tabs[next].focus();
          }
        });
      });
    });
  }
  /* --------------------------------------------------- メニュー (ポップアップ) */
  function openMenu(anchor, items, onPick) {
    closeAllMenus();
    var menu = document.createElement('div');
    menu.className = 'ctxmenu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = items.map(function (it, i) {
      if (it.sep) { return '<hr class="ctxmenu__sep">'; }
      return '<button class="ctxmenu__item" type="button" role="menuitem" data-idx="' + i + '"' +
        (it.disabled ? ' aria-disabled="true" tabindex="-1"' : '') + '>' +
        '<span style="flex:1 1 auto;white-space:nowrap">' + esc(it.label) + (it.ellipsis ? '…' : '') + '</span>' +
        (it.checked ? '<span aria-hidden="true">✔</span>' : '') +
        (it.accel ? '<span class="kbd">' + esc(it.accel) + '</span>' : '') +
        '</button>';
    }).join('');
    $('#desktop').appendChild(menu);

    /* ポインタのすぐ近く (メニュー バーなら真下) に置く */
    var d = $('#desktop').getBoundingClientRect();
    var a = anchor.getBoundingClientRect();
    var k = Demo.stage.k || 1;
    var left = (a.left - d.left) / k;
    var top = (a.bottom - d.top) / k;
    menu.style.left = Math.round(Math.max(0, Math.min(left, Demo.stage.w - menu.offsetWidth - 4))) + 'px';
    menu.style.top = Math.round(Math.max(0, Math.min(top, Demo.stage.h - menu.offsetHeight - 4))) + 'px';
    anchor.setAttribute('aria-expanded', 'true');

    function items_() { return $$('.ctxmenu__item:not([aria-disabled="true"])', menu); }
    menu.addEventListener('click', function (e) {
      var b = e.target.closest('.ctxmenu__item');
      if (!b || b.getAttribute('aria-disabled') === 'true') { return; }
      var it = items[Number(b.dataset.idx)];
      closeAllMenus();
      if (onPick) { onPick(it); }
    });
    menu.addEventListener('keydown', function (e) {
      var list = items_();
      var i = list.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1 + list.length) % list.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
      if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
      if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus(); }
      if (e.key === 'Escape') { e.preventDefault(); closeAllMenus(); anchor.focus(); }
    });
    var first = items_()[0];
    if (first) { first.focus(); }
    return menu;
  }

  function bindMenus(rec) {
    var bar = $('.menubar', rec.root);
    if (!bar || !rec.def.menus) { return; }
    $$('.menubar__item', bar).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var m = rec.def.menus[Number(btn.dataset.menu)];
        if (!m) { return; }
        if (btn.getAttribute('aria-expanded') === 'true') { closeAllMenus(); return; }
        openMenu(btn, m.items, function (item) {
          if (rec.def.onMenu) { rec.def.onMenu(m.label, item, rec); }
        });
      });
    });
  }

  /* デスクトップの右クリック: 短く、文脈に関連する項目だけ */
  function setupContextMenu() {
    $('#desktop').addEventListener('contextmenu', function (e) {
      var d = $('#desktop').getBoundingClientRect();
      var k = Demo.stage.k || 1;
      var px = (e.clientX - d.left) / k;
      var py = (e.clientY - d.top) / k;
      var probe = document.createElement('span');
      probe.style.cssText = 'position:absolute;left:' + px + 'px;top:' + py + 'px;width:0;height:0';
      $('#desktop').appendChild(probe);
      openMenu(probe, [
        { label: '表示', items: [] },
        { label: '並べ替え' },
        { label: '最新の情報に更新' },
        { sep: true },
        { label: '新規作成', disabled: true },
        { sep: true },
        { label: '画面の解像度' },
        { label: '個人用設定' },
        { label: 'ガジェット' }
      ], function (item) {
        if (item.label === '個人用設定') { openSurface('propsheet'); }
        if (item.label === '画面の解像度') { setPreset('1024x768'); }
        if (item.label === '最新の情報に更新') { notify({ icon: 'i-sync', title: '最新の情報に更新しました', text: 'デスクトップを再描画しました。' }); }
      });
      probe.remove();
      e.preventDefault();
    });
  }
  /* --------------------------------------------- サーフェス (window 定義) を開く */
  function openSurface(id, extra) {
    var reg = window.__surfaces;
    if (!reg) { return null; }
    var def = reg.get(id);
    if (!def) {
      notify({ icon: 'i-warn', title: 'この画面は未実装です', text: 'ID: ' + id });
      return null;
    }
    if (def.owner === '*') {
      /* 所有ウィンドウとして、いま操作しているウィンドウの中央に出す (その下には置かない) */
      def.owner = (WM.active && WM.wins[WM.active]) ? WM.active : null;
    }
    if (extra) { Object.keys(extra).forEach(function (k) { def[k] = extra[k]; }); }
    return open(def);
  }

  /* ------------------------------------------------------- スタート メニュー */
  function toggleStart(on) {
    var menu = $('#startmenu');
    var next = typeof on === 'boolean' ? on : menu.hidden;
    menu.hidden = !next;
    $('#startbtn').setAttribute('aria-expanded', String(next));
    if (next) {
      var item = $('.smlink', menu);
      if (item) { item.focus(); }
    }
  }

  /* ---------------------------------------------------------------- キーボード */
  function focusables(root) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', root)
      .filter(function (n) { return n.offsetParent !== null; });
  }

  function setupKeyboard() {
    document.addEventListener('keydown', function (e) {
      /* Alt: メニュー バーとアクセス キーの表示を切り替える (削除はしない) */
      if (e.key === 'Alt' && !e.repeat && !e.ctrlKey) {
        document.body.classList.toggle('show-menubar');
      }
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.length === 1) {
        var rec = WM.wins[WM.active];
        var bar = rec && $('.menubar', rec.root);
        if (bar) {
          var items = $$('.menubar__item', bar);
          var match = items.filter(function (b, i) {
            var m = (rec.def.menus || [])[i] || {};
            var key = (m.accesskey || m.label.charAt(0) || '').toLowerCase();
            return key === e.key.toLowerCase();
          })[0];
          if (match) { e.preventDefault(); closeAllMenus(); match.click(); }
        }
      }

      if (e.key === 'Escape') {
        if ($('.ctxmenu')) { closeAllMenus(); return; }
        if (!$('#startmenu').hidden) { toggleStart(false); $('#startbtn').focus(); return; }
        var b = $('.balloon', $('#desktop'));
        if (b) { b.remove(); return; }
        /* タイトル バーの閉じるボタンと同じ = キャンセル相当の動作 */
        if (WM.active) { close(WM.active); }
        return;
      }

      /* モーダル表示中はタブ ストップをダイアログ内に閉じ込める */
      if (e.key === 'Tab') {
        var modal = WM.order.map(function (id) { return WM.wins[id]; })
          .filter(function (r) { return r && r.modal && !r.min; }).pop();
        if (!modal) { return; }
        var list = focusables(modal.root);
        if (!list.length) { return; }
        var first = list[0];
        var last = list[list.length - 1];
        if (!modal.root.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
  /* ------------------------------------------------------------------ 起動 */
  function setPreset(name) {
    applyPreset(name);
    $$('#seg-preset .seg__item').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.preset === name));
    });
    relayout();
  }

  function wireShell() {
    /* デモ ツールバー (Windows UI ではない部分) */
    $$('#seg-scale .seg__item').forEach(function (b) {
      b.addEventListener('click', function () { applyScale(Number(b.dataset.scale)); relayout(); });
    });
    $$('#seg-preset .seg__item').forEach(function (b) {
      b.addEventListener('click', function () { setPreset(b.dataset.preset); });
    });
    $('#btn-hc').addEventListener('click', function () {
      var on = document.documentElement.classList.toggle('theme-hc');
      document.body.classList.toggle('theme-hc', on);
      $('#btn-hc').setAttribute('aria-pressed', String(on));
    });
    $('#btn-glass').addEventListener('click', function () { setGlass(!glassOn()); });
    $('#btn-lens').addEventListener('click', function () {
      var lens = $('#lens');
      lens.hidden = !lens.hidden;
      $('#btn-lens').setAttribute('aria-pressed', String(!lens.hidden));
      if (!lens.hidden) {
        var cs = getComputedStyle(document.documentElement);
        $('#lens-hairline').textContent = '--hairline = ' + cs.getPropertyValue('--hairline').trim();
        $('#lens-dpr').textContent = 'devicePixelRatio = ' + Demo.dpr;
      }
    });
    $('#btn-drawer').addEventListener('click', function () {
      var hide = !$('#drawer').hidden;
      $('#drawer').hidden = hide;
      $('#btn-drawer').setAttribute('aria-pressed', String(!hide));
      window.setTimeout(relayout, 10);
    });
    $('#btn-reset').addEventListener('click', function () {
      Object.keys(WM.wins).slice().forEach(function (id) {
        if (!WM.wins[id].taskbar) { close(id); }
      });
      WM.cascade = 0;
      relayout();
    });

    /* スタート メニュー */
    $('#startbtn').addEventListener('click', function () { toggleStart(); });
    $('#allprograms').addEventListener('click', function () {
      var list = $('#alllist');
      list.hidden = !list.hidden;
      $('#allprograms').setAttribute('aria-expanded', String(!list.hidden));
    });

    /* タスクバー: クリックで最小化/復帰 (標準のボタン挙動) */
    $('#tasklist').addEventListener('click', function (e) {
      var b = e.target.closest('[data-task]');
      if (!b) { return; }
      var id = b.dataset.task;
      var rec = WM.wins[id];
      if (!rec) { return; }
      if (rec.min) { setMinimized(rec, false); }
      else if (WM.active === id) { setMinimized(rec, true); }
      else { focus(id); }
    });

    /* 通知領域: バルーン (同時に 1 つだけ) */
    $('#tray-status').addEventListener('click', function () {
      var btn = $('#tray-status');
      var shown = $('.balloon', $('#desktop'));
      if (shown) { shown.remove(); } else {
        balloon(btn, {
          icon: 'i-sync',
          title: 'すべてのファイルが最新です',
          text: '同期は完了しています。',
          action: '同期の進行状況を表示する',
          onAction: function () { openSurface('progress'); }
        });
      }
      btn.setAttribute('aria-expanded', String(!!$('.balloon', $('#desktop'))));
    });

    /* デスクトップの表示: いずれかが開いていれば最小化、すべて最小化済みなら復帰 */
    $('#showdesktop').addEventListener('click', function () {
      var anyOpen = WM.order.some(function (id) {
        var r = WM.wins[id];
        return r && r.taskbar && !r.min;
      });
      WM.order.forEach(function (id) {
        var rec = WM.wins[id];
        if (rec && rec.taskbar) { setMinimized(rec, anyOpen); }
      });
    });

    /* ベール: クリックしても閉じない。モーダル側の応答を促すだけ */
    $('#modalveil').addEventListener('click', function () {
      var modal = WM.order.map(function (id) { return WM.wins[id]; })
        .filter(function (r) { return r && r.modal && !r.min; }).pop();
      if (modal) {
        var f = firstFocusable(modal.root);
        if (f) { f.focus(); }
      }
    });

    /* [data-open] はどこからでもサーフェスを開く */
    document.addEventListener('click', function (e) {
      var trg = e.target.closest('[data-open]');
      if (!trg) { return; }
      e.preventDefault();
      if (!$('#startmenu').hidden) { toggleStart(false); }
      openSurface(trg.dataset.open);
    });

    /* 外側クリックでポップアップを閉じる */
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.ctxmenu') && !e.target.closest('[data-menu]')) { closeAllMenus(); }
      if (!e.target.closest('#startmenu') && !e.target.closest('#startbtn') && !$('#startmenu').hidden) {
        toggleStart(false);
      }
    });

    window.addEventListener('resize', function () { relayout(); readout(); }, { passive: true });
  }
  function boot() {
    window.__app = {
      open: open,
      openSurface: openSurface,
      close: close,
      focus: focus,
      notify: notify,
      balloon: balloon,
      openMenu: openMenu,
      setProgress: setProgress,
      setOverlay: setOverlay,
      setMinimized: setMinimized,
      relayout: relayout,
      fitReport: fitReport,
      applyScale: applyScale,
      setPreset: setPreset,
      firstFocusable: firstFocusable
    };

    wireShell();
    setupKeyboard();
    setupContextMenu();

    tickClock();
    window.setInterval(tickClock, 15000);

    applyScale(1);
    applyPreset('free');
    /* backdrop-filter を持てない環境は、最初から不透明 (Vista Basic 相当) で表示する */
    if (!GLASS_OK) {
      setGlass(false);
      $('#btn-glass').disabled = true;
      $('#btn-glass').title = 'この環境は backdrop-filter に対応していません';
    }
    relayout();

    /* 最初から開いておくウィンドウ (タスクバーと 1px の枠を見せる) */
    openSurface('explorer');
    openSurface('ribbon');

    document.dispatchEvent(new CustomEvent('demo:ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

