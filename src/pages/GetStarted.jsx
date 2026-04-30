import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GetStarted = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);

    const [form, setForm] = useState({
        // Location
        address: "",
        lat: "",
        lon: "",

        // System
        panelArea: "30",
        efficiency: "18",
        tilt: "15",
        azimuth: "180",
        inverterRating: "5",

        // Economics
        cost: "200000",
        tariff: "7",
    });

    const update = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

    const next = () => setStep((s) => Math.min(3, s + 1));
    const back = () => setStep((s) => Math.max(1, s - 1));

    const runSimulation = async () => {
        setIsLoading(true);
        try {
            const payload = {
                location: { address: form.address, lat: Number(form.lat), lon: Number(form.lon) },
                system: {
                    panelArea: Number(form.panelArea),
                    efficiency: Number(form.efficiency),
                    tilt: Number(form.tilt),
                    azimuth: Number(form.azimuth),
                    inverterRating: Number(form.inverterRating),
                    cost: Number(form.cost),
                },
                tariff: Number(form.tariff),
            };
            
            const response = await fetch('http://localhost:5000/api/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            
            const data = await response.json();
            if (data.success) {
                setResults(data.data.predictions);
                setStep(4);
            } else {
                alert("Simulation failed: " + data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error connecting to server. Make sure Node backend is running on port 5000.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            Start Your <span className="text-emerald-400">Solar Simulation</span>
                        </h1>
                        <p className="mt-3 text-emerald-100/80">
                            Enter your location, system details, and tariff to estimate yield and ROI.
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        {[
                            { n: 1, label: "Location" },
                            { n: 2, label: "System" },
                            { n: 3, label: "Cost & Tariff" },
                            { n: 4, label: "Results" },
                        ].map((x) => (
                            <div key={x.n} className="flex items-center gap-2">
                                <div
                                    className={[
                                        "h-8 w-8 rounded-full grid place-items-center text-sm font-bold transition-colors",
                                        step === x.n
                                            ? "bg-emerald-500 text-white"
                                            : step > x.n 
                                                ? "bg-emerald-500/50 text-white" 
                                                : "bg-white/10 text-emerald-100/80 border border-emerald-500/20",
                                    ].join(" ")}
                                >
                                    {x.n}
                                </div>
                                <span className="text-sm text-emerald-100/70 hidden sm:inline-block">{x.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-emerald-500/20 bg-white/5 backdrop-blur-md p-6 md:p-8">
                        {/* Step 1 */}
                        {step === 1 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">Location</h2>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm text-emerald-100/80 mb-1">Address</label>
                                        <input
                                            value={form.address}
                                            onChange={update("address")}
                                            type="text"
                                            placeholder="e.g., Thiruvananthapuram, Kerala"
                                            className="w-full rounded-xl bg-black/40 border border-emerald-500/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-emerald-100/80 mb-1">Latitude</label>
                                            <input
                                                value={form.lat}
                                                onChange={update("lat")}
                                                type="number"
                                                step="any"
                                                placeholder="e.g., 8.5241"
                                                className="w-full rounded-xl bg-black/40 border border-emerald-500/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-emerald-100/80 mb-1">Longitude</label>
                                            <input
                                                value={form.lon}
                                                onChange={update("lon")}
                                                type="number"
                                                step="any"
                                                placeholder="e.g., 76.9366"
                                                className="w-full rounded-xl bg-black/40 border border-emerald-500/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                            />
                                        </div>
                                    </div>

                                    <p className="text-xs text-emerald-100/60">
                                        Tip: Later you can replace this with a Leaflet map picker (PRD MVP feature).
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 2 */}
                        {step === 2 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">System Details</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Panel area (m²)" value={form.panelArea} onChange={update("panelArea")} />
                                    <Field label="Efficiency (%)" value={form.efficiency} onChange={update("efficiency")} />
                                    <Field label="Tilt (°)" value={form.tilt} onChange={update("tilt")} />
                                    <Field label="Azimuth (°)" value={form.azimuth} onChange={update("azimuth")} />
                                    <Field label="Inverter rating (kW)" value={form.inverterRating} onChange={update("inverterRating")} />
                                </div>

                                <p className="mt-3 text-xs text-emerald-100/60">
                                    These inputs match the simulation parameters in your MVP requirements.
                                </p>
                            </div>
                        )}

                        {/* Step 3 */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-semibold text-white mb-4">Cost & Tariff</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="System cost (₹)" value={form.cost} onChange={update("cost")} />
                                    <Field label="Electricity tariff (₹/kWh)" value={form.tariff} onChange={update("tariff")} />
                                </div>

                                <p className="mt-3 text-emerald-100/60 text-sm">
                                    SolarOpti.AI uses these to estimate savings and payback period, which is a key MVP goal.
                                </p>
                            </div>
                        )}

                        {/* Step 4 - Results */}
                        {step === 4 && results && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-emerald-400 mb-2">Simulation Complete!</h2>
                                    <p className="text-emerald-100/80">Here are your personalized solar system recommendations.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    <ResultCard title="Recommended System" value={`${results.recommendedSystemSize_kW} kW`} />
                                    <ResultCard title="Battery Capacity" value={`${results.recommendedBatteryCapacity_Ah} Ah`} />
                                    <ResultCard title="Optimal Tilt Angle" value={`${results.optimalTiltAngle}°`} />
                                    <ResultCard title="Annual Yield" value={`${results.estimatedAnnualYield_kWh} kWh`} />
                                    <ResultCard title="Annual Savings" value={`₹${results.estimatedAnnualSavings}`} />
                                    <ResultCard title="Payback Period" value={`${results.paybackPeriod_years} Years`} highlight={true} />
                                </div>
                                
                                <div className="mt-6 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                    <h3 className="text-lg font-semibold text-white mb-2">Estimated ROI (25 Years)</h3>
                                    <p className="text-3xl font-bold text-emerald-400">{results.ROI_percentage}%</p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-8 flex items-center justify-between gap-3">
                            {step < 4 ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={back}
                                        disabled={step === 1 || isLoading}
                                        className="rounded-xl px-5 py-3 border border-emerald-500/20 text-white hover:border-emerald-400/50 transition disabled:opacity-50"
                                    >
                                        Back
                                    </button>

                                    {step < 3 ? (
                                        <button
                                            type="button"
                                            onClick={next}
                                            className="rounded-xl px-5 py-3 bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={runSimulation}
                                            disabled={isLoading}
                                            className="rounded-xl px-5 py-3 bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isLoading && (
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {isLoading ? "Running..." : "Run Simulation"}
                                        </button>
                                    )}
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setResults(null); }}
                                    className="mx-auto rounded-xl px-5 py-3 bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
                                >
                                    Start New Simulation
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

function Field({ label, value, onChange }) {
    return (
        <div>
            <label className="block text-sm text-emerald-100/80 mb-1">{label}</label>
            <input
                value={value}
                onChange={onChange}
                type="number"
                step="any"
                className="w-full rounded-xl bg-black/40 border border-emerald-500/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
        </div>
    );
}

function ResultCard({ title, value, highlight = false }) {
    return (
        <div className={`p-5 rounded-xl border ${highlight ? 'border-emerald-400 bg-emerald-500/20' : 'border-emerald-500/20 bg-white/5'}`}>
            <p className="text-sm text-emerald-100/70 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${highlight ? 'text-emerald-300' : 'text-white'}`}>{value}</p>
        </div>
    );
}

export default GetStarted;
