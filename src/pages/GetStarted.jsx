import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GetStarted = () => {
    const [step, setStep] = useState(1);

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

    const runSimulation = () => {
        // Later: call your backend POST /api/simulate with this payload
        console.log("Simulation payload:", {
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
        });
        alert("Form saved! Next step: connect this to /api/simulate");
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
                        ].map((x) => (
                            <div key={x.n} className="flex items-center gap-2">
                                <div
                                    className={[
                                        "h-8 w-8 rounded-full grid place-items-center text-sm font-bold",
                                        step === x.n
                                            ? "bg-emerald-500 text-white"
                                            : "bg-white/10 text-emerald-100/80 border border-emerald-500/20",
                                    ].join(" ")}
                                >
                                    {x.n}
                                </div>
                                <span className="text-sm text-emerald-100/70">{x.label}</span>
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
                            <div>
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

                        {/* Actions */}
                        <div className="mt-8 flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={back}
                                disabled={step === 1}
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
                                    className="rounded-xl px-5 py-3 bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
                                >
                                    Run Simulation
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
                className="w-full rounded-xl bg-black/40 border border-emerald-500/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
        </div>
    );
}

export default GetStarted;
