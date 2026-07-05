# Google AI Studio - Master Prompt for Weather App

請將以下內容直接貼入 Google AI Studio (Android Build Mode)：

---

請幫我建立一個 Android 原生天氣應用程式（Weather App），使用 Kotlin 與 Jetpack Compose 實作，並遵循 Material Design 3 (M3) 規範。
這是一個完整的氣象應用，必須使用 MVVM 架構、Retrofit 進行網路請求、協程 (Coroutines) 及 StateFlow 進行狀態管理，並具備深/淺色主題支援。

## 1. 核心功能與資料來源
使用免費且免金鑰的 Open-Meteo API：
- **天氣**: `https://api.open-meteo.com/v1/forecast` (包含當前天氣、24小時預報、7天預報、日出/日落、紫外線指數 UV_Index)
- **空氣品質**: `https://air-quality-api.open-meteo.com/v1/air-quality` (取得 AQI)
- **地理編碼**: `https://geocoding-api.open-meteo.com/v1/search` (供城市搜尋)

## 2. 畫面結構 (UI Components)
- **頂部搜尋列**: 包含文字輸入框（支援輸入城市）與一個「定位」圖示按鈕（點擊取得 GPS 座標）。需有下拉選單顯示搜尋結果。
- **背景特效**: 依據當前天氣代碼（0~99），背景使用 Compose Canvas 繪製對應的天氣動畫（晴天太陽光芒、雨天雨滴下落、陰天雲朵飄動、夜晚星星閃爍、雪天雪花落下、雷雨天閃電效果）。
- **當前天氣大卡片**: 置中顯示特大字體的溫度、城市名稱、日期，以及天氣描述。卡片需具有 Glassmorphism（毛玻璃半透明）效果 (`Modifier.blur`)。卡片下方有三個按鈕：加入收藏、語音播報、分享。
- **天氣細節網格**: 顯示濕度、風速、體感溫度、日出、日落、降雨機率。
- **環境指標區塊**: 兩個並排卡片顯示 AQI 空氣品質指數與 UV 紫外線指數。
- **24小時預報**: 使用 `LazyRow` 橫向捲動顯示每小時的溫度與圖示。
- **溫度趨勢圖**: 使用 Vico 或直接用 Canvas 繪製 24 小時的溫度折線圖。
- **7天預報**: 垂直清單顯示未來一週的天氣概況與最高/最低溫。

## 3. 技術與架構要求
- 所有的資料模型需使用 Kotlin `data class`。
- API 呼叫需封裝在 `Repository`，並在 ViewModel 中使用 `viewModelScope` 發起請求。
- 請實作網路請求失敗的 Retry 機制（最多重試 2 次）。
- 本地資料儲存（收藏的城市清單、主題偏好設定）使用 Jetpack DataStore 或 Room Database。
- 使用 `FusedLocationProviderClient` 取得 GPS 位置。
- 使用 Android 內建的 `TextToSpeech` 實作語音播報功能。

## 4. 主題與顏色 (Material 3)
請定義以下色彩系統：
- Light: 背景 `#f0f4f8`, 卡片表面 `rgba(255,255,255,0.85)`
- Dark: 背景 `#0d1117`, 卡片表面 `rgba(30,41,59,0.85)`
強調色使用 `#4a90d9` (Light) / `#60a5fa` (Dark)。

請產生完整的專案架構，包含所有的 Composable 函數、ViewModel、Repository 及網路層介面。
---
