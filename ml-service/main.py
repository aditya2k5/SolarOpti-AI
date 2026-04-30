from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import math

app = FastAPI(title="SolarOpti.ai ML Microservice")

# Pydantic models for request and response
class LocationData(BaseModel):
    address: str
    lat: float
    lon: float

class SystemData(BaseModel):
    panelArea: float
    efficiency: float
    tilt: float
    azimuth: float
    inverterRating: float
    cost: float

class SimulationRequest(BaseModel):
    location: LocationData
    system: SystemData
    tariff: float

class SimulationResponse(BaseModel):
    recommendedSystemSize_kW: float
    recommendedBatteryCapacity_Ah: float
    optimalTiltAngle: float
    estimatedAnnualYield_kWh: float
    estimatedAnnualSavings: float
    paybackPeriod_years: float
    ROI_percentage: float

@app.post("/predict", response_model=SimulationResponse)
async def predict_solar_yield(data: SimulationRequest):
    try:
        # 1. Optimal Tilt Angle (Heuristic based on latitude)
        # Typically, the optimal tilt angle for fixed solar panels is approximately equal to the absolute latitude.
        optimal_tilt = abs(data.location.lat)
        
        # 2. Recommended System Size (kW)
        # Using Area (m^2) and Efficiency (%)
        # Power (kW) = Area * Efficiency * Irradiance (Standard Testing Condition: 1000 W/m^2 or 1 kW/m^2)
        system_size_kW = data.system.panelArea * (data.system.efficiency / 100) * 1.0
        
        # Ensure system size does not exceed inverter rating significantly (or cap it based on standard practice)
        # For simplicity, we just take the calculated system size.
        
        # 3. Estimated Annual Yield (kWh)
        # Yield = System Size (kW) * Peak Sun Hours per day * 365 * Performance Ratio (PR)
        # We estimate peak sun hours based on a generic global average or latitude proxy. 
        # For India/Equatorial regions, average is ~4.5 hours.
        peak_sun_hours_per_day = 4.5
        performance_ratio = 0.75 # Accounting for temperature loss, inverter loss, dirt, etc.
        
        # Adjusting performance ratio slightly based on tilt deviation from optimal
        tilt_penalty = 1.0 - (abs(data.system.tilt - optimal_tilt) * 0.005) # 0.5% loss per degree deviation
        performance_ratio *= max(0.5, tilt_penalty)
        
        annual_yield_kWh = system_size_kW * peak_sun_hours_per_day * 365 * performance_ratio
        
        # 4. Recommended Battery Capacity (Ah)
        # Assume standard 48V battery bank. We want to store 1 day of yield for autonomy (simplified).
        # Energy (Wh) = Ah * Voltage. So Ah = (Energy (Wh) / Voltage)
        # Let's say we store 50% of daily yield.
        daily_yield_Wh = (annual_yield_kWh / 365) * 1000
        battery_voltage = 48.0
        depth_of_discharge = 0.8 # Standard for Lithium-ion
        recommended_battery_Ah = (daily_yield_Wh * 0.5) / (battery_voltage * depth_of_discharge)
        
        # 5. Financials
        annual_savings = annual_yield_kWh * data.tariff
        cost = data.system.cost
        
        if annual_savings > 0:
            payback_period = cost / annual_savings
        else:
            payback_period = 0.0
            
        roi = 0.0
        if cost > 0:
            # ROI over a typical 25-year panel lifespan
            total_lifetime_savings = annual_savings * 25
            net_profit = total_lifetime_savings - cost
            roi = (net_profit / cost) * 100

        return SimulationResponse(
            recommendedSystemSize_kW=round(system_size_kW, 2),
            recommendedBatteryCapacity_Ah=round(recommended_battery_Ah, 2),
            optimalTiltAngle=round(optimal_tilt, 2),
            estimatedAnnualYield_kWh=round(annual_yield_kWh, 2),
            estimatedAnnualSavings=round(annual_savings, 2),
            paybackPeriod_years=round(payback_period, 2),
            ROI_percentage=round(roi, 2)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Run the server on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
