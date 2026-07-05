# Weather App - Antigravity 專案設定

## 專案工作模式（固定入口）

**專案名稱：** Weather App  
**專案用途：** 精緻的天氣應用程式，提供即時天氣資訊、24 小時與 7 天預報，整合空氣品質 (AQI)、紫外線指數 (UV Index)、溫度趨勢圖 (Chart.js)、截圖分享 (html2canvas) 與 Web Speech API 語音播報  
**主要工作目錄：** 專案根目錄（d:\klin\Antigravity\Weather）  
**預設 branch：** main（以目前 Git 狀態為準，不自動切換 branch）

### 同步規則

**開工時：** 使用系統啟動同步，讀取本檔 `AGENTS.md` 與對話紀錄 `ConversationRecord.txt` / `ConversationRecord.md`，檢查 Git 狀態。  
**收工時：** 更新 `ConversationRecord.txt` 與 `ConversationRecord.md`，將變更 commit 並自動推送至 GitHub。  
**新專案初始化時：** 若缺少核心規則文件，自動補齊 `AGENTS.md` 與 `ConversationRecord.md`。

### 不動作

- 不要把每日進度寫進 AGENTS.md。
- 不要建立第二份 canonical API spec。
- 不要自動納入無關 Git 變更。
- 不要寫入 secrets 或正式 API Keys（優先採用免金鑰之公開 API）。

---

## API 規格維護規則

本專案使用以下公開 API 進行天氣與環境資料抓取：
- **主要天氣資料 (Open-Meteo)**：
  - **Endpoint**: `https://api.open-meteo.com/v1/forecast`
  - **參數**: `latitude`, `longitude`, `current_weather=true`, `hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,weathercode,uv_index`, `daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max`, `timezone=auto`
- **空氣品質資料 (Open-Meteo Air Quality)**：
  - **Endpoint**: `https://air-quality-api.open-meteo.com/v1/air-quality`
  - **參數**: `latitude`, `longitude`, `hourly=european_aqi`

若 API 欄位、參數或資料解析邏輯改變，必須同步更新 `AGENTS.md` 中的規格定義。

---

## 專案核心架構與約束

1. **核心技術棧**：原生 HTML5 + CSS3 (Vanilla CSS) + JavaScript (Vanilla JS)。
2. **外部套件 (經由 CDN 載入)**：
   - Chart.js (繪製溫度趨勢圖)
   - html2canvas (實作天氣分享截圖)
3. **部署環境**：GitHub Pages 靜態網站部署 (`https://klin1976.github.io/Weather-App/`)。
4. **容錯設計**：API 呼叫配置了 `try/catch` 捕捉與 Retry（失敗自動重試兩次）機制，確保離線或弱網環境下的穩定度。

## 已完成的開發階段

- **Phase 1**：實作基礎天氣查詢、紫外線指數 (UV Index) 顏色標示與 24 小時橫向捲動預報。
- **Phase 2**：串接空氣品質 (AQI) API、透過 LocalStorage 實作多城市收藏，以及整合 Web Speech API 進行語音播報。
- **Phase 3**：引入 Chart.js 溫度趨勢圖、html2canvas 截圖分享，以及天氣警報整合，並發佈至 GitHub Pages。
- **Phase 4 (優化)**：
  - 在 UI 中為 AQI 與 UV Index 新增獨立精緻的環境卡片。
  - 優化 `[data-theme="dark"]` 深色主題的平滑 CSS 過渡動畫。
  - 在 `app.js` 中重構 `fetch` 邏輯，加入 Robust Error Handling 與自動重試兩次機制。

## 工作流規範

- **開工流程**：讀取 `AGENTS.md`、`ConversationRecord.txt`、`git status`、回報狀態。
- **收工流程**：檢查 Git 變更、更新 `ConversationRecord.txt` 與 `ConversationRecord.md`、執行 commit 並推送至 GitHub 觸發 Pages 自動部署。
