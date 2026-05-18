export const calculateSolar = async (req, res) => {

    try {

        console.log("Incoming Request Body:");
        console.log(req.body);

        const {
            location,
            consumption,
            propertyDetails
        } = req.body;

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (
            !location ||
            !consumption ||
            !propertyDetails
        ) {

            return res.status(400).json({

                success: false,
                message: "Missing required fields."
            });
        }

        // -----------------------------
        // MONTHLY UNIT CALCULATION
        // -----------------------------

        let monthlyUnits = 0;

        // If user entered bill amount
        if (consumption.type === "bill") {

            // Temporary average tariff per unit
            const tariffRate = 7;

            monthlyUnits =
                Number(consumption.value) / tariffRate;

        }

        // If user entered direct units
        else if (consumption.type === "kwh") {

            monthlyUnits =
                Number(consumption.value);
        }

        // Invalid type
        else {

            return res.status(400).json({

                success: false,
                message: "Invalid consumption type."
            });
        }

        // -----------------------------
        // SYSTEM SIZE CALCULATION
        // -----------------------------

        const systemSize =
            Number((monthlyUnits / 120).toFixed(1));

        // -----------------------------
        // PANEL CALCULATION
        // -----------------------------

        const panelWatt = 550;

        const recommendedPanels =
            Math.ceil(
                (systemSize * 1000) / panelWatt
            );

        // -----------------------------
        // INVERTER
        // -----------------------------

        const recommendedInverter =
            `${Math.ceil(systemSize)}kW Hybrid Inverter`;

        // -----------------------------
        // POWER PRODUCTION
        // -----------------------------

        const estimatedProduction =
            Math.round(systemSize * 120);

        // -----------------------------
        // COST ESTIMATION
        // -----------------------------

        const estimatedCost =
            Number(Math.round(systemSize * 70000));

        // -----------------------------
        // GOVERNMENT SUBSIDY
        // -----------------------------

        let governmentSubsidy = 0;

        if (
            propertyDetails.installationType ===
            "Residential"
        ) {

            if (systemSize <= 3) {

                governmentSubsidy = 78000;

            } else {

                governmentSubsidy = 108000;
            }
        }

        // -----------------------------
        // FINAL COST
        // -----------------------------

        const finalCost =
            Number(estimatedCost) -
            Number(governmentSubsidy);

        // -----------------------------
        // DEBUG LOGS
        // -----------------------------

        console.log("Monthly Units:", monthlyUnits);

        console.log("System Size:", systemSize);

        console.log("Estimated Cost:", estimatedCost);

        console.log("Government Subsidy:", governmentSubsidy);

        console.log("Final Cost:", finalCost);

        // -----------------------------
        // RESPONSE
        // -----------------------------

        return res.status(200).json({

            success: true,

            recommendation: {

                location:
                    location.address || "Unknown",

                recommendedPanels,

                recommendedInverter,

                systemSize:
                    `${systemSize} kW`,

                estimatedProduction:
                    `${estimatedProduction} kWh/month`,

                estimatedCost:
                    `₹${estimatedCost.toLocaleString()}`,

                governmentSubsidy:
                    `₹${governmentSubsidy.toLocaleString()}`,

                finalCost:
                    `₹${finalCost.toLocaleString()}`,

                roofType:
                propertyDetails.roofType,

                roofAreaSqFt:
                propertyDetails.roofAreaSqFt,

                installationType:
                propertyDetails.installationType,
            }
        });

    } catch (error) {

        console.error("Solar Calculation Error:");
        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Server Error"
        });
    }
};