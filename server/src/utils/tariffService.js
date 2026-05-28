import { electricityTariff } from "../config/electricityTariff.js";

// =====================================
// EXISTING DYNAMIC TARIFF LOGIC
// =====================================
export const getAverageTariff = (
    state,
    estimatedUnits
) => {

    // Clean state string
    const cleanState =
        state?.replace(
            /\s+/g,
            ""
        );

    // Find state tariff
    const tariffData =
        electricityTariff[
            cleanState
        ] ||
        electricityTariff.default;

    const slab =
        tariffData.residential;

    // Slab Logic
    if (estimatedUnits <= 200) {
        return slab.low;
    }

    if (estimatedUnits <= 500) {
        return slab.medium;
    }

    return slab.high;
};

// =====================================
// NEW PDF REPORT HELPER
// =====================================
export const getTariffForState = async (
    state
) => {

    const cleanState =
        state?.replace(
            /\s+/g,
            ""
        );

    const tariffData =
        electricityTariff[
            cleanState
        ] ||
        electricityTariff.default;

    // PDF uses medium slab estimate
    return tariffData
        .residential
        .medium;
};