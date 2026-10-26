# 更新日誌

所有重大變更皆記錄於此文件。格式參考 [Keep a Changelog](https://keepachangelog.com/)。

## [Unreleased]

### Added
- 綠界 ECPay AIO 金流串接：結帳後導向綠界付款頁面完成真實付款流程
- 新增 `src/utils/ecpay.js` 工具模組：CheckMacValue 簽章產生/驗證、ECPay 專用 URL 編碼、QueryTradeInfo API 查詢
- 新增 `GET /ecpay/payment/:orderId` 頁面路由：產生自動送出的 ECPay 付款表單
- 新增 `POST /api/orders/:id/check-payment` API：透過 QueryTradeInfo API 主動查詢付款狀態（取代本地端無法接收的 Server Notify）
- 訂單新增 `merchant_trade_no` 欄位：對應綠界 MerchantTradeNo，由 order_no 去除連字號產生

### Changed
- 前台八頁（首頁、商品詳情、購物車、結帳、登入／註冊、訂單列表、訂單詳情、404）依 pencil 設計稿全面改版：暖白底、珊瑚橘紅主色、深可可頁尾、LXGW WenKai TC 手寫標題、鵝黃價格吊牌；行動優先，桌面（1440）與手機（390）共用同一份 EJS
- 首頁首屏「今日花櫃」改以 API 前三項商品渲染（名稱、價格、圖片皆為真實資料）
- 前台導覽新增手機漢堡選單（`header.ejs`、`header-init.js`）；訂單狀態標籤與付款提示配色調整（`orders.js`、`order-detail.js`）
- 新增前台專用頁尾 `views/partials/site-footer.ejs`；後臺沿用原 `footer.ejs`，外觀不變
- `public/css/input.css` 新增暖色 token（`paper`、`ink`、`coral`、`cocoa`、`peach`、`tag` 等）與 `.price-tag` 元件；舊 `rose-*` 等 token 保留供後臺使用
- 結帳頁面（checkout.js）：送出訂單後導向綠界付款頁面，不再直接跳轉訂單詳情
- 訂單詳情頁面（order-detail.ejs / order-detail.js）：原「付款成功/失敗」模擬按鈕改為「查詢付款狀態」與「前往付款」按鈕；從綠界導回時自動觸發付款狀態查詢

## [1.0.0] - 2026-04-12

### 新增
- 使用者註冊、登入、個人資料 API
- 商品列表與詳情 API（公開）
- 購物車 CRUD API（雙模式認證：JWT / X-Session-Id）
- 訂單建立、查詢、模擬付款 API
- 後台商品管理 API（CRUD）
- 後台訂單查詢 API（含狀態篩選）
- EJS 前台頁面（首頁、商品詳情、購物車、結帳、訂單）
- EJS 後台頁面（商品管理、訂單管理）
- SQLite 資料庫自動初始化與種子資料
- Vitest 測試套件（6 個測試檔案，循序執行）
- Swagger/OpenAPI 文件生成
- Tailwind CSS 樣式系統
- 專案文件結構建立
