import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/simplify-tap/Navbar";
import { Footer } from "@/components/simplify-tap/Footer";
import { Check, ArrowRight, User, Briefcase, Building, Mail, Lock, Loader2, CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSignUp, useAuth, useUser } from "@clerk/clerk-react";
import { supabase, createClerkSupabaseClient } from "@/lib/supabase";
import { useSupabase } from "@/hooks/useSupabase";

const logo = "https://image2url.com/images/1766048702496-c162cdbc-a508-4446-afbc-21e8ac31403a.jpg";

const CreateCard = () => {
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { getToken } = useAuth();
  const { user, isSignedIn } = useUser();
  const supabaseClient = useSupabase();

  const [step, setStep] = useState(1); // 1 = Details, 2 = Email, 3 = Verification
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    company: "",
    email: "",
    password: "",
    code: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Collect Personal Details
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      toast.error("Please enter your name.");
      return;
    }

    // Existing User Flow: Create Card Directly
    if (isSignedIn && user) {
      setIsLoading(true);
      try {
        console.log("Creating additional card for user:", user.id);
        const username = `${formData.firstName}${formData.lastName}${Math.floor(Math.random() * 1000)}`
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '');

        // Check Team Membership Constraint
        // 1. Check if user belongs to a team (via team_members table OR if existing profile has team_id)
        // Actually, easiest is to check existing profiles count if we want to limit EVERYONE or just team members?
        // User requested: "only one card" for team members.

        // Let's check if they have ANY profile with a team_id
        const { data: existingProfiles } = await supabaseClient
          .from("profiles")
          .select("team_id")
          .eq("clerk_user_id", user.id);

        const isTeamMember = existingProfiles?.some(p => p.team_id);

        if (isTeamMember && existingProfiles && existingProfiles.length > 0) {
          toast.error("Team members are limited to one digital card.");
          setIsLoading(false);
          return;
        }

        const { error: dbError } = await supabaseClient
          .from("profiles")
          .insert({
            clerk_user_id: user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            job_title: formData.title,
            company: formData.company,
            email: formData.email || user.primaryEmailAddress?.emailAddress || "",
            card_mail: formData.email || user.primaryEmailAddress?.emailAddress || "",
            updated_at: new Date().toISOString(),
            username: username,
            is_premium: false // New cards start as free unless logic changes
          });

        if (dbError) throw dbError;

        toast.success("New card created successfully!");
        navigate("/dashboard");
      } catch (err: any) {
        console.error("Create additional card error:", err);
        toast.error("Failed to create card: " + (err.message || "Unknown error"));
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // New User Flow
    setStep(2);
  };

  // Step 2: Create Account (Clerk SignUp)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      // 1. Create Clerk User
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // 2. Start Email Verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      toast.success("Verification code sent to your email.");
      setStep(3);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      const errorMsg = err.errors?.[0]?.message || "Something went wrong. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Verify OTP & Save to Supabase (Strict Flow)
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      console.log("Starting verification...");
      // 1. Verify Email
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: formData.code,
      });

      console.log("Verification Result:", completeSignUp.status);

      if (completeSignUp.status !== "complete") {
        throw new Error("Verification failed. Please try again.");
      }

      const userId = completeSignUp.createdUserId;
      if (!userId) throw new Error("User ID missing.");

      // 2. Set Active Session (Wait for this!)
      console.log("Setting active session...");
      if (completeSignUp.createdSessionId) {
        await setActive({ session: completeSignUp.createdSessionId });
      }

      // 3. Get Auth Token for RLS
      // Try to get fresh token immediately (window.Clerk often has it after setActive)
      let token = null;
      try {
        // @ts-ignore
        if (window.Clerk?.session) {
          // @ts-ignore
          token = await window.Clerk.session.getToken({ template: 'supabase' });
        }
      } catch (e) { console.warn("window.Clerk token fetch failed", e); }

      if (!token) {
        // Fallback to hook
        token = await getToken({ template: 'supabase' });
      }

      console.log("Token acquired:", !!token);

      // 4. Insert Profile to Supabase
      console.log("Saving to Supabase (Blocking)...", userId);

      const authenticatedClient = createClerkSupabaseClient(token);

      // Generate username for first user
      // Generate username for first user
      const username = `${formData.firstName}${formData.lastName}${Math.floor(Math.random() * 1000)}`
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

      // Check for Team Invitation
      // We can check if their email exists in 'team_members' with status 'invited'
      // Note: The new user might not have permission to read 'team_members' except for their own email row (if we added that policy).
      // Assuming 'public' read or 'authenticated' read for team_members where email = user.email.

      let assignedTeamId = null;
      try {
        const { data: invite } = await authenticatedClient
          .from("team_members")
          .select("team_id")
          .eq("email", formData.email.toLowerCase()) // Ensure case match
          .maybeSingle();

        if (invite) {
          assignedTeamId = invite.team_id;
          console.log("Found Team Invite:", assignedTeamId);

          // Optionally update status to 'active'
          await authenticatedClient
            .from("team_members")
            .update({ status: 'active' })
            .eq("email", formData.email.toLowerCase());
        }
      } catch (err) {
        console.warn("Error checking team invites:", err);
      }

      const { error: dbError } = await authenticatedClient
        .from("profiles")
        .insert(
          {
            clerk_user_id: userId,
            first_name: formData.firstName,
            last_name: formData.lastName,
            job_title: formData.title,
            company: formData.company,
            email: formData.email,
            card_mail: formData.email,
            updated_at: new Date().toISOString(),
            username: username,
            team_id: assignedTeamId, // Assign Team ID
            is_premium: !!assignedTeamId // Team members get Premium perks
          }
        );

      if (dbError) {
        console.error("Supabase Write Error:", dbError);
        // Do NOT redirect on error
        throw new Error("Failed to save profile data. Please try again.");
      }

      toast.success("Account created successfully!");

      // 5. Redirect immediately
      navigate("/profile");

    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      const errorMsg = err.errors?.[0]?.message || err.message || "Verification failed.";
      toast.error(errorMsg);
      setIsLoading(false); // Only stop loading on error.
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4 min-h-[80vh] flex items-center">
        <div className="container mx-auto max-w-xl">
          <div className="text-center mb-8">
            <img src={logo} alt="Simplify Tap" className="h-16 w-auto mx-auto mb-6 rounded object-contain" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {step === 1 && (isSignedIn ? "Create a New Card" : "Tell us about yourself")}
              {step === 2 && "Create your account"}
              {step === 3 && "Verify your email"}
            </h1>
            <p className="text-muted-foreground">
              {step === 1 && (isSignedIn ? "Enter details for your new digital card." : "This will appear on your digital business card.")}
              {step === 2 && "Enter your email to save your card."}
              {step === 3 && `Enter the code sent to ${formData.email}`}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">

            {/* Step 1: Personal Details */}
            {step === 1 && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="pl-9 h-12"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="title"
                      name="title"
                      placeholder="Product Designer"
                      value={formData.title}
                      onChange={handleChange}
                      className="pl-9 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="company"
                      name="company"
                      placeholder="Acme Inc."
                      value={formData.company}
                      onChange={handleChange}
                      className="pl-9 h-12"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2 mt-4" disabled={isLoading}>
                  {isSignedIn ? (
                    <>
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      Create Card
                    </>
                  ) : (
                    <>
                      Next Step
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Step 2: Email & Password (Account Creation) */}
            {step === 2 && (
              <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-in">
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
                  <Label htmlFor="password">Create Password</Label>
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
                      minLength={8}
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2 mt-4" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-4"
                  disabled={isLoading}
                >
                  Back to details
                </button>
              </form>
            )}

            {/* Step 3: Verification */}
            {step === 3 && (
              <form onSubmit={handleVerificationSubmit} className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="123456"
                    value={formData.code}
                    onChange={handleChange}
                    className="h-12 text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Check your email inbox and spam folder.
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2 mt-4" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-4"
                  disabled={isLoading}
                >
                  Back to email
                </button>
              </form>
            )}

            <p className="text-xs text-muted-foreground text-center mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have a card?{" "}
              {isSignedIn ? (
                <Link to="/dashboard" className="text-primary hover:underline">Go to Dashboard</Link>
              ) : (
                <Link to="/signin" className="text-primary hover:underline">Sign in</Link>
              )}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CreateCard;
