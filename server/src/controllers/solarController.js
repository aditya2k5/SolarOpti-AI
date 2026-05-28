import { calculateSubsidy } from "../services/subsidyService.js";
import { calculateSizing } from "../services/solarSizingService.js";
import { getWeatherFeatures } from "../services/weatherService.js";
import { getMLPrediction } from "../services/mlPredictionService.js";
import { getAverageTariff } from "../utils/tariffService.js";

export const calculateSolar = async (req, res) => {
    try {
        const { location, consumption, propertyDetails } = req.body;

        // -----------------------------
        // VALIDATION
        // -----------------------------
        if (!location || !consumption || !propertyDetails) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields."
            });
        }

        // -----------------------------
        // LOCATION & STATE PARSING
        // -----------------------------
        const lat = location.coordinates?.[0];
        const lon = location.coordinates?.[1];
        
        // IMPORTANT: Ensure your frontend payload includes location.state (e.g., "Kerala")
        const stateName = location.state || 'default';

        // -----------------------------
        // WEATHER ENGINE
        // -----------------------------
        const weather = await getWeatherFeatures(lat, lon);

        // -----------------------------
        // CONSUMPTION & DYNAMIC TARIFF
        // -----------------------------
        let monthlyUnits = 0;
        
        if (consumption.type === "bill") {
            const billValue = Number(consumption.value);
            
            // Pass 1: Rough baseline estimate
            const roughUnits = billValue / 6.5; 
            
            // Pass 2: Get the exact state tariff using the rough unit estimation
            const exactTariff = getAverageTariff(stateName, roughUnits);
            
            // Pass 3: Calculate the highly accurate monthly units
            monthlyUnits = billValue / exactTariff;

        } else if (consumption.type === "kwh") {
            monthlyUnits = Number(consumption.value);
        } else {
            return res.status(400).json({ success: false, message: "Invalid consumption type" });
        }
        
        monthlyUnits = Math.round(monthlyUnits);

        // -----------------------------
        // STRUCTURAL SIZING ENGINE
        // -----------------------------
        // Static baseline for physical equipment layout (prevents weather from skewing panel counts)
        const regionalBaselineSunHours = 4.8;

        const sizingResult = calculateSizing({
            monthlyUnits,
            peakSunHours: regionalBaselineSunHours, 
            roofAreaSqFt: propertyDetails.roofAreaSqFt
        });

        // -----------------------------
        // INVERTER OPTIMIZATION
        // -----------------------------
        let inverterCap = Math.ceil(sizingResult.systemSize);
        if (inverterCap === 4) inverterCap = 5;
        if (inverterCap > 5 && inverterCap < 8) inverterCap = 8;
        if (inverterCap > 8 && inverterCap < 10) inverterCap = 10;

        const recommendedInverter = `${inverterCap}kW Smart Hybrid Inverter`;

        // -----------------------------
        // ML GRAPH PREDICTION
        // -----------------------------
        const mlPrediction = await getMLPrediction(
            weather,
            sizingResult.systemSize, 
            propertyDetails.roofAreaSqFt
        );

        // SAFETY GUARD: Prevents crashes if the Python Flask server is down or returns null
        if (!mlPrediction || !mlPrediction.chart_data) {
            throw new Error("ML prediction service is currently unavailable.");
        }

        const estimatedMonthlyProduction = mlPrediction.chart_data.reduce(
            (sum, item) => sum + item.power_kwh, 0
        ) * 30;

        // -----------------------------
        // COST & SUBSIDY STRUCTURE
        // -----------------------------
        const baselineCostPerKw = 65000;
        const estimatedCost = Math.round(sizingResult.systemSize * baselineCostPerKw);

        const governmentSubsidy = calculateSubsidy(
            sizingResult.systemSize,
            propertyDetails.installationType
        );

        const finalCost = estimatedCost - governmentSubsidy;

        // -----------------------------
        // FINAL UNIFIED RESPONSE
        // -----------------------------
        return res.status(200).json({
            success: true,
            recommendation: {
                location: location.address || "Selected Location",
                systemSize: `${sizingResult.systemSize} kW`,
                recommendedPanels: sizingResult.recommendedPanels, 
                recommendedInverter,
                estimatedProduction: `${estimatedMonthlyProduction.toFixed(2)} kWh/month`,
                estimatedCost: `₹${estimatedCost.toLocaleString("en-IN")}`,
                governmentSubsidy: `₹${governmentSubsidy.toLocaleString("en-IN")}`,
                finalCost: `₹${finalCost.toLocaleString("en-IN")}`,
                roofType: propertyDetails.roofType,
                roofAreaSqFt: propertyDetails.roofAreaSqFt,
                analyticalData: {
                    irradiation: weather.irradiance,
                    temperature: weather.temperature,
                    humidity: weather.humidity
                }
            },
            graphPrediction: {
                peakPower: mlPrediction.peak_power_kwh,
                peakTime: mlPrediction.peak_time,
                chartData: mlPrediction.chart_data
            }
        });

    } catch (error) {
        console.error("Solar Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server computation error"
        });
    }
};