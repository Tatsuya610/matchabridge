# Team Setup Guide

このドキュメントは、MatchaBackプロジェクトをチームで編集する際のセットアップ方法です。

## 📋 前提条件

- Git がインストールされている
- テキストエディタ（VS Code 推奨）
- Python 3 または Node.js
- GitHub アカウント

## 🔧 初期セットアップ（最初の1回）

### 1. リポジトリをクローン

```bash
# オリジナルリポジトリをクローン
git clone https://github.com/yourusername/matchaback.git
cd matchaback

# GitHub設定を確認
git config --list | grep user
```

### 2. ユーザー情報を設定

```bash
# グローバル設定（全プロジェクト共通）
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメール@example.com"

# または、このプロジェクト単位での設定
git config user.name "あなたの名前"
git config user.email "あなたのメール@example.com"
```

### 3. ローカルサーバーをセットアップ

```bash
# Python を使用（推奨）
python3 -m http.server 8000

# ターミナルに表示される:
# Serving HTTP on 0.0.0.0 port 8000...
```

ブラウザで `http://localhost:8000` を開いてください。

## 📝 日々の作業フロー

### 毎日の開始時

```bash
# メインブランチに移動
git checkout main

# 最新の変更を取得
git pull origin main

# ローカルサーバーを起動
python3 -m http.server 8000
```

### 新しい機能を追加する場合

```bash
# 新しいブランチを作成
git checkout -b feature/機能名

# 例：
git checkout -b feature/add-matcha-gallery
```

### 変更をコミット

```bash
# ファイルを確認
git status

# ファイルをステージング
git add .

# またはファイル単位で
git add farms.html
git add scripts/farms.js

# コミット（日本語でもOK）
git commit -m "feat: 説明"
# または英語で
git commit -m "feat: Add new farm to directory"
```

### 変更をプッシュ

```bash
# あなたのリモートブランチにプッシュ
git push origin feature/機能名

# GitHub で Pull Request を作成
```

## 🔄 複数人での連携時

### 誰かの変更を取得

```bash
# 最新の状態に更新
git fetch origin
git pull origin main
```

### 衝突（コンフリクト）が発生した場合

```bash
# ステータスを確認
git status

# コンフリクトを解決
# テキストエディタでファイルを開き、
# <<<<<<< HEAD
# <<<<<<< と ======= と >>>>>>> で囲まれた箇所を修正

# 解決後、再度コミット
git add .
git commit -m "fix: Resolve merge conflict"
```

## 📂 ファイル編集時のルール

### farms.json を編集する場合

```json
{
  "id": "farm-id",
  "name_en": "English Name",
  "name_ja": "日本語名",
  "prefecture_code": "JP-XX",
  "producer_type": "farm",
  "tea_characteristics": ["ceremonial", "shade-grown"],
  "products": [
    {
      "name_en": "Product Name",
      "name_ja": "商品名",
      "grade": "A",
      "size": "100g",
      "image": "/assets/products/product.jpg"
    }
  ]
}
```

### HTML/CSS を編集する場合

- 日本語と英語の両方を含める
- モバイルでも見栄えが良いか確認
- ブラウザの DevTools で確認（F12）
- コンソールにエラーが出ないか確認

### JavaScript を編集する場合

- エラーハンドリングを含める
- コンソールにログ出力を含める
- コメントを日本語で書いても、英語でもOK

## 🧪 テストの実施

### ローカルで動作確認

```bash
# 1. ブラウザを開く
open http://localhost:8000

# 2. DevTools を開く (F12 または Cmd+Option+I)

# 3. Console タブでエラー確認
# 4. Network タブでファイル読み込み確認

# 5. 画面サイズを変更してレスポンシブ確認
# DevTools > Toggle device toolbar (Cmd+Shift+M)
```

### 言語切り替えをテスト

```
# 日本語でテスト
http://localhost:8000?lang=ja

# 英語でテスト
http://localhost:8000?lang=en
```

## 💬 コミットメッセージの例

```bash
# 機能追加
git commit -m "feat: Add café map to cafes.html"

# バグ修正
git commit -m "fix: Correct prefecture positioning for Kagoshima"

# ドキュメント更新
git commit -m "docs: Update farm addition guide"

# ファイル名・構造変更
git commit -m "refactor: Reorganize scripts directory"

# スタイル修正
git commit -m "style: Improve mobile responsiveness"

# 複数行メッセージ
git commit -m "feat: Add producer voice section

- Add video grid layout
- Implement responsive columns
- Add titles and descriptions"
```

## 🔍 よくあるトラブル

### ❌ `localhost:8000 に接続できない`

```bash
# ポートが既に使用されている場合
python3 -m http.server 9000  # 別のポートを使用

# ファイアウォール確認
# Mac: System Preferences > Security & Privacy
```

### ❌ `git push` がエラーになる

```bash
# リモートを確認
git remote -v

# オリジンが設定されていない場合
git remote add origin https://github.com/username/matchaback.git
git push origin feature/branch-name
```

### ❌ ファイルを編集できない

```bash
# ファイルの所有者を確認
ls -la farms.html

# 権限を修正
chmod 644 farms.html
```

### ❌ Mergeコンフリクトが解決できない

```bash
# 最新の main を取得
git fetch origin main

# コンフリクトを確認
git diff

# コンフリクトを手作業で解決した後
git add .
git commit -m "fix: Resolve conflict with main"
```

## 🎯 チーム編集のベストプラクティス

### ✅ やるべきこと

- [ ] 毎日 `git pull` で最新を取得
- [ ] 1つの PR=1つの機能/バグ修正
- [ ] 小分けにしてコミット
- [ ] コミットメッセージは分かりやすく
- [ ] PR を出す前にローカルでテスト
- [ ] コードレビューのコメントに返信

### ❌ やってはいけないこと

- [ ] main ブランチで直接編集
- [ ] 巨大な 1 つのコミット
- [ ] メッセージなしのコミット
- [ ] テストなしで PR を出す
- [ ] 他人のコミットを修正・削除
- [ ] パスワードやトークンをコミット

## 📞 よくある質問

### Q: ブランチ名は何でもいい？
A: プレフィックスを使ってください
- `feature/機能名` - 新機能
- `fix/バグ名` - バグ修正
- `docs/ドキュメント` - ドキュメント

### Q: PR は誰が作成？
A: 機能完成後に作成者が PR を作成して、チームメンバーに確認依頼

### Q: 複数人が同じファイルを編集したら？
A: Git が自動マージできない場合は、テキストエディタで手作業で修正

### Q: 誤ってコミットしたら？
A: まだプッシュしていなければ `git reset` で戻せます
```bash
git reset HEAD~1  # 最後のコミットを取り消し
```

### Q: main ブランチを誤って編集したら？
A: PR を出す前なら気にしないで大丈夫。PR で新ブランチに移ってください

## 📚 参考資料

- [Git 入門](https://github.com/skills/introduction-to-github)
- [GitHub 公式チュートリアル](https://guides.github.com/)
- [CONTRIBUTING.md](CONTRIBUTING.md) - 詳細な貢献ガイド

---

質問があれば、GitHub Issues で質問してください！
