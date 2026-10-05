/* ==========================================================================
   surfaces.js — デモに出す各サーフェス (ウィンドウ / ダイアログ) の定義
   出典: references/windows.md, controls.md, commands.md, messages.md, text.md
   文言は text.md (メイン命令は文/命令/質問、補足命令は言い換えない、
   コミット ボタンは具体的な動作、エラーは Close) に従って書いている
   ========================================================================== */
(function () {
  'use strict';

  var icon = window.__ui.icon;
  var esc = window.__ui.esc;
  var $ = window.__ui.$;
  var $$ = window.__ui.$$;
  var defs = {};

  /* --------------------------------------------------------------- 部品 */
  function btn(label, o) {
    o = o || {};
    return '<button class="btn' + (o.def ? ' btn--default' : '') + (o.cls ? ' ' + o.cls : '') + '" type="button"' +
      (o.close ? ' data-close="' + esc(o.close) + '"' : '') +
      (o.open ? ' data-open="' + esc(o.open) + '"' : '') +
      (o.disabled ? ' disabled' : '') +
      (o.focus ? ' data-initial-focus' : '') +
      (o.action ? ' data-action="' + esc(o.action) + '"' : '') +
      '>' + (o.icon ? icon(o.icon) : '') + esc(label) +
      (o.arrow ? '<span class="btn__arrow" aria-hidden="true"></span>' : '') + '</button>';
  }

  function tip(text, pos) {
    return '<span class="tip' + (pos ? ' tip--' + pos : '') + '" role="tooltip">' + esc(text) + '</span>';
  }

  function commitBar(inner, left) {
    return '<div class="commitbar' + (left ? ' commitbar--left' : '') + '">' +
      (left ? '<span class="commitbar__grow"></span>' : '<span class="commitbar__grow"></span>') + inner + '</div>';
  }

  function status(parts) {
    return '<div class="statusbar">' + parts.map(function (p) {
      return '<span class="statusbar__part' + (p.grow ? ' statusbar__part--grow' : '') +
        (p.border ? ' statusbar__part--border' : '') + '">' +
        (p.icon ? icon(p.icon) : '') + esc(p.text) + '</span>';
    }).join('') + '</div>';
  }

  function listRows(rows) {
    return rows.map(function (r) {
      /* 列数は見出しに合わせる: 末尾の空セルは出力しない */
      var rest = [r[1], r[2], r[3]];
      while (rest.length && !rest[rest.length - 1]) { rest.pop(); }
      return '<div class="listview__row" role="option" tabindex="0" aria-selected="false" data-file="' + esc(r[0]) + '">' +
        '<span class="listview__cell">' + icon(r[4] || 'i-doc') + esc(r[0]) + '</span>' +
        rest.map(function (c) { return '<span class="listview__cell">' + esc(c) + '</span>'; }).join('') +
        '</div>';
    }).join('');
  }

  var FOLDERS = {
    documents: {
      title: 'ドキュメント',
      crumb: ['サンプル ユーザー', 'ドキュメント'],
      rows: [
        ['報告書_第3四半期.docx', '2024/06/30 14:20', 'Microsoft Word 文書', '248 KB', 'i-doc'],
        ['予算案.xlsx', '2024/07/02 9:05', 'Microsoft Excel ワークシート', '96 KB', 'i-doc'],
        ['会議メモ.txt', '2024/07/04 18:41', 'テキスト ドキュメント', '4 KB', 'i-doc'],
        ['集合写真.jpg', '2024/05/19 11:02', 'JPEG イメージ', '3.2 MB', 'i-image'],
        ['請求書', '2024/07/01 8:30', 'フォルダー', '', 'i-folder']
      ]
    },
    pictures: {
      title: 'ピクチャ',
      crumb: ['サンプル ユーザー', 'ピクチャ'],
      rows: [
        ['集合写真.jpg', '2024/05/19 11:02', 'JPEG イメージ', '3.2 MB', 'i-image'],
        ['スクリーンショット.png', '2024/06/11 20:15', 'PNG イメージ', '812 KB', 'i-image'],
        ['サンプル ピクチャ', '2024/01/09 10:00', 'フォルダー', '', 'i-folder']
      ]
    },
    computer: {
      title: 'コンピューター',
      crumb: ['コンピューター'],
      rows: [
        ['ローカル ディスク (C:)', '', 'ローカル ディスク', '48.2 GB 空き / 120 GB', 'i-drive'],
        ['データ (D:)', '', 'ローカル ディスク', '212 GB 空き / 500 GB', 'i-drive'],
        ['DVD RW ドライブ (E:)', '', 'CD ドライブ', '', 'i-drive']
      ]
    }
  };
  /* ==================================================================
     1. ドキュメント — 一次ウィンドウ (タスクバーにボタンが出る)
     ================================================================== */
  var EXPLORER_MENUS = [
    { label: 'ファイル', accesskey: 'f', items: [
      { label: '新しいウィンドウを開く' },
      { label: '新しいフォルダー' },
      { sep: true },
      { label: 'プロパティ', accel: 'Alt+Enter' },
      { label: '削除' },
      { label: '名前の変更' },
      { sep: true },
      { label: '閉じる', accel: 'Alt+F4' }
    ] },
    { label: '編集', accesskey: 'e', items: [
      { label: '元に戻す', accel: 'Ctrl+Z', disabled: true },
      { label: '切り取り', accel: 'Ctrl+X' },
      { label: 'コピー', accel: 'Ctrl+C' },
      { label: '貼り付け', accel: 'Ctrl+V', disabled: true },
      { sep: true },
      { label: 'すべて選択', accel: 'Ctrl+A' }
    ] },
    { label: '表示', accesskey: 'v', items: [
      { label: '大きいアイコン' },
      { label: '小さいアイコン' },
      { label: '詳細', checked: true },
      { sep: true },
      { label: 'メニュー バー' },
      { label: 'ナビゲーション ウィンドウ' },
      { sep: true },
      { label: '最新の情報に更新' }
    ] },
    { label: 'ツール', accesskey: 't', items: [
      { label: 'ネットワーク ドライブの割り当て', ellipsis: true },
      { label: 'フォルダー オプション', ellipsis: true },
      { sep: true },
      { label: 'バックグラウンド コピーを開始' }
    ] },
    { label: 'ヘルプ', accesskey: 'h', items: [
      { label: 'Windows のヘルプとサポート' },
      { label: 'このデモについて', ellipsis: true }
    ] }
  ];

  function explorerBody() {
    var f = FOLDERS.documents;
    return '<div class="toolbar">' +
        '<button class="btn btn--small btn--menu" type="button">整理<span class="btn__arrow" aria-hidden="true"></span></button>' +
        '<button class="btn btn--small btn--menu" type="button">共有<span class="btn__arrow" aria-hidden="true"></span></button>' +
        '<button class="btn btn--small btn--menu" type="button">書き込み<span class="btn__arrow" aria-hidden="true"></span></button>' +
        '<span class="toolbar__sep"></span>' +
        '<button class="btn btn--small" type="button" data-action="newfolder">新しいフォルダー</button>' +
        '<span class="toolbar__sep"></span>' +
        '<button class="btn btn--small" type="button" data-action="copy">バックグラウンド コピー</button>' +
        '<span class="toolbar__spacer"></span>' +
        '<span class="searchbox" style="max-width:16rem">' + icon('i-search') +
        '<input type="search" id="x-search" aria-label="ドキュメントを検索" placeholder="検索"></span>' +
      '</div>' +
      '<div class="addressbar">' +
        '<span class="toolbar__sep"></span>' +
        '<button class="iconbtn" type="button" aria-label="戻る" disabled>' + icon('i-back') + '</button>' +
        '<button class="iconbtn" type="button" aria-label="進む" disabled>' + icon('i-forward') + '</button>' +
        '<span class="breadcrumbs" id="x-crumb">' +
          f.crumb.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('<span class="breadcrumbs__sep">▸</span>') +
        '</span>' +
      '</div>' +
      '<div class="winbody">' +
        '<nav class="navpane" aria-label="ナビゲーション ウィンドウ">' +
          '<ul class="tree">' +
            '<li><button class="tree__item" type="button" data-folder="documents" aria-expanded="true">' +
              '<span class="tree__twisty" aria-hidden="true"></span>' + icon('i-folder') + 'ドキュメント</button>' +
              '<ul class="tree" role="group">' +
                '<li><button class="tree__item" type="button" data-folder="documents">' + icon('i-folder') + '請求書</button></li>' +
              '</ul>' +
            '</li>' +
            '<li><button class="tree__item" type="button" data-folder="pictures" aria-expanded="false">' +
              '<span class="tree__twisty" aria-hidden="true"></span>' + icon('i-image') + 'ピクチャ</button></li>' +
            '<li><button class="tree__item" type="button" data-folder="computer">' +
              '<span class="tree__twisty" aria-hidden="true"></span>' + icon('i-computer') + 'コンピューター</button></li>' +
            '<li><button class="tree__item" type="button" data-folder="computer">' + icon('i-network') + 'ネットワーク</button></li>' +
          '</ul>' +
        '</nav>' +
        '<div class="winbody__main">' +
          '<div class="listview" id="x-list" role="listbox" aria-label="ファイル一覧" ' +
            'style="--cols:2.4fr 1.3fr 1.5fr .7fr">' +
            '<div class="listview__head" aria-hidden="true"><span>名前</span><span>更新日時</span><span>種類</span><span>サイズ</span></div>' +
            '<div id="x-rows">' + listRows(f.rows) + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      status([
        { text: f.rows.length + ' 個の項目', grow: true },
        { text: '選択された項目 0 個' },
        { text: 'ローカル ディスク (C:)', border: true }
      ]);
  }

  defs.explorer = function () {
    return {
      id: 'explorer',
      title: 'ドキュメント',
      icon: 'i-folder',
      w: 920, h: 560, minW: 520, minH: 300,
      menus: EXPLORER_MENUS,
      body: explorerBody(),
      onMount: mountExplorer,
      onMenu: explorerMenu
    };
  };
  function mountExplorer(root, rec, api) {
    var rowsBox = $('#x-rows', root);
    var crumb = $('#x-crumb', root);
    var parts = $$('.statusbar__part', root);
    var search = $('#x-search', root);
    var selected = null;

    function select(row) {
      $$('.listview__row', rowsBox).forEach(function (r) {
        r.setAttribute('aria-selected', String(r === row));
      });
      selected = row;
      parts[1].textContent = '選択された項目 ' + (row ? '1' : '0') + ' 個';
    }

    function openItem(row) {
      var name = row.dataset.file;
      if (name === '請求書' || name === 'サンプル ピクチャ') {
        api.notify({ icon: 'i-folder', title: 'フォルダーを開きました', text: name });
        return;
      }
      if (/\.(jpg|png)$/.test(name)) {
        api.notify({ icon: 'i-image', title: '既定のプログラムで開きました', text: name });
      } else if (/\.(xlsx)$/.test(name)) {
        api.notify({ icon: 'i-doc', title: '既定のプログラムで開きました', text: name });
      } else {
        api.notify({ icon: 'i-doc', title: '既定のプログラムで開きました', text: name });
      }
    }

    function bindRows() {
      var rows = $$('.listview__row', rowsBox);
      rows.forEach(function (row, i) {
        row.addEventListener('click', function () { select(row); });
        row.addEventListener('dblclick', function () { openItem(row); });
        row.addEventListener('keydown', function (e) {
          var list = $$('.listview__row', rowsBox).filter(function (r) { return !r.hidden; });
          var idx = list.indexOf(row);
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            var next = e.key === 'ArrowDown' ? Math.min(list.length - 1, idx + 1) : Math.max(0, idx - 1);
            select(list[next]);
            list[next].focus();
          }
          if (e.key === 'Enter') { e.preventDefault(); openItem(row); }
        });
      });
    }

    /* 場所の切り替え: 一覧とパンくず、ステータス バーが同時に追従する */
    function render(name) {
      var f = FOLDERS[name] || FOLDERS.documents;
      crumb.innerHTML = f.crumb.map(function (c) { return '<span>' + esc(c) + '</span>'; })
        .join('<span class="breadcrumbs__sep">▸</span>');
      rowsBox.innerHTML = listRows(f.rows);
      parts[0].textContent = f.rows.length + ' 個の項目';
      select(null);
      bindRows();
      if (search.value) { search.value = ''; }
    }

    $$('[data-folder]', root).forEach(function (item) {
      item.addEventListener('click', function () { render(item.dataset.folder); });
    });

    /* 検索は単純・一貫・信頼できる動作にする (部分一致でその場で絞り込む) */
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      $$('.listview__row', rowsBox).forEach(function (row) {
        var hit = !q || row.dataset.file.toLowerCase().indexOf(q) >= 0;
        row.hidden = !hit;
        if (hit) { shown += 1; }
      });
      parts[0].textContent = shown + ' 個の項目';
      select(null);
    });

    $$('[data-action]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.action === 'copy') { startCopy(rec); }
        if (b.dataset.action === 'newfolder') {
          api.notify({ icon: 'i-folder', title: '新しいフォルダーを作成しました', text: '名前を入力して Enter を押してください。' });
        }
      });
    });

    rec.explorer = { render: render, select: select, selected: function () { return selected; } };
  }

  /* タスクバー ボタンの進行状況: ウィンドウが前面にある間は出さず、ウィンドウ内で示す */
  function startCopy(rec) {
    var api = window.__app;
    var statusbar = $('.statusbar', rec.root);
    if ($('.progress', statusbar)) { return; }
    var bar = document.createElement('span');
    bar.className = 'progress';
    bar.innerHTML = '<span class="progress__track"><span class="progress__bar"></span></span>' +
      '<span class="progress__label">0%</span>';
    statusbar.insertBefore(bar, statusbar.firstChild);

    var p = 0;
    var timer = window.setInterval(function () {
      p = Math.min(100, p + 4 + Math.random() * 6);
      $('.progress__bar', bar).style.width = p + '%';
      $('.progress__label', bar).textContent = Math.round(p) + '%';
      /* 前面にある間はタスクバーに出さない (ウィンドウ内の表示で十分) */
      var background = window.__wm.active !== rec.id;
      api.setProgress(rec.id, background ? p : null);
      if (p >= 100) {
        window.clearInterval(timer);
        api.setProgress(rec.id, null);
        /* 状態は「オーバーレイ アイコン」か「通知領域アイコン」のどちらか一方だけ */
        api.setOverlay(rec.id, 'i-ok');
        window.setTimeout(function () { api.setOverlay(rec.id, null); }, 5000);
        bar.remove();
        api.notify({
          icon: 'i-ok',
          title: 'コピーが完了しました',
          text: '1 個の項目 (248 KB) をコピーしました。'
        });
      }
    }, 320);
  }

  function explorerMenu(label, item, rec) {
    var api = window.__app;
    var bar = $('.menubar', rec.root);
    if (item.label === 'メニュー バー') {
      bar.classList.toggle('is-pinned');
      return;
    }
    if (item.label === '最新の情報に更新') {
      api.notify({ icon: 'i-sync', title: '最新の情報に更新しました', text: '一覧を再描画しました。' });
      return;
    }
    if (item.label === '削除') { api.openSurface('confirm-delete'); return; }
    if (item.label === 'プロパティ') { api.openSurface('propsheet'); return; }
    if (item.label === 'バックグラウンド コピーを開始') { startCopy(rec); return; }
    if (item.label === '閉じる') { api.close(rec.id); return; }
    if (item.label === 'Windows のヘルプとサポート') {
      /* Help は二次的な手段。UI 自体で説明できているかを先に疑う (windows-environment.md) */
      api.notify({
        icon: 'i-help',
        title: 'Help は用意していません',
        text: 'この画面は UI だけで完結するように作っています。'
      });
      return;
    }
    if (item.label === 'このデモについて') { api.openSurface('commandlinks'); return; }
    if (item.label === 'すべて選択') {
      $$('.listview__row', rec.root).forEach(function (r) { r.setAttribute('aria-selected', 'true'); });
      return;
    }
    api.notify({ icon: 'i-info', title: 'このデモでは未実装です', text: 'メニュー項目: ' + item.label });
  }
  /* ==================================================================
     2. Aero サンプル アプリ — リボン (タブ → グループ → コマンド)
     ================================================================== */
  function ribbonHTML() {
    function group(label, body, launcher) {
      return '<div class="ribbon__group"><div class="ribbon__groupbody">' + body + '</div>' +
        '<div class="ribbon__grouplabel">' + esc(label) + '</div>' +
        (launcher ? '<button class="ribbon__launcher" type="button" aria-label="' + esc(label) + 'の詳細設定"></button>' : '') +
        '</div>';
    }
    function big(id, label, iconId) {
      return '<button class="rbig" type="button" data-ribbon="' + id + '">' + icon(iconId) + esc(label) + '</button>';
    }
    function small(id, label, iconId, arrow) {
      return '<button class="rsmall" type="button" data-ribbon="' + id + '">' + icon(iconId) + esc(label) +
        (arrow ? '<span class="rsmall__arrow" aria-hidden="true"></span>' : '') + '</button>';
    }
    function stack(inner) { return '<div class="rstack">' + inner + '</div>'; }

    return '<div class="ribbon">' +
      '<div class="ribbon__tabs" data-tabs role="tablist" aria-label="リボン">' +
        '<button class="ribbon__tab" type="button" role="tab" aria-selected="true" data-panel="rb-home">ホーム</button>' +
        '<button class="ribbon__tab" type="button" role="tab" aria-selected="false" tabindex="-1" data-panel="rb-insert">挿入</button>' +
        '<button class="ribbon__tab" type="button" role="tab" aria-selected="false" tabindex="-1" data-panel="rb-view">表示</button>' +
      '</div>' +
      '<div class="ribbon__panel" id="rb-home" data-active="true">' +
        group('クリップボード',
          big('paste', '貼り付け', 'i-paste') +
          stack(small('cut', '切り取り', 'i-scissors') + small('copy', 'コピー', 'i-copy'))) +
        group('フォント',
          stack(
            '<span class="ribbon__groupbody" style="gap:.25rem">' +
              '<select class="combobox" aria-label="フォント" style="min-width:9rem">' +
                '<option>Meiryo UI</option><option>Meiryo</option><option>Segoe UI</option>' +
              '</select>' +
              '<select class="combobox" aria-label="サイズ" style="min-width:4rem"><option>9</option><option>11</option><option>14</option></select>' +
            '</span>' +
            stack(
              small('bold', '太字', 'i-text') + small('italic', '斜体', 'i-text') +
              small('underline', '下線', 'i-text') + small('color', '文字色', 'i-brush', true)
            )
          ), true) +
        group('段落',
          stack(small('bullets', '箇条書き', 'i-grid', true) + small('indent', 'インデント', 'i-line')) +
          stack(small('align', '配置', 'i-grid', true) + small('lineheight', '行間', 'i-line', true))) +
      '</div>' +
      '<div class="ribbon__panel" id="rb-insert" data-active="false">' +
        group('図',
          big('picture', '図', 'i-image') +
          stack(small('shape', '図形', 'i-shape') + small('chart', 'グラフ', 'i-grid'))) +
        group('テキスト',
          stack(small('textbox', 'テキスト ボックス', 'i-text') + small('date', '日付', 'i-doc')) +
          stack(small('symbol', '記号と特殊文字', 'i-text'))) +
        group('リンク',
          big('link', 'ハイパーリンク', 'i-cloud')) +
      '</div>' +
      '<div class="ribbon__panel" id="rb-view" data-active="false">' +
        group('ズーム',
          '<span class="sliderrow" style="padding:0 .5rem">' +
            '<input type="range" min="50" max="200" value="100" aria-label="ズーム" id="r-zoom">' +
            '<output id="r-zoom-out">100%</output></span>', true) +
        group('ウィンドウ',
          stack(small('split', '分割', 'i-grid') + small('new', '新しいウィンドウ', 'i-app'))) +
      '</div>' +
      '</div>';
  }

  function ribbonBody() {
    return '<div class="toolbar" style="justify-content:flex-end">' +
        '<span class="toolbar__spacer"></span>' +
        '<span class="searchbox" style="max-width:14rem">' + icon('i-search') +
        '<input type="search" aria-label="ヘルプを検索" placeholder="ヘルプを検索"></span>' +
        '<button class="iconbtn" type="button" aria-label="ヘルプ">' + icon('i-help') + '</button>' +
      '</div>' +
      '<div style="flex:1 1 auto;min-height:0;overflow:auto;padding:1.5rem 2rem;background:#fff">' +
        '<h1 style="font-size:1.375rem;font-weight:600;margin-bottom:.5rem">第 3 四半期の報告</h1>' +
        '<p style="max-width:65ch;margin-bottom:.75rem">' +
          '本文は 1 行あたりおよそ 65 文字に収め、上から順に読めるようにしています。' +
          '長い文章は段落に分け、要点を先に置きます。</p>' +
        '<p style="max-width:65ch;color:#55606a;font-size:.75rem">' +
          '補足: このデモの本文は、読みやすさの上限 (65 文字) を実際に測れるようにしてあります。</p>' +
      '</div>' +
      status([
        { text: 'ページ 1 / 1', grow: true },
        { text: '単語数 0' },
        { text: '日本語', border: true }
      ]);
  }

  defs.ribbon = function () {
    return {
      id: 'ribbon',
      title: '無題 — Aero サンプル アプリ',
      icon: 'i-app',
      w: 1000, h: 620, minW: 560, minH: 360,
      /* リボンはメニュー バーとツールバーを置き換える (重複させない) */
      menus: null,
      ribbon: ribbonHTML(),
      body: ribbonBody(),
      onMount: mountRibbon
    };
  };
  function mountRibbon(root, rec, api) {
    var status = $('.statusbar__part', root);

    /* リボンのコマンドは 1 か所にまとめ、同じコマンドを他所に重複させない */
    $$('[data-ribbon]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.ribbon;
        if (id === 'picture') { api.openSurface('open'); return; }
        if (id === 'paste') {
          status.textContent = '貼り付けました (取り消すには Ctrl+Z)';
          return;
        }
        status.textContent = b.textContent.trim() + ' を実行しました';
      });
    });

    var zoom = $('#r-zoom', root);
    if (zoom) {
      zoom.addEventListener('input', function () {
        $('#r-zoom-out', root).textContent = zoom.value + '%';
      });
    }

    /* ヘルプ ボタン: まず UI 側で説明できているかを問う */
    $$('.iconbtn', root).forEach(function (b) {
      b.addEventListener('click', function () {
        api.notify({
          icon: 'i-help',
          title: 'この画面のヘルプ',
          text: 'リボンは常に見えているので、ヘルプを開かなくても目的のコマンドを見つけられます。'
        });
      });
    });
  }
  /* ==================================================================
     3. コモン コントロール ギャラリー — コントロール選択の対応表 (controls.md)
     ================================================================== */
  function placard(title, inner) {
    return '<div class="placard"><div class="placard__title">' + esc(title) + '</div>' + inner + '</div>';
  }

  function tabStrip(label, tabs) {
    return '<div class="tabstrip" data-tabs role="tablist" aria-label="' + esc(label) + '">' +
      tabs.map(function (t, i) {
        return '<button class="tab" type="button" role="tab" aria-selected="' + (i === 0) + '"' +
          (i === 0 ? '' : ' tabindex="-1"') + ' data-panel="' + t[1] + '">' + esc(t[0]) + '</button>';
      }).join('') + '</div>';
  }

  function galleryBtnTab() {
    return '<div class="tabpanel" id="g-btn" data-active="true">' +
        placard('コマンド ボタン (すぐに実行する操作)',
          '<div style="display:flex;flex-wrap:wrap;gap:.75rem;align-items:center">' +
            btn('OK', { def: true, close: 'ok' }) +
            btn('キャンセル', { close: 'cancel' }) +
            btn('無効なボタン', { disabled: true }) +
            btn('その他のオプション', { arrow: true, cls: 'btn--menu' }) +
            btn('分割ボタン', { arrow: true, cls: 'btn--split' }) +
            btn('参照...', { action: 'browse' }) +
            btn('今すぐ更新', { icon: 'i-shield' }) +
          '</div>' +
          '<p style="margin-top:.75rem;max-width:65ch">' +
            '既定のボタンは 1 つだけ (青 + 外側のグロー)。' +
            '「参照...」の <code class="code">...</code> は、実行の前にさらに入力が必要な印です。</p>') +
        placard('コマンド リンク (何をしますか? への排他的な回答)',
          '<p style="margin-bottom:.5rem">どのように保存しますか?</p>' +
          '<div class="cmdlinks">' +
            '<button class="commandlink" type="button" data-cmdsave="pdf">' + icon('i-save') +
              '<span><span class="commandlink__title">PDF として保存する</span>' +
              '<span class="commandlink__desc">レイアウトを固定して、ほかの環境でも同じように表示します。</span></span></button>' +
            '<button class="commandlink" type="button" data-cmdsave="docx">' + icon('i-doc') +
              '<span><span class="commandlink__title">編集できる形式で保存する</span>' +
              '<span class="commandlink__desc">あとから内容を変更できます。</span></span></button>' +
          '</div>' +
          '<p style="margin-top:.75rem;color:#55606a;max-width:65ch">' +
            'コマンド リンクは 2 つ以上で使い、説明を添えられます。' +
            'プロパティ シートやタブ付きダイアログでは使いません。</p>') +
      '</div>';
  }
  function galleryInputTab() {
    return '<div class="tabpanel" id="g-in" data-active="false">' +
        placard('テキスト入力とその場のエラー',
          '<div style="display:grid;gap:1rem;max-width:32rem">' +
            '<span class="field"><label class="field__label" for="g-name">名前</label>' +
              '<input class="textbox" id="g-name" type="text" value="会議メモ"></span>' +
            '<span class="field"><label class="field__label" for="g-prompt">整理先 (入力プロンプト)</label>' +
              '<input class="textbox" id="g-prompt" type="text" placeholder="例: 2024 年 第 3 四半期"></span>' +
            '<span class="field"><label class="field__label" for="g-err">フォルダー名</label>' +
              '<input class="textbox" id="g-err" type="text" aria-describedby="g-err-msg">' +
              '<span class="fielderror" id="g-err-msg" hidden>' + icon('i-error') +
              '<span>フォルダー名を入力してください。空のままでは作成できません。</span></span></span>' +
          '</div>' +
          '<p style="margin-top:.75rem;color:#55606a;max-width:65ch">' +
            'プロンプトはイタリック + グレーで、入力すると消えます。' +
            'エラーは赤い枠だけでなく、アイコンと文でも示します。' +
            '「フォルダー名」からフォーカスを外すと検証します。</p>') +
        placard('選択 (排他的/非排他的) と範囲',
          '<div style="display:grid;gap:1.25rem;max-width:34rem">' +
            '<div class="combo" data-combo>' +
              '<button class="combobox" type="button" aria-haspopup="listbox" aria-expanded="false">' +
                '<span data-combo-value>ドキュメント</span>' +
                '<span class="combobox__arrow" aria-hidden="true"></span></button>' +
              '<div class="combolist" role="listbox" aria-label="保存先" hidden>' +
                '<button class="combolist__item" type="button" role="option" data-value="ドキュメント">ドキュメント</button>' +
                '<button class="combolist__item" type="button" role="option" data-value="ピクチャ">ピクチャ</button>' +
                '<button class="combolist__item" type="button" role="option" data-value="デスクトップ">デスクトップ</button>' +
              '</div>' +
            '</div>' +
            '<fieldset class="group"><legend>更新の確認</legend>' +
              '<div class="choicegroup" role="radiogroup" aria-label="更新の確認">' +
                '<label class="choice"><input type="radio" name="g-upd" value="毎日" checked>' +
                  '<span class="choice__text">毎日確認する</span></label>' +
                '<label class="choice"><input type="radio" name="g-upd" value="毎週">' +
                  '<span class="choice__text">毎週確認する</span></label>' +
                '<label class="choice"><input type="radio" name="g-upd" value="しない">' +
                  '<span class="choice__text">確認しない</span></label>' +
              '</div>' +
            '</fieldset>' +
            '<div class="choicegroup">' +
              '<label class="choice"><input type="checkbox" checked>' +
                '<span class="choice__text">大きいファイルを送る前に確認する' +
                '<span class="choice__note">1 回の送信が 25 MB を超える場合だけ確認します。</span></span></label>' +
              '<label class="choice"><input type="checkbox">' +
                '<span class="choice__text">送信が完了したら通知する</span></label>' +
            '</div>' +
            '<div class="sliderrow"><label for="g-bright">明るさ</label>' +
              '<input type="range" id="g-bright" min="0" max="100" value="60">' +
              '<output for="g-bright">60</output></div>' +
          '</div>' +
          '<p style="margin-top:.75rem;color:#55606a;max-width:65ch">' +
            'ラジオ ボタンのグループは 1 つのタブ ストップで、矢印キーはグループ内を回ります。' +
            'チェック ボックスは独立した選択なので、0 個でも成立します。</p>') +
      '</div>';
  }
  function galleryListTab() {
    return '<div class="tabpanel" id="g-list" data-active="false">' +
        placard('一覧 (list view) とツリー',
          '<div class="listview" id="g-listview" role="listbox" aria-label="サンプル一覧" style="--cols:2fr 1.3fr .8fr">' +
            '<div class="listview__head" aria-hidden="true"><span>名前</span><span>更新日時</span><span>サイズ</span></div>' +
            listRows([
              ['報告書_第3四半期.docx', '2024/06/30 14:20', '248 KB', '', 'i-doc'],
              ['集合写真.jpg', '2024/05/19 11:02', '3.2 MB', '', 'i-image'],
              ['会議メモ.txt', '2024/07/04 18:41', '4 KB', '', 'i-doc']
            ]) +
          '</div>' +
          '<p style="margin-top:.75rem;color:#55606a;max-width:65ch">' +
            '列の幅は内容に合わせて既定・最小・最大を決めます。' +
            '行は矢印キーと Enter で操作でき、フォーカスが外れると選択の色は控えめになります。</p>') +
        placard('ツリー (階層)',
          '<ul class="tree">' +
            '<li><button class="tree__item" type="button" aria-expanded="true" data-tree>' +
              '<span class="tree__twisty" aria-hidden="true"></span>' + icon('i-folder') + 'ドキュメント</button>' +
              '<ul class="tree" role="group"><li><button class="tree__item" type="button" data-tree>' +
                icon('i-folder') + '請求書</button></li></ul></li>' +
            '<li><button class="tree__item" type="button" aria-expanded="false" data-tree>' +
              '<span class="tree__twisty" aria-hidden="true"></span>' + icon('i-image') + 'ピクチャ</button>' +
              '<ul class="tree" role="group" hidden><li><button class="tree__item" type="button" data-tree>' +
                icon('i-image') + 'サンプル ピクチャ</button></li></ul></li>' +
          '</ul>') +
      '</div>';
  }

  function galleryProgTab() {
    return '<div class="tabpanel" id="g-prog" data-active="false">' +
        placard('進行状況バー (開始と終了が決まっている作業)',
          '<div style="display:grid;gap:1rem;max-width:36rem">' +
            '<div class="progress" id="g-prog-det">' +
              '<span class="progress__track"><span class="progress__bar"></span></span>' +
              '<span class="progress__label">0%</span></div>' +
            '<div style="display:flex;gap:.5rem">' +
              btn('開始', { cls: 'btn--small', action: 'prog-start' }) +
              btn('一時停止', { cls: 'btn--small', action: 'prog-pause' }) +
              btn('停止', { cls: 'btn--small', action: 'prog-stop' }) +
            '</div>' +
            '<div class="progress progress--indeterminate">' +
              '<span class="progress__track"><span class="progress__bar"></span></span>' +
              '<span class="progress__label">確認中</span></div>' +
            '<div class="progress"><span class="progress__track">' +
              '<span class="progress__bar progress__bar--paused" style="width:45%"></span></span>' +
              '<span class="progress__label">一時停止</span></div>' +
            '<div class="progress"><span class="progress__track">' +
              '<span class="progress__bar progress__bar--error" style="width:70%"></span></span>' +
              '<span class="progress__label">エラー</span></div>' +
          '</div>' +
          '<p style="margin-top:.75rem;color:#55606a;max-width:65ch">' +
            '確定表示のバーを使い (時間が予測できなくても)、黄 = 一時停止、赤 = 失敗。' +
            'バーを最初からやり直させず、残り時間は正確に言えるときだけ示します。</p>') +
      '</div>';
  }

  function galleryFbTab() {
    return '<div class="tabpanel" id="g-fb" data-active="false">' +
        placard('ツールチップ (ラベルのないコントロール)',
          '<div class="toolbar" style="border:0;background:none;gap:.25rem">' +
            '<span class="tipwrap"><button class="iconbtn" type="button" aria-label="元に戻す">' + icon('i-undo') +
              '</button>' + tip('元に戻す (Ctrl+Z)') + '</span>' +
            '<span class="tipwrap"><button class="iconbtn" type="button" aria-label="印刷">' + icon('i-printer') +
              '</button>' + tip('印刷') + '</span>' +
            '<span class="tipwrap"><button class="iconbtn" type="button" aria-label="保存">' + icon('i-save') +
              '</button>' + tip('上書き保存') + '</span>' +
          '</div>' +
          '<p style="margin-top:.5rem;color:#55606a;max-width:65ch">' +
            'ツールチップはホバーだけでなくフォーカスでも出ます。' +
            '対象や次に狙う対象を覆わないよう、横並びでは右に出しません。</p>') +
        placard('バルーン / 通知 / メッセージ',
          '<div style="display:flex;flex-wrap:wrap;gap:.5rem">' +
            btn('バルーンを表示', { cls: 'btn--small', action: 'balloon' }) +
            btn('通知を表示', { cls: 'btn--small', action: 'toast' }) +
            btn('エラー ダイアログ', { cls: 'btn--small', open: 'error' }) +
            btn('削除の確認 (はい/いいえ)', { cls: 'btn--small', open: 'confirm-delete' }) +
            btn('昇格の確認 (UAC)', { cls: 'btn--small', open: 'uac' }) +
            btn('進行状況ダイアログ', { cls: 'btn--small', open: 'progress' }) +
            btn('共通ダイアログ (開く)', { cls: 'btn--small', open: 'open' }) +
          '</div>' +
          '<p style="margin-top:.75rem;color:#55606a;max-width:65ch">' +
            'バルーンは「有効だが意図しない状態」に、通知は「今の作業と無関係な出来事」に使います。' +
            'どちらも広告には使いません。</p>') +
      '</div>';
  }

  function galleryBody() {
    return '<div class="tabs">' +
      tabStrip('コントロールの種類', [
        ['ボタン', 'g-btn'], ['入力', 'g-in'], ['一覧', 'g-list'],
        ['進行状況', 'g-prog'], ['フィードバック', 'g-fb']
      ]) +
      galleryBtnTab() + galleryInputTab() + galleryListTab() + galleryProgTab() + galleryFbTab() +
      '</div>';
  }

  defs.gallery = function () {
    return {
      id: 'gallery',
      title: 'コモン コントロール ギャラリー',
      icon: 'i-grid',
      w: 940, h: 620, minW: 520, minH: 380,
      body: galleryBody(),
      onMount: mountGallery
    };
  };
  function mountGallery(root, rec, api) {
    /* コンボ ボックス: 排他的な値の一覧 */
    $$('[data-combo]', root).forEach(function (combo) {
      var trigger = $('.combobox', combo);
      var list = $('.combolist', combo);
      var value = $('[data-combo-value]', combo);
      trigger.addEventListener('click', function () {
        list.hidden = !list.hidden;
        trigger.setAttribute('aria-expanded', String(!list.hidden));
        if (!list.hidden) {
          var sel = $('[aria-selected="true"]', list) || $('.combolist__item', list);
          sel.focus();
        }
      });
      list.addEventListener('keydown', function (e) {
        var items = $$('.combolist__item', list);
        var i = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
        if (e.key === 'Escape') { e.preventDefault(); list.hidden = true; trigger.focus(); }
      });
      $$('.combolist__item', list).forEach(function (item) {
        item.addEventListener('click', function () {
          $$('.combolist__item', list).forEach(function (i) {
            i.setAttribute('aria-selected', String(i === item));
          });
          value.textContent = item.dataset.value;
          list.hidden = true;
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        });
      });
    });

    /* 範囲コントロールの現在値 */
    $$('.sliderrow input[type="range"]', root).forEach(function (r) {
      var out = r.parentNode.querySelector('output');
      if (out) { r.addEventListener('input', function () { out.textContent = r.value; }); }
    });

    /* その場のエラー: 色だけでなく文とアイコンで示す */
    var err = $('#g-err', root);
    var msg = $('#g-err-msg', root);
    if (err && msg) {
      err.addEventListener('blur', function () {
        var bad = err.value.trim() === '';
        err.setAttribute('aria-invalid', String(bad));
        msg.hidden = !bad;
      });
      err.addEventListener('input', function () {
        if (err.getAttribute('aria-invalid') === 'true' && err.value.trim()) {
          err.setAttribute('aria-invalid', 'false');
          msg.hidden = true;
        }
      });
    }

    /* ツリーの開閉 (矢印ではなく、つまみの切替として) */
    $$('[data-tree]', root).forEach(function (item) {
      item.addEventListener('click', function () {
        var group = item.parentNode.querySelector('ul.tree');
        if (!group) { return; }
        var willOpen = group.hidden;
        group.hidden = !willOpen;
        item.setAttribute('aria-expanded', String(willOpen));
      });
    });

    /* 進行状況: 一時停止して再開しても、バーを最初からやり直させない */
    var bar = $('#g-prog-det', root);
    var prog = { value: 0, timer: null };
    function paint() {
      $('.progress__bar', bar).style.width = prog.value + '%';
      $('.progress__label', bar).textContent = Math.round(prog.value) + '%';
    }
    function run() {
      if (prog.timer) { return; }
      prog.timer = window.setInterval(function () {
        prog.value = Math.min(100, prog.value + 3);
        paint();
        if (prog.value >= 100) {
          window.clearInterval(prog.timer);
          prog.timer = null;
          $('.progress__label', bar).textContent = '完了';
        }
      }, 220);
    }
    function pause() {
      if (!prog.timer) { return; }
      window.clearInterval(prog.timer);
      prog.timer = null;
      $('.progress__bar', bar).classList.add('progress__bar--paused');
      $('.progress__label', bar).textContent = '一時停止';
    }
    function stop() {
      if (prog.timer) { window.clearInterval(prog.timer); prog.timer = null; }
      prog.value = 0;
      $('.progress__bar', bar).classList.remove('progress__bar--paused');
      paint();
    }

    $$('[data-action]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var a = b.dataset.action;
        if (a === 'prog-start') { $('.progress__bar', bar).classList.remove('progress__bar--paused'); run(); }
        if (a === 'prog-pause') { pause(); }
        if (a === 'prog-stop') { stop(); }
        if (a === 'browse') { api.openSurface('open'); }
        if (a === 'balloon') {
          api.balloon(b, {
            icon: 'i-warn',
            title: 'このファイルはほかのプログラムで使用中です',
            text: '閉じてから、もう一度お試しください。'
          });
        }
        if (a === 'toast') {
          api.notify({
            icon: 'i-cloud',
            title: 'バックアップが完了しました',
            text: '14:02 に 1 個の項目を保存しました。'
          });
        }
      });
    });

    /* コマンド リンク: 実行した結果を必ず伝える */
    $$('[data-cmdsave]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var kind = b.dataset.cmdsave === 'pdf' ? 'PDF' : '編集できる形式';
        api.notify({ icon: 'i-save', title: kind + 'で保存しました', text: '保存先はドキュメントです。' });
      });
    });

    $$('#g-listview .listview__row', root).forEach(function (row) {
      row.addEventListener('click', function () {
        $$('#g-listview .listview__row', root).forEach(function (r) {
          r.setAttribute('aria-selected', String(r === row));
        });
      });
    });
  }
  /* ==================================================================
     4. 画面のプロパティ — プロパティ シート (適用ボタンはここだけ)
     ================================================================== */
  var WALLPAPERS = [
    { id: 'aero', label: 'Aero ブルー (既定)',
      css: 'radial-gradient(120% 85% at 50% 112%, rgba(255,255,255,.55) 0%, rgba(255,255,255,0) 58%), radial-gradient(62% 48% at 50% 96%, rgba(140,210,255,.60) 0%, rgba(140,210,255,0) 72%), linear-gradient(#123c6b 0%, #1f6199 38%, #4f9ed4 72%, #bfe3f6 100%)' },
    { id: 'sunset', label: '夕焼け',
      css: 'radial-gradient(80% 60% at 50% 100%, rgba(255,214,150,.85) 0%, rgba(255,214,150,0) 70%), linear-gradient(#3b2263 0%, #7a3f6d 45%, #d8794f 78%, #f6c98a 100%)' },
    { id: 'graphite', label: 'グラファイト',
      css: 'radial-gradient(70% 50% at 50% 105%, rgba(255,255,255,.30) 0%, rgba(255,255,255,0) 70%), linear-gradient(#1b2028 0%, #333b46 60%, #6b7480 100%)' },
    { id: 'meadow', label: '草原',
      css: 'radial-gradient(70% 50% at 50% 110%, rgba(230,255,210,.55) 0%, rgba(230,255,210,0) 70%), linear-gradient(#1d4f7a 0%, #4d94c4 45%, #9fd07a 78%, #dff0b8 100%)' }
  ];

  function propsheetBody() {
    function tab(label, id, first) {
      return '<button class="tab" type="button" role="tab" aria-selected="' + !!first + '"' +
        (first ? '' : ' tabindex="-1"') + ' data-panel="' + id + '">' + esc(label) + '</button>';
    }
    return '<div class="propsheet">' +
      '<div class="tabs">' +
        '<div class="tabstrip" data-tabs role="tablist" aria-label="画面のプロパティ">' +
          tab('背景', 'p-bg', true) + tab('サウンド', 'p-snd') + tab('テーマ', 'p-thm') +
        '</div>' +
        '<div class="tabpanel" id="p-bg" data-active="true">' +
          '<div class="proprow">' +
            '<span class="proprow__label">背景</span>' +
            '<div class="listview" id="p-walls" role="listbox" aria-label="背景の一覧" style="--cols:1fr;max-height:12rem">' +
              WALLPAPERS.map(function (w, i) {
                return '<div class="listview__row" role="option" tabindex="0" data-wall="' + w.id + '"' +
                  ' aria-selected="' + (i === 0) + '"><span class="listview__cell">' + icon('i-image') + esc(w.label) +
                  '</span></div>';
              }).join('') +
            '</div>' +
          '</div>' +
          '<div class="proprow" style="margin-top:1rem">' +
            '<span class="proprow__label">プレビュー</span>' +
            '<div class="preview" id="p-preview" style="min-height:7rem;color:#fff"></div>' +
          '</div>' +
          '<p style="margin-top:1rem;max-width:65ch;color:#55606a">' +
            'このウィンドウはモーダルではありません。選択した内容はすぐにデスクトップへ反映されるので、' +
            '結果を見ながら決められます。</p>' +
        '</div>' +
        '<div class="tabpanel" id="p-snd" data-active="false">' +
          '<div class="proprow"><span class="proprow__label">サウンドの種類</span>' +
            '<div class="listview" role="listbox" aria-label="サウンドの種類" style="--cols:1fr;max-height:8rem">' +
              '<div class="listview__row" role="option" tabindex="0" aria-selected="true">' +
                '<span class="listview__cell">' + icon('i-sound') + 'Windows 既定</span></div>' +
              '<div class="listview__row" role="option" tabindex="0" aria-selected="false">' +
                '<span class="listview__cell">' + icon('i-sound') + 'サウンドなし</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="choicegroup" style="margin-top:1rem">' +
            '<label class="choice"><input type="checkbox" checked>' +
              '<span class="choice__text">起動時に Windows のサウンドを再生する</span></label>' +
          '</div>' +
          '<p style="margin-top:1rem;max-width:65ch;color:#55606a">' +
            'サウンドは補助的なチャネルです。音だけで情報を伝えず、設定で切れるようにします。</p>' +
        '</div>' +
        '<div class="tabpanel" id="p-thm" data-active="false">' +
          '<fieldset class="group"><legend>配色</legend>' +
            '<div class="choicegroup" role="radiogroup" aria-label="配色">' +
              '<label class="choice"><input type="radio" name="p-theme" value="standard" checked>' +
                '<span class="choice__text">標準 (Aero)</span></label>' +
              '<label class="choice"><input type="radio" name="p-theme" value="classic">' +
                '<span class="choice__text">クラシック</span></label>' +
              '<label class="choice"><input type="radio" name="p-theme" value="hc">' +
                '<span class="choice__text">ハイ コントラスト (白地に黒)</span>' +
                '<span class="choice__note">色のトークンを差し替えるだけで全画面が追従します。</span></label>' +
            '</div>' +
          '</fieldset>' +
        '</div>' +
      '</div>' +
      commitBar(
        btn('OK', { def: true, close: 'ok', focus: true }) +
        btn('キャンセル', { close: 'cancel' }) +
        btn('適用', { close: 'apply', disabled: true })
      ) +
      '</div>';
  }

  defs.propsheet = function () {
    return {
      id: 'propsheet',
      title: '画面のプロパティ',
      icon: 'i-monitor',
      w: 720, h: 580, minW: 420, minH: 360,
      body: propsheetBody(),
      onMount: mountPropsheet,
      onCommit: propsheetCommit
    };
  };
  function applyWallpaper(id) {
    var w = WALLPAPERS.filter(function (x) { return x.id === id; })[0] || WALLPAPERS[0];
    var desktop = $('.desktop');
    desktop.dataset.wall = w.id;
    desktop.style.background = w.css;
    var preview = $('#p-preview');
    if (preview) { preview.style.background = w.css; }
  }

  function mountPropsheet(root, rec, api) {
    var buttons = $$('.commitbar .btn', root);
    var applyBtn = buttons[2];
    var saved = $('.desktop').dataset.wall || 'aero';
    rec.propsheet = { saved: saved };

    function setDirty(on) {
      if (applyBtn) { applyBtn.disabled = !on; }
    }

    $$('#p-walls .listview__row', root).forEach(function (row) {
      function pick() {
        $$('#p-walls .listview__row', root).forEach(function (r) {
          r.setAttribute('aria-selected', String(r === row));
        });
        applyWallpaper(row.dataset.wall);
        setDirty(true);
      }
      row.addEventListener('click', pick);
      row.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); pick(); } });
    });

    $$('input[name="p-theme"]', root).forEach(function (r) {
      r.addEventListener('change', function () {
        var hc = r.value === 'hc';
        document.documentElement.classList.toggle('theme-hc', hc);
        document.body.classList.toggle('theme-hc', hc);
        setDirty(true);
      });
    });

    /* 初期表示のプレビューを現在の設定に合わせる */
    applyWallpaper(saved);
    setDirty(false);
  }

  function propsheetCommit(value, root, rec) {
    if (value === 'apply') {
      /* 適用は閉じない。プロパティ シートだけが持つボタン */
      rec.propsheet.saved = $('.desktop').dataset.wall || 'aero';
      var applyBtn = $$('.commitbar .btn', root)[2];
      if (applyBtn) { applyBtn.disabled = true; }
      return false;
    }
    if (value === 'cancel') {
      /* キャンセルは元の状態に戻す (副作用を残さない) */
      applyWallpaper(rec.propsheet.saved);
      document.documentElement.classList.remove('theme-hc');
      document.body.classList.remove('theme-hc');
      return true;
    }
    return true;
  }
  /* ==================================================================
     5. ネットワークへの接続 — ウィザード (手順は決定の数だけ数える)
     ================================================================== */
  function wizardBody() {
    function link(id, title, desc, iconId) {
      return '<button class="commandlink" type="button" data-method="' + id + '">' + icon(iconId) +
        '<span><span class="commandlink__title">' + esc(title) + '</span>' +
        '<span class="commandlink__desc">' + esc(desc) + '</span></span></button>';
    }
    return '<div class="wizard">' +
      '<div class="wizard__body">' +
        '<aside class="wizard__aside">' +
          '<div class="wizard__art" role="img" aria-label="ネットワークのイラスト"></div>' +
          '<ol class="wizard__steps" id="w-steps">' +
            '<li aria-current="step">接続方法の選択</li>' +
            '<li>ネットワークの設定</li>' +
            '<li>設定の確認</li>' +
          '</ol>' +
          '<p style="margin-top:1rem;font-size:.75rem;color:#55606a" id="w-count">手順 1 / 3</p>' +
        '</aside>' +
        '<div class="wizard__main">' +
          '<div class="wizard__page" data-page="1" data-active="true">' +
            '<p class="maininstr">接続方法を選んでください</p>' +
            '<p class="suppl">選んだ方法に応じて、次のページで設定を尋ねます。</p>' +
            '<div class="cmdlinks">' +
              link('wireless', 'ワイヤレス ネットワークに接続する',
                   '電波の届く範囲にあるネットワークに接続します。', 'i-wifi') +
              link('broadband', 'ブロードバンド (PPPoE) に接続する',
                   'プロバイダーから渡されたユーザー名とパスワードを使います。', 'i-network') +
              link('dialup', 'ダイヤルアップに接続する',
                   '電話回線とモデムを使って接続します。', 'i-cloud') +
            '</div>' +
          '</div>' +
          '<div class="wizard__page" data-page="2">' +
            '<p class="maininstr">ネットワークの設定を入力してください</p>' +
            '<p class="suppl">設定はこの後いつでも変更できます。</p>' +
            '<div style="display:grid;gap:1rem;max-width:28rem;margin-top:1rem">' +
              '<span class="field"><label class="field__label" for="w-name">ネットワーク名 (SSID)</label>' +
                '<input class="textbox" id="w-name" type="text" placeholder="例: HomeNetwork"></span>' +
              '<fieldset class="group"><legend>セキュリティの種類</legend>' +
                '<div class="choicegroup" role="radiogroup" aria-label="セキュリティの種類">' +
                  '<label class="choice"><input type="radio" name="w-sec" value="WPA2-PSK" checked>' +
                    '<span class="choice__text">WPA2-PSK</span></label>' +
                  '<label class="choice"><input type="radio" name="w-sec" value="WPA-PSK">' +
                    '<span class="choice__text">WPA-PSK</span></label>' +
                  '<label class="choice"><input type="radio" name="w-sec" value="なし">' +
                    '<span class="choice__text">なし' +
                    '<span class="choice__note">暗号化されません。公衆ネットワーク以外ではおすすめしません。</span>' +
                    '</span></label>' +
                '</div>' +
              '</fieldset>' +
              '<span class="field"><label class="field__label" for="w-key">セキュリティ キー</label>' +
                '<input class="textbox" id="w-key" type="password"></span>' +
            '</div>' +
          '</div>' +
          '<div class="wizard__page" data-page="3">' +
            '<p class="maininstr">設定を確認してください</p>' +
            '<p class="suppl">[接続] を選ぶと接続を開始します。</p>' +
            '<dl class="uac__id" id="w-summary" style="margin-top:1rem;max-width:28rem"></dl>' +
          '</div>' +
          '<div class="wizard__page" data-page="4">' +
            '<p class="maininstr">ネットワークに接続しました</p>' +
            '<p class="suppl" id="w-done"></p>' +
            '<p class="suppl" style="color:#55606a">' +
              '完了ページでは [次へ] も [戻る] も出さず、[閉じる] だけを出します。</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="wizard__foot">' +
        '<span class="commitbar__grow"></span>' +
        '<button class="btn" type="button" id="w-back">戻る</button>' +
        '<button class="btn btn--default" type="button" id="w-next" disabled>次へ</button>' +
        '<button class="btn" type="button" id="w-close" hidden>閉じる</button>' +
        '<button class="btn" type="button" data-close="cancel" id="w-cancel">キャンセル</button>' +
      '</div>' +
      '</div>';
  }

  defs.wizard = function () {
    return {
      id: 'wizard',
      title: 'ネットワークへの接続',
      icon: 'i-network',
      w: 800, h: 560, minW: 560, minH: 420,
      body: wizardBody(),
      onMount: mountWizard
    };
  };
  var METHOD_LABEL = {
    wireless: 'ワイヤレス ネットワーク',
    broadband: 'ブロードバンド (PPPoE)',
    dialup: 'ダイヤルアップ'
  };

  function mountWizard(root, rec, api) {
    var state = { step: 1, method: '', security: 'WPA2-PSK' };
    var pages = $$('.wizard__page', root);
    var steps = $$('#w-steps li', root);
    var back = $('#w-back', root);
    var next = $('#w-next', root);
    var closeBtn = $('#w-close', root);
    var count = $('#w-count', root);
    var nameInput = $('#w-name', root);

    function refresh() {
      back.hidden = (state.step === 1 || state.step === 4);
      next.hidden = (state.step === 4);
      closeBtn.hidden = (state.step !== 4);
      /* 最後のコミットは「次へ」ではなく具体的な動作の言葉にする */
      next.textContent = state.step === 3 ? '接続' : '次へ';
      next.disabled = (state.step === 1 && !state.method) ||
                      (state.step === 2 && !nameInput.value.trim());
      steps.forEach(function (li, i) {
        if (state.step === i + 1) { li.setAttribute('aria-current', 'step'); }
        else { li.removeAttribute('aria-current'); }
      });
      /* 手順の数は「本当に数えられる範囲」だけを数える */
      count.textContent = state.step <= 3 ? ('手順 ' + state.step + ' / 3') : '完了';
    }

    function renderSummary() {
      var sec = $$('input[name="w-sec"]', root).filter(function (r) { return r.checked; })[0];
      state.security = sec ? sec.value : 'なし';
      state.name = nameInput.value.trim();
      $('#w-summary', root).innerHTML =
        '<dt>接続方法</dt><dd>' + esc(METHOD_LABEL[state.method] || '未選択') + '</dd>' +
        '<dt>ネットワーク名</dt><dd>' + esc(state.name) + '</dd>' +
        '<dt>セキュリティ</dt><dd>' + esc(state.security) + '</dd>';
    }

    function show(step) {
      state.step = step;
      pages.forEach(function (p) { p.dataset.active = String(Number(p.dataset.page) === step); });
      if (step === 3) { renderSummary(); }
      refresh();
      var first = step === 1 ? $('.commandlink', root)
        : step === 2 ? nameInput
        : step === 3 ? next : closeBtn;
      if (first) { first.focus(); }
    }

    $$('[data-method]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        state.method = b.dataset.method;
        $$('[data-method]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        refresh();
      });
    });

    nameInput.addEventListener('input', refresh);

    back.addEventListener('click', function () { show(Math.max(1, state.step - 1)); });
    closeBtn.addEventListener('click', function () { api.close(rec.id); });
    next.addEventListener('click', function () {
      if (state.step < 3) { show(state.step + 1); return; }
      /* 接続: 進行状況は作業が終わるまで 1 本のバーで示す */
      show(4);
      $('#w-done', root).textContent =
        '「' + state.name + '」に ' + state.security + ' で接続し、IP アドレスを取得しました。';
      api.notify({
        icon: 'i-ok',
        title: 'ネットワークに接続しました',
        text: '「' + state.name + '」との接続が完了しました。'
      });
    });

    show(1);
  }
  /* ==================================================================
     6. テキストとフォント — modern porting の根拠を見せる
     出典: references/modern-porting.md §1-§3, references/text.md, visuals.md
     ================================================================== */
  function fontsBody() {
    return '<div class="tabs">' +
      tabStrip('テキストとフォント', [
        ['フォント スタック', 'f-stack'],
        ['役割とサイズ', 'f-size'],
        ['テキストの種類', 'f-style'],
        ['和文と欧文', 'f-mix']
      ]) +
      '<div class="tabpanel" id="f-stack" data-active="true">' +
        placard('フォント スタック (この順に解決されます)',
          '<ol style="padding-left:1.4em;line-height:1.9">' +
            '<li><strong>Meiryo UI</strong> — Windows の日本語 UI 用 (リボン UI でも推奨)</li>' +
            '<li><strong>Meiryo</strong> — 本文の日本語</li>' +
            '<li><strong>Segoe UI / Segoe UI Variable Text</strong> — 欧文の標準 UI 書体</li>' +
            '<li><strong>Myriad / Myriad Pro / Myriad Set Pro</strong> — 旧 Mac 系の代替</li>' +
            '<li><strong>Hind / Noto Sans / Noto Sans JP / Noto Sans CJK JP</strong> — 埋め込み可能 (OFL)</li>' +
            '<li><strong>system-ui</strong> — 最後の受け皿</li>' +
          '</ol>' +
          '<p style="margin-top:.75rem;max-width:65ch;color:#55606a">' +
            'OS や商用の書体は<strong>名前で参照するだけ</strong>で、ファイルは同梱しません。' +
            '同梱してよいのは Hind と Noto Sans 系 (OFL) だけです。</p>') +
        placard('実測 (この環境で実際に使われている書体)',
          '<div id="f-probe"></div>') +
      '</div>' +
      '<div class="tabpanel" id="f-size" data-active="false">' +
        placard('役割ごとのサイズ (era の比率を rem で維持)',
          '<table class="probe-table" id="f-sizes"><thead><tr>' +
            '<th>役割</th><th>トークン</th><th>実測 (px)</th><th>本文との比</th></tr></thead><tbody></tbody></table>' +
          '<p style="margin-top:.75rem;max-width:65ch;color:#55606a">' +
            'era の 9pt をそのまま持ち込むと Retina / 4K では小さすぎます。' +
            '比率 (メイン命令 ≈ 本文 × 1.33) だけを保ち、実寸は rem に任せます。' +
            'root の font-size を変えると、ここもすべて追従します。</p>') +
      '</div>' +
      '<div class="tabpanel" id="f-style" data-active="false">' +
        placard('メイン命令 / 補足命令 / 本文',
          '<p class="maininstr">接続方法を選んでください</p>' +
          '<p class="suppl">選んだ方法に応じて、次のページで設定を尋ねます。</p>' +
          '<p style="max-width:65ch">本文は上から順に読めるように書き、要点を先頭に置きます。' +
            '1 行はおよそ 65 文字までに収め、それ以上は段落を分けます。</p>' +
          '<p style="margin-top:.5rem;color:#55606a;max-width:65ch">' +
            'メイン命令は文・命令・質問のいずれかで、ユーザーの目的を述べます。' +
            '補足命令はメイン命令を言い換えず、文脈だけを足します。</p>') +
        placard('エラー / 警告 / ラベル / ツールチップ',
          '<p style="color:#b3261e;max-width:65ch">' + icon('i-error') +
            ' フォルダー名を入力してください。空のままでは作成できません。</p>' +
          '<p style="color:#9a6a00;margin-top:.5rem;max-width:65ch">' + icon('i-warn') +
            ' この操作は元に戻せません。先にバックアップを取ることをおすすめします。</p>' +
          '<p style="margin-top:.75rem">ラベル (文末の句点なし)</p>' +
          '<p style="color:#55606a;font-size:.75rem">ツールチップ (文末の句点なし)</p>') +
      '</div>' +
      '<div class="tabpanel" id="f-mix" data-active="false">' +
        placard('和文と欧文の混植',
          '<p class="textsample">日本語のみ: 会議メモをドキュメント フォルダーに保存しました。</p>' +
          '<p class="textsample textsample--latin">Latin only: The report was saved to your Documents folder.</p>' +
          '<p class="textsample">混植: 2024 年 7 月 4 日のレポート (248 KB) を保存しました。</p>' +
          '<p style="margin-top:.75rem;max-width:65ch;color:#55606a">' +
            'スタックは日本語書体を先に置いているため、和文も欧文も同じフォントで描かれます。' +
            '欧文を Segoe UI で出したい場合は、欧文用のスタックを別トークン' +
            ' (<code class="code">--font-latin</code>) として使い分けます。</p>' +
          '<p id="f-mix-probe" style="margin-top:.5rem;color:#55606a"></p>') +
        placard('編集できる見本 (入力した文字がそのまま UI 書体で描かれます)',
          '<span class="field"><label class="field__label" for="f-input">見本のテキスト</label>' +
            '<input class="textbox" id="f-input" type="text" value="会議メモ 2024-07-04 (248 KB)"></span>' +
          '<p id="f-out" style="margin-top:.75rem;font-size:1.125rem">会議メモ 2024-07-04 (248 KB)</p>') +
      '</div>' +
      '</div>';
  }

  defs.fonts = function () {
    return {
      id: 'fonts',
      title: 'テキストとフォント',
      icon: 'i-text',
      w: 900, h: 620, minW: 520, minH: 380,
      body: fontsBody(),
      onMount: mountFonts
    };
  };
  function mountFonts(root, rec, api) {
    var probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:100px';
    probe.textContent = 'あAg';
    document.body.appendChild(probe);

    var stack = ['Meiryo UI', 'Meiryo', 'Segoe UI', 'Segoe UI Variable Text', 'Myriad', 'Hind', 'Noto Sans', 'system-ui'];
    var rows = stack.map(function (f) {
      var available = false;
      try { available = !!(document.fonts && document.fonts.check && document.fonts.check('100px "' + f + '"')); } catch (e) { available = false; }
      probe.style.fontFamily = '"' + f + '"';
      return { name: f, available: available, width: probe.offsetWidth };
    });
    /* 実際に使われている書体 = 幅が一致する最初の候補 */
    probe.style.fontFamily = '';
    var actualWidth = probe.offsetWidth;
    var actual = 'system-ui (代替)';
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].width === actualWidth && rows[i].available) { actual = rows[i].name; break; }
    }
    probe.remove();

    var table = '<table class="probe-table"><thead><tr>' +
      '<th>候補</th><th>利用可</th><th>「あAg」の幅 (100px 時)</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td>' + (r.name === actual ? '<strong>' + esc(r.name) + ' ← 採用</strong>' : esc(r.name)) +
          '</td><td>' + (r.available ? 'あり' : 'なし') + '</td><td>' + r.width + 'px</td></tr>';
      }).join('') + '</tbody></table>' +
      '<p style="margin-top:.5rem;color:#55606a">採用: <strong>' + esc(actual) + '</strong> / ' +
      'devicePixelRatio = ' + (window.devicePixelRatio || 1) + '</p>';
    $('#f-probe', root).innerHTML = table;

    /* 役割ごとの実寸と比率 (rem なので root の設定に追従する) */
    var roles = [
      ['キャプション', '--text-caption'],
      ['本文 / コントロール ラベル', '--text-body'],
      ['タイトル バー', '--text-title'],
      ['メイン命令', '--text-main'],
      ['ページ見出し', '--text-head']
    ];
    var sizer = document.createElement('span');
    sizer.style.cssText = 'position:absolute;visibility:hidden';
    sizer.textContent = 'M';
    document.body.appendChild(sizer);
    function pxOf(token) {
      sizer.style.fontSize = 'var(' + token + ')';
      return Math.round(parseFloat(getComputedStyle(sizer).fontSize) * 100) / 100;
    }
    var bodyPx = pxOf('--text-body');
    $('#f-sizes tbody', root).innerHTML = roles.map(function (r) {
      var px = pxOf(r[1]);
      return '<tr><td>' + esc(r[0]) + '</td><td><code class="code">' + r[1] + '</code></td>' +
        '<td>' + px + 'px</td><td>' + (bodyPx ? (px / bodyPx).toFixed(2) : '—') + ' ×</td></tr>';
    }).join('');
    sizer.remove();

    /* 和文と欧文で同じ書体が使われているかを幅で確かめる */
    var mix = document.createElement('span');
    mix.style.cssText = 'position:absolute;visibility:hidden;font-size:16px;white-space:nowrap';
    mix.textContent = 'Ag 会議';
    document.body.appendChild(mix);
    var uiWidth = mix.offsetWidth;
    mix.style.fontFamily = 'var(--font-latin)';
    var latinWidth = mix.offsetWidth;
    mix.remove();
    $('#f-mix-probe', root).textContent =
      '「Ag 会議」の幅: UI スタック ' + uiWidth + 'px / 欧文スタック(--font-latin) ' + latinWidth + 'px' +
      (uiWidth === latinWidth ? ' — どちらも同じ書体が使われています。' : ' — 欧文だけ別の書体です。');

    /* 編集できる見本 */
    var input = $('#f-input', root);
    var out = $('#f-out', root);
    input.addEventListener('input', function () { out.textContent = input.value || ' '; });
  }
  /* ==================================================================
     7. ダイアログ ボックス — タイトル → メイン命令 → 補足 → 内容 → コミット
     出典: references/windows.md, messages.md, text.md
     ================================================================== */
  function dialogBody(o) {
    return '<div class="dlg">' +
      '<div class="dlg__body">' +
        (o.glyph ? '<span class="dlg__icon" role="img" aria-label="' + esc(o.glyphLabel || '') + '">' +
          icon(o.glyph) + '</span>' : '') +
        '<div class="dlg__text">' +
          '<p class="maininstr">' + o.main + '</p>' +
          (o.suppl ? '<p class="suppl">' + o.suppl + '</p>' : '') +
          (o.content || '') +
        '</div>' +
      '</div>' +
      (o.footer ? '<div class="dlg__footer">' + o.footer + '</div>' : '') +
      commitBar(o.commit || '') +
      '</div>';
  }

  function dialogDef(o) {
    return {
      id: o.id,
      title: o.title,
      icon: o.icon,
      owner: '*',                             // 操作元の中央に出す (その下には置かない)
      modal: o.modal !== false,
      resizable: o.resizable === true,
      minimizable: false,
      winClass: (o.winClass || '') + ' win--dialog',
      w: o.w || 470,
      h: o.h || 250,
      minW: o.minW || 300,
      body: o.customBody || dialogBody(o),
      onMount: o.onMount,
      onCommit: o.onCommit
    };
  }

  /* ダイアログは内容ぴったりの高さにする (大きくしすぎない) */
  function fitDialog(root) {
    root.style.height = 'auto';
    var h = root.offsetHeight;
    root.style.height = h + 'px';
  }

  defs['confirm-delete'] = function () {
    return dialogDef({
      id: 'confirm-delete',
      title: '削除の確認',
      glyph: 'i-warn',
      glyphLabel: '警告',
      w: 480,
      main: '「報告書_第3四半期.docx」をごみ箱に移動しますか?',
      suppl: 'ごみ箱からは後で復元できます。',
      content: '<label class="choice"><input type="checkbox" id="cd-again">' +
        '<span class="choice__text">今後この確認を表示しない' +
        '<span class="choice__note">この設定は [いいえ] を選んでも有効になります。</span></span></label>' +
        '<p class="metaopt" style="margin-top:.5rem">※ チェックはメタ オプションで、キャンセル相当の操作でも有効です。</p>',
      commit: btn('はい', { def: true, close: 'yes', focus: true }) + btn('いいえ', { close: 'no' }),
      onCommit: function (value) {
        if (value === 'yes') {
          window.__app.notify({
            icon: 'i-recycle',
            title: 'ごみ箱に移動しました',
            text: '「報告書_第3四半期.docx」をごみ箱に移動しました。'
          });
        }
      }
    });
  };

  defs.error = function () {
    return dialogDef({
      id: 'error',
      title: 'ファイルを開けません',
      glyph: 'i-error',
      glyphLabel: 'エラー',
      w: 520,
      main: '「予算案.xlsx」は別のプログラムで使用中です。',
      suppl: 'ほかのプログラムを閉じてから、もう一度お試しください。',
      content: '<details class="progressive"><summary>詳細を表示する</summary>' +
        '<div class="dlg__details">エラー コード: 0x80070020\n' +
        'このファイルは別のプロセスによってロックされています。\n' +
        '待機中のプロセス: EXCEL.EXE (PID 4820)</div></details>',
      footer: '<button class="link" type="button" data-close="none">このエラーの解決方法を確認する</button>',
      /* 問題は「OK」ではないので、閉じるボタンは Close にする */
      commit: btn('閉じる', { def: true, close: 'close', focus: true }),
      onMount: function (root, rec, api) {
        fitDialog(root);
        var link = $('.link', root);
        link.addEventListener('click', function () {
          api.notify({
            icon: 'i-help',
            title: '解決方法',
            text: '使用中のプログラムを閉じてから、もう一度開いてください。'
          });
        });
      }
    });
  };

  defs.uac = function () {
    return dialogDef({
      id: 'uac',
      title: 'ユーザー アカウント制御',
      glyph: 'i-shield',
      glyphLabel: '昇格',
      winClass: 'win--uac',
      w: 560,
      main: 'このアプリがこのコンピューターに変更を加えることを許可しますか?',
      suppl: 'プログラムの名前と発行元を確認してから判断してください。',
      content: '<dl class="uac__id">' +
        '<dt>プログラム名</dt><dd>Aero サンプル アプリ</dd>' +
        '<dt>確認済みの発行元</dt><dd>Contoso Ltd.</dd>' +
        '<dt>ファイルの入手先</dt><dd>このコンピューター上のハード ドライブ</dd>' +
        '</dl>' +
        '<p class="uac__detail">表示のタイミング: 昇格が必要になった時点で 1 回だけ表示します。</p>',
      commit: btn('はい', { def: true, close: 'yes', focus: true }) + btn('いいえ', { close: 'no' }),
      onMount: fitDialog,
      onCommit: function (value) {
        if (value === 'yes') {
          window.__app.notify({ icon: 'i-shield', title: '管理者として実行します', text: '要求した操作を続けます。' });
        } else {
          window.__app.notify({ icon: 'i-info', title: '操作を中止しました', text: '変更は加えられていません。' });
        }
      }
    });
  };
  defs.progress = function () {
    return dialogDef({
      id: 'progress',
      title: 'コピーしています',
      w: 520,
      main: 'ファイルをコピーしています',
      suppl: '「報告書_第3四半期.docx」をドキュメント フォルダーにコピーしています。',
      content: '<div class="progress" style="margin-top:1rem">' +
        '<span class="progress__track"><span class="progress__bar"></span></span>' +
        '<span class="progress__label">0%</span></div>' +
        '<p style="margin-top:.75rem;color:#55606a;max-width:65ch">' +
          '時間の見込みが正確に言えないため、残り時間は表示していません。' +
          '再開しても、バーは最初からやり直させません。</p>' +
        '<p style="margin-top:.5rem;color:#55606a;max-width:65ch">' +
          '有効な状態で終わる必要がある作業のため、この間だけタイトル バーの閉じるを無効にしています' +
          ' (ガイドが認める例外)。[停止] はいつでも選べます。</p>',
      /* 進行中の操作なので Cancel ではなく Stop */
      commit: btn('停止', { close: 'stop', focus: true }),
      onMount: function (root, rec, api) {
        fitDialog(root);
        var bar = $('.progress__bar', root);
        var label = $('.progress__label', root);
        var stop = $('.commitbar .btn', root);
        var captionClose = $('.captionbtn--close', root);
        if (captionClose) { captionClose.disabled = true; }
        var p = 0;
        var timer = window.setInterval(function () {
          p = Math.min(100, p + 3);
          bar.style.width = p + '%';
          label.textContent = p + '%';
          if (p >= 100) {
            window.clearInterval(timer);
            if (captionClose) { captionClose.disabled = false; }
            $('.maininstr', root).textContent = 'コピーが完了しました';
            $('.suppl', root).textContent = '1 個の項目 (248 KB) をコピーしました。';
            stop.textContent = '閉じる';
            stop.setAttribute('data-close', 'close');
            label.textContent = '完了';
            api.notify({ icon: 'i-ok', title: 'コピーが完了しました', text: 'ドキュメント フォルダーに保存しました。' });
          }
        }, 220);
        rec.progressTimer = timer;
      },
      onClose: function (rec) { window.clearInterval(rec.progressTimer); }
    });
  };

  defs.commandlinks = function () {
    return dialogDef({
      id: 'commandlinks',
      title: '印刷',
      w: 560,
      main: 'どのように印刷しますか?',
      suppl: '選んだ内容はこの後いつでも変更できます。',
      content: '<div class="cmdlinks" style="margin-top:.75rem">' +
        '<button class="commandlink" type="button" data-print="duplex">' + icon('i-printer') +
          '<span><span class="commandlink__title">両面に印刷する</span>' +
          '<span class="commandlink__desc">用紙を半分に節約できます。</span></span></button>' +
        '<button class="commandlink" type="button" data-print="single">' + icon('i-printer') +
          '<span><span class="commandlink__title">片面に印刷する</span>' +
          '<span class="commandlink__desc">各ページを 1 枚ずつ印刷します。</span></span></button>' +
        '</div>' +
        '<p style="margin-top:.75rem;color:#55606a;max-width:65ch">' +
          'コマンド リンク自体が実行なので、このダイアログには [次へ] を置いていません。' +
          '取り消せるよう [キャンセル] は必ず残します。</p>',
      commit: btn('キャンセル', { close: 'cancel', focus: true }),
      onMount: function (root, rec, api) {
        fitDialog(root);
        $$('[data-print]', root).forEach(function (b) {
          b.addEventListener('click', function () {
            var kind = b.dataset.print === 'duplex' ? '両面' : '片面';
            api.close(rec.id);
            api.openSurface('progress');
            api.notify({ icon: 'i-printer', title: kind + '印刷を開始しました', text: '1 部を既定のプリンターに送信します。' });
          });
        });
      }
    });
  };

  defs['confirm-shutdown'] = function () {
    return dialogDef({
      id: 'confirm-shutdown',
      title: 'Windows のシャットダウン',
      glyph: 'i-question',
      glyphLabel: '確認',
      w: 520,
      main: 'このコンピューターの電源を切りますか?',
      suppl: '保存していない変更は失われます。先にアプリで保存してください。',
      commit: btn('シャットダウン', { def: true, close: 'shutdown', focus: true }) + btn('キャンセル', { close: 'cancel' }),
      onMount: fitDialog,
      onCommit: function (value) {
        if (value === 'shutdown') {
          window.__app.notify({
            icon: 'i-battery',
            title: 'このデモでは電源を切りません',
            text: '実際のシャットダウンは行いません。'
          });
        }
      }
    });
  };
  /* 共通ダイアログ (開く): 標準を置き換えず、そのまま使う */
  defs.open = function () {
    var files = [
      ['報告書_第3四半期.docx', '2024/06/30 14:20', '248 KB', '', 'i-doc'],
      ['予算案.xlsx', '2024/07/02 9:05', '96 KB', '', 'i-doc'],
      ['集合写真.jpg', '2024/05/19 11:02', '3.2 MB', '', 'i-image'],
      ['会議メモ.txt', '2024/07/04 18:41', '4 KB', '', 'i-doc']
    ];
    return dialogDef({
      id: 'open',
      title: '開く',
      w: 720, h: 460,
      resizable: true,
      customBody:
        '<div class="commondlg">' +
          '<div class="commondlg__bar">' +
            '<button class="iconbtn" type="button" aria-label="戻る">' + icon('i-back') + '</button>' +
            '<button class="iconbtn" type="button" aria-label="進む">' + icon('i-forward') + '</button>' +
            '<span class="breadcrumbs">サンプル ユーザー<span class="breadcrumbs__sep">▸</span>ドキュメント</span>' +
          '</div>' +
          '<div class="commondlg__body">' +
            '<nav class="places" aria-label="場所">' +
              '<ul class="smlist">' +
                '<li><button class="smlink" type="button">' + icon('i-star') + 'お気に入り</button></li>' +
                '<li><button class="smlink" type="button">' + icon('i-doc') + 'ドキュメント</button></li>' +
                '<li><button class="smlink" type="button">' + icon('i-image') + 'ピクチャ</button></li>' +
                '<li><button class="smlink" type="button">' + icon('i-computer') + 'コンピューター</button></li>' +
                '<li><button class="smlink" type="button">' + icon('i-network') + 'ネットワーク</button></li>' +
              '</ul>' +
            '</nav>' +
            '<div class="filelist">' +
              '<div class="listview" id="o-list" role="listbox" aria-label="ファイル" style="--cols:2.4fr 1.2fr .8fr">' +
                '<div class="listview__head" aria-hidden="true"><span>名前</span><span>更新日時</span><span>サイズ</span></div>' +
                listRows(files) +
              '</div>' +
              '<span class="filerow"><label for="o-name">ファイル名</label>' +
                '<input class="textbox" id="o-name" type="text" value="報告書_第3四半期.docx"></span>' +
              '<span class="filterrow"><label for="o-filter">ファイルの種類</label>' +
                '<select class="combobox" id="o-filter">' +
                  '<option>すべてのファイル (*.*)</option>' +
                  '<option>Word 文書 (*.docx)</option>' +
                  '<option>イメージ (*.jpg;*.png)</option>' +
                '</select></span>' +
            '</div>' +
          '</div>' +
          commitBar(btn('開く', { def: true, close: 'open', focus: true }) + btn('キャンセル', { close: 'cancel' })) +
        '</div>',
      onMount: function (root, rec, api) {
        var name = $('#o-name', root);
        $$('#o-list .listview__row', root).forEach(function (row) {
          row.addEventListener('click', function () {
            $$('#o-list .listview__row', root).forEach(function (r) {
              r.setAttribute('aria-selected', String(r === row));
            });
            name.value = row.dataset.file;
          });
          row.addEventListener('dblclick', function () {
            api.close(rec.id);
            api.notify({ icon: 'i-doc', title: 'ファイルを開きました', text: row.dataset.file });
          });
        });
      },
      onCommit: function (value, root) {
        if (value === 'open') {
          window.__app.notify({ icon: 'i-doc', title: 'ファイルを開きました', text: $('#o-name', root).value });
        }
      }
    });
  };

  /* ごみ箱・ネットワーク・デバイスとプリンター: デスクトップと
     スタート メニューから開く先 (どれも標準の枠 + 一覧という同じ作り) */
  defs.recycle = function () {
    return {
      id: 'recycle',
      title: 'ごみ箱',
      icon: 'i-recycle',
      w: 780, h: 460, minW: 460, minH: 260,
      body: '<div class="toolbar">' +
          '<button class="btn btn--small" type="button" data-action="empty">ごみ箱を空にする</button>' +
          '<span class="toolbar__sep"></span>' +
          '<button class="btn btn--small" type="button" data-action="restore">この項目を元に戻す</button>' +
          '<span class="toolbar__spacer"></span>' +
        '</div>' +
        '<div class="listview" role="listbox" aria-label="ごみ箱の内容" style="--cols:2.4fr 1.2fr .8fr;flex:1 1 auto;border-left:0;border-right:0">' +
          '<div class="listview__head" aria-hidden="true"><span>名前</span><span>削除した日時</span><span>サイズ</span></div>' +
          listRows([['古い控え.docx', '2024/06/28 9:12', '112 KB', '', 'i-doc'],
                    ['メモ (2).txt', '2024/07/01 21:03', '2 KB', '', 'i-doc']]) +
        '</div>' +
        status([{ text: '2 個の項目', grow: true }, { text: '1.02 GB まで保存できます', border: true }]),
      onMount: function (root, rec, api) {
        $$('[data-action]', root).forEach(function (b) {
          b.addEventListener('click', function () {
            if (b.dataset.action === 'empty') { api.openSurface('confirm-delete'); return; }
            api.notify({ icon: 'i-recycle', title: '元の場所に戻しました', text: '選択した項目をごみ箱から戻しました。' });
          });
        });
        $$('.listview__row', root).forEach(function (row) {
          row.addEventListener('click', function () {
            $$('.listview__row', root).forEach(function (r) { r.setAttribute('aria-selected', String(r === row)); });
          });
        });
      }
    };
  };

  defs.network = function () {
    return {
      id: 'network',
      title: 'ネットワーク',
      icon: 'i-network',
      w: 780, h: 480, minW: 460, minH: 280,
      body: '<div class="addressbar"><span class="breadcrumbs">ネットワーク</span>' +
          '<span class="toolbar__spacer"></span>' +
          '<span class="infotip">' + icon('i-info') + ' 検出されたデバイスを表示しています</span></div>' +
        '<div class="listview" role="listbox" aria-label="ネットワーク上のコンピューター" ' +
          'style="--cols:2fr 1.4fr;flex:1 1 auto;border-left:0;border-right:0">' +
          '<div class="listview__head" aria-hidden="true"><span>名前</span><span>種類</span></div>' +
          listRows([['STUDY-PC', 'コンピューター', '', '', 'i-computer'],
                    ['NAS-01', '記憶域デバイス', '', '', 'i-drive'],
                    ['HP-LaserJet', 'プリンター', '', '', 'i-printer']]) +
        '</div>' +
        status([{ text: '3 個のデバイス', grow: true }, { text: 'ネットワーク', border: true }]),
      onMount: function (root) {
        $$('.listview__row', root).forEach(function (row) {
          row.addEventListener('click', function () {
            $$('.listview__row', root).forEach(function (r) { r.setAttribute('aria-selected', String(r === row)); });
          });
        });
      }
    };
  };

  defs.printer = function () {
    return {
      id: 'printer',
      title: 'デバイスとプリンター',
      icon: 'i-printer',
      w: 820, h: 500, minW: 480, minH: 300,
      body: '<div class="toolbar">' +
          '<button class="btn btn--small" type="button" data-action="add">プリンターを追加する</button>' +
          '<span class="toolbar__sep"></span>' +
          '<button class="btn btn--small" type="button" data-action="queue">印刷キューを表示する</button>' +
          '<span class="toolbar__spacer"></span>' +
        '</div>' +
        '<div class="listview" role="listbox" aria-label="プリンター" style="--cols:2fr 1.4fr;flex:1 1 auto;border-left:0;border-right:0">' +
          '<div class="listview__head" aria-hidden="true"><span>名前</span><span>状態</span></div>' +
          listRows([['HP LaserJet 400', '既定のプリンター / 準備完了', '', '', 'i-printer'],
                    ['Microsoft XPS Document Writer', '準備完了', '', '', 'i-printer'],
                    ['Fax', '使用できません', '', '', 'i-printer']]) +
        '</div>' +
        status([{ text: '3 台のプリンター', grow: true }, { text: '1 台が既定', border: true }]),
      onMount: function (root, rec, api) {
        $$('[data-action]', root).forEach(function (b) {
          b.addEventListener('click', function () {
            if (b.dataset.action === 'add') { api.openSurface('wizard'); return; }
            /* 印刷は共通ダイアログを拡張して使う (置き換えない) */
            api.openSurface('commandlinks');
          });
        });
        $$('.listview__row', root).forEach(function (row) {
          row.addEventListener('click', function () {
            $$('.listview__row', root).forEach(function (r) { r.setAttribute('aria-selected', String(r === row)); });
          });
        });
      }
    };
  };
  window.__surfaces = {
    defs: defs,
    get: function (id) { return defs[id] ? defs[id]() : null; }
  };
})();
