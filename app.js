/**
 * Weather App - 主程式
 * 使用 Open-Meteo API
 */

// ==================== 常數與設定 ====================
const API_BASE = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const AIR_QUALITY_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';

// 天氣代碼對應圖示與描述
const WEATHER_CODES = {
    0: { icon: '☀️', desc: '晴朗', animation: 'sunny' },
    1: { icon: '🌤️', desc: '大致晴朗', animation: 'sunny' },
    2: { icon: '⛅', desc: '局部多雲', animation: 'cloudy' },
    3: { icon: '☁️', desc: '多雲', animation: 'cloudy' },
    45: { icon: '🌫️', desc: '霧', animation: 'foggy' },
    48: { icon: '🌫️', desc: '霧凇', animation: 'foggy' },
    51: { icon: '🌧️', desc: '毛毛雨', animation: 'rainy' },
    53: { icon: '🌧️', desc: '中等毛毛雨', animation: 'rainy' },
    55: { icon: '🌧️', desc: '強毛毛雨', animation: 'rainy' },
    61: { icon: '🌧️', desc: '小雨', animation: 'rainy' },
    63: { icon: '🌧️', desc: '中雨', animation: 'rainy' },
    65: { icon: '🌧️', desc: '大雨', animation: 'rainy' },
    66: { icon: '🌨️', desc: '凍雨', animation: 'snowy' },
    67: { icon: '🌨️', desc: '強凍雨', animation: 'snowy' },
    71: { icon: '❄️', desc: '小雪', animation: 'snowy' },
    73: { icon: '❄️', desc: '中雪', animation: 'snowy' },
    75: { icon: '❄️', desc: '大雪', animation: 'snowy' },
    77: { icon: '❄️', desc: '雪粒', animation: 'snowy' },
    80: { icon: '🌦️', desc: '陣雨', animation: 'rainy' },
    81: { icon: '🌦️', desc: '中等陣雨', animation: 'rainy' },
    82: { icon: '🌦️', desc: '強陣雨', animation: 'rainy' },
    85: { icon: '🌨️', desc: '陣雪', animation: 'snowy' },
    86: { icon: '🌨️', desc: '強陣雪', animation: 'snowy' },
    95: { icon: '⛈️', desc: '雷陣雨', animation: 'thunderstorm' },
    96: { icon: '⛈️', desc: '雷陣雨伴小冰雹', animation: 'thunderstorm' },
    99: { icon: '⛈️', desc: '雷陣雨伴大冰雹', animation: 'thunderstorm' },
};

// 台灣城市中英文對照 (Open-Meteo API 不支援中文搜尋)
const TAIWAN_CITIES = {
    '台北': 'Taipei',
    '臺北': 'Taipei',
    '新北': 'New Taipei',
    '桃園': 'Taoyuan',
    '台中': 'Taichung',
    '臺中': 'Taichung',
    '台南': 'Tainan',
    '臺南': 'Tainan',
    '高雄': 'Kaohsiung',
    '基隆': 'Keelung',
    '新竹': 'Hsinchu',
    '嘉義': 'Chiayi',
    '宜蘭': 'Yilan',
    '花蓮': 'Hualien',
    '台東': 'Taitung',
    '臺東': 'Taitung',
    '屏東': 'Pingtung',
    '南投': 'Nantou',
    '雲林': 'Yunlin',
    '彰化': 'Changhua',
    '苗栗': 'Miaoli',
    '澎湖': 'Penghu',
    '金門': 'Kinmen',
    '馬祖': 'Matsu',
};

