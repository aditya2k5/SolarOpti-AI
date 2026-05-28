export const electricityTariff = {
    AndamanAndNicobar: { residential: { low: 2.5, medium: 4.5, high: 6.0 } },
    AndhraPradesh: { residential: { low: 2.0, medium: 4.5, high: 9.0 } },
    ArunachalPradesh: { residential: { low: 4.0, medium: 4.0, high: 4.0 } }, // Mostly flat rates
    Assam: { residential: { low: 4.5, medium: 6.0, high: 7.5 } },
    Bihar: { residential: { low: 6.0, medium: 7.0, high: 8.5 } },
    Chandigarh: { residential: { low: 2.7, medium: 4.3, high: 4.7 } },
    Chhattisgarh: { residential: { low: 3.5, medium: 4.5, high: 6.5 } },
    DadraAndNagarHaveli: { residential: { low: 1.5, medium: 2.5, high: 3.2 } },
    DamanAndDiu: { residential: { low: 1.5, medium: 2.2, high: 2.8 } },
    Delhi: { residential: { low: 3.0, medium: 4.5, high: 8.0 } }, // Subsidized for lower tiers
    Goa: { residential: { low: 1.8, medium: 3.0, high: 4.5 } },
    Gujarat: { residential: { low: 3.0, medium: 4.0, high: 5.2 } }, // Plus heavy FPPCA in reality
    Haryana: { residential: { low: 2.0, medium: 4.5, high: 7.0 } },
    HimachalPradesh: { residential: { low: 3.3, medium: 4.0, high: 5.0 } },
    JammuAndKashmir: { residential: { low: 2.0, medium: 3.0, high: 4.0 } },
    Jharkhand: { residential: { low: 4.2, medium: 5.5, high: 6.2 } },
    Karnataka: { residential: { low: 4.5, medium: 6.5, high: 8.5 } },
    Kerala: { residential: { low: 4.0, medium: 6.0, high: 8.0 } },
    Ladakh: { residential: { low: 2.0, medium: 3.0, high: 4.0 } },
    Lakshadweep: { residential: { low: 1.5, medium: 3.5, high: 6.0 } },
    MadhyaPradesh: { residential: { low: 4.2, medium: 5.5, high: 7.0 } },
    Maharashtra: { residential: { low: 4.5, medium: 8.5, high: 11.5 } }, // Generally highest in India
    Manipur: { residential: { low: 4.5, medium: 5.5, high: 6.5 } },
    Meghalaya: { residential: { low: 4.0, medium: 4.5, high: 6.0 } },
    Mizoram: { residential: { low: 3.5, medium: 4.8, high: 5.5 } },
    Nagaland: { residential: { low: 4.5, medium: 5.5, high: 6.5 } },
    Odisha: { residential: { low: 3.0, medium: 4.8, high: 6.2 } },
    Puducherry: { residential: { low: 1.5, medium: 2.8, high: 4.5 } },
    Punjab: { residential: { low: 3.5, medium: 5.0, high: 7.3 } },
    Rajasthan: { residential: { low: 4.7, medium: 6.5, high: 8.0 } },
    Sikkim: { residential: { low: 2.0, medium: 3.0, high: 4.0 } },
    TamilNadu: { residential: { low: 3.5, medium: 5.5, high: 7.5 } },
    Telangana: { residential: { low: 3.5, medium: 5.0, high: 8.5 } },
    Tripura: { residential: { low: 4.5, medium: 5.5, high: 7.0 } },
    UttarPradesh: { residential: { low: 5.5, medium: 6.0, high: 7.0 } },
    Uttarakhand: { residential: { low: 3.0, medium: 4.2, high: 5.5 } },
    WestBengal: { residential: { low: 5.0, medium: 6.5, high: 9.0 } },
    
    // Safety fallback for unrecognized inputs
    default: { residential: { low: 4.0, medium: 6.5, high: 8.0 } } 
};