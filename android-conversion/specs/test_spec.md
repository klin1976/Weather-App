# 測試與發佈規格

## 1. 測試策略
- **單元測試**: 針對 ViewModel 與資料轉換邏輯使用 JUnit4 + MockK。
- **UI 測試**: Compose UI 測試 (`composeTestRule`) 驗證元件是否存在與點擊互動。
- **整合測試**: 針對 Repository 使用 MockWebServer 模擬 Open-Meteo API 回應。

## 2. 實機測試清單
- [ ] GPS 權限定位是否準確取得天氣
- [ ] TTS 語音播報是否為中文
- [ ] 截圖分享功能是否成功呼叫系統選單
- [ ] 主題切換是否平滑且顏色正確
- [ ] 動畫效能是否順暢 (60fps)

## 3. Play Store 發佈準備
- 應用程式圖示 (512x512)
- Feature Graphic (1024x500)
- 至少 4 張手機螢幕截圖
- 無隱藏廣告宣告
- 隱私權政策 (需提及位置資訊使用與 Open-Meteo 第三方服務)
