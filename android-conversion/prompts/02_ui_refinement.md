# UI 精修指令集 (逐步貼入 AI Studio)

如果在 Master Prompt 生成後 UI 還有需要微調，可逐步使用以下 Prompt：

1. **強化毛玻璃效果 (Glassmorphism)**
   > 請修改 `CurrentWeatherCard` 與所有的細節卡片，確保其背景顏色為 `Color.White.copy(alpha = 0.2f)` (淺色) 或 `Color.Black.copy(alpha = 0.2f)` (深色)，並加上 `Modifier.blur(16.dp)`，讓卡片呈現強烈的毛玻璃質感。

2. **優化天氣動畫背景**
   > 請為背景建立一個獨立的 `WeatherBackground` Composable，使用 `Canvas` 和 `InfiniteTransition`。如果是下雨 (代碼 61-65)，畫出由上往下移動的藍色直線；如果是晴天 (代碼 0-1)，畫出黃色圓形並有旋轉的光芒；如果是晚上，畫出閃爍的白色小圓點代表星星。

3. **實作橫向預報清單**
   > 請確保 24 小時預報是使用 `LazyRow`，每個 Item 之間要有 `16.dp` 的間距。確保時間格式顯示為 `HH:mm`。

4. **折線圖實作**
   > 請在 24 小時預報下方加入一個溫度趨勢圖，使用 `Canvas` 繪製一條平滑曲線 (貝茲曲線)，X 軸為時間，Y 軸為溫度，並在曲線下方填滿漸層色。
