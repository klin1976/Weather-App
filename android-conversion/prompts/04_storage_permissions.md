# 儲存與權限指令集

用於完善原生硬體功能與本地儲存：

1. **實作位置權限**
   > 請使用 Accompanist Permissions 處理 `ACCESS_FINE_LOCATION` 權限。當使用者點擊定位按鈕時，如果沒有權限，跳出權限請求；如果有權限，使用 `FusedLocationProviderClient` 取得經緯度，並更新 ViewModel。

2. **實作 Text-to-Speech (TTS)**
   > 請建立一個 `TtsManager` 類別，初始化 `TextToSpeech` 並設定 `Locale.TAIWAN`。當使用者點擊語音按鈕時，將目前的城市、溫度與天氣狀況組合成長字串，傳入 TTS 進行語音播報。

3. **實作城市收藏 (DataStore)**
   > 請使用 Jetpack DataStore preferences 儲存使用者收藏的城市清單（可以將 List<City> 轉為 JSON String 儲存）。請提供新增與刪除收藏的函數。
