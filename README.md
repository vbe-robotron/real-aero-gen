# windows-ux-guide

Microsoft の **Windows User Experience Interaction Guidelines**（Windows 7 / Vista 版 UX Guide）を
エージェント スキルとして再構成したものです。Windows デスクトップ UI の設計・実装・レビュー時に、
エージェントへ読み込ませて使います。

- スキル本体: [`skills/windows-ux-guide/SKILL.md`](skills/windows-ux-guide/SKILL.md)
- 参照資料: [`skills/windows-ux-guide/references/`](skills/windows-ux-guide/references/)（14 ファイル）
- エージェント定義: [`skills/windows-ux-guide/agents/openai.yaml`](skills/windows-ux-guide/agents/openai.yaml)

## 必要環境

実行環境は不要です（Markdown のみ）。エージェントがスキルを探索するディレクトリへ
フォルダーを置くだけで使えます。

## 使い方

`skills/windows-ux-guide/` を、お使いのエージェントのスキル ディレクトリへコピーします。

```bash
# Codex / ChatGPT デスクトップ（プロジェクト直下）
mkdir -p .agents/skills && cp -r skills/windows-ux-guide .agents/skills/

# Claude Code（プロジェクト直下）
mkdir -p .claude/skills && cp -r skills/windows-ux-guide .claude/skills/

# ホーム配下（全プロジェクト共通）
mkdir -p ~/.agents/skills && cp -r skills/windows-ux-guide ~/.agents/skills/
```

配置後は `$windows-ux-guide` として呼び出せます（説明文が一致すれば自動でも起動します）。
`.agents/skills/` や `.claude/skills/` は各自の環境で生成されるものなので `.gitignore` で除外しています。

## 参照資料の一覧

| ファイル | 内容 |
| --- | --- |
| `references/design-principles.md` | 設計原則（14 の短縮版 / 19 の詳細版）と「Top Guidelines Violations」チェックリスト |
| `references/controls.md` | コントロールの選択と構成（ボタン、テキスト ボックス、リスト、プログレス、ツールヒント等） |
| `references/commands.md` | メニュー、ツール バー、リボン、コマンドの整理 |
| `references/text.md` | UI テキスト、スタイル、トーン、大文字化、ラベル、説明文 |
| `references/messages.md` | エラー、警告、確認、通知メッセージ |
| `references/interaction.md` | キーボード、マウス、タッチ、ペン、アクセシビリティ |
| `references/windows.md` | ウィンドウ管理、フレーム、ダイアログ ボックス、ウィザード、プロパティ シート |
| `references/visuals.md` | レイアウト、フォント、色、アイコン、標準アイコン、アニメーション、サウンド |
| `references/experiences.md` | ブランディング、セットアップ、初回起動、印刷 |
| `references/windows-environment.md` | デスクトップ、スタート メニュー、タスク バー、通知領域、コントロール パネル、ヘルプ、UAC |
| `references/checklists.md` | 画面の種類ごとの事前チェック / レビュー用チェックリスト |
| `references/ja-overview.md` | 日本語概要版の要点（Meiryo、タスク バー、リボン、タッチ） |
| `references/modern-porting.md` | モダン環境への移植: フォント スタック、rem スケーリング、1px 質感、Aero glass の合成（§3.1–3.2）、4:3 / 5:4 / 16:10 |
| `references/sources.md` | 出典と、抽出テキストの再生成手順 |

## 対象範囲

ソースは Windows 7 / Vista（2010 年最終更新）時点のものです。原則の多くは現在も有効ですが、
表現や例は現在の Microsoft の設計ガイドラインとは一致しません。クラシック デスクトップ /
Aero 調の UI を対象とし、モダン Windows（Fluent / WinUI、タッチ ファースト、ダーク モード）を
対象にする場合は差異を明示してください。詳細は `SKILL.md` の Scope note と
[`references/modern-porting.md`](skills/windows-ux-guide/references/modern-porting.md) にあります。

## ライセンス

このリポジトリの内容（スキルとして再構成した記述）は **MIT License** です。全文は
[`LICENSE`](LICENSE) を参照してください。

同梱のスキルは Microsoft の *Windows User Experience Interaction Guidelines*
（Windows 7 / Vista 版）および関連する Microsoft Learn のドキュメントを
**要約・再構成**したもので、原文の著作権は Microsoft Corporation に帰属します
（MIT の対象外で、原文は同梱していません）。詳しい帰属先は [`NOTICE`](NOTICE)、
出典の対応表は [`skills/windows-ux-guide/references/sources.md`](skills/windows-ux-guide/references/sources.md)
にあります。

リポジトリ直下の `UXGuide_(Windows_7_Vista).pdf` / `UXGuideJpOverview.pdf` は参照用に置いてある
Microsoft の原本で、リポジトリには含まれません（`.gitignore` で除外）。MIT の対象外なので
再配布しないでください。
