export const getMLPrediction = async (weather, systemSize, roofArea) => {
    try {
        const response = await fetch(
            "http://localhost:8010/predict-day",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    system_size_kw: systemSize,
                    roof_area_sq_m: roofArea * 0.0929, // Correctly converts sq ft to sq meters

                    // FIX: Read the newly updated forecast array keys from your weather service
                    hourly_irradiance_forecast: weather.hourly_irradiance_forecast,
                    hourly_temp_forecast: weather.hourly_temp_forecast
                })
            }
        );

        // RESPONSE VALIDATION
        if (!response.ok) {
            const text = await response.text();
            console.log("Flask Error:", text);
            return null;
        }

        const data = await response.json();
        console.log("Weather-Aware ML Response Successfully Retrieved:", data);
        return data;

    } catch (error) {
        console.log("ML Prediction Error:", error);
        return null;
    }
};