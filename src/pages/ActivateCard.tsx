
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/simplify-tap/Navbar";
import { useUser } from "@clerk/clerk-react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Ensure this component exists or use simple span
import { Loader2, Nfc, CheckCircle, AlertCircle, Smartphone, Wifi, CreditCard, Calendar, Box, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Adjust path if using sonner or other hook
import { Toaster } from "@/components/ui/toaster"; // Or just rely on App's toaster
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const ActivateCard = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const authenticatedClient = useSupabase();
    const { toast } = useToast();

    const [orderIdInput, setOrderIdInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [activatedCards, setActivatedCards] = useState<any[]>([]);

    // NFC Mock States
    const [showNfcModal, setShowNfcModal] = useState(false);
    const [nfcMode, setNfcMode] = useState<"read" | "write">("read");
    const [nfcStatus, setNfcStatus] = useState<"scanning" | "success" | "error">("scanning");

    // Fetch User's Orders (Treating them as "Activated Cards" for now)
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !authenticatedClient) return;

            setIsLoading(true);
            try {
                const { data, error } = await authenticatedClient
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setActivatedCards(data || []);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoaded && isSignedIn) {
            fetchOrders();
        }
    }, [user, isLoaded, isSignedIn, authenticatedClient]);

    // Helper for UUID check
    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    const handleActivate = async () => {
        const input = orderIdInput.trim();
        if (!input) {
            toast({ title: "Input Required", description: "Please enter a valid Order ID.", variant: "destructive" });
            return;
        }

        setIsActivating(true);

        try {
            if (!authenticatedClient || !user) throw new Error("Not authenticated");

            let query = authenticatedClient.from('orders').select('*');

            // Determine query based on ID format
            if (isUUID(input)) {
                query = query.eq('id', input);
            } else if (input.startsWith('order_')) {
                // Razorpay Order ID
                query = query.eq('razorpay_order_id', input);
            } else {
                // Fallback or invalid format
                // We'll search both just in case, using 'or' 
                // BUT 'or' requires correct syntax and casting for UUID which might fail if input is not UUID.
                // Safest to just error if format is clearly invalid for UUID and doesn't match razorpay prefix?
                // Actually, let's just assume it MIGHT be a payment ID or custom ID.
                // For now, strict: UUID or 'order_'.
                toast({ title: "Invalid Format", description: "Please use the full Order ID (UUID) or Razorpay Order ID (starts with order_).", variant: "destructive" });
                setIsActivating(false);
                return;
            }

            const { data, error } = await query.maybeSingle();

            if (error) throw error;

            if (!data) {
                toast({ title: "Not Found", description: "No order found with this ID.", variant: "destructive" });
                setIsActivating(false);
                return;
            }

            // 2. Verify Ownership
            if (data.user_id !== user.id) {
                toast({
                    title: "Access Denied",
                    description: "This order was not placed by your account. You cannot activate it here.",
                    variant: "destructive"
                });
                setIsActivating(false);
                return;
            }

            // 3. Verify Payment Status
            if (data.status !== 'paid') {
                toast({
                    title: "Activation Failed",
                    description: "This order is not marked as paid yet. Please complete payment.",
                    variant: "destructive"
                });
                setIsActivating(false);
                return;
            }

            // 4. Check if already in list (Client-side check for now)
            if (activatedCards.some(c => c.id === data.id)) {
                toast({ title: "Already Active", description: "This card is already active in your dashboard." });
            } else {
                toast({ title: "Success!", description: "Card activated successfully." });
                setActivatedCards([data, ...activatedCards]);
                setOrderIdInput("");
            }

        } catch (err: any) {
            console.error("Activation Error:", err);
            toast({ title: "Error", description: "Failed to verify order. Please try again.", variant: "destructive" });
        } finally {
            setIsActivating(false);
        }
    };

    const handleNfcAction = (mode: "read" | "write") => {
        setNfcMode(mode);
        setNfcStatus("scanning");
        setShowNfcModal(true);

        // Simulate NFC process
        setTimeout(() => {
            setNfcStatus("success");
            setTimeout(() => {
                setShowNfcModal(false);
                toast({
                    title: mode === "read" ? "Link Updated!" : "Write Successful!",
                    description: mode === "read" ? "Card link updated from NFC tag." : "Data successfully written to NFC card."
                });
            }, 1500);
        }, 3000);
    };

    if (!isLoaded) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
                    <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
                    <p className="text-slate-600 mb-6">You need to be logged in to activate and manage your cards.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
            <Navbar />

            <main className="pt-28 px-4 md:px-8 max-w-5xl mx-auto space-y-12">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <Nfc className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Activate Your Card</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Link your physical Simplify Tap card to your digital profile. Manage your orders and customize NFC settings.
                    </p>
                </div>

                {/* Activation Input Card */}
                <Card className="max-w-md mx-auto border-0 shadow-xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-900 text-white p-6">
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" /> Enter Order Detail
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                            Found in your email confirmation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Order ID</label>
                            <Input
                                placeholder="e.g. 123e4567-e89b..."
                                value={orderIdInput}
                                onChange={(e) => setOrderIdInput(e.target.value)}
                                className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary font-mono text-sm"
                            />
                            <p className="text-xs text-slate-500">
                                You can find your Order ID in the <Link to="/orders" className="text-primary hover:underline">My Orders</Link> page.
                            </p>
                        </div>
                        <Button
                            onClick={handleActivate}
                            disabled={isActivating || !orderIdInput}
                            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20 transition-all"
                        >
                            {isActivating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Activate Card"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Activated Cards List */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        Your Activated Cards
                    </h2>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                        </div>
                    ) : activatedCards.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-slate-900">No cards found</h3>
                            <p className="text-slate-500">Enter an Order ID above to get started.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {activatedCards.map((card) => (
                                <Card key={card.id} className="group hover:shadow-md transition-shadow duration-300 border-slate-100 rounded-2xl overflow-hidden bg-white">
                                    <div className="absolute top-0 right-0 p-4">
                                        <Badge className={`${card.status === 'paid' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'} border-0`}>
                                            {card.status === 'paid' ? 'Active' : 'Payment Pending'}
                                        </Badge>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            <Box className="w-5 h-5 text-slate-400" />
                                            Order #{card.id.slice(0, 8)}...
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-1 text-xs">
                                            <Calendar className="w-3 h-3" /> {new Date(card.created_at).toLocaleDateString()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 text-xs">Total Amount</p>
                                                <p className="font-semibold">₹{card.total_amount}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs">Items</p>
                                                <p className="font-semibold">{card.items?.length || 1} Cards</p>
                                            </div>
                                            <div className="col-span-2 mt-2 pt-2 border-t border-slate-100">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> Validity
                                                    </span>
                                                    {(() => {
                                                        // Check if this order contains a subscription-based product
                                                        const hasSubscription = card.items?.some((i: any) =>
                                                            i.id === 'google-review-nfc-card' ||
                                                            i.name?.toLowerCase().includes('review') // Fallback check
                                                        );

                                                        if (!hasSubscription) {
                                                            return <span className="text-sm font-bold text-slate-700">Lifetime</span>;
                                                        }

                                                        const expiryDate = new Date(card.created_at);
                                                        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 Year Validity
                                                        const now = new Date();
                                                        const diffTime = expiryDate.getTime() - now.getTime();
                                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                                        const isExpiringSoon = diffDays > 0 && diffDays <= 30;
                                                        const isExpired = diffDays <= 0;

                                                        return (
                                                            <span className={`text-sm font-bold ${isExpired ? 'text-red-600' :
                                                                isExpiringSoon ? 'text-amber-600' :
                                                                    'text-green-600'
                                                                }`}>
                                                                {isExpired ? "Expired" : `${diffDays} Days Remaining`}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* NFC Actions */}
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3">
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-slate-200 hover:bg-white hover:text-primary hover:border-primary transition-colors h-10 text-xs sm:text-sm font-medium"
                                                onClick={() => handleNfcAction("read")}
                                            >
                                                <Wifi className="w-4 h-4 mr-2 rotate-90" />
                                                Update Link (Read)
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-slate-200 hover:bg-white hover:text-primary hover:border-primary transition-colors h-10 text-xs sm:text-sm font-medium"
                                                onClick={() => handleNfcAction("write")}
                                            >
                                                <Smartphone className="w-4 h-4 mr-2" />
                                                Write to NFC
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

            </main>

            {/* NFC Interaction Modal */}
            <Dialog open={showNfcModal} onOpenChange={setShowNfcModal}>
                <DialogContent className="sm:max-w-md bg-white rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
                    <div className="bg-slate-900 p-8 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-loading-bar opacity-50"></div>

                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="relative">
                                {/* Pulse Animation */}
                                {nfcStatus === "scanning" && (
                                    <>
                                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                                        <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse delay-75"></div>
                                    </>
                                )}
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-500 ${nfcStatus === "success" ? "bg-green-500" : "bg-primary"
                                    }`}>
                                    {nfcStatus === "success" ? (
                                        <CheckCircle className="w-10 h-10 text-white animate-in zoom-in spin-in-12 duration-300" />
                                    ) : (
                                        <Nfc className="w-10 h-10 text-white" />
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-1">
                                    {nfcStatus === "success" ? (
                                        nfcMode === "read" ? "Link Updated!" : "Write Complete!"
                                    ) : (
                                        nfcMode === "read" ? "Ready to Scan" : "Ready to Write"
                                    )}
                                </h3>
                                <p className="text-slate-300 text-sm">
                                    {nfcStatus === "success" ? (
                                        "Operation completed successfully."
                                    ) : (
                                        "Hold your phone near the Simplify Tap card."
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    {nfcStatus === "scanning" && (
                        <div className="p-6 text-center">
                            <img
                                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY2J6eGx5aDhkbjBkZzR5YzF6d3B6eGZ5eGZ5eGZ5eGZ5eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/LpWV6KtsqR1v1j8t1G/giphy.gif"
                                alt="NFC Scanning"
                                className="w-32 h-32 mx-auto opacity-50 mix-blend-multiply"
                            />
                            <p className="text-xs text-slate-400 mt-4">Make sure NFC is enabled on your device.</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default ActivateCard;
