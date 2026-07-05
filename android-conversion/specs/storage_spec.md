# 資料儲存與權限規格

## 1. Jetpack DataStore (Preferences)
儲存使用者的深淺色主題偏好與最近查詢的城市。
```kotlin
val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")
```

## 2. Room Database (收藏城市與快取)
- **Entity**: `SavedCity(id, name, lat, lon)`
- **DAO**: 提供 `insert`, `delete`, `getAllCities` 查詢
- 提供離線快取能力（保留最近一次查詢的完整 JSON）

## 3. 權限與位置服務
- 在 `AndroidManifest.xml` 加入：
  - `INTERNET`
  - `ACCESS_FINE_LOCATION`
  - `ACCESS_COARSE_LOCATION`
- 使用 Google Play Services `FusedLocationProviderClient` 取得 GPS 座標。
- 使用 Accompanist Permissions 請求權限。

## 4. TextToSpeech 與截圖分享
- **TTS**: 初始化 `android.speech.tts.TextToSpeech` 並設定 `Locale.TAIWAN`。
- **Share**: 使用 `PixelCopy` API 從 Compose 的 View 抓取 Bitmap，再透過 `FileProvider` 與 `Intent.ACTION_SEND` 分享。
