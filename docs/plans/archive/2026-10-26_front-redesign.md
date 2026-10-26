# 計畫：把 pencil 設計稿落地為 EJS ＋ Tailwind（前臺八頁，桌面＋手機）

## Context
前一階段已在 pencil 畫布完成「花漾生活」前臺八頁的桌面（1440）與手機（390）設計：暖白底、珊瑚橘紅主色、深可可頁尾、LXGW WenKai TC 手寫標題、鵝黃價格吊牌。本階段將設計轉成實際程式碼，使線上網站與設計稿一致。後臺（admin）不在範圍內，須維持原樣。

## 盤點結果（已讀過的現況）
- 前臺版型：`views/layouts/front.ejs` 引用 `partials/head|header|footer|notification`；`header.ejs` 僅前臺使用；**`footer.ejs`、`head.ejs`、色票 token 後臺也在用**。
- 色票定義於 `public/css/input.css` 的 `@theme`（`rose-primary` 等）；`public/css/output.css` 為建置產物，目前不存在。
- 頁面為 Vue 3（CDN）掛在各頁 `<div id="app">`，資料與事件在 `public/js/pages/*.js`；`header-init.js` 依賴 `#auth-nav`、`#cart-badge`、`#orders-link`。
- JS 內寫死的樣式類別：`notification.js`（`bg-sage`、`bg-apricot`）、`orders.js`／`order-detail.js` 的狀態標籤（`apricot`、`sage`、`red-*`）。
- 測試僅 API（vitest＋supertest），無 HTML 測試。`node_modules` 尚未安裝。專案目錄 `git status` 回報非 git 儲存庫，故**無版本回退**，須先手動備份。

## 設計決策
1. **新增 token、不改舊 token**：於 `@theme` 追加 `paper #FBF1E6`、`ink #2A1A12`、`ink-2 #5E4636`、`muted #7A6454`、`line #E3D3C2`、`coral #C8482A`、`coral-dark #A23718`、`cocoa #3A2418`、`peach #FBDFD0`、`tag #F4D35E`、`font-hand`（LXGW WenKai TC）。舊 `rose-*`、`blush`、`cream` 等保留，後臺外觀不變。
2. **新增 `partials/site-footer.ejs`** 給前臺用；`footer.ejs` 留給後臺不動。
3. **單一 EJS、行動優先 Tailwind**（預設為手機，`md:`／`lg:` 放大到桌面），不另做兩套頁面。
4. **保留所有 Vue 綁定與 `id`／`data-*`**，只換標記與 class，功能零變更。
5. **價格吊牌**做成 `input.css` 內的元件 class（`.price-tag`，含穿孔 `::before`、微傾斜），供首頁首屏與商品頁共用。
6. **首頁首屏「今日花櫃」資料化**：以 API 取回的前三項商品渲染（有 `image_url` 用之，無則退回 `featuredImages`），價格與名稱即真實資料；其餘行銷文案維持靜態。
7. 手機選單：`header.ejs` 增加漢堡按鈕與展開面板，於 `header-init.js` 加最小切換邏輯；登入／登出、訂單連結同步顯示於面板。
8. 設計稿中「底部固定行動列」不實作（靜態稿未呈現），維持內容流程內按鈕。

## 將動到的檔案（皆為覆寫既有檔，需你同意）
- `public/css/input.css`：新增 token、`.price-tag`、前臺 body 基礎樣式（以 class 套在前臺 `<body>`，不影響後臺）。
- `views/partials/head.ejs`：Google Fonts 增加 `LXGW WenKai TC`。
- `views/layouts/front.ejs`：body 改 `bg-paper text-ink`；`<main>` 去掉 `max-w-7xl` 外框，改由各頁區塊自帶容器（設計為滿版區塊）。
- `views/partials/header.ejs`、新增 `views/partials/site-footer.ejs`、`public/js/header-init.js`（類別換新 token、手機選單）。
- 八頁：`views/pages/index.ejs`、`product-detail.ejs`、`cart.ejs`、`checkout.ejs`、`login.ejs`、`orders.ejs`、`order-detail.ejs`、`404.ejs`。
- `public/js/pages/orders.js`、`order-detail.js`：狀態標籤 class 配合新色（`sage`／`apricot` 維持語意，必要時微調）。
- 文件：`docs/CHANGELOG.md`（Unreleased → Changed）、`docs/DEVELOPMENT.md`（設計 token 與 `.price-tag` 說明）；計畫存 `docs/plans/2026-10-26_front-redesign.md`，完成後移至 `docs/plans/archive/`。
- **不動**：`views/layouts/admin.ejs`、`partials/admin-*.ejs`、`partials/footer.ejs`、`views/pages/admin/*`、`src/`、`tests/`。

## 需要你點頭的系統變更
- 執行 `npm install`（`node_modules` 目前為空，才能建置 CSS 與跑測試）。
- 在 scratchpad 建備份 `backup-front/`（`views/`、`input.css`、`header-init.js`、`orders.js`、`order-detail.js`），因無 git 可回退。
- 背景啟動開發伺服器（`PORT=3001`）供截圖驗證，結束後關閉。

## 實作順序（以任務清單逐階段回報）
1. 備份 → `npm install` → 擴充 `input.css` token 與 `.price-tag` → `npm run css:build`。
2. 共用骨架：`head`、`front.ejs`、`header`（含手機選單）、`site-footer`、`header-init.js`。
3. 首頁（含首屏花桶、精選、品牌故事、全商品、好評、服務特色）。
4. 商品詳情 → 購物車 → 結帳（含錯誤態樣式）。
5. 登入／註冊 → 訂單列表 → 訂單詳情 → 404。
6. 每完成一階段即建置 CSS、截圖比對設計稿。

## 驗證
- `npm run css:build` 無錯誤；`npm test` 全數通過（確認未波及 API）。
- 啟動伺服器後，以 pencil `browser` 工具載入各頁，經 CDP `Emulation.setDeviceMetricsOverride` 分別在 1440 與 390 寬截圖，逐頁對照畫布設計稿（色、字、版面、吊牌、錯位排列）。
- 功能抽測：加入購物車（徽章數字更新）、登入／登出導覽切換、結帳表單驗證錯誤態、訂單狀態標籤顏色、手機漢堡選單展開。
- 後臺頁（`/admin/products`、`/admin/orders`）外觀與改前一致。
- 掃描 390 寬無橫向捲動；觸控目標 ≥44px。

## 風險
- 暖白底＋襯線近「生成式慣例」，以手寫字型、吊牌與照片主導版面區隔（已於設計階段說明）。
- LXGW WenKai TC 經 Google Fonts 載入，中文字檔較大，首次載入可能有字型閃爍；以 `display=swap` 緩解。
- 無版本控制，依賴備份回退。
