# API 整合指令集

如果 API 連線或資料解析有問題，使用以下 Prompt：

1. **修正 JSON 對應**
   > Open-Meteo 的 JSON 回傳包含 `hourly` 和 `daily` 物件，裡面的資料是陣列。請確保 Kotlin 的 data class 正確對應，例如 `val time: List<String>`, `val temperature_2m: List<Double>`。請在 ViewModel 中將這些轉換為 List<HourlyItem> 讓 Compose 方便使用。

2. **加入 Retry 攔截器**
   > 請在建立 OkHttpClient 時加入一個 Interceptor，當請求失敗或超時時，自動延遲 1 秒並重試，最多重試 2 次。

3. **錯誤狀態 UI 處理**
   > 請在 ViewModel 中使用 Sealed Class 定義 UI State (Loading, Success, Error)。如果處於 Error 狀態，請在畫面上顯示一個帶有「重試」按鈕的錯誤訊息提示框。
