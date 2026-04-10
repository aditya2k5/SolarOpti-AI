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
        navigate("/get-started");
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col transition-colors duration-300">
            <div className="flex-1 relative bg-transparent overflow-hidden flex items-center justify-center py-16 px-4">
                {/* Emerald glow effects */}
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#10B981] opacity-10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#34D399] opacity-10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10 animate-fade-in">
                    <div className="text-center mb-8">
                        <img src={logo} alt="SolarOpti.AI Logo" className="h-12 w-auto mx-auto mb-4" />
                        <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                            {title}
                        </h1>
                        <p className="mt-3 text-[var(--text-muted)]">
                            {subtitle}
                        </p>
                    </div>

                    <div className="card p-6 md:p-8 shadow-2xl">
                        <form onSubmit={onSubmit} className="space-y-5">
                            {mode === "register" && (
                                <div className="space-y-2 text-left">
                                    <label htmlFor="name" className="block text-sm text-[var(--text-primary)] mb-1">Name</label>
                                    <input
                                        id="name"
                                        placeholder="E.g. Uma"
                                        autoComplete="name"
                                        className="w-full rounded-xl bg-[var(--background)] border border-[var(--border-emerald)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] opacity-80 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 transition-all duration-300"
                                    />
                                </div>
                            )}

                            <div className="space-y-2 text-left">
                                <label htmlFor="email" className="block text-sm text-[var(--text-primary)] mb-1">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                    className="w-full rounded-xl bg-[var(--background)] border border-[var(--border-emerald)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] opacity-80 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 transition-all duration-300"
                                />
                            </div>

                            <div className="space-y-2 text-left">
                                <label htmlFor="password" className="block text-sm text-[var(--text-primary)] mb-1">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full rounded-xl bg-[var(--background)] border border-[var(--border-emerald)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] opacity-80 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 transition-all duration-300"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full"
                            >
                                {mode === "login" ? "Sign In" : "Create Account"}
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[var(--border-emerald)]"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    {/* FIXED: The span background now matches the card surface, not a hardcoded dark color */}
                                    <span className="px-3 bg-[var(--background)] text-[var(--text-muted)] rounded-full border border-[var(--border-emerald)]">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/Index")}
                                className="btn-outline w-full py-3"
                            >
                                Continue as Guest
                            </button>

                            <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
                                {mode === "login" ? (
                                    <p>
                                        Don't have an account?{" "}
                                        <button
                                            type="button"
                                            className="text-[#10B981] font-semibold hover:text-[#34D399] hover:underline underline-offset-4 transition-colors"
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
                                            className="text-[#10B981] font-semibold hover:text-[#34D399] hover:underline underline-offset-4 transition-colors"
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