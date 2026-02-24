import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sun, Target, Users, Cpu, LineChart, FileText } from "lucide-react";

const About = () => {
    return (
        <div className="min-h-screen bg-transparent">


            <main className="pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Header */}
                    <header className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            About{" "}
                            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                                SolarOpti.AI
                            </span>
                        </h1>
                        <p className="mt-4 text-emerald-100/80 leading-relaxed">
                            SolarOpti.AI is a web-based solar energy optimization dashboard
                            built to help people design, simulate, and optimize solar
                            installations using AI-powered forecasting and location-specific
                            data—so solar decisions become easier, faster, and more accurate.
                        </p>
                    </header>

                    {/* Grid cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


                        {/* Problem statement */}
                        <section className="rounded-2xl border border-emerald-500/20 bg-white/5 backdrop-blur-md p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 grid place-items-center">
                                    <LineChart className="h-5 w-5 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-semibold text-white">
                                    Problem Statement
                                </h2>
                            </div>

                            <p className="text-emerald-100/80 leading-relaxed">
                                Many solar calculators and quotes suffer from inaccurate
                                forecasting, missing optimization guidance, poor accessibility,
                                and unclear ROI—often leading to efficiency losses and delayed
                                adoption.
                            </p>

                            <ul className="mt-4 space-y-2 text-emerald-100/80">
                                <li>• Generic estimates ignore local weather patterns.</li>
                                <li>• Users don’t get tilt/azimuth and component suggestions.</li>
                                <li>• ROI is not clear, so payback feels uncertain.</li>
                            </ul>
                        </section>
                        {/* Aims */}
                        <section className="rounded-2xl border border-emerald-500/20 bg-white/5 backdrop-blur-md p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 grid place-items-center">
                                    <Target className="h-5 w-5 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-semibold text-white">Our Aim</h2>
                            </div>

                            <p className="text-emerald-100/80 leading-relaxed">
                                Our aim is to democratize solar planning by providing accurate,
                                AI-driven optimization tools that are accessible to everyone—from
                                homeowners to professional installers—helping reduce avoidable
                                costs and improve energy output.
                            </p>

                            <p className="mt-4 text-emerald-100/80 leading-relaxed">
                                Instead of relying on generic calculators, SolarOpti.AI gives
                                location-specific yield predictions, clear ROI metrics, and
                                optimized tilt/orientation recommendations so users can make
                                confident decisions before investing.
                            </p>
                        </section>

                        {/* How it works */}
                        <section className="rounded-2xl border border-emerald-500/20 bg-white/5 backdrop-blur-md p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 grid place-items-center">
                                    <Cpu className="h-5 w-5 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-semibold text-white">
                                    How SolarOpti.AI Works
                                </h2>
                            </div>

                            <p className="text-emerald-100/80 leading-relaxed">
                                You enter your location and system details (panel area/efficiency,
                                tilt/azimuth, inverter rating, cost, and electricity tariff), and
                                the platform runs a simulation pipeline to compute yield, savings,
                                payback period, and optimization recommendations.
                            </p>

                            <ol className="mt-4 space-y-2 text-emerald-100/80">
                                <li>
                                    1) Fetch location-based irradiance (GHI) and weather inputs.
                                </li>
                                <li>
                                    2) Use AI forecasting (SARIMAX) to predict irradiance patterns.
                                </li>
                                <li>
                                    3) Convert forecast into energy yield using physics-based calculations.
                                </li>
                                <li>
                                    4) Run tilt/orientation optimization to maximize annual yield.
                                </li>
                                <li>
                                    5) Generate ROI metrics and concise AI recommendations; export a PDF report if needed.
                                </li>
                            </ol>
                        </section>

                        {/* Target audience */}
                        <section className="rounded-2xl border border-emerald-500/20 bg-white/5 backdrop-blur-md p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 grid place-items-center">
                                    <Users className="h-5 w-5 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-semibold text-white">
                                    Target Audience
                                </h2>
                            </div>

                            <p className="text-emerald-100/80 leading-relaxed">
                                SolarOpti.AI is designed primarily for Indian homeowners planning
                                rooftop solar, and also for engineers, installers, students, and
                                NGOs working on rural electrification and solar adoption.
                            </p>

                            <ul className="mt-4 space-y-2 text-emerald-100/80">
                                <li>• Homeowners who need clear payback and savings clarity.</li>
                                <li>• Engineers/installers who want standardized simulations and reports.</li>
                                <li>• Students and researchers who want a practical, resume-grade tool.</li>
                                <li>• NGOs supporting rural solar sizing under tight budgets.</li>
                            </ul>
                        </section>
                    </div>

                    {/* Why solar */}
                    <section className="mt-10 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-green-500/5 p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 grid place-items-center">
                                <Sun className="h-5 w-5 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-semibold text-white">Why Solar?</h2>
                        </div>

                        <p className="text-emerald-100/80 leading-relaxed">
                            Solar energy reduces dependence on grid electricity and helps lower
                            long-term energy costs, while also supporting cleaner energy
                            adoption at scale—especially important in fast-growing regions.
                        </p>

                        <p className="mt-4 text-emerald-100/80 leading-relaxed">
                            Solar becomes even more valuable when planning is accurate: the right
                            tilt/orientation, realistic yield prediction, and clear ROI can
                            prevent undersizing/oversizing, reduce waste, and increase real-world
                            performance.
                        </p>
                    </section>

                    {/* Reports */}
                    <section className="mt-8 rounded-2xl border border-emerald-500/20 bg-white/5 backdrop-blur-md p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 grid place-items-center">
                                <FileText className="h-5 w-5 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-semibold text-white">
                                What You Get
                            </h2>
                        </div>

                        <ul className="space-y-2 text-emerald-100/80">
                            <li>• Location-based solar yield forecasting and monthly/annual projections.</li>
                            <li>• ROI analysis: savings, payback period, and clarity before purchase.</li>
                            <li>• Optimization suggestions for better energy capture and system decisions.</li>
                            <li>• Exportable PDF reports for sharing with clients or family.</li>
                        </ul>
                    </section>
                </div>
            </main>


        </div>
    );
};

export default About;
