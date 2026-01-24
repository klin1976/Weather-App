# 🌦️ Skeuomorphic Weather App

![Weather App Demo](file:///C:/Users/Admin/.gemini/antigravity/brain/3e161570-5e67-46d0-a85c-42325a53576a/uploaded_media_1769261430673.png)

一個基於原生 HTML/CSS/JS 開發的精緻氣象應用程式。採用**擬物動態風 (Skeuomorphic + Animation)** 設計，將天氣變化以生動的動畫呈現，並提供多樣化的進階天氣數據與互動功能。

## ✨ 特色功能

### 1. 擬物擬動態背景
- 根據當前或搜尋城市的天氣狀況，自動切換對應的動態動畫：
  - **晴天**: 太陽光芒與耀斑效果
  - **雨天**: 雨滴下落與粒子碰撞
  - **多雲**: 雲朵緩緩漂動
  - **夜間**: 月亮切換與星星閃爍
  - **下雪**: 輕盈雪花飄落
  - **雷暴**: 隨機閃電效果

### 2. 核心氣象資訊
- **精準搜尋**: 支援台灣城市中文搜尋（自動轉換英文 API 查詢）與國外城市搜尋。
- **定位功能**: 一鍵偵測當前位置天氣。
- **7 天預報**: 未來一週的天氣趨勢與圖示。
- **詳細面板**: 包含濕度、風速、體感溫度、日出/日落時間、降雨機率。

### 3. 進階進階功能
- **逐時預報 (Hourly)**: 未來 24 小時的詳細天氣卡片（可橫向捲動）。
- **溫度趨勢圖 (Charts)**: 使用 **Chart.js** 視覺化呈現未來 24 小時溫度變化。
- **環境數據 (UV & AQI)**:
  - 紫外線指數等級與顏色提醒。
  - 空氣品質 (AQI) 即時監控。
- **收藏城市**: 點擊 `⭐` 即可將常用城市儲存至本地 (LocalStorage)。
- **語音播報 (Voice)**: 透過 Web Speech API 朗讀當前天氣狀況。
- **一鍵分享**: 整合 **html2canvas**，可將精美的天氣卡片畫面截圖下載。

---

## 🛠️ 技術架構

- **前端核心**: Vanilla HTML5, CSS3, JavaScript (ES6+).
- **天氣 API**: [Open-Meteo API](https://open-meteo.com/) (Free, No Key required).
- **資料視覺化**: [Chart.js](https://www.chartjs.org/).
- **截圖處理**: [html2canvas](https://html2canvas.hertzen.com/).
- **設計風格**: 毛玻璃效果 (Glassmorphism) + 深色/淺色模式自動切換 (儲存偏好)。

---

## 🚀 快速開始

1. **複製儲存庫**:
   ```bash
   git clone https://github.com/klin1976/Weather-App.git
   ```

2. **直接開啟**:
   進入資料夾後，直接使用瀏覽器開啟 `index.html` 即可運行。或者使用簡易伺服器：
   ```bash
   npx serve .
   ```

3. **瀏覽體驗**:
   造訪 `http://localhost:3000` 即可開始使用。

---

## 📸 介面展示

- **深色模式**: 精緻的毛玻璃卡片與星空背景。
- **淺色模式**: 清爽的澄淨天空與內容展示。
- **互動卡片**: 滑鼠懸停細節卡的動態提升效果。

---

## 📝 開發歷程
本專案為一個完整的作品集展示，從基礎的 API 串接、UI 動畫設計到進階的第三方庫整合（圖表、截圖、語音），旨在展示如何使用最紮實的原生技術開發出具備現代感且功能強大的 Web App。

---

## 📜 授權
MIT License. 可作為學習與個人作品集參考。

Powerd by **Antigravity AI**.
