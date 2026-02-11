
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useSupabase } from "@/hooks/useSupabase";
import { useCallback } from "react";

export function useProfileRedirect() {
    const navigate = useNavigate();
    const { user } = useUser();
    const supabase = useSupabase();

    const checkProfileAndRedirect = useCallback(async () => {
        if (!user || !supabase) {
            // If dependencies aren't ready, we can't check yet.
            // Callers should ensure isLoaded/isSignedIn before calling.
            return;
        }

        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("job_title, company, website, bio, email, card_mail, phone")
                .eq("clerk_user_id", user.id)
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error("Profile check error:", error);
                // If error, safer to send to create/profile to fix issues or retry
                navigate("/create");
                return;
            }

            if (!data) {
                // No profile exists
                navigate("/create");
                return;
            }

            // If profile exists, go to dashboard. Don't force /create for missing optional fields.
            if (data) {
                navigate("/dashboard");
            } else {
                navigate("/create");
            }
        } catch (err) {
            console.error("Unexpected error checking profile:", err);
            navigate("/create");
        }
    }, [user, supabase, navigate]);

    return { checkProfileAndRedirect };
}
