## 2026-06-07 全体CSS/HTML崩れ修正・原則違反修正

### 修正目的
全体の表示崩れ、共通UIの不統一、ARG制作原則から外れている箇所を修正。

### 変更したファイル
- assets/common-fiction.css
- index.html
- 403/index.html
- blog/index.html
- ending/index.html
- ending/feedback.html
- famous-people/index.html
- feedback/index.html
- form/index.html
- report-form/index.html
- hospital/index.html
- hospital/news.html
- hospital/articles/basement-lab-renovation.html
- hospital/articles/golden-week-2026.html
- hospital/articles/records-digitization.html
- hospital/articles/resident-recruitment-2027.html
- mail/index.html
- news-paper/index.html
- news-paper/article.html
- news-paper/article-education.html
- news-paper/article-hospital.html
- news-paper/article-mio.html
- news-paper/article-naruse.html
- news-paper/article-renji.html
- news-paper/article-station.html
- news-paper/asakura-mio-safe.html
- reviews/index.html
- school/index.html
- school/news.html
- search/index.html
- suzuki-chat/index.html
- suzuki-chat/renji-chat.html
- suzuki-chat/hospital-admin-log.html

### 主な修正内容
- 共通FICTIONALヘッダーの統一
- 共通フッター表記の統一
- 高リスクページの注意書き追加
- スマホ表示崩れの修正
- CSS重複の整理
- HTML構造の整理
- リンク切れ修正

### 原則対応
- 混同リスク回避：全HTMLに固定フィクションヘッダーと共通フッターを付与し、通報フォームの送信文言を実在の緊急通報に見えにくい「証拠を送信する」へ変更。医療記録に見える資料には「劇中医療記録 / FICTIONAL MEDICAL RECORD」を追加。
- 著作権・UI模倣リスク回避：検索、ニュース、メール種別のFICTIONAL表記を明確化し、全ページ共通CSSで実在サービス風の過度な固定UIではなく架空作品用の控えめな表示に統一。
- 没入感維持：人物名、日付、学校名、病院名、記事名、Stage/Ending導線は変更せず、ページごとの世界観を残したまま安全表示と表示品質だけを共通化。
- 導線維持：既存の主要リンク構造は維持しつつ、空リンクと存在しない音声ファイル参照を解消。検索結果は内部導線として同一タブ遷移に整理。

### 確認した項目
- PC表示：HTTPサーバーで全HTMLが200で開けること、CSSの波括弧不整合がないことを確認。
- スマホ表示：共通CSSで375px / 390px / 430px相当の幅でもヘッダーが2段折り返し、画像・動画・iframeが画面幅を超えない指定を確認。実ブラウザスクリーンショットは環境にブラウザがないため未取得。
- リンク：静的な内部href/srcに空リンク、#のみリンク、存在しない相対リンクがないことを確認。
- JSエラー：外部JSと全HTML内のインラインscriptに対して `node --check` を実行し、構文エラーがないことを確認。ブログの複数行本文文字列はテンプレートリテラルへ修正。
- フォーム：form/index.html と report-form/index.html のフォーム表示、注意書き、送信ボタン文言、既存の送信後エンディング遷移コードを確認。
- エンディング：ending/index.html が存在しない音声ファイルを参照しないようにし、BGM等が未設定でもJSが停止しないように確認。
- 感想ページ：feedback/index.html、ending/feedback.html、reviews/index.html のFICTIONAL表記とSupabase CDN参照を維持。

### 残っている懸念点
- ブラウザ実機によるConsole確認とスクリーンショット取得は、実行環境にChromium/Firefox/Playwrightがなく、npmからPlaywrightを取得できないため未実施。
- Supabase接続はCDNと外部サービスに依存するため、静的構文とページ配信確認まで実施。
