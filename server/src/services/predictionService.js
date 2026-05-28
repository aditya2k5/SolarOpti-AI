// FUTURE ML INTEGRATION POINT
export const predictProduction = ({ systemSize, peakSunHours, derateFactor }) => {
    // Currently using thermodynamic formula.
    // Later, this function will execute a fetch() to your Python Random Forest API.
    return Math.round(
        systemSize * peakSunHours * derateFactor * 30
    );
};