# windows-ux-guide

Microsoft の **Windows User Experience Interaction Guidelines**（Windows 7 / Vista 版 UX Guide）を
エージェント スキルとして再構成した `windows-ux-guide` を、**`npx` ひとつで配布・導入できる**
ようにしたパッケージです。同じリポジトリに、ガイドの適用例である **Aero UI デモ** を同梱しています。

- スキル本体: [`skills/windows-ux-guide/`](skills/windows-ux-guide/SKILL.md)
  （`SKILL.md` + `references/*.md` + `agents/openai.yaml`）
- デモ: [`demo/`](demo/index.html)（HTML/CSS/JS のみ。ビルド不要）

## 必要環境

- Node.js **18 以上**（依存パッケージはありません。`npx` が入っていれば追加インストール不要）

## 使い方

```bash
# 1. スキルをエージェントの探索パスへ配置する（既定コマンド）
npx windows-ux-guide install

# 2. Aero UI デモをローカルで配信する
npx windows-ux-guide demo

# 3. パッケージ内容と配置先の候補を確認する
npx windows-ux-guide list
```

`npx windows-ux-guide` のように引数なしで実行した場合も `install` として動作します。

### install

| オプション | 説明 |
| --- | --- |
| `-t, --target <name>` | 配置先。`agents`（既定）/ `codex` / `claude` / `all` / `auto` |
| `--user` | プロジェクトではなくホーム配下へ配置する |
| `-d, --dir <path>` | スキル群の親ディレクトリを直接指定する |
| `-n, --name <dir>` | 配置先のフォルダー名（既定: `windows-ux-guide`） |
| `-f, --force` | 既存の配置先を上書きする |
| `--prune` | `--force` 時に配置先の余分なファイルも削除する |
| `--symlink` | コピーせずシンボリック リンクを張る（開発用） |
| `--dry-run` | 書き込まずに実行内容だけを表示する |
| `--json` | 結果を JSON で出力する |

配置される探索パス（2025 年時点の規約）:

| 対象 | プロジェクト | ユーザー (`--user`) |
| --- | --- | --- |
| Codex / OpenAI（agent skills 標準） | `<repo>/.agents/skills/windows-ux-guide` | `~/.agents/skills/windows-ux-guide` |
| Claude Code | `<project>/.claude/skills/windows-ux-guide` | `~/.claude/skills/windows-ux-guide` |

- 既に配置済みで内容が同じ場合は「既に最新です」と表示して何もしません。
- 内容が違う場合は、黙って上書きせずに `--force` を案内します（`--dry-run` で差分だけ確認できます）。
- 配置後は Claude Code なら `/windows-ux-guide`、Codex / ChatGPT デスクトップなら
  `$windows-ux-guide` として呼び出せます。説明文が一致すれば自動でも起動します。

```bash
# 例
npx windows-ux-guide install -t claude        # Claude Code のプロジェクトへ
npx windows-ux-guide install --user           # ホーム配下（全プロジェクト共通）
npx windows-ux-guide install -t all --dry-run # 両方に配置した場合の差分確認
```

### demo

| オプション | 説明 |
| --- | --- |
| `-p, --port <n>` | 待ち受けポート（既定: `8080`。使用中なら自動で `+1`） |
| `--host <addr>` | 待ち受けアドレス（既定: `127.0.0.1`） |
| `--no-open` | ブラウザーを自動で開かない |

```bash
npx windows-ux-guide demo -p 5173
```

デモは `demo/` を静的配信するだけです。停止は `Ctrl+C`。

## パッケージ構成

```
package.json          npm メタデータ（bin: windows-ux-guide / wxg）
bin/cli.mjs           CLI 本体（依存ゼロ・ESM）
skills/windows-ux-guide/
  SKILL.md            スキル定義（name / description の frontmatter）
  references/*.md     ガイド本文（14 ファイル）
  agents/openai.yaml  ChatGPT デスクトップ / Codex 用の表示メタデータ
demo/                 Aero UI デモ（index.html + css/ + js/）
```

`npm publish` では `package.json` の `files` により `bin/`・`skills/`・`demo/`・`README.md`
のみが公開されます（PDF 資料などは含まれません）。

## ローカルでの動作確認と公開

```bash
# 開発時の実行（インストール不要）
node bin/cli.mjs --help
node bin/cli.mjs install --target claude --dry-run
node bin/cli.mjs demo --no-open
npm run demo            # 同上

# パッケージに含まれるファイルの確認と、公開内容の検証
npm pack --dry-run
npm publish --dry-run
```

`npx` での実地検証は、tarball を直接指定するのが確実です。

```bash
npm pack                      # windows-ux-guide-0.1.0.tgz ができる
npx ./windows-ux-guide-0.1.0.tgz install --dry-run
```

`npx` へ渡す tarball は `./` 付きの相対パスにしてください。絶対パス（`/tmp/….tgz`）は
パッケージではなく実行ファイルと解釈され `Permission denied` になります。
レジストリへ公開した後は名前だけで実行できます。

```bash
npx windows-ux-guide install --target claude
npx windows-ux-guide demo
```

公開する場合は、先に `package.json` の `version` を上げてから `npm publish` を実行します
（`publishConfig.access` は `public`）。

## メモ

- 動作確認済み: Node.js v22.14.0 / npm 10.9.2。`npx ./windows-ux-guide-0.1.0.tgz` から
  `install`（`agents` / `claude` / `all` / `auto`、`--user`、`--dir`、`--name`、`--symlink`、
  `--force`、`--prune`、`--dry-run`、`--json`）と `demo`（HTTP 配信）を確認しています。
  配置したスキルは同梱物とバイト単位で一致します（16 ファイル）。
- ライセンスは **MIT**（`LICENSE`）です。`skills/windows-ux-guide/` の中身は Microsoft の
  UX Guide 等を**要約・再構成した自作の記述**で、原文は再掲していません。原文の権利は
  Microsoft に帰属し MIT の対象外です（詳細は `NOTICE`、出典は
  `skills/windows-ux-guide/references/sources.md`）。
- `--symlink` は開発用です。`--force` を併用せずに既存の配置先がある場合でも、
  リンクを張り直します。
- Windows でシンボリック リンクを作るには開発者モードまたは管理者権限が必要です。
  通常は既定のコピー配置を使ってください。

## ライセンス

このパッケージ（CLI `bin/cli.mjs`、`demo/`、スキルとして再構成した記述）は
**MIT License** です。全文は [`LICENSE`](LICENSE) を参照してください。

同梱のスキルは Microsoft の *Windows User Experience Interaction Guidelines*
（Windows 7 / Vista 版）および関連する Microsoft Learn のドキュメントを
**要約・再構成**したもので、原文の著作権は Microsoft Corporation に帰属します
（MIT の対象外で、原文は同梱していません）。詳しい帰属先は [`NOTICE`](NOTICE)、
出典の対応表は [`skills/windows-ux-guide/references/sources.md`](skills/windows-ux-guide/references/sources.md)
にあります。

リポジトリ直下の `UXGuide_(Windows_7_Vista).pdf` / `UXGuideJpOverview.pdf` は
参照用に置いてある Microsoft の原本で、npm パッケージには含まれません
（`package.json` の `files` で除外）。MIT の対象外なので再配布しないでください。