// ==================== DOM 元素 ====================
const elements = {
    cityInput: document.getElementById('city-input'),
    searchBtn: document.getElementById('search-btn'),
    locationBtn: document.getElementById('location-btn'),
    searchResults: document.getElementById('search-results'),
    weatherBg: document.getElementById('weather-bg'),
    cityName: document.getElementById('city-name'),
    currentDate: document.getElementById('current-date'),
    currentTemp: document.getElementById('current-temp'),
    weatherIcon: document.getElementById('weather-icon'),
    weatherDesc: document.getElementById('weather-desc'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
    feelsLike: document.getElementById('feels-like'),
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    precipitation: document.getElementById('precipitation'),
    uvValue: document.getElementById('uv-value'),
    uvDesc: document.getElementById('uv-desc'),
    aqiValue: document.getElementById('aqi-value'),
    aqiDesc: document.getElementById('aqi-desc'),
    hourlyContainer: document.getElementById('hourly-container'),
    forecastContainer: document.getElementById('forecast-container'),
    themeToggle: document.getElementById('theme-toggle'),
};

// ==================== 狀態管理 ====================
let currentLocation = { lat: null, lon: null, name: '' };
let isDarkMode = false;
let searchTimeout = null;

// 安全讀取 localStorage，避免因禁用或資料損壞導致異常
let savedCities = [];
try {
    savedCities = JSON.parse(localStorage.getItem('weatherAppSavedCities')) || [];
} catch (e) {
    console.warn('無法讀取收藏城市:', e);
}
let chartInstance = null;

// ==================== 初始化 ====================
function init() {
    // 載入儲存的主題
    const savedTheme = localStorage.getItem('weatherAppTheme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    }

    // 綁定事件
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.locationBtn.addEventListener('click', handleGeolocation);
    elements.cityInput.addEventListener('input', handleInputChange);
    elements.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    elements.themeToggle.addEventListener('click', toggleTheme);

    // 收藏與語音播報
    const saveCityBtn = document.getElementById('save-city-btn');
    const speakBtn = document.getElementById('speak-btn');
    if (saveCityBtn) saveCityBtn.addEventListener('click', saveCity);
    if (speakBtn) speakBtn.addEventListener('click', speakWeather);

    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) shareBtn.addEventListener('click', shareWeather);

    // 點擊其他地方關閉搜尋結果
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-section')) {
            elements.searchResults.classList.add('hidden');
        }
    });

    // 輸入框失焦時隱藏搜尋結果
    elements.cityInput.addEventListener('blur', () => {
        setTimeout(() => {
            elements.searchResults.classList.add('hidden');
        }, 200);
    });

    // 預設載入台北天氣 (直接呼叫 API，不顯示搜尋結果)
    loadDefaultCity();

    // 更新日期
    updateCurrentDate();
}

// ==================== API 函數 ====================

/**
 * 載入預設城市 (台北)
 */
async function loadDefaultCity() {
    try {
        const response = await fetch(
            `${GEOCODING_API}?name=台北&count=1&language=zh`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const city = data.results[0];
            currentLocation = {
                lat: city.latitude,
                lon: city.longitude,
                name: `${city.name}, ${city.country}`
            };
            elements.cityName.textContent = currentLocation.name;
            fetchWeather(city.latitude, city.longitude);
        }
    } catch (error) {
        console.error('載入預設城市失敗:', error);
        showError('無法載入預設城市，請手動搜尋');
    }
}

/**
 * 搜尋城市
 */
async function searchCity(query) {
    if (!query.trim()) return;

    // 檢查是否為台灣城市中文名稱
    let searchQuery = query.trim();
    if (TAIWAN_CITIES[searchQuery]) {
        searchQuery = TAIWAN_CITIES[searchQuery];
    }

    try {
        const response = await fetch(
            `${GEOCODING_API}?name=${encodeURIComponent(searchQuery)}&count=10&language=zh`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            // 優先排序：台灣 > 其他國家
            const sortedResults = data.results.sort((a, b) => {
                const aIsTaiwan = a.country === 'Taiwan' || a.country === '中華民國' || a.country_code === 'TW';
                const bIsTaiwan = b.country === 'Taiwan' || b.country === '中華民國' || b.country_code === 'TW';
                if (aIsTaiwan && !bIsTaiwan) return -1;
                if (!aIsTaiwan && bIsTaiwan) return 1;
                return 0;
            });
            displaySearchResults(sortedResults.slice(0, 5));
        } else {
            elements.searchResults.innerHTML = '<div class="search-result-item">找不到此城市</div>';
            elements.searchResults.classList.remove('hidden');
        }
    } catch (error) {
        console.error('搜尋城市失敗:', error);
    }
}

/**
 * 取得天氣資料
 */
async function fetchWeather(lat, lon, retries = 2) {
    try {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index',
            hourly: 'temperature_2m,weather_code,precipitation_probability',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max',
            timezone: 'auto',
            forecast_days: 7,
            forecast_hours: 24
        });

        const response = await fetch(`${API_BASE}?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        updateWeatherUI(data);
        fetchAirQuality(lat, lon); // 同時取得空氣品質
        return data;
    } catch (error) {
        console.error(`取得天氣資料失敗 (${3 - retries}/3):`, error);
        if (retries > 0) {
            console.log(`正在重試天氣資料... 剩餘次數: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchWeather(lat, lon, retries - 1);
        }
        showError('無法取得天氣資料，請檢查網路連線後重試');
    }
}

/**
 * 取得空氣品質資料
 */
async function fetchAirQuality(lat, lon, retries = 2) {
    try {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'pm10,pm2_5,us_aqi'
        });

        const response = await fetch(`${AIR_QUALITY_API}?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data.current) {
            const aqi = Math.round(data.current.us_aqi || 0);
            const aqiLevel = getAQILevel(aqi);
            const aqiColor = getAQIColor(aqi);

            if (elements.aqiValue && elements.aqiDesc) {
                elements.aqiValue.textContent = aqi;
                elements.aqiDesc.textContent = aqiLevel;
                elements.aqiValue.style.color = aqiColor;
                elements.aqiDesc.style.color = aqiColor;
            }
        }
    } catch (error) {
        console.error(`取得空氣品質失敗 (${3 - retries}/3):`, error);
        if (retries > 0) {
            console.log(`正在重試空氣品質... 剩餘次數: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchAirQuality(lat, lon, retries - 1);
        }
        if (elements.aqiValue && elements.aqiDesc) {
            elements.aqiValue.textContent = 'N/A';
            elements.aqiDesc.textContent = '--';
        }
    }
}

// ==================== UI 更新函數 ====================

/**
 * 顯示搜尋結果
 */
function displaySearchResults(results) {
    elements.searchResults.innerHTML = results.map(city => `
        <div class="search-result-item" 
             data-lat="${city.latitude}" 
             data-lon="${city.longitude}"
             data-name="${city.name}${city.admin1 ? ', ' + city.admin1 : ''}, ${city.country}">
            <strong>${city.name}</strong>
            <span style="color: var(--text-muted); font-size: 0.85rem;">
                ${city.admin1 ? city.admin1 + ', ' : ''}${city.country}
            </span>
        </div>
    `).join('');

    elements.searchResults.classList.remove('hidden');

    // 綁定點擊事件
    elements.searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const lat = item.dataset.lat;
            const lon = item.dataset.lon;
            const name = item.dataset.name;

            currentLocation = { lat, lon, name };
            elements.cityName.textContent = name;
            elements.cityInput.value = '';
            elements.searchResults.classList.add('hidden');

            fetchWeather(lat, lon);
        });
    });
}

/**
 * 更新天氣 UI
 */
function updateWeatherUI(data) {
    const current = data.current;
    const daily = data.daily;

    // 當前天氣
    const weatherInfo = WEATHER_CODES[current.weather_code] || { icon: '❓', desc: '未知', animation: 'cloudy' };

    elements.currentTemp.textContent = Math.round(current.temperature_2m);
    elements.currentTemp.classList.add('temp-change');
    setTimeout(() => elements.currentTemp.classList.remove('temp-change'), 300);

    elements.weatherIcon.textContent = weatherInfo.icon;
    elements.weatherDesc.textContent = weatherInfo.desc;

    // 詳細資訊
    elements.humidity.textContent = `${current.relative_humidity_2m}%`;
    elements.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    elements.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
    elements.sunrise.textContent = formatTime(daily.sunrise[0]);
    elements.sunset.textContent = formatTime(daily.sunset[0]);
    elements.precipitation.textContent = `${daily.precipitation_probability_max[0] || 0}%`;

    // 紫外線指數
    const uvIndex = Math.round(daily.uv_index_max[0] || 0);
    if (elements.uvValue && elements.uvDesc) {
        elements.uvValue.textContent = uvIndex;
        elements.uvDesc.textContent = getUVLevel(uvIndex);
        elements.uvValue.style.color = getUVColor(uvIndex);
        elements.uvDesc.style.color = getUVColor(uvIndex);
    }

    // 每小時預報
    updateHourlyForecast(data.hourly);

    // 更新圖表
    updateChart(data.hourly);

    // 7 天預報
    updateForecast(daily);

    // 更新背景動畫
    updateWeatherAnimation(weatherInfo.animation, isNightTime(daily.sunrise[0], daily.sunset[0]));
}

