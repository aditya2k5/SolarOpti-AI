import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet marker icons in React

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapEventsAndMarker({ lat, lon, updateLocation }) {
    const map = useMap();

    useEffect(() => {
        if (lat && lon) {
            map.flyTo([lat, lon], map.getZoom());
        }
    }, [lat, lon, map]);

    useMapEvents({
        click(e) {
            updateLocation(e.latlng.lat, e.latlng.lng);
        },
    });

    return lat && lon ? <Marker position={[lat, lon]} /> : null;
}

const GetStarted = () => {
    const [step, setStep] = useState(1);
    const [isLocating, setIsLocating] = useState(false);

    const [form, setForm] = useState({
        // Step 1: Location
        address: "",
        lat: "",
        lon: "",

        // Step 2: Consumption
        consumptionType: "bill", // 'bill' or 'kwh'
        monthlyBill: "",
        monthlyKwh: "",

        // Step 3: Roof Information
        roofType: "Flat Roof",
        roofArea: "",
        budget: "1L-3L",
    });

    const update = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
    const updateDirect = (key, value) => setForm((p) => ({ ...p, [key]: value }));

    const updateLocation = (lat, lon) => {
        setForm((p) => ({ ...p, lat: parseFloat(lat).toFixed(6), lon: parseFloat(lon).toFixed(6) }));
    };

    const handleAutoDetect = () => {
        setIsLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    updateLocation(position.coords.latitude, position.coords.longitude);
                    setIsLocating(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not detect location. Please ensure location permissions are granted.");
                    setIsLocating(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
            setIsLocating(false);
        }
    };

    const next = () => setStep((s) => Math.min(3, s + 1));
    const back = () => setStep((s) => Math.max(1, s - 1));

    const runSimulation = () => {
        // Send these simple inputs to the backend.
        // The backend AI will calculate tilt, azimuth, efficiency, and inverter sizing.
        console.log("Simulation Payload (Sent to AI Backend):", {
            location: {
                address: form.address,
                coordinates: form.lat && form.lon ? [Number(form.lat), Number(form.lon)] : null
            },
            consumption: {
                type: form.consumptionType,
                value: form.consumptionType === 'bill' ? Number(form.monthlyBill) : Number(form.monthlyKwh)
            },
            propertyDetails: {
                roofType: form.roofType,
                roofAreaSqFt: Number(form.roofArea),
                budgetRange: form.budget
            }
        });
        alert("Form saved! Check console for the payload sent to the AI.");
    };

    const defaultCenter = [20.5937, 78.9629]; // Center of India

    const roofTypes = ["Flat Roof", "Sloped Roof", "Industrial Roof", "Ground Installation"];
    const budgetRanges = ["< ₹1 Lakh", "₹1 Lakh – ₹3 Lakh", "₹3 Lakh – ₹5 Lakh", "> ₹5 Lakh"];

    return (
        <div className="min-h-screen bg-[#0a0f12] text-white">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="max-w-3xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            Design Your <span className="text-emerald-400">Solar System</span>
                        </h1>
                        <p className="mt-3 text-emerald-100/80">
                            Tell us a bit about your home. Our AI handles the complex engineering calculations.
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        {[
                            { n: 1, label: "Location" },
                            { n: 2, label: "Energy Usage" },
                            { n: 3, label: "Roof Details" },
                        ].map((x) => (
                            <div key={x.n} className="flex items-center gap-2">
                                <div
                                    className={[
                                        "h-8 w-8 rounded-full grid place-items-center text-sm font-bold transition-colors",
                                        step === x.n
                                            ? "bg-emerald-500 text-white"
                                            : step > x.n
                                                ? "bg-emerald-500/40 text-emerald-100"
                                                : "bg-white/10 text-emerald-100/50 border border-emerald-500/20",
                                    ].join(" ")}
                                >
                                    {x.n}
                                </div>
                                <span className={`text-sm hidden sm:block ${step === x.n ? "text-emerald-300 font-medium" : "text-emerald-100/50"}`}>
                                    {x.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-emerald-500/20 bg-white/5 backdrop-blur-md p-6 md:p-8 shadow-xl shadow-emerald-900/10">

                        {/* Step 1: Location */}
                        {step === 1 && (
                            <div className="animate-in fade-in duration-300">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">Where are you located?</h2>
                                        <p className="text-sm text-emerald-100/60 mt-1">Needed for sunlight analysis and weather patterns.</p>
                                    </div>
                                    <button
                                        onClick={handleAutoDetect}
                                        disabled={isLocating}
                                        className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 whitespace-nowrap"
                                    >
                                        📍 {isLocating ? "Detecting..." : "Use Current Location"}
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div>
                                        <input
                                            value={form.address}
                                            onChange={update("address")}
                                            type="text"
                                            placeholder="Search address or tap on the map..."
                                            className="w-full rounded-xl bg-black/40 border border-emerald-500/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                        />
                                    </div>

                                    {/* Map Container */}
                                    <div className="h-[300px] w-full rounded-xl overflow-hidden border border-emerald-500/20 bg-black/40 relative">
                                        {!form.lat && !form.lon && (
                                            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-black/40">
                                                <span className="bg-black/80 text-emerald-300 px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                                                    Tap anywhere on the map to drop a pin
                                                </span>
                                            </div>
                                        )}
                                        <MapContainer
                                            center={form.lat && form.lon ? [form.lat, form.lon] : defaultCenter}
                                            zoom={form.lat && form.lon ? 16 : 4}
                                            style={{ height: "100%", width: "100%", zIndex: 10 }}
                                        >
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <MapEventsAndMarker lat={form.lat} lon={form.lon} updateLocation={updateLocation} />
                                        </MapContainer>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Consumption */}
                        {step === 2 && (
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-xl font-semibold text-white mb-2">How much energy do you use?</h2>
                                <p className="text-sm text-emerald-100/60 mb-6">This helps us size the right inverter and panel count for you.</p>

                                <div className="flex p-1 bg-black/40 rounded-xl mb-6 w-full max-w-md">
                                    <button
                                        onClick={() => updateDirect("consumptionType", "bill")}
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                                            form.consumptionType === "bill" ? "bg-emerald-500 text-white shadow-md" : "text-emerald-100/60 hover:text-white"
                                        }`}
                                    >
                                        Average Monthly Bill
                                    </button>
                                    <button
                                        onClick={() => updateDirect("consumptionType", "kwh")}
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                                            form.consumptionType === "kwh" ? "bg-emerald-500 text-white shadow-md" : "text-emerald-100/60 hover:text-white"
                                        }`}
                                    >
                                        Monthly Units (kWh)
                                    </button>
                                </div>

                                {form.consumptionType === "bill" ? (
                                    <div>
                                        <label className="block text-sm text-emerald-100/80 mb-2">What is your average monthly electricity bill?</label>
                                        <div className="relative max-w-md">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-100/50">₹</span>
                                            <input
                                                value={form.monthlyBill}
                                                onChange={update("monthlyBill")}
                                                type="number"
                                                placeholder="e.g. 2500"
                                                className="w-full rounded-xl bg-black/40 border border-emerald-500/20 pl-8 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-lg"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm text-emerald-100/80 mb-2">How many units do you consume monthly?</label>
                                        <div className="relative max-w-md">
                                            <input
                                                value={form.monthlyKwh}
                                                onChange={update("monthlyKwh")}
                                                type="number"
                                                placeholder="e.g. 350"
                                                className="w-full rounded-xl bg-black/40 border border-emerald-500/20 pl-4 pr-16 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-lg"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-100/50 text-sm">kWh</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Roof Details */}
                        {step === 3 && (
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-xl font-semibold text-white mb-2">Tell us about your property</h2>
                                <p className="text-sm text-emerald-100/60 mb-6">To check maximum installation capacity and recommend setup quality.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Roof Type */}
                                    <div>
                                        <label className="block text-sm text-emerald-100/80 mb-2">Roof Type</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {roofTypes.map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => updateDirect("roofType", type)}
                                                    className={`p-3 rounded-xl border text-sm text-left transition ${
                                                        form.roofType === type
                                                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                                                            : "bg-black/40 border-emerald-500/20 text-emerald-100/70 hover:border-emerald-500/50"
                                                    }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Area & Budget */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm text-emerald-100/80 mb-2">Approximate Roof Area (Optional)</label>
                                            <div className="relative">
                                                <input
                                                    value={form.roofArea}
                                                    onChange={update("roofArea")}
                                                    type="number"
                                                    placeholder="e.g. 1000"
                                                    className="w-full rounded-xl bg-black/40 border border-emerald-500/20 pl-4 pr-16 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-100/50 text-sm">sq ft</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-emerald-100/80 mb-2">Estimated Budget Range</label>
                                            <select
                                                value={form.budget}
                                                onChange={update("budget")}
                                                className="w-full rounded-xl bg-black/40 border border-emerald-500/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 appearance-none"
                                            >
                                                {budgetRanges.map((range) => (
                                                    <option key={range} value={range} className="bg-gray-900">
                                                        {range}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-8 pt-6 border-t border-emerald-500/20 flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={back}
                                disabled={step === 1}
                                className="rounded-xl px-6 py-3 border border-emerald-500/20 text-white hover:bg-emerald-500/10 transition disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                Back
                            </button>

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={next}
                                    className="rounded-xl px-8 py-3 bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/25"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={runSimulation}
                                    className="rounded-xl px-8 py-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/40 transition transform hover:-translate-y-0.5"
                                >
                                    Generate AI Result
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

export default GetStarted;