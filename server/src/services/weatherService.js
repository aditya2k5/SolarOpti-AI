export const getWeatherFeatures = async (lat, lon) => {
    try {
        if (!lat || !lon) {
            throw new Error(`Invalid coordinates received: lat=${lat}, lon=${lon}`);
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,shortwave_radiation,cloud_cover&forecast_days=1&timezone=auto`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        const hourly = data.hourly;

        const hourlyTemperature = hourly.temperature_2m;
        const hourlyRadiation = hourly.shortwave_radiation;
        const hourlyCloud = hourly.cloud_cover;

        const avgTemp = hourlyTemperature.reduce((a, b) => a + b, 0) / hourlyTemperature.length;
        const avgRadiation = hourlyRadiation.reduce((a, b) => a + b, 0) / hourlyRadiation.length;
        const avgCloud = hourlyCloud.reduce((a, b) => a + b, 0) / hourlyCloud.length;

        console.log(
            "Open-Meteo Loaded Successfully"
        );

        console.log(
            "Location:",
            {
                latitude: lat,
                longitude: lon
            }
        );

        console.log(
            "Weather Summary:",
            {
                irradiance:
                    avgRadiation / 1000,

                temperature:
                    avgTemp,

                cloud_cover:
                    avgCloud
            }
        );

        console.log(
            "Hourly Irradiance:",
            hourlyRadiation.map(
                x => x / 1000
            )
        );

        console.log(
            "Hourly Temperature:",
            hourlyTemperature
        );

        // 1. UPDATED TRY BLOCK KEYS TO MATCH FLASK EXPECTATIONS
        return {
            irradiance: avgRadiation / 1000,
            temperature: avgTemp,
            humidity: avgCloud,
            hourly_irradiance_forecast: hourlyRadiation.map(x => x / 1000), // Key updated
            hourly_temp_forecast: hourlyTemperature,                       // Key updated
            hourly_cloud_cover_forecast: hourlyCloud                       // Key updated
        };

    } catch (error) {
        console.error("Open-Meteo Error:", error.message);

        const fallbackIrradiance = [
            0, 0, 0, 0, 0, 0,             // 00:00 to 05:00
            0.1, 0.3, 0.5, 0.7, 0.9, 1.0, // 06:00 to 11:00
            1.0, 0.9, 0.7, 0.5, 0.2, 0,   // 12:00 to 17:00
            0, 0, 0, 0, 0, 0              // 18:00 to 23:00
        ];

        // 2. UPDATED CATCH BLOCK KEYS TO MATCH FLASK EXPECTATIONS
        return {
            irradiance: 0.3,
            temperature: 30,
            humidity: 60,
            hourly_irradiance_forecast: fallbackIrradiance, // Key updated
            hourly_temp_forecast: Array(24).fill(30),       // Key updated
            hourly_cloud_cover_forecast: Array(24).fill(40) // Key updated
        };
    }
};