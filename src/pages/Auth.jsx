import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from '../../assets/SolarOpti-logo.png';

export default function Auth() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("login"); // "login" | "register"

    const title = useMemo(
        () => (mode === "login" ? "Welcome Back" : "Create an Account"),
        [mode]
    );

    const subtitle = useMemo(
        () =>
            mode === "login"
                ? "Sign in to save designs and export reports."
                : "Register to save designs and export reports.",
        [mode]
    );

    const onSubmit = (e) => {
        e.preventDefault();
        // Dummy for now. Later: call your backend and store JWT.
        navigate("/get-started");
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col">


            <div className="flex-1 relative bg-transparent overflow-hidden flex items-center justify-center py-16 px-4">
                {/* Emerald glow effects */}
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#10B981] opacity-10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#34D399] opacity-10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10 animate-fade-in">
                    <div className="text-center mb-8">
                        <img src={logo} alt="SolarOpti.AI Logo" className="h-12 w-auto mx-auto mb-4" />
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                            {title}
                        </h1>
                        <p className="mt-3 text-emerald-100/80">
                            {subtitle}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/20 bg-white/5 backdrop-blur-md p-6 md:p-8 shadow-2xl">
                        <form onSubmit={onSubmit} className="space-y-5">
                            {mode === "register" && (
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm text-emerald-100/80 mb-1">Name</label>
                                    <input
                                        id="name"
                                        placeholder="E.g. Uma"
                                        autoComplete="name"
                                        className="w-full rounded-xl bg-black/40 border border-emerald-500/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-300"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm text-emerald-100/80 mb-1">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                    className="w-full rounded-xl bg-black/40 border border-emerald-500/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm text-emerald-100/80 mb-1">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full rounded-xl bg-black/40 border border-emerald-500/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-300"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-xl px-5 py-3 bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition duration-300 shadow-lg shadow-emerald-500/25"
                            >
                                {mode === "login" ? "Sign In" : "Create Account"}
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-emerald-500/20"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[#050B0A] text-emerald-100/60 rounded-full border border-emerald-500/10">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/Index")}
                                className="w-full rounded-xl px-5 py-3 border border-emerald-500/30 text-emerald-400 font-medium hover:bg-emerald-500/10 transition duration-300"
                            >
                                Continue as Guest
                            </button>

                            <div className="mt-6 text-center text-sm text-emerald-100/70">
                                {mode === "login" ? (
                                    <p>
                                        Don't have an account?{" "}
                                        <button
                                            type="button"
                                            className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline underline-offset-4 transition-colors"
                                            onClick={() => setMode("register")}
                                        >
                                            Register here
                                        </button>
                                    </p>
                                ) : (
                                    <p>
                                        Already have an account?{" "}
                                        <button
                                            type="button"
                                            className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline underline-offset-4 transition-colors"
                                            onClick={() => setMode("login")}
                                        >
                                            Sign in
                                        </button>
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>


        </div>
    );
}
