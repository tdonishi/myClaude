# myClaude

このリポジトリは、Claude Code のクラウドセッションを体験するために作成されました。

## クラウドセッションで最初に体験したこと

1. クラウドセッション上でファイルを編集する
2. `git add` / `git commit` で変更を記録する
3. `git push` してGitHub上に変更を反映する

クラウドセッションのコンテナは使い捨てのため、`push`して初めて変更が確定します。

## 2回目のコミット&プッシュ

同じ流れ(編集→add→commit→push)を再度繰り返すことで、
複数回のコミットが同じブランチに積み重なっていくことを確認しました。

## プルリクエスト(PR)の作成

作業ブランチ(`claude/demo-pr-fprsk9`)を`main`から切り、変更を加えてpushした後、
`main`ブランチへのPRを作成する流れを体験しました。

## マンダラート ノートアプリ

`mandala-art/`配下に、マンダラート形式で発想を広げるためのノートアプリを追加しました。
`mandala-art/index.html`をブラウザで開くと利用できます。

- 1ページは3×3マスの正方形で、中央マスにテーマを、周囲8マスに連想語を書き込みます。
- 周囲8マスがすべて埋まると、その8つの語をそれぞれテーマとした新しいページを一括作成できます。
- 作成済みのページは緑枠のマスから開けるほか、パンくずリストや全体マップから行き来できます。
- 入力内容はブラウザのlocalStorageに自動保存されます。

### iOSでアプリのように使う(PWA対応)

Web App ManifestとService Workerに対応しており、Safari(iOS)から次の手順でホーム画面に追加すると、
ネイティブアプリのようにアイコンから起動できます(オフラインでも動作します)。

1. SafariでHTTPS配信された`mandala-art/index.html`を開く
2. 共有ボタン → 「ホーム画面に追加」を選択

App Storeへの配信は行っていません。あくまでSafariの機能を使ったホーム画面ショートカット(PWA)です。

### GitHub Pagesでの公開

`.github/workflows/pages.yml`により、`main`ブランチへのpush時にリポジトリ内容をGitHub Pagesへ自動デプロイします。
初回のみ、リポジトリの`Settings > Pages > Build and deployment > Source`を「GitHub Actions」に設定してください。
設定後は次のURLでiPhoneの実機Safariからアクセスできます。

`https://<GitHubユーザー名>.github.io/myClaude/mandala-art/`
