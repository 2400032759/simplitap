import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/hooks/useSupabase";
import { useUser } from "@clerk/clerk-react";
import { Check, X, Building2, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export const TeamInvites = () => {
    const { user } = useUser();
    const supabase = useSupabase();
    const { toast } = useToast();
    const [invites, setInvites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.primaryEmailAddress?.emailAddress) return;

        const fetchInvites = async () => {
            try {
                const email = user.primaryEmailAddress!.emailAddress.toLowerCase();

                // Fetch invites where status is 'invited'
                const { data, error } = await supabase
                    .from("team_members")
                    .select("*, teams(name, company_name)")
                    .eq("email", email)
                    .eq("status", "invited");

                if (error) throw error;
                setInvites(data || []);
            } catch (err) {
                console.error("Error fetching invites:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInvites();
    }, [user, supabase]);

    const handleAccept = async (invite: any) => {
        setProcessing(invite.id);
        try {
            // 1. Update status to 'active'
            const { error: memberError } = await supabase
                .from("team_members")
                .update({ status: 'active' })
                .eq("id", invite.id);

            if (memberError) throw memberError;

            // 2. Link profile to team
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    team_id: invite.team_id,
                    is_premium: true // Teams grant premium
                })
                .eq("clerk_user_id", user?.id);

            if (profileError) throw profileError;

            toast({
                title: "Welcome to the Team!",
                description: `You have joined ${invite.teams?.name || "the team"}.`,
            });

            // Remove from local list
            setInvites(invites.filter(i => i.id !== invite.id));

            // Reload to refresh dashboard state
            window.location.reload();

        } catch (err: any) {
            console.error("Accept failed:", err);
            toast({
                title: "Error",
                description: "Failed to join team. Please try again.",
                variant: "destructive"
            });
        } finally {
            setProcessing(null);
        }
    };

    const handleDecline = async (invite: any) => {
        if (!confirm("Are you sure you want to decline this invitation?")) return;

        setProcessing(invite.id);
        try {
            // Update status to 'declined' (or delete?) - let's set to declined so admin knows
            // actually better to just delete or set status to 'left/declined'
            // For now, let's delete the row so they can be re-invited if needed
            const { error } = await supabase
                .from("team_members")
                .delete()
                .eq("id", invite.id);

            if (error) throw error;

            toast({
                title: "Declined",
                description: "Invitation declined.",
            });

            setInvites(invites.filter(i => i.id !== invite.id));

        } catch (err: any) {
            console.error("Decline failed:", err);
            toast({
                title: "Error",
                description: "Failed to decline.",
                variant: "destructive"
            });
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return null; // Don't show anything while loading
    if (invites.length === 0) return null;

    return (
        <div className="w-full max-w-6xl mx-auto mb-6 px-4">
            {invites.map((invite) => (
                <Card key={invite.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-sm mb-4">
                    <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-full text-blue-600 shadow-sm">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Team Invitation</h3>
                                <p className="text-slate-600">
                                    You have been invited to join <strong>{invite.teams?.company_name || invite.teams?.name || "a team"}</strong>.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="flex-1 sm:flex-none border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                onClick={() => handleDecline(invite)}
                                disabled={!!processing}
                            >
                                {processing === invite.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                                Decline
                            </Button>
                            <Button
                                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:scale-105"
                                onClick={() => handleAccept(invite)}
                                disabled={!!processing}
                            >
                                {processing === invite.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                Accept Invitation
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
