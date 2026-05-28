export const calculateSizing = ({ monthlyUnits, peakSunHours, roofAreaSqFt }) => {
    const derateFactor = 0.82;
    const panelWatt = 550;
    
    const physicalSqFtPerPanel = 24; 
    const clearanceMultiplier = 1.5; 
    const effectiveSqFtPerPanel = physicalSqFtPerPanel * clearanceMultiplier; // ~36 sq ft

    // 1. Structural Guard: Handle zero/empty inputs gracefully upfront
    if (!monthlyUnits || monthlyUnits <= 0 || !peakSunHours || peakSunHours <= 0) {
        return { systemSize: 0, recommendedPanels: 0, derateFactor, areaWarning: null };
    }

    // 2. Calculate Raw Power Requirement
    const dailyTargetUnits = monthlyUnits / 30;
    const requiredKw = dailyTargetUnits / (peakSunHours * derateFactor);

    // 3. Calculate Panels Required
    let recommendedPanels = Math.ceil((requiredKw * 1000) / panelWatt);
    
    if (recommendedPanels === 0) recommendedPanels = 1;

    let areaWarning = null;

    // 4. Apply Physical Roof Constraints safely
    if (roofAreaSqFt && Number(roofAreaSqFt) > 0) {
        const availableArea = Number(roofAreaSqFt);
        const totalRequiredArea = recommendedPanels * effectiveSqFtPerPanel;

        if (availableArea < totalRequiredArea) {
            const calculatedFit = Math.floor(availableArea / effectiveSqFtPerPanel);
            
            // EDGE CASE FIX: If roof area can't even fit 1 panel with clearance, 
            // clamp it to exactly 1 panel minimum rather than dropping to 0.
            recommendedPanels = Math.max(1, calculatedFit);
            
            areaWarning = `Space constraint detected. Added safety clearance and capped design to ${recommendedPanels} modules.`;
        }
    }

    // 5. Calculate Final Actual System Size based on physical panels
    const finalSystemSizeKw = Number(((recommendedPanels * panelWatt) / 1000).toFixed(2));

    return {
        systemSize: finalSystemSizeKw,
        recommendedPanels,
        derateFactor,
        areaWarning
    };
};