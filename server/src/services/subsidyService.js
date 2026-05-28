export const calculateSubsidy = (systemSize, installationType) => {
    let subsidy = 0;

    if (installationType === "Residential") {
        if (systemSize <= 2) {
            subsidy = systemSize * 30000;
        } else if (systemSize > 2 && systemSize < 3) {
            subsidy = 60000 + ((systemSize - 2) * 18000);
        } else {
            subsidy = 78000;
        }
    }

    return Math.round(subsidy);
};