# Weather App - Android 轉換專案

這是一個將原生 HTML/JS/CSS 天氣應用程式，轉換為 Android APK 的專案。我們採用 **Google AI Studio (Build Mode)**，利用 Generative AI 在雲端自動編譯 Kotlin 與 Jetpack Compose。

## 如何使用此專案生成 Android App？

1. 前往 [Google AI Studio](https://aistudio.google.com/)。
2. 在左側面板選擇 **Build** 模式。
3. 平台選擇 **Android**。
4. 開啟本專案的 `prompts/01_master_prompt.md`，將內容完全複製。
5. 貼入 AI Studio 的輸入框並送出。
6. 等待 AI 生成完整的 Kotlin 專案。
7. 在右側的**瀏覽器模擬器 (Browser Emulator)** 中檢視並測試 App。

## 迭代與精修
如果生成的 App 缺少功能或 UI 需要調整，請參考 `prompts/02_ui_refinement.md` 到 `04_storage_permissions.md` 中的精修指令。
直接在 AI Studio 的對話框中貼上對應的修正指令即可。

## 實機測試與匯出 APK
1. 在 AI Studio 中，點擊右側的 **Get code** 或 **Deploy** 按鈕。
2. 如果你的電腦有連接 Android 手機（需開啟 USB 偵錯），可透過 WebADB 直接安裝到手機上。
3. 若需要發佈至 Play Store 或進階開發，可以將專案匯出（Export）為 Android Studio 專案。
4. 參考 `prompts/06_playstore_submission.md` 準備上架所需的圖文與隱私權政策。
