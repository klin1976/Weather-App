# 後端 API 與資料模型規格

## 1. Kotlin 資料模型
```kotlin
data class WeatherResponse(
    @SerializedName("current") val current: CurrentWeather,
    @SerializedName("hourly") val hourly: HourlyWeather,
    @SerializedName("daily") val daily: DailyWeather
)
// 包含對應的內部資料類別
```

## 2. Retrofit 介面
```kotlin
interface WeatherApiService {
    @GET("v1/forecast")
    suspend fun getForecast(
        @Query("latitude") lat: Double,
        @Query("longitude") lon: Double,
        // ... 其他參數
    ): WeatherResponse
}
```

## 3. Repository 層
使用 `WeatherRepository` 封裝 Retrofit 呼叫。
實作 OkHttp `Interceptor` 進行失敗重試：
```kotlin
class RetryInterceptor(private val maxRetries: Int = 2) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        // 重試邏輯與 delay
    }
}
```

## 4. ViewModel 狀態管理
```kotlin
@HiltViewModel
class WeatherViewModel @Inject constructor(
    private val repository: WeatherRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow<WeatherUiState>(WeatherUiState.Loading)
    val uiState: StateFlow<WeatherUiState> = _uiState.asStateFlow()
}
```
