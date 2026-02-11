import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/simplify-tap/Navbar";
import { Footer } from "@/components/simplify-tap/Footer";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSignIn } from "@clerk/clerk-react";

const logo = "https://image2url.com/images/1766048702496-c162cdbc-a508-4446-afbc-21e8ac31403a.jpg";

const SignIn = () => {
    const navigate = useNavigate();
    const { isLoaded, signIn, setActive } = useSignIn();

    // Views: 'signin' | 'forgot_email' | 'forgot_code'
    const [view, setView] = useState<'signin' | 'forgot_email' | 'forgot_code'>('signin');

    const [loading, setLoading] = useState(false);

    // Login Data
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Reset Data
    const [resetEmail, setResetEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 1. Standard Sign In
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;
        setLoading(true);

        try {
            const result = await signIn.create({
                identifier: formData.email,
                password: formData.password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                toast.success("Welcome back!");
                navigate("/dashboard");
            } else {
                console.log("Login incomplete", result);
                toast.error("Login incomplete. Additional steps may be required.");
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            const errorMsg = err.errors?.[0]?.message || "Invalid email or password.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // 2. Request Password Reset (Send OTP)
    const handleSendResetCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;
        setLoading(true);

        try {
            // First check if email exists/is valid by trying to start a reset flow
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: resetEmail,
            });

            toast.success("Reset code sent to your email.");
            setView("forgot_code");
        } catch (err: any) {
            console.error("Reset Request Error:", err);
            const code = err.errors?.[0]?.code;
            const msg = err.errors?.[0]?.message;

            if (code === "form_identifier_not_found") {
                toast.error("No account found with this email.");
            } else {
                toast.error(msg || "Failed to send reset code.");
            }
        } finally {
            setLoading(false);
        }
    };

    // 3. Verify OTP and Set New Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;
        setLoading(true);

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code: resetCode,
                password: newPassword,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                toast.success("Password reset successfully! You are now logged in.");
                navigate("/dashboard");
            } else {
                console.log("Reset incomplete", result);
                toast.error("Verification failed. Please check the code.");
            }
        } catch (err: any) {
            console.error("Reset Confirm Error:", err);
            const msg = err.errors?.[0]?.message || "Failed to reset password.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <section className="pt-32 pb-20 px-4 min-h-[80vh] flex items-center">
                <div className="container mx-auto max-w-md">
                    <div className="text-center mb-8">
                        <img src={logo} alt="Simplify Tap" className="h-16 w-auto mx-auto mb-6 rounded object-contain" />
                        <h1 className="text-3xl font-bold text-foreground mb-4">
                            {view === 'signin' ? "Welcome back" : view === 'forgot_email' ? "Reset Password" : "New Password"}
                        </h1>
                        <p className="text-muted-foreground">
                            {view === 'signin'
                                ? "Sign in to manage your digital card"
                                : view === 'forgot_email'
                                    ? "Enter your email to receive a verification code"
                                    : "Enter the code sent to your email and your new password"
                            }
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">

                        {/* VIEW 1: SIGN IN */}
                        {view === 'signin' && (
                            <form onSubmit={handleSignIn} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-9 h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <button
                                            type="button"
                                            onClick={() => { setResetEmail(formData.email); setView('forgot_email'); }}
                                            className="text-xs font-semibold text-primary hover:underline"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="pl-9 h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" size="lg" className="w-full gap-2 mt-2" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}

                        {/* VIEW 2: FORGOT - ENTER EMAIL */}
                        {view === 'forgot_email' && (
                            <form onSubmit={handleSendResetCode} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="resetEmail">Email address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="resetEmail"
                                            name="resetEmail"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            className="pl-9 h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" size="lg" className="w-full gap-2 mt-2" disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Verification Code"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => setView('signin')}
                                >
                                    Back to Sign In
                                </Button>
                            </form>
                        )}

                        {/* VIEW 3: FORGOT - ENTER CODE & NEW PASS */}
                        {view === 'forgot_code' && (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Verification Code</Label>
                                    <Input
                                        id="code"
                                        name="code"
                                        type="text"
                                        placeholder="Enter code from email"
                                        value={resetCode}
                                        onChange={(e) => setResetCode(e.target.value)}
                                        className="h-12 text-center tracking-widest font-mono text-lg"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            placeholder="New secure password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="pl-9 h-12"
                                            minLength={8}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" size="lg" className="w-full gap-2 mt-2" disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password & Login"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => setView('forgot_email')}
                                >
                                    Resend Code / Change Email
                                </Button>
                            </form>
                        )}

                        {view === 'signin' && (
                            <div className="mt-6 text-center">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">
                                            New to Simplify Tap?
                                        </span>
                                    </div>
                                </div>

                                <Link to="/create">
                                    <Button variant="outline" className="w-full">
                                        Create free card
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default SignIn;
