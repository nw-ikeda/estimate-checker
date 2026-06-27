# 経費逆算・見積もりチェッカー

Webディレクター向けの外注費・ディレクション費・粗利を一括計算するツールです。

## 機能

- 外注費の複数項目入力（項目名 / 金額 / 担当者）
- ディレクション費の自動計算（外注費合計 × 任意の割合）
- 見積額の複数項目入力とリアルタイム集計
- 粗利・粗利率の自動計算
- 掛け率チェック表（5〜7.5掛けの請求推奨額と粗利率）
- 消費税切り替え（10% / 8% / なし）

## ローカルで使う

```
index.html をブラウザで直接開くだけで動作します。
```

サーバー不要・インターネット接続不要です。

## GitHub Pages で公開する手順

### 1. リポジトリ作成とプッシュ

```bash
git init
git add index.html README.md
git commit -m "初回コミット"

# gh CLI が使える場合（リポジトリ名は任意）
gh repo create estimate-checker --public --source=. --push

# gh CLI がない場合は GitHub 上で新規リポジトリを作成してから：
# git remote add origin https://github.com/<ユーザー名>/<リポジトリ名>.git
# git push -u origin main
```

### 2. GitHub Pages を有効化

1. GitHubのリポジトリページを開く
2. **Settings** タブをクリック
3. 左メニューの **Pages** を選択
4. **Source** を `Deploy from a branch` に設定
5. Branch を `main`、フォルダを `/ (root)` に設定して **Save**
6. しばらく待つと `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開される

## 評価基準

| 粗利率 | 評価 |
|--------|------|
| 70%以上 | ◎ 優良 |
| 60%以上 | ◯ 良好 |
| 40%以上 | △ 注意 |
| 40%未満 | ✕ 要検討 |

## 技術仕様

- HTML / CSS / Vanilla JS（フレームワーク不使用）
- 外部ライブラリ不使用
- index.html 単一ファイル構成
