# GitHubへの公開手順

このドキュメントは、MatchaBackプロジェクトをGitHubに公開するための完全ガイドです。

## 📋 準備

### 1. GitHubアカウントと設定

```bash
# Gitをインストール（Macの場合、既にインストール済みなら不要）
git --version  # バージョン確認

# グローバル設定（初回のみ）
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメールアドレス"

# SSH鍵を生成（初回のみ）
ssh-keygen -t ed25519 -C "あなたのメールアドレス"
# 4回Enter を押す
```

### 2. SSH鍵をGitHubに登録

```bash
# SSH鍵の公開鍵をコピー
cat ~/.ssh/id_ed25519.pub

# GitHub設定ページで登録
# https://github.com/settings/keys
# 「New SSH key」をクリック
# Title: 「My MacBook」など
# Key: 上のコマンドの出力を貼り付け
```

接続確認：
```bash
ssh -T git@github.com
# Hi yourusername! You've successfully authenticated...
```

## 🚀 GitHubへ公開する手順

### ステップ 1: GitHubでリポジトリを作成

1. GitHub.com にログイン
2. 画面右上の「+」アイコン → 「New repository」
3. Repository name: `matchaback`
4. Description: `A modern web platform for connecting Japanese matcha producers with international café partners.`
5. Visibility: **Public** を選択（オープンソースの場合）
6. 「README file」「.gitignore」「license」は **チェックなし** にしてください
7. 「Create repository」ボタンをクリック

### ステップ 2: ローカルでGitを初期化

```bash
cd /Users/fujiitatsuya/Documents/matcha

# Git リポジトリを初期化
git init

# ユーザー情報を設定（このプロジェクト用）
git config user.name "あなたの名前"
git config user.email "あなたのメールアドレス"

# 設定確認
git config --list | grep user
```

### ステップ 3: すべてのファイルをコミット

```bash
# ファイルをステージング
git add .

# コミットメッセージを追加
git commit -m "Initial commit: MatchaBack Partner Farms Platform

- Interactive Japan map with farm locations
- Multi-language support (English/Japanese)
- Café partnership resources
- Matcha preparation guides
- Farm detail pages with product listings
- Security headers (CSP, Permissions-Policy)
- GitHub collaborative workflow setup"

# ファイルが追加されたか確認
git log --oneline
```

### ステップ 4: GitHubのリポジトリに接続

```bash
# GitHubで作成したリポジトリのURLを使用
# ssh形式: git@github.com:yourusername/matchaback.git
# https形式: https://github.com/yourusername/matchaback.git

# SSH推奨（パスワード入力なし）
git remote add origin git@github.com:yourusername/matchaback.git

# またはHTTPS（Personal Access Tokenが必要）
# git remote add origin https://github.com/yourusername/matchaback.git

# 確認
git remote -v
# origin  git@github.com:yourusername/matchaback.git (fetch)
# origin  git@github.com:yourusername/matchaback.git (push)
```

### ステップ 5: GitHubにプッシュ

```bash
# main ブランチに切り替え
git branch -M main

# GitHubにプッシュ
git push -u origin main

# 確認メッセージが表示されたら、
# 初回は GitHub にサインインを求められます（SSH鍵の場合は不要）
```

### ステップ 6: 公開確認

```bash
# ブラウザで確認
open https://github.com/yourusername/matchaback
```

## ✅ 公開確認チェックリスト

- [ ] GitHubで `matchaback` リポジトリが見える
- [ ] すべてのファイルが表示されている
- [ ] README.md が表示されている
- [ ] CONTRIBUTING.md, TEAM_SETUP.md が表示されている
- [ ] .gitignore が隠しファイルとして存在
- [ ] GitHub Actions の workflows が表示されている

## 📝 README を GitHubに表示

README.md は自動的にリポジトリのメインページに表示されます。

現在のREADME内容を確認：
```bash
head -20 README.md
```

## 🔗 便利なリンク

公開後、以下URLで共有できます：

```
# メインリポジトリ
https://github.com/yourusername/matchaback

# ファイルの表示
https://github.com/yourusername/matchaback/blob/main/README.md

# イシュー報告
https://github.com/yourusername/matchaback/issues

# ディスカッション
https://github.com/yourusername/matchaback/discussions

# PR作成
https://github.com/yourusername/matchaback/pulls
```

## 🔄 公開後の更新方法

### 小さな変更の場合
```bash
# ファイルを編集
# 例: farms.html を修正

# 変更をコミット
git add farms.html
git commit -m "fix: Correct styling on farms page"

# GitHubにプッシュ
git push origin main
```

### 新機能を追加する場合（複数人での開発）
```bash
# feature ブランチを作成
git checkout -b feature/new-feature

# 機能を開発
# ...編集...

# コミット
git add .
git commit -m "feat: Add new feature"

# プッシュ
git push origin feature/new-feature

# GitHub で Pull Request を作成
# レビュー後、main にマージ
```

## 🎯 一般公開設定

### ライセンスを追加（推奨）

```bash
# MIT ライセンスを追加
curl https://raw.githubusercontent.com/github/gitignore/main/Global/macOS.gitignore -o .gitignore_mac

# または GitHub 上で:
# Add file → Create new file
# Name: LICENSE
# 内容: MIT ライセンスをコピー（テンプレートから選択可能）
```

### README にバッジを追加（オプション）

```markdown
[![GitHub License](https://img.shields.io/github/license/yourusername/matchaback)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/yourusername/matchaback?style=social)](https://github.com/yourusername/matchaback)
```

## ⚠️ 公開前のチェック

- [ ] パスワード保護コード削除 ✅
- [ ] ハードコードされた localhost 参照削除 ✅
- [ ] .gitignore が正しく設定 ✅
- [ ] sensitive データ（API キーなど）がない ✅
- [ ] README が分かりやすい ✅
- [ ] CONTRIBUTING.md が存在 ✅
- [ ] LICENSE が存在（必要に応じて）

## 🆘 トラブルシューティング

### ❌ "Permission denied (publickey)"
```bash
# SSH鍵の問題
ssh -vT git@github.com
# 出力を確認し、~/.ssh/authorized_keys に鍵がある確認

# または HTTPS を使用
git remote set-url origin https://github.com/yourusername/matchaback.git
```

### ❌ "fatal: remote origin already exists"
```bash
# リモートを削除して再設定
git remote remove origin
git remote add origin git@github.com:yourusername/matchaback.git
```

### ❌ "Updates were rejected because the branch is behind"
```bash
# リモートの変更を取得してマージ
git pull origin main
git push origin main
```

### ❌ "error: src refspec main does not match any"
```bash
# ブランチ名の確認
git branch

# master がある場合は main に名前変更
git branch -M main
git push -u origin main
```

## 💡 ベストプラクティス

1. **定期的にプッシュ**：毎日作業を終わる時にプッシュ
2. **意味のあるコミットメッセージ**：何をしたかが分かるように
3. **ブランチを活用**：main は安定した状態を保つ
4. **PR でレビュー**：チーム開発時は必ず PR を通す
5. **Issue を活用**：バグ報告や機能提案は Issue で

---

質問があれば GitHub Discussions で質問できます！
