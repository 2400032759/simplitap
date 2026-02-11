import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DigitalCard } from "@/components/simplify-tap/DigitalCard";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ExchangeContactModal } from "@/components/simplify-tap/ExchangeContactModal";
import { Lock } from "lucide-react";

const PublicCard = () => {
    const { id } = useParams<{ id: string }>();
    const [cardData, setCardData] = useState<any>(null);
    const [profileId, setProfileId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showExchangeModal, setShowExchangeModal] = useState(false);
    const viewLogged = useRef(false);
    const exchangeTimerRef = useRef<NodeJS.Timeout | null>(null);

    const logAnalytics = async (pid: string, type: string) => {
        // 1. Insert Event
        const { error } = await supabase
            .from('analytics_events')
            .insert({
                profile_id: pid,
                type: type
                // metadata: removed temporarily to bypass schema cache issue
            });

        if (error) {
            console.error("ANALYTICS INSERT FAILED:", JSON.stringify(error));
            // alert("Analytics Error: " + JSON.stringify(error)); // Uncomment if console is hard to see
        } else {
            console.log("Analytics event logged successfully:", type);
        }

        // 2. Increment Counter (RPC) - Best effort
        if (type === 'view') {
            await supabase.rpc('increment_view', { row_id: pid }).then(({ error }) => {
                if (error) console.error("RPC Error:", error);
            });
        } else if (type.startsWith('click')) {
            await supabase.rpc('increment_click', { row_id: pid });
        }
    };

    useEffect(() => {
        async function fetchCard() {
            if (!id) return;

            try {
                // Match by username OR clerk_user_id
                // Match by username OR clerk_user_id OR profile_id
                // IMPORTANT: Only check 'id' column if the param is a valid UUID to avoid Postgres errors
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

                let query = supabase.from("profiles").select("*, teams(*)");

                if (isUuid) {
                    // Try exact ID match first for precision
                    query = query.or(`id.eq.${id},username.eq.${id},clerk_user_id.eq.${id}`);
                } else {
                    // Not a UUID, so it must be a username or clerk user ID (if clerk IDs aren't uuids)
                    query = query.or(`username.eq.${id},clerk_user_id.eq.${id}`);
                }

                const fetchPromise = query.maybeSingle();

                const timeoutPromise = new Promise<{ data: null, error: any }>((resolve) =>
                    setTimeout(() => resolve({ data: null, error: "TIMEOUT" }), 6000)
                );

                const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

                if (error && error !== "TIMEOUT") {
                    console.error("Card fetch error:", error);
                }

                if (data) {
                    setProfileId(data.id);
                    // Log View Once
                    if (!viewLogged.current) {
                        viewLogged.current = true;
                        logAnalytics(data.id, 'view');
                    }

                    // Check for Global Premium Status (Account Level)
                    let isPremiumAccount = data.is_premium === true;
                    if (!isPremiumAccount && data.clerk_user_id) {
                        const { data: premiumCheck } = await supabase
                            .from('profiles')
                            .select('id')
                            .eq('clerk_user_id', data.clerk_user_id)
                            .eq('is_premium', true)
                            .limit(1)
                            .maybeSingle();

                        if (premiumCheck) isPremiumAccount = true;
                    }

                    const isPremium = isPremiumAccount;

                    // Determine final values, prioritizing Team settings if applicable
                    const companyName = data.teams?.company_name || data.company;
                    const themeId = data.teams?.theme_color || data.theme_color;
                    const companyLogo = data.teams?.logo_url || data.company_logo_url;
                    const isTeam = !!data.team_id || !!data.teams;

                    setCardData({
                        firstName: data.first_name,
                        lastName: data.last_name,
                        title: data.job_title,
                        company: companyName,
                        bio: data.bio,
                        phone: data.phone,
                        email: data.card_mail || data.email,
                        website: data.website,
                        linkedin: data.linkedin,
                        twitter: data.X,
                        instagram: data.Instagram,
                        mapLink: data.map_link,
                        logoUrl: data.avatar_url,
                        bannerUrl: isPremium ? data.banner_url : null,
                        themeColor: data.style?.customColors?.primary,
                        themeId: themeId,
                        companyLogoUrl: isPremium ? companyLogo : null,
                        socialLinks: data.social_links,
                        // Pass Style & Layout Settings from DB
                        sectionOrder: (() => {
                            let order = (data.style?.sectionOrder || ['profile', 'bio', 'social', 'contact', 'weblinks', 'video', 'gallery'])
                                .flatMap((s: any) => s === 'media' ? ['video', 'gallery'] : s);

                            // Ensure 'contact' is in the order for button rendering
                            if (!order.includes('contact')) {
                                const bioIndex = order.indexOf('bio');
                                if (bioIndex !== -1) {
                                    order.splice(bioIndex + 1, 0, 'contact');
                                } else {
                                    const socialIndex = order.indexOf('social');
                                    if (socialIndex !== -1) {
                                        order.splice(socialIndex, 0, 'contact');
                                    } else {
                                        order.push('contact');
                                    }
                                }
                            }
                            return order;
                        })(),
                        customComponents: data.style?.customComponents || [],
                        templateId: data.teams?.template_id || data.style?.templateId || "modern",
                        font: data.style?.font || "Inter",
                        cardStyle: data.style?.cardStyle || { borderRadius: 0, shadow: false, background: true },
                        visibleSections: data.style?.visibleSections || {},
                        customColors: data.teams?.style?.customColors || data.style?.customColors,
                        pageLoader: data.style?.pageLoader,

                        // Hotfix: Force premium for 'test' user if DB update failed, otherwise use DB value
                        isPremium: isPremium,
                        isTeam: isTeam,
                        isLocked: data.is_locked
                    });
                }
            } catch (err) {
                console.error("Error in public card load:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchCard();

        // Timer removed for manual trigger only
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!cardData) {
        return (
            <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Card Not Found</h1>
                    <p className="text-muted-foreground mb-4">The digital card you're looking for doesn't exist.</p>
                    <Link to="/">
                        <Button>Go Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (cardData.isLocked) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                    <h1 className="text-xl font-bold mb-2 text-gray-900">Profile Locked</h1>
                    <p className="text-gray-500">
                        This digital card has been temporarily locked by its owner.
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="w-screen h-[100dvh] overflow-hidden bg-white md:bg-gray-100 md:flex md:items-center md:justify-center">
            <div className="w-full h-full md:w-full md:max-w-md md:h-[90vh] md:shadow-2xl md:rounded-3xl overflow-hidden">
                <DigitalCard
                    showBranding={!cardData.isPremium}
                    premium={cardData.isPremium}
                    isTeam={cardData.isTeam}
                    userData={cardData}
                    onLinkClick={(type) => {
                        if (profileId) {
                            logAnalytics(profileId, `click_${type.toLowerCase()}`);
                        }
                    }}
                    onSaveContact={() => setShowExchangeModal(true)}
                />
            </div>

            {/* Exchange Contact Modal */}
            {cardData && profileId && (
                <ExchangeContactModal
                    open={showExchangeModal}
                    onOpenChange={setShowExchangeModal}
                    cardOwnerName={`${cardData.firstName} ${cardData.lastName}`}
                    cardOwnerId={profileId}
                    cardOwnerData={cardData}
                />
            )}
        </div>
    );
};

export default PublicCard;
