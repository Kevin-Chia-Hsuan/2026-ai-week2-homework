---
name: e2e-ecpay-checkout
description: 以 Playwright MCP 跑花卉電商的 E2E 結帳測試：登入 → 加購物車 → 結帳 → 綠界 stage 網路ATM／台灣土地銀行 → 模擬付款 → 訂單已付款，結束必附 3 張關鍵截圖。觸發語：「E2E 測試」「跑綠界流程」「測結帳」「測金流」。
---

# E2E：綠界網路ATM（台灣土地銀行）結帳流程

使用 Playwright MCP（`mcp__playwright__*`）。若工具為 deferred，先以 ToolSearch 載入：
`select:mcp__playwright__browser_navigate,browser_snapshot,browser_click,browser_fill_form,browser_select_option,browser_find,browser_take_screenshot,browser_wait_for`

## 0. 前置

1. 讀 `.env`：帳號 `ADMIN_EMAIL`、密碼 `ADMIN_PASSWORD`。**不得把密碼寫進回報、截圖檔名或任何檔案。**
2. 取台北時間作為截圖資料夾名：
   ```bash
   TS=$(TZ=Asia/Taipei date +%Y%m%d-%H%M%S)
   SHOT_DIR="$PWD/docs/e2e-screenshots/$TS" && mkdir -p "$SHOT_DIR" && echo "$SHOT_DIR"
   ```
3. 檢查 30001：`lsof -iTCP:30001 -sTCP:LISTEN`。
   - 已在跑：沿用，結束時**不**關閉。
   - 未在跑：背景啟動，並記下「是我啟動的」：
     ```bash
     PORT=30001 BASE_URL=http://localhost:30001 node server.js
     ```
     `BASE_URL` 必須一併覆蓋，否則綠界「返回商店」會回到 `.env` 的 3001。
   - 不改 `.env`，不動 3001 的程序。

## 1. 流程

| # | 動作 | 要點 |
|---|------|------|
| 1 | 開 `http://localhost:30001/login`，填 Email、密碼，按表單內「登入」 | 成功後導回 `/` |
| 2 | 首頁「探索所有花藝」區任一「加入購物車」 | 實測用「迷你多肉組合盆」NT$ 580（滿 500 免運） |
| 3 | 開 `/cart`，確認 1 件，按「前往結帳」 | |
| 4 | `/checkout` 填收件人、Email、地址，按「確認送出訂單」 | 測試值：測試用戶／帳號 Email／台北市信義區測試路 1 號。頁面有兩顆同名按鈕（手機版、桌機版），選擇器要加 `>> visible=true` 只點可見者 |
| 5 | 導向 `payment-stage.ecpay.com.tw` 後，點付款方式「網路ATM」（WebATM） | 使用者口稱的「ATM 網路交易」即此項；**不是**「ATM虛擬帳號」（無銀行可選、不即時付款） |
| 6 | 銀行下拉選「台灣土地銀行」 | `browser_select_option`，target 用 `#selWebATMBank`，值為 `台灣土地銀行`（非「臺灣」）。`#selATMBank` 屬「ATM虛擬帳號」，不可選錯；用 `select:has(option…)` 會命中兩個而失敗 |
| 7 | **截圖①** `01-ecpay-webatm-land-bank.png`（fullPage） | 需見「網路ATM」反白＋銀行欄為台灣土地銀行 |
| 8 | 點 `#WebATMPaySubmit`（前往付款） | 用文字比對會命中 6 個元素而失敗，務必用此 id |
| 9 | 出現提醒對話框 → 點「關閉」 | 之後跳到 `pay-stage.ecpay.com.tw/MockMPPost/LandWebAtm` |
| 10 | 確認 `RC=0`、`MSG=交易成功`，按「Save」 | 這是綠界 stage 的模擬銀行回傳。Save 不是 `<button>`，用 `input[value="Save"]` 點 |
| 11 | 進入「付款成功」頁，**截圖②** `02-ecpay-payment-success.png` | 頁面應顯示訂單編號、付款方式「網路ATM」 |
| 12 | 點「返回商店」 | 回到 `localhost:30001/orders/<id>?payment=pending` |
| 13 | 確認訂單頁有綠色「付款成功！」與「已付款」標籤，**截圖③** `03-order-paid.png`（fullPage） | |

截圖用 `browser_take_screenshot`，`filename` 給 `$SHOT_DIR` 下的**絕對路徑**。

## 2. 收尾

1. 若伺服器是本次啟動的：`kill $(lsof -tiTCP:30001 -sTCP:LISTEN)`。背景任務隨之回報 exit 143 屬正常，非故障。
2. **回報必須包含**：
   - 步驟結果表（成功／失敗）與訂單編號。
   - **3 張截圖的完整絕對路徑**（缺任何一張即視為測試未完成）。
   - 兩點聲明：付款是 stage 模擬、無真實扣款；未另行驗證庫存扣減與購物車清空（除非有額外查 API／DB）。
3. 可選：`browser_console_messages` 檢視 console error，有則一併列出。

## 3. 失敗處理

- 任一步卡住：立即 `browser_take_screenshot` 留證（存同一資料夾，檔名 `FAIL-<步驟>.png`），回報卡點與頁面狀態，**不硬闖、不繞過驗證**。
- 綠界 stage 若出現驗證碼或改版：停下回報，與使用者討論。
- 登入失敗：先確認 `.env` 密碼，勿猜測其他帳密。
