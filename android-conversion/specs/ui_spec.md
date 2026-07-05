# 前端 UI 規格 (Jetpack Compose)

## 1. 畫面結構圖 (Compose Tree)
```text
WeatherAppTheme
└── Scaffold
    ├── TopBar: SearchBar (城市搜尋 + 定位按鈕)
    └── Content: Box (包含動態背景與主要內容)
        ├── WeatherBackground (7種天氣動態效果)
        └── LazyColumn (可捲動的主要內容)
            ├── CurrentWeatherCard (大卡片：溫度、城市、日期、天氣圖示)
            │   └── ActionRow (收藏⭐、語音🔊、分享📤)
            ├── WeatherDetailsGrid (3欄：濕度、風速、體感、日出、日落、降雨)
            ├── EnvironmentGrid (2欄：AQI、UV)
            ├── HourlyForecastRow (LazyRow: 24小時預報)
            ├── TemperatureChart (Vico 圖表)
            └── DailyForecastList (7天預報卡片)
```

## 2. 關鍵 Composable 規格

### `CurrentWeatherCard`
- **API**: `Card`, `Column`, `Row`, `Text`, `Icon`
- **Modifier**: `fillMaxWidth()`, `padding(16.dp)`, `background(Color.White.copy(alpha=0.85f))`, `blur(10.dp)` (Glassmorphism 效果)
- **內容**: 顯示5rem大字體的溫度，天氣描述與對應圖示。

### `WeatherBackground`
- **API**: `Canvas` + `InfiniteTransition`
- **實作**: 根據傳入的 `WeatherType` 繪製不同的動畫。

## 3. Material3 系統主題
使用 `lightColorScheme` 與 `darkColorScheme` 定義主題顏色，並結合 Noto Sans TC。
Glassmorphism 效果透過 Modifier.blur 加上半透明表面顏色達成。

## 4. 動畫實作 (Canvas + InfiniteTransition)
- **Sunny**: `drawCircle` + 旋轉的光芒 (`drawPath`)
- **Rainy**: `drawLine` 繪製多條直線，Y軸由上往下移動 (`animateFloatAsState`)
- **Cloudy**: `drawPath` 繪製雲朵形狀，X軸緩慢移動
- **Night**: `drawCircle` 繪製星星，透明度閃爍
- **Snowy**: `drawCircle` (白色) 配合旋轉與 Y軸移動
- **Foggy**: 繪製半透明矩形或雲霧漸層，X軸緩慢平移
- **Thunderstorm**: Rainy 動畫加上隨機全螢幕閃白 (`drawRect` with alpha)
