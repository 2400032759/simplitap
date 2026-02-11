import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/lib/supabase";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/simplify-tap/Navbar";
import { Footer } from "@/components/simplify-tap/Footer";
import { Check, Layout, Zap, QrCode, Briefcase, Loader2, Users, ArrowRight } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/lib/api";

const Plus = () => {
    const { user } = useUser();
    const authenticatedClient = useSupabase();
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [accessCode, setAccessCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [paymentLink, setPaymentLink] = useState("");
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [isInTeam, setIsInTeam] = useState(false);

    // Initialize details from user if available
    useEffect(() => {
        if (user?.primaryPhoneNumber?.phoneNumber) {
            setPhoneNumber(user.primaryPhoneNumber.phoneNumber);
        }
        if (user?.primaryEmailAddress?.emailAddress) {
            setEmail(user.primaryEmailAddress.emailAddress);
        }
    }, [user]);

    // Check Team Status
    useEffect(() => {
        const checkTeamStatus = async () => {
            if (!user || !authenticatedClient) return;
            const { data } = await authenticatedClient
                .from('profiles')
                .select('team_id')
                .eq('clerk_user_id', user.id)
                .maybeSingle();

            if (data?.team_id) {
                setIsInTeam(true);
            }
        };
        checkTeamStatus();
    }, [user, authenticatedClient]);

    const handleUpgradeClick = () => {
        setShowPaymentModal(true);
    };

    const handlePaymentSubmit = async () => {
        setPaymentProcessing(true);

        const isFreeAccess = accessCode.trim().toLowerCase() === "access";

        if (isFreeAccess) {
            // Existing logic for free access code
            setTimeout(async () => {
                const savedData = localStorage.getItem("user_card_data");
                const data = savedData ? JSON.parse(savedData) : {};

                const updatedData = {
                    ...data,
                    isPremium: true,
                    plan: "evangelist"
                };
                localStorage.setItem("user_card_data", JSON.stringify(updatedData));

                // Sync to Database
                if (user && authenticatedClient) {
                    try {
                        await authenticatedClient
                            .from('profiles')
                            .update({
                                is_premium: true,
                                plan_type: 'evangelist',
                                subscription_status: 'active'
                            })
                            .eq('clerk_user_id', user.id);
                    } catch (err) {
                        console.error("Failed to sync premium status to DB:", err);
                    }
                }

                setPaymentProcessing(false);
                setShowPaymentModal(false);
                setShowSuccess(true);
            }, 1000);
            return;
        }

        // Razorpay Logic (Node.js Backend Integration)
        const res = await loadRazorpayScript();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setPaymentProcessing(false);
            return;
        }

        try {
            // Validate Phone & Email before creating subscription
            if (!phoneNumber || phoneNumber.length < 10) {
                alert("Please enter a valid phone number.");
                setPaymentProcessing(false);
                return;
            }
            if (!email || !email.includes('@')) {
                alert("Please enter a valid email address.");
                setPaymentProcessing(false);
                return;
            }

            // 1. Create Subscription via Backend
            const result = await fetch(`${API_BASE_URL}/api/create-subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planType: 'plus',
                    userId: user?.id,
                    customerEmail: email,
                    customerPhone: phoneNumber,
                    customerName: user?.fullName || "User",
                    quantity: 499 // Send amount as quantity for ₹1 plan strategy
                })
            });

            const resultText = await result.text();
            let data;
            try {
                data = JSON.parse(resultText);
            } catch (e) {
                console.error("API Response was not JSON:", resultText);
                throw new Error(`Server Error: ${result.status} ${result.statusText}`);
            }

            if (!result.ok) {
                throw new Error(data.error || 'Failed to create subscription');
            }

            const { subscriptionId, keyId, shortUrl } = data;

            // Store payment link as fallback
            if (shortUrl) {
                setPaymentLink(shortUrl);
            }

            // 2. Open Razorpay Checkout
            // Close the local modal FIRST to prevent focus traps/overlays interfering with Razorpay
            setShowPaymentModal(false);

            const options = {
                key: keyId,
                // amount: 100, // OMITTED for Subscriptions
                // currency: "INR", // OMITTED for Subscriptions
                name: "Simplify Tap",
                description: "Plus Plan Subscription",
                subscription_id: subscriptionId,

                // FORCE QR & UPI IMMEDIATE LOAD
                method: {
                    upi: true,
                    card: true,
                    netbanking: false,
                    wallet: false,
                    emi: false
                },
                upi: {
                    flow: "collect",
                    qr: true
                },
                readonly: {
                    email: false,
                    contact: false
                },

                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch(`${API_BASE_URL}/api/verify-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_subscription_id: response.razorpay_subscription_id,
                                razorpay_signature: response.razorpay_signature,
                                userId: user?.id,
                                planType: 'plus'
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            setShowSuccess(true);
                        } else {
                            alert('Payment verification failed: ' + verifyData.message);
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Payment verification error');
                    }
                },
                prefill: {
                    name: user?.fullName || "User",
                    email: email,
                    contact: phoneNumber
                },
                theme: {
                    color: "#0F172A"
                },
                modal: {
                    ondismiss: async function () {
                        console.log("Checkout closed by user, checking status...");

                        try {
                            const checkRes = await fetch(`${API_BASE_URL}/api/check-subscription-status`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    subscriptionId: subscriptionId,
                                    userId: user?.id,
                                    planType: 'plus'
                                })
                            });

                            const checkData = await checkRes.json();
                            if (checkData.success) {
                                console.log("Payment was actually successful!");
                                setShowSuccess(true);
                                setShowPaymentModal(false); // Ensure our modal is closed
                            } else {
                                console.log("Payment incomplete: " + checkData.status);
                            }
                        } catch (err) {
                            console.error("Failed to check status", err);
                        }

                        setPaymentProcessing(false);
                    },
                    backdropclose: false,
                    escape: true,
                    animation: true
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

            // Browser Fix: Ensure iframe is clickable
            setTimeout(() => {
                const iframe = document.querySelector("iframe[class^='razorpay']");
                if (iframe) {
                    (iframe as HTMLElement).style.pointerEvents = "auto";
                }
            }, 500);

            // 4. Active Polling: Check status every 2 seconds
            // This handles cases where the user pays on phone but the desktop browser doesn't receive the socket event.
            const pollInterval = setInterval(async () => {
                try {
                    const checkRes = await fetch(`${API_BASE_URL}/api/check-subscription-status`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            subscriptionId: subscriptionId,
                            userId: user?.id,
                            planType: 'plus'
                        })
                    });
                    const checkData = await checkRes.json();

                    if (checkData.success) {
                        console.log("Polling success: Payment completed!");
                        clearInterval(pollInterval);

                        // Force close Razorpay UI
                        // There isn't a clean public API to close it from outside without the instance, 
                        // but updating our own UI is the priority.
                        // Ideally: paymentObject.close() if valid, but often restricted.

                        setShowPaymentModal(false);
                        setShowSuccess(true);
                        setPaymentProcessing(false);

                        // Try to close iframe visually if it persists
                        const rzpFrame = document.querySelector('.razorpay-container');
                        if (rzpFrame) rzpFrame.remove();
                    }
                } catch (e) {
                    console.error("Polling error", e);
                }
            }, 2000);

            // Validate clearing the interval eventually to prevent leaks
            setTimeout(() => clearInterval(pollInterval), 180000); // Stop after 3 mins

        } catch (err: any) {
            console.error("Payment Error:", err);
            alert('Payment initialization failed: ' + err.message);
            setPaymentProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] pb-24 md:pb-0">
            <Navbar />

            <main className="pt-28 md:pt-36 pb-12 px-6 md:px-8 max-w-5xl mx-auto">

                {/* HERO SECTION */}
                <div className="mb-12 md:mb-16 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#0F172A] mb-6 leading-[1.1]">
                        Full control over your <br className="hidden md:block" /> professional identity.
                    </h1>

                    <p className="text-lg md:text-xl text-[#64748B] leading-relaxed mb-8 max-w-2xl font-normal">
                        Remove branding, customize your card, and unlock insights — <br className="hidden md:block" /> built for modern professionals.
                    </p>

                    <div className="flex flex-col items-start gap-2 mb-10">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl font-bold text-[#0F172A] tracking-tight">₹499</span>
                            <span className="text-[#64748B] line-through text-lg">₹999</span>
                        </div>
                        <span className="text-sm text-primary font-semibold">Special Launch Pricing</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Button
                            onClick={handleUpgradeClick}
                            disabled={loading}
                            className="h-12 px-8 rounded-2xl text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all w-full sm:w-auto"
                        >
                            {loading ? "Processing..." : "Upgrade to Plus"}
                        </Button>
                        <button
                            onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="h-12 px-6 rounded-2xl text-base font-medium text-[#64748B] hover:text-[#0F172A] bg-white border border-gray-200 hover:border-gray-300 transition-colors w-full sm:w-auto"
                        >
                            Compare plans
                        </button>
                    </div>
                </div>

                {/* VALUE CARDS - 2x2 Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Layout className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#0F172A] text-sm md:text-base">Brand Control</h3>
                            <p className="text-xs text-[#64748B] mt-1">Remove all branding</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                            <Zap className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#0F172A] text-sm md:text-base">Growth & Insights</h3>
                            <p className="text-xs text-[#64748B] mt-1">Track views & clicks</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#0F172A] text-sm md:text-base">Custom QR</h3>
                            <p className="text-xs text-[#64748B] mt-1">Connect instantly</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                            <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#0F172A] text-sm md:text-base">Professional Tools</h3>
                            <p className="text-xs text-[#64748B] mt-1">Export & manage</p>
                        </div>
                    </div>
                </div>

                {/* PRICING COMPARISON - Stacked Cards */}
                <div id="pricing-section" className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto scroll-mt-32">
                    {/* Free Card */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col h-full">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-[#0F172A]">Free</h3>
                            <p className="text-[#64748B] mt-1">Basic digital card</p>
                        </div>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-4xl font-bold text-[#0F172A]">₹0</span>
                            <span className="text-[#64748B]">/forever</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Custom Link",
                                "Basic QR Code",
                                "Activate NFC Device",
                                "Profile Essentials (Bio, Banner, Socials)",
                                "Simplify Tap Branding"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-[#0F172A]">
                                    <Check className="w-4 h-4 text-[#64748B]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Plus Card - Highlighted */}
                    <div className="bg-white p-8 rounded-3xl border-2 border-primary shadow-xl shadow-primary/5 flex flex-col h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider">
                            Most Popular
                        </div>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-[#0F172A]">Plus</h3>
                            <p className="text-[#64748B] mt-1">Full professional suite</p>
                        </div>
                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-4xl font-bold text-[#0F172A]">₹499</span>
                            <span className="text-[#64748B] line-through text-sm">₹999</span>
                            <span className="text-[#64748B] text-xs">/year</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Everything in Free",
                                "Remove Simplify Tap Branding",
                                "Add Company Logo",
                                "Custom Themes",
                                "Custom QR Code",
                                "Advanced Integrations",
                                "Up to 2 Cards (Multi-business)"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#0F172A]">
                                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Check className="w-2.5 h-2.5 text-primary" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Button
                            onClick={handleUpgradeClick}
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-md shadow-primary/10"
                        >
                            {loading ? "Processing..." : "Upgrade to Plus"}
                        </Button>
                    </div>
                </div>

                {/* TEAMS LINK */}
                <div className="text-center mb-12">
                    <p className="text-[#64748B] text-sm">
                        Need to manage multiple cards? <Link to="/teams" className="text-primary hover:text-[#0D8C96] font-medium hover:underline">Check out Teams</Link>
                    </p>
                </div>

                {/* TRUST FOOTER */}
                <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#64748B]">
                    <div className="flex gap-6 font-medium">
                        <span>Cancel anytime</span>
                        <span>No contracts</span>
                    </div>
                    <div className="text-[#94A3B8]">
                        Trusted by modern professionals
                    </div>
                </div>

            </main>

            {/* STICKY MOBILE CTA */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="font-bold text-[#0F172A]">Plus</span>
                        <span className="text-xs text-[#64748B]">₹499/year</span>
                    </div>
                    <Button
                        onClick={handleUpgradeClick}
                        disabled={loading}
                        className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20"
                    >
                        {loading ? "..." : "Upgrade"}
                    </Button>
                </div>
            </div>

            {/* Spacer for mobile footer */}
            <div className="h-4 md:hidden"></div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center ring-1 ring-black/5">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Welcome to Plus</h2>
                        <p className="text-[#64748B] mb-8 leading-relaxed">
                            Your professional identity is now fully unlocked.
                        </p>
                        <div className="space-y-3">
                            <Link to="/profile">
                                <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium">
                                    Customize Brand
                                </Button>
                            </Link>
                            <Link to="/dashboard">
                                <Button variant="ghost" className="w-full h-12 rounded-xl text-[#64748B] hover:text-[#0F172A] font-medium hover:bg-gray-50">
                                    Return to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <DialogContent className="sm:max-w-md bg-white rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
                    {isInTeam ? (
                        /* TEAM CONFLICT VIEW */
                        <>
                            <div className="bg-amber-50 p-6 text-center border-b border-amber-100">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                                    <Users className="w-6 h-6 text-amber-600" />
                                </div>
                                <h2 className="text-xl font-bold text-amber-900">Upgrade Unavailable</h2>
                            </div>
                            <div className="p-8 text-center">
                                <p className="text-[#64748B] mb-6 leading-relaxed">
                                    You are currently a member of a <strong>Team</strong>. The Plus plan is designed for individual professionals and cannot be active while you are in a team.
                                </p>

                                <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left border border-slate-100">
                                    <h4 className="font-semibold text-[#0F172A] mb-2 text-sm">To upgrade to Plus:</h4>
                                    <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2">
                                        <li>Go to your Team Dashboard.</li>
                                        <li>Leave your current team.</li>
                                        <li>Return here to activate Plus.</li>
                                    </ol>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Link to="/teams" onClick={() => setShowPaymentModal(false)}>
                                        <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold">
                                            Go to Team Dashboard
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowPaymentModal(false)}
                                        className="w-full text-slate-500"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* NORMAL PAYMENT VIEW */
                        <>
                            <div className="bg-primary p-6 text-center">
                                <h2 className="text-xl font-bold text-white">Complete Your Upgrade</h2>
                                <p className="text-white/80 text-sm mt-1">Unlock seamless professional tools</p>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                                    <div>
                                        <p className="font-semibold text-[#0F172A]">Plus Plan</p>
                                        <p className="text-xs text-[#64748B]">Early Evangelist License</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-[#0F172A]">₹499</span>
                                        <p className="text-[10px] text-gray-400">/ year (Renews Autopay)</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-[#64748B]">
                                            Email Address <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            placeholder="Where should we send the invoice?"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-medium text-[#64748B]">
                                            Phone Number <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            placeholder="Required for billing (e.g. 9876543210)"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="code" className="text-sm font-medium text-[#64748B]">
                                            For Early Evangelists
                                        </Label>
                                        <Input
                                            id="code"
                                            placeholder="Enter access code (Optional)"
                                            value={accessCode}
                                            onChange={(e) => setAccessCode(e.target.value)}
                                            className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <DialogFooter className="mt-8 flex-col sm:justify-center gap-2">
                                    <Button
                                        onClick={handlePaymentSubmit}
                                        disabled={paymentProcessing}
                                        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-base transition-all"
                                    >
                                        {paymentProcessing ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processing...
                                            </span>
                                        ) : (
                                            accessCode.trim().toLowerCase() === "access" ? "Unlock for Free" : "Pay ₹499 & Subscribe"
                                        )}
                                    </Button>

                                    {paymentLink && (
                                        <div className="pt-4 text-center animate-in fade-in slide-in-from-bottom-2">
                                            <p className="text-xs text-gray-500 mb-2">Having trouble with the popup?</p>
                                            <a
                                                href={paymentLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary hover:underline text-sm font-medium"
                                            >
                                                Pay via Secure Link &rarr;
                                            </a>
                                        </div>
                                    )}
                                </DialogFooter>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Helper to load Razorpay script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default Plus;
