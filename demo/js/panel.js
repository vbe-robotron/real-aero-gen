/* ==========================================================================
   panel.js — スキル注解パネル (どの規則をどこで示しているか) と自動検証
   windows-ux-guide/references/*.md の該当箇所に対応づける
   ========================================================================== */
(function () {
  'use strict';

  var $ = window.__ui.$;
  var $$ = window.__ui.$$;
  var esc = window.__ui.esc;
  var icon = window.__ui.icon;

  /* ------------------------------------------------------------ 注解の一覧 */
  var ANNOTATIONS = [
    {
      title: 'ウィンドウ枠とタイトル バー',
      ref: 'windows.md',
      target: 'explorer',
      body: 'ガラスの枠は 1px の外枠 + 1px の内側ハイライト + 停止比率つきグラデーション (era の質感) と、' +
        'DWM の合成に相当する backdrop-filter のぼかしで作ります。スクリーンショットの縮小は使っていません。' +
        'ダイアログにはタイトル バー アイコンを付けず、一次ウィンドウと区別します。'
    },
    {
      title: 'ダイアログの標準レイアウト',
      ref: 'windows.md',
      target: 'confirm-delete',
      body: 'タイトル バー → メイン命令 → 補足命令 → 内容 → コミット ボタンの順です。' +
        'メイン命令はユーザーの目的を文で述べ、補足命令はそれを言い換えず文脈だけを足します。'
    },
    {
      title: 'コミット ボタンの順序',
      ref: 'interaction.md',
      target: 'confirm-delete',
      body: 'はい / いいえ / キャンセル / 適用 の順で、既定は 1 つだけ。' +
        '問題が起きた後のメッセージでは OK ではなく Close、進行中の操作では Cancel ではなく Stop を使います。'
    },
    {
      title: 'ウィザード',
      ref: 'windows.md',
      target: 'wizard',
      body: '[次へ] はコミットせずに進み、[戻る] は間違いを直すためだけに使います。' +
        '最後は「接続」のような具体的な動作の言葉で確定し、完了ページは [閉じる] だけにします。' +
        '手順の数は、本当に数えられる範囲だけを数えます。'
    },
    {
      title: 'プロパティ シートと [適用]',
      ref: 'windows.md',
      target: 'propsheet',
      body: '[適用] を持つのはプロパティ シートとコントロール パネル項目だけです。' +
        'タブ名は具体的にし、General / Advanced / Settings のようなタブやページは作りません。' +
        '変更結果を見ながら決められるよう、モーダルにはしません。'
    },
    {
      title: 'エラー / 警告 / 確認の使い分け',
      ref: 'messages.md',
      target: 'error',
      body: 'エラーは「すでに起きた問題」、警告は「これから問題になりうる状態」、確認は「実行してよいかの質問」です。' +
        '予防できるものは予防し、行動につながらないメッセージは出しません。詳細 (エラー コード) は折りたたみます。'
    },
    {
      title: 'コントロールの選択',
      ref: 'controls.md',
      target: 'gallery',
      body: '即時の操作にはボタン、独立した選択にはチェック ボックス、排他的で説明が要る選択にはラジオ ボタンか' +
        'コマンド リンク、連続値にはスライダーを使います。プロンプトはイタリック + グレーで、重要な情報には使いません。'
    },
    {
      title: 'メニューとリボン',
      ref: 'commands.md',
      target: 'ribbon',
      body: 'リボンはメニュー バーとツールバーを置き換えるので、同じコマンドを重複させません。' +
        'メニュー バーは File / Edit / View / Tools / Help の順で、三点リーダは「続けて入力が必要」なときだけ付けます。'
    },
    {
      title: 'タスクバーの状態表示',
      ref: 'windows-environment.md',
      target: 'explorer',
      body: '進行状況はタスクバー ボタンに出しますが、ウィンドウが前面にある間は出しません。' +
        '状態は「オーバーレイ アイコン」か「通知領域アイコン」のどちらか一方だけを使います。' +
        '[ドキュメント] の [バックグラウンド コピー] で試せます。'
    },
    {
      title: 'スタート メニューとデスクトップ',
      ref: 'windows-environment.md',
      target: null,
      body: 'スタート メニューにはプログラムのショートカットだけを 1 つずつ置きます。' +
        'デスクトップには、よく使うものだけを、既定でオフの設定として提供します。'
    },
    {
      title: 'キーボードとフォーカス',
      ref: 'interaction.md',
      target: 'gallery',
      body: 'タブ順は左から右、上から下。ラジオ ボタンのグループは 1 つのタブ ストップで、矢印キーは中を回ります。' +
        'モーダル表示中はタブ ストップをダイアログ内に閉じ込め、<span class="kbd">Esc</span> は常にキャンセル相当です。' +
        'ホバーでしか使えない機能はありません。'
    },
    {
      title: 'テキストの書き方',
      ref: 'text.md',
      target: 'fonts',
      body: 'ユーザーは読み飛ばす前提で、要点を先に置きます。二人称・現在形・能動態で書き、' +
        'メイン命令は 1 文、タイトルはタイトル スタイル、本文は文スタイルです。'
    },
    {
      title: 'フォント スタックと rem スケール',
      ref: 'modern-porting.md §1-§2',
      target: 'fonts',
      body: 'Meiryo UI → Meiryo → Segoe UI → Myriad → Hind → Noto Sans → system-ui の順に解決します。' +
        'サイズは era の実ピクセルではなく比率 (メイン命令 ≈ 本文 × 1.33) だけを引き継ぎ、' +
        'すべて rem で指定するので、ブラウザーの文字サイズ設定とズームに追従します。'
    },
    {
      title: 'era の 1px の質感',
      ref: 'modern-porting.md §3',
      target: null,
      body: '外枠 1px + 内側ハイライト 1px + 48% / 49% の停止比率で、当時の「詰まった」見た目を再現します。' +
        'DPR が 2 以上のときだけ <code class="code">--hairline</code> を 0.5px に細めます。' +
        '[1px 拡大鏡] で実際の太さを確認できます。'
    },
    {
      title: 'Aero ガラスは DWM の合成',
      ref: 'modern-porting.md §3.1-§3.2',
      target: null,
      body: 'ガラスは色ではなく、DWM がデスクトップを背後でぼかして合成した結果です。' +
        'このデモは枠を <code class="code">backdrop-filter</code> (ぼかし + 彩度) で作り、' +
        '不透明度は色づきだけに留めます。祖先に <code class="code">filter</code> があると' +
        'ぼかしが効かなくなるため、影は <code class="code">box-shadow</code> を使っています。' +
        'ぼかしを持てない環境とハイ コントラストでは、[Aero ガラス (透明)] のように' +
        '不透明な Vista Basic 相当へ切り替えます。'
    },
    {
      title: '想定画面 (4:3 / 5:4 / 16:10)',
      ref: 'modern-porting.md §4',
      target: null,
      body: '当時の主戦場は 4:3 と 16:10 で、16:9 ではありません。' +
        '16:9 は縦が短くなるため、1366x768 が最も厳しい条件になります。' +
        'デモ ツールバーの [想定画面] を切り替えると、その論理解像度で実際に組み直して検証できます。'
    },
    {
      title: 'UAC (昇格)',
      ref: 'windows-environment.md',
      target: 'uac',
      body: '昇格は必要になった時点で 1 回だけ求めます。昇格が必要なコマンドには盾のアイコンを付け、' +
        '要求の理由が分かるように表示します。'
    },
    {
      title: '判断が分かれる点: 日本語書体を先に置く',
      ref: 'modern-porting.md §1',
      warn: true,
      target: 'fonts',
      body: 'このスタックは Meiryo UI を先頭に置いています。日本語 UI では正しい一方、' +
        '日本語版 Windows 上の欧文も Meiryo の欧文で描かれるため、欧文を Segoe UI で見せたい場合は' +
        '順序の入れ替え (または <code class="code">--font-latin</code> の併用) が必要です。' +
        'ここは好みではなく対象環境で決めるべき点として残しています。'
    }
  ];

  function renderAnnotations() {
    var list = $('#annlist');
    list.innerHTML = ANNOTATIONS.map(function (a, i) {
      return '<li class="ann' + (a.warn ? ' ann--warn' : '') + '">' +
        '<div class="ann__head">' +
          '<span class="ann__title">' + esc(a.title) + '</span>' +
          '<button class="ann__ref" type="button" data-ref="' + i + '" ' +
            'title="該当する画面を開いて示す">' + esc(a.ref) + '</button>' +
        '</div>' +
        '<div class="ann__body">' + a.body + '</div>' +
        '</li>';
    }).join('');

    $$('[data-ref]', list).forEach(function (b) {
      b.addEventListener('click', function () {
        var a = ANNOTATIONS[Number(b.dataset.ref)];
        if (!a || !a.target) {
          window.__app.notify({
            icon: 'i-info',
            title: 'この項目は画面全体に関わります',
            text: '特定のウィンドウには対応していません。'
          });
          return;
        }
        if (!window.__wm.wins[a.target]) { window.__app.openSurface(a.target); }
        else { window.__app.focus(a.target); }
        var node = $('#win-' + a.target);
        if (node) {
          node.classList.add('ann-hl');
          window.setTimeout(function () { node.classList.remove('ann-hl'); }, 1600);
        }
      });
    });
  }
  /* --------------------------------------------------- フォント解決の要約 */
  function renderFontProbe() {
    var cs = getComputedStyle(document.documentElement);
    var stack = (cs.fontFamily || '').split(',').map(function (s) {
      return s.trim().replace(/^["']|["']$/g, '');
    }).filter(Boolean);

    var probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;font-size:100px;white-space:nowrap';
    probe.textContent = 'あAg';
    document.body.appendChild(probe);
    var uiWidth = probe.offsetWidth;
    probe.remove();

    var rows = stack.map(function (name, i) {
      var available = false;
      try { available = !!(document.fonts && document.fonts.check && document.fonts.check('100px "' + name + '"')); }
      catch (e) { available = false; }
      return { name: name, index: i + 1, available: available };
    });
    var resolved = rows.filter(function (r) { return r.available; })[0];

    /* 同じ幅 = 同じ書体。日本語書体が先にあると欧文もその書体で描かれる */
    var mix = document.createElement('span');
    mix.style.cssText = 'position:absolute;visibility:hidden;font-size:16px;white-space:nowrap';
    mix.textContent = 'Ag 会議';
    document.body.appendChild(mix);
    var withUi = mix.offsetWidth;
    mix.style.fontFamily = 'var(--font-latin)';
    var withLatin = mix.offsetWidth;
    mix.remove();

    $('#fontprobe').innerHTML =
      '<table class="probe-table"><thead><tr><th>順位</th><th>候補</th><th>利用可</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td>' + r.index + '</td><td>' +
          (resolved && r.name === resolved.name ? '<strong>' + esc(r.name) + ' ← 採用</strong>' : esc(r.name)) +
          '</td><td>' + (r.available ? 'あり' : 'なし') + '</td></tr>';
      }).join('') + '</tbody></table>' +
      '<p style="margin-top:.5rem;color:#55606a">実測: 「あAg」= ' + uiWidth + 'px (100px 時) / DPR ' +
      (window.devicePixelRatio || 1) + '</p>' +
      '<p style="margin-top:.5rem;color:#55606a">和文と欧文の混植: 「Ag 会議」が UI スタックで ' + withUi +
      'px、欧文スタック (<code class="code">--font-latin</code>) で ' + withLatin + 'px。' +
      (withUi === withLatin
        ? '同じ幅なので、いまは同じ書体が使われています。'
        : '幅が違うので、欧文だけ別の書体が使われています。') + '</p>' +
      '<p style="margin-top:.5rem;color:#55606a">OS/商用フォントは名前参照のみで、ファイルは同梱していません' +
      ' (同梱してよいのは Hind と Noto Sans 系のみ)。</p>';
  }

  /* -------------------------------------------- 想定画面とはみ出しの検証 */
  var PRESET_TABLE = [
    ['640x480', '4:3', 'セーフ モード相当の最低ライン'],
    ['800x600', '4:3', '最小サポート解像度 (固定サイズはここで全部見えること)'],
    ['1024x768', '4:3', '設計と最適化の基準'],
    ['1280x1024', '5:4', '縦長の 4:3 系'],
    ['1440x900', '16:10', '当時のワイド標準'],
    ['1366x768', '16:9', '高さの最悪ケース (16:9 は縦が短い)']
  ];

  function renderAspect() {
    var demo = window.__demo;
    var fit = window.__app.fitReport();
    var current = PRESET_TABLE.filter(function (r) { return r[0] === demo.preset; })[0];

    var overflow = fit.overflow.map(function (o) {
      return '<li>' + esc(o.title) + ' (' + o.w + 'x' + o.h + ' / 作業領域 ' + fit.area.w + 'x' + fit.area.h + ')</li>';
    }).join('');
    var clipped = fit.clipped.map(function (o) { return '<li>' + esc(o.title) + '</li>'; }).join('');

    $('#aspectreport').innerHTML =
      '<p>' +
        '現在: <strong>' + (current ? esc(current[0]) + ' (' + current[1] + ') ' + esc(current[2])
          : '自動 (実際のウィンドウ サイズ)') + '</strong><br>' +
        '作業領域: ' + fit.area.w + 'x' + fit.area.h + ' px / ウィンドウ数 ' + Object.keys(window.__wm.wins).length +
      '</p>' +
      (overflow
        ? '<div class="hintband hintband--danger" style="margin-top:.5rem">' + icon('i-error') +
          '<div><strong>作業領域より大きいウィンドウがあります。</strong><ul>' + overflow + '</ul>' +
          '<p>ガイドは「最小解像度で完全に表示できること」を求めています。</p></div></div>'
        : '<div class="hintband" style="margin-top:.5rem">' + icon('i-ok') +
          '<div>すべてのウィンドウが作業領域に収まっています。</div></div>') +
      (clipped
        ? '<div class="hintband hintband--warn" style="margin-top:.5rem">' + icon('i-warn') +
          '<div><strong>画面の外にはみ出しているウィンドウ:</strong><ul>' + clipped + '</ul></div></div>'
        : '') +
      '<table class="probe-table" style="margin-top:.75rem"><thead><tr>' +
        '<th>解像度</th><th>比率</th><th>位置づけ</th></tr></thead><tbody>' +
        PRESET_TABLE.map(function (r) {
          return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
        }).join('') +
      '</tbody></table>';
  }
  /* ------------------------------------------- 事前チェック (自動検証つき) */
  function evaluate() {
    var cs = getComputedStyle(document.documentElement);
    var demo = window.__demo;
    var fit = window.__app.fitReport();
    var wins = Object.keys(window.__wm.wins).map(function (k) { return window.__wm.wins[k]; });
    var hairline = cs.getPropertyValue('--hairline').trim();
    var modals = wins.filter(function (r) { return r.modal; });

    return [
      {
        label: 'タイプは rem で指定されている (era の実ピクセルを写していない)',
        ok: /rem/.test(cs.getPropertyValue('--text-body')),
        note: '--text-body = ' + cs.getPropertyValue('--text-body').trim() + ' / root = ' + cs.fontSize
      },
      {
        label: '1px の線は DPR に応じて細くなる',
        ok: demo.dpr >= 2 ? parseFloat(hairline) < 1 : hairline === '1px',
        note: '--hairline = ' + hairline + ' / DPR ' + demo.dpr
      },
      {
        label: '想定画面の作業領域にすべてのウィンドウが収まっている',
        ok: fit.overflow.length === 0 && fit.clipped.length === 0,
        note: (fit.overflow.length + fit.clipped.length) + ' 件のはみ出し (作業領域 ' + fit.area.w + 'x' + fit.area.h + ')'
      },
      {
        label: '各サーフェスの既定ボタンは 1 つ以下',
        ok: wins.every(function (r) { return $$('.commitbar .btn--default', r.root).length <= 1; }),
        note: '動かすべき応答を 1 つに絞る'
      },
      {
        label: 'モーダルは同時に 1 つまで (不要なモーダルを作らない)',
        ok: modals.length <= 1,
        note: '現在のモーダル数: ' + modals.length
      },
      {
        label: '閉じるボタンが無効化されていない (進行状況の例外を除く)',
        ok: wins.every(function (r) {
          if (r.id === 'progress') { return true; }
          var b = $('.captionbtn--close', r.root);
          return !b || !b.disabled;
        }),
        note: 'ユーザーの制御を奪わない'
      },
      {
        label: 'すべてのウィンドウがキーボードで操作できる',
        ok: wins.every(function (r) { return $$('button, input, select, [tabindex="0"]', r.root).length > 0; }),
        note: '各ウィンドウに 1 つ以上のタブ ストップ'
      }
    ];
  }

  function renderChecks() {
    var items = evaluate();
    $('#checklist').innerHTML = items.map(function (c) {
      return '<li style="display:flex;gap:.5rem;align-items:flex-start">' +
        icon(c.ok ? 'i-ok' : 'i-warn') +
        '<span><strong>' + esc(c.label) + '</strong>' +
        (c.note ? '<br><span style="color:#55606b">' + esc(c.note) + '</span>' : '') +
        '</span></li>';
    }).join('') +
      '<li style="margin-top:.5rem;color:#55606b">この一覧は checklists.md の項目から、' +
      'デモで自動的に判定できるものだけを抜き出したものです。</li>';
  }

  /* ------------------------------------------------------------------ 起動 */
  function refreshDynamic() {
    if (!window.__app) { return; }
    renderFontProbe();
    renderAspect();
    renderChecks();
  }

  function bootPanel() {
    renderAnnotations();
    refreshDynamic();
    document.addEventListener('demo:stagechange', refreshDynamic);
    document.addEventListener('demo:windowschange', refreshDynamic);
    document.addEventListener('demo:scalechange', function () { window.setTimeout(refreshDynamic, 30); });
    document.addEventListener('demo:ready', refreshDynamic);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPanel);
  } else {
    bootPanel();
  }
})();