/**
 * 更新 7 天預報
 */
function updateForecast(daily) {
    const days = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

    elements.forecastContainer.innerHTML = daily.time.map((date, index) => {
        const weatherInfo = WEATHER_CODES[daily.weather_code[index]] || { icon: '❓' };
        const dayOfWeek = index === 0 ? '今天' : days[new Date(date).getDay()];

        return `
            <div class="forecast-card fade-in" style="animation-delay: ${index * 0.05}s">
                <div class="forecast-day">${dayOfWeek}</div>
                <div class="forecast-icon">${weatherInfo.icon}</div>
                <div class="forecast-temp">
                    <span class="forecast-temp-high">${Math.round(daily.temperature_2m_max[index])}°</span>
                    <span class="forecast-temp-low">${Math.round(daily.temperature_2m_min[index])}°</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 更新天氣背景動畫
 */
function updateWeatherAnimation(type, isNight) {
    // 移除所有天氣類別
    elements.weatherBg.className = 'weather-background';

    // 清除動畫層
    const animLayer = elements.weatherBg.querySelector('.animation-layer');
    animLayer.innerHTML = '';

    // 設定新的天氣類別
    if (isNight && type === 'sunny') {
        elements.weatherBg.classList.add('weather-night');
        createStars(animLayer);
        createMoon(animLayer);
    } else {
        elements.weatherBg.classList.add(`weather-${type}`);

        switch (type) {
            case 'rainy':
                createRaindrops(animLayer);
                break;
            case 'snowy':
                createSnowflakes(animLayer);
                break;
            case 'cloudy':
                createClouds(animLayer);
                break;
            case 'foggy':
                createFog(animLayer);
                break;
            case 'thunderstorm':
                createRaindrops(animLayer);
                createLightning(animLayer);
                break;
            case 'sunny':
                createSunRays(animLayer);
                break;
        }
    }
}

// ==================== 動畫生成函數 ====================

function createRaindrops(container) {
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(drop);
    }
}

function createSnowflakes(container) {
    for (let i = 0; i < 50; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.textContent = '❄';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.fontSize = `${0.5 + Math.random() * 1}rem`;
        flake.style.animationDuration = `${3 + Math.random() * 4}s`;
        flake.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(flake);
    }
}

function createClouds(container) {
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.top = `${10 + Math.random() * 30}%`;
        cloud.style.width = `${100 + Math.random() * 150}px`;
        cloud.style.height = `${40 + Math.random() * 30}px`;
        cloud.style.animationDuration = `${20 + Math.random() * 20}s`;
        cloud.style.animationDelay = `${Math.random() * 10}s`;
        container.appendChild(cloud);
    }
}

function createStars(container) {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 60}%`;
        star.style.animationDuration = `${1 + Math.random() * 2}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        container.appendChild(star);
    }
}

function createMoon(container) {
    const moon = document.createElement('div');
    moon.className = 'moon';
    container.appendChild(moon);
}

function createFog(container) {
    for (let i = 0; i < 3; i++) {
        const fog = document.createElement('div');
        fog.className = 'fog-layer';
        fog.style.top = `${20 + i * 25}%`;
        fog.style.animationDelay = `${i * 2}s`;
        container.appendChild(fog);
    }
}

function createLightning(container) {
    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    container.appendChild(lightning);
}

function createSunRays(container) {
    const sunRays = document.createElement('div');
    sunRays.className = 'sun-rays';
    for (let i = 0; i < 8; i++) {
        const ray = document.createElement('div');
        ray.className = 'sun-ray';
        ray.style.transform = `rotate(${i * 45}deg)`;
        sunRays.appendChild(ray);
    }
    container.appendChild(sunRays);
}

// ==================== 工具函數 ====================

/**
 * 顯示錯誤訊息給使用者
 */
function showError(message) {
    // 建立錯誤提示元素
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-toast';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(244, 67, 54, 0.95);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(errorDiv);

    // 3 秒後自動移除
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        errorDiv.style.transition = 'opacity 0.3s';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

function handleSearch() {
    const query = elements.cityInput.value.trim();
    if (query) {
        searchCity(query);
    }
}

function handleInputChange() {
    clearTimeout(searchTimeout);
    const query = elements.cityInput.value.trim();

    if (query.length >= 2) {
        searchTimeout = setTimeout(() => searchCity(query), 300);
    } else {
        elements.searchResults.classList.add('hidden');
    }
}

function handleGeolocation() {
    if (!navigator.geolocation) {
        alert('您的瀏覽器不支援定位功能');
        return;
    }

    elements.locationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            currentLocation = { lat: latitude, lon: longitude, name: '目前位置' };
            elements.cityName.textContent = '目前位置';

            await fetchWeather(latitude, longitude);
            elements.locationBtn.disabled = false;
        },
        (error) => {
            console.error('定位失敗:', error);
            alert('無法取得您的位置，請手動搜尋城市');
            elements.locationBtn.disabled = false;
        }
    );
}

function toggleTheme() {
    if (isDarkMode) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.documentElement.setAttribute('data-theme', 'dark');
    elements.themeToggle.querySelector('.theme-icon').textContent = '☀️';
    localStorage.setItem('weatherAppTheme', 'dark');
    isDarkMode = true;
}

function disableDarkMode() {
    document.documentElement.removeAttribute('data-theme');
    elements.themeToggle.querySelector('.theme-icon').textContent = '🌙';
    localStorage.setItem('weatherAppTheme', 'light');
    isDarkMode = false;
}

function updateCurrentDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    elements.currentDate.textContent = now.toLocaleDateString('zh-TW', options);
}

function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function isNightTime(sunrise, sunset) {
    const now = new Date();
    const sunriseTime = new Date(sunrise);
    const sunsetTime = new Date(sunset);
    return now < sunriseTime || now > sunsetTime;
}

/**
 * 取得 UV Index 等級文字
 */
function getUVLevel(uv) {
    if (uv <= 2) return `低`;
    if (uv <= 5) return `中等`;
    if (uv <= 7) return `高`;
    if (uv <= 10) return `極高`;
    return `危險`;
}

/**
 * 取得 UV Index 顏色
 */
function getUVColor(uv) {
    if (uv <= 2) return '#4CAF50'; // 綠色
    if (uv <= 5) return '#FFEB3B'; // 黃色
    if (uv <= 7) return '#FF9800'; // 橘色
    if (uv <= 10) return '#F44336'; // 紅色
    return '#9C27B0'; // 紫色
}

/**
 * 更新每小時預報
 */
function updateHourlyForecast(hourly) {
    if (!hourly || !hourly.time) return;

    // 只顯示未來 24 小時
    const next24Hours = hourly.time.slice(0, 24);

    elements.hourlyContainer.innerHTML = next24Hours.map((time, index) => {
        const hour = new Date(time).getHours();
        const temp = Math.round(hourly.temperature_2m[index]);
        const weatherCode = hourly.weather_code[index];
        const weatherInfo = WEATHER_CODES[weatherCode] || { icon: '❓' };
        const precipitation = hourly.precipitation_probability[index] || 0;

        return `
            <div class="hourly-card fade-in" style="animation-delay: ${index * 0.02}s">
                <div class="hourly-time">${hour}:00</div>
                <div class="hourly-icon">${weatherInfo.icon}</div>
                <div class="hourly-temp">${temp}°</div>
                <div class="hourly-rain">${precipitation}%</div>
            </div>
        `;
    }).join('');
}

/**
 * 取得 AQI 等級文字
 */
function getAQILevel(aqi) {
    if (aqi <= 50) return `良好`;
    if (aqi <= 100) return `中等`;
    if (aqi <= 150) return `對敏感族群不健康`;
    if (aqi <= 200) return `不健康`;
    if (aqi <= 300) return `非常不健康`;
    return `危險`;
}

/**
 * 取得 AQI 顏色
 */
function getAQIColor(aqi) {
    if (aqi <= 50) return '#4CAF50'; // 綠色
    if (aqi <= 100) return '#FFEB3B'; // 黃色
    if (aqi <= 150) return '#FF9800'; // 橘色
    if (aqi <= 200) return '#F44336'; // 紅色
    if (aqi <= 300) return '#9C27B0'; // 紫色
    return '#7E1E1E'; // 褐紅色
}

/**
 * 儲存城市到收藏
 */
function saveCity() {
    if (!currentLocation.lat || !currentLocation.lon) return;

    const city = {
        name: currentLocation.name,
        lat: currentLocation.lat,
        lon: currentLocation.lon
    };

    // 檢查是否已存在
    const exists = savedCities.some(c => c.lat === city.lat && c.lon === city.lon);
    if (exists) {
        alert('此城市已在收藏清單中');
        return;
    }

    savedCities.push(city);
    localStorage.setItem('weatherAppSavedCities', JSON.stringify(savedCities));
    alert(`已收藏 ${city.name}`);
}

/**
 * 載入收藏城市
 */
function loadSavedCity(city) {
    currentLocation = { lat: city.lat, lon: city.lon, name: city.name };
    elements.cityName.textContent = city.name;
    fetchWeather(city.lat, city.lon);
}

/**
 * 語音播報天氣
 */
function speakWeather() {
    if (!currentLocation.name || elements.currentTemp.textContent === '--') {
        alert('請先搜尋城市');
        return;
    }

    if (!('speechSynthesis' in window)) {
        alert('您的瀏覽器不支援語音播報');
        return;
    }

    const temp = elements.currentTemp.textContent;
    const desc = elements.weatherDesc.textContent;
    const city = currentLocation.name;

    const text = `${city}，目前溫度 ${temp} 度，天氣狀況 ${desc}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.9;

    speechSynthesis.speak(utterance);
}

/**
 * 更新溫度圖表
 */
function updateChart(hourly) {
    if (!hourly || !hourly.time) return;

    const ctx = document.getElementById('temp-chart');
    if (!ctx) return;

    // 準備資料 (未來 24 小時)
    const next24Hours = hourly.time.slice(0, 24);
    const labels = next24Hours.map(time => {
        const date = new Date(time);
        return `${date.getHours()}:00`;
    });
    const temps = hourly.temperature_2m.slice(0, 24);

    // 銷毀舊圖表
    if (chartInstance) {
        chartInstance.destroy();
    }

    // 建立新圖表
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '溫度 (°C)',
                data: temps,
                borderColor: 'rgba(255, 152, 0, 0.8)',
                backgroundColor: 'rgba(255, 152, 0, 0.2)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: isDarkMode ? '#b8b8d0' : '#4a4a6a',
                        maxTicksLimit: 8
                    }
                },
                y: {
                    display: false,
                    min: Math.min(...temps) - 2,
                    max: Math.max(...temps) + 2
                }
            }
        }
    });
}

/**
 * 分享天氣 (截圖)
 */
async function shareWeather() {
    try {
        const appContainer = document.querySelector('.app-container');

        // 顯示載入中提示
        alert('正在產生圖片，請稍候...');

        const canvas = await html2canvas(appContainer, {
            backgroundColor: isDarkMode ? '#1a1a2e' : '#87CEEB',
            scale: 2
        });

        // 下載圖片
        const link = document.createElement('a');
        link.download = `weather-${currentLocation.name}-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

    } catch (error) {
        console.error('分享失敗:', error);
        alert('無法產生圖片，請稍後再試');
    }
}

// ==================== 啟動 ====================
document.addEventListener('DOMContentLoaded', init);
