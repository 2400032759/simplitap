import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/simplify-tap/Navbar";
import { Footer } from "@/components/simplify-tap/Footer";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Users, Building2, Layout, Shield, ArrowRight, Star, Sparkles } from "lucide-react";

const Pricing = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#0F172A] selection:bg-primary/10">
            <Navbar />

            <main className="pt-32 md:pt-44 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 md:mb-24 animate-in fade-in slide-in-from-top-10 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles className="w-3 h-3" />
                        Pricing Plans
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-[#0F172A] mb-6 leading-tight">
                        Plans for every <span className="text-primary italic">stage</span> of growth.
                    </h1>
                    <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto font-normal leading-relaxed">
                        From individuals to enterprise teams, we have the features you need to manage your professional identity.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative">
                    {/* Background Decorative Element */}
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-br from-primary/5 via-blue-50/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

                    {/* FREE PLAN */}
                    <div className="group bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col hover:-translate-y-2">
                        <div className="mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:scale-110 transition-transform">
                                <Layout className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Free</h3>
                            <p className="text-[#64748B] text-sm">Essentials for getting started.</p>
                        </div>

                        <div className="mb-8 items-baseline flex gap-1">
                            <span className="text-5xl font-bold text-[#0F172A]">₹0</span>
                            <span className="text-[#64748B] text-sm font-medium">/forever</span>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            {[
                                "1 Digital Business Card",
                                "Custom URL (simplifytap.com/v/you)",
                                "Standard Profile Templates",
                                "Unlimited Taps & Scans",
                                "Basic Social Links",
                                "Profile QR Code",
                                "Simplify Tap Branding"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-[#475569]">
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-slate-400" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link to="/create" className="mt-auto">
                            <Button variant="outline" className="w-full h-14 rounded-2xl border-gray-200 text-[#0F172A] font-bold hover:bg-gray-50 transition-all">
                                Get Started for Free
                            </Button>
                        </Link>
                    </div>

                    {/* PLUS PLAN */}
                    <div className="group relative bg-[#0F172A] rounded-[2rem] p-8 text-white shadow-2xl shadow-primary/20 flex flex-col hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                        {/* Glossy Overlay */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none" />

                        <div className="absolute top-6 right-6">
                            <div className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg animate-pulse">
                                Most Popular
                            </div>
                        </div>

                        <div className="mb-8 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform backdrop-blur-sm">
                                <Crown className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Plus</h3>
                            <p className="text-gray-400 text-sm">Full control over your brand.</p>
                        </div>

                        <div className="mb-8 relative z-10 flex flex-col">
                            <div className="flex items-center gap-3">
                                <span className="text-5xl font-bold text-white tracking-tight text-glow">₹499</span>
                                <span className="text-gray-400 line-through text-lg">₹999</span>
                            </div>
                            <span className="text-primary text-sm font-semibold mt-1">One-time payment or Monthly</span>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1 relative z-10">
                            {[
                                "Up to 2 Cards (Multi-business)",
                                "NO Simplify Tap Branding",
                                "Custom Branding & Themes",
                                "Add Company Logo & Banners",
                                "Advanced Profile Templates",
                                "Export Contacts via AI Scanner",
                                "Custom QR Code (Shapes & Colors)",
                                "Priority Email Support"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-primary" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link to="/plus" className="mt-auto relative z-10">
                            <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all group/btn">
                                Upgrade to Plus
                                <Zap className="w-4 h-4 ml-2 fill-current group-hover/btn:animate-bounce" />
                            </Button>
                        </Link>
                    </div>

                    {/* TEAMS PLAN */}
                    <div className="group bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col hover:-translate-y-2">
                        <div className="mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Teams</h3>
                            <p className="text-[#64748B] text-sm">Centralized control for organizations.</p>
                        </div>

                        <div className="mb-8 flex flex-col">
                            <div className="flex items-center gap-3">
                                <span className="text-5xl font-bold text-[#0F172A] tracking-tight">₹1499</span>
                                <span className="text-[#64748B] line-through text-lg">₹1999</span>
                            </div>
                            <span className="text-blue-600 text-sm font-semibold mt-1">Includes 5 Licenses</span>
                        </div>

                        <div className="bg-blue-50/50 rounded-2xl p-4 mb-8 border border-blue-100">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-blue-800 uppercase">Add-on License</span>
                                <span className="text-lg font-bold text-blue-900">₹99 <span className="text-xs font-normal opacity-70">/seat</span></span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            {[
                                "Admin Management Dashboard",
                                "Central Card Management",
                                "Locked Company Branding",
                                "Bulk Profile Creation",
                                "Team Analytics & Insights",
                                "Export all contacts to CRM",
                                "Custom Integrated Domains",
                                "Dedicated Account Manager"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-[#475569]">
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-blue-500" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link to="/teams" className="mt-auto">
                            <Button variant="outline" className="w-full h-14 rounded-2xl border-blue-100 bg-blue-50/20 text-blue-700 font-bold hover:bg-blue-50 transition-all">
                                Create Team
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Comparison Section (Simplified for Premium feel) */}
                <div className="max-w-4xl mx-auto py-20 border-t border-gray-100">
                    <h2 className="text-3xl font-bold text-[#0F172A] text-center mb-16">Frequently Asked Questions</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            { q: "Can I upgrade my individual account to a Team?", a: "Yes! You can convert your profile and manage multiple seats from the Teams dashboard." },
                            { q: "Are there any hidden recurring costs?", a: "Our Plus plan is currently a one-time purchase for early evangelists. Teams is billed per license." },
                            { q: "What happens if I need more than 5 seats?", a: "You can easily add additional licenses for just ₹99/license directly from your admin panel." },
                            { q: "Is the NFC card included in the plan?", a: "NFC cards are physical products sold separately. The digital profile is included in all plans." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-[#0F172A] mb-3">{item.q}</h4>
                                <p className="text-sm text-[#64748B] leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default Pricing;
