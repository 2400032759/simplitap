import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";


// Import necessary UI components
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/lib/api";

export const CartSidebar = () => {
    const { items, removeFromCart, addToCart, clearCart, isCartOpen, setIsCartOpen } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const authenticatedClient = useSupabase();
    const { user } = useUser();
    const { toast } = useToast();

    // Checkout Form State
    const [checkoutForm, setCheckoutForm] = useState({
        name: user?.fullName || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
        phone: user?.primaryPhoneNumber?.phoneNumber || "",
        address: "",
        city: "",
        state: "",
        zip: ""
    });

    const [coupon, setCoupon] = useState("");

    // Load Razorpay Script Helper
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const total = items.reduce((acc, item) => {
        const priceString = item.price;
        const price = parseFloat(priceString.replace(/[^0-9.]/g, ''));
        return acc + price * item.quantity;
    }, 0);

    const updateQuantity = (item: any, delta: number) => {
        if (delta > 0) {
            addToCart(item, item.customization); // Pass customization explicitly
        } else {
            // ... existing remove logic or just rely on trash icon
        }
    };

    const handleCheckout = async () => {
        if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
            toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Load Razorpay SDK
            const res = await loadRazorpayScript();
            if (!res) {
                toast({ title: "Error", description: "Razorpay SDK failed to load. Are you online?", variant: "destructive" });
                setIsProcessing(false);
                return;
            }

            // 2. Create Order on Backend
            const totalAmountPaise = Math.round(total * 100); // Convert to paise
            const orderRes = await fetch(`${API_BASE_URL}/api/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: totalAmountPaise,
                    currency: "INR",
                    receipt: `rcpt_${Date.now()}`
                })
            });

            if (!orderRes.ok) {
                const errorData = await orderRes.json();
                throw new Error(errorData.details || errorData.error || "Failed to create order on server");
            }

            const orderData = await orderRes.json();

            // 3. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Simplify Tap",
                description: "Product Purchase",
                order_id: orderData.id,
                handler: async function (response: any) {
                    try {
                        const shippingAddressFull = `${checkoutForm.address}, ${checkoutForm.city}, ${checkoutForm.state} - ${checkoutForm.zip}`;

                        const orderPayload = {
                            user_id: user?.id,
                            customer_name: checkoutForm.name,
                            customer_email: checkoutForm.email,
                            customer_phone: checkoutForm.phone,
                            shipping_address: shippingAddressFull,
                            total_amount: total,
                            status: 'paid', // Mark as PAID immediately
                            coupon_code: coupon || null,
                            payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            items: items.map(item => ({
                                id: item.id,
                                name: item.name,
                                quantity: item.quantity,
                                price: item.originalPrice || item.price,
                                customization: item.customization,
                                image: item.image
                            }))
                        };

                        if (!authenticatedClient) {
                            throw new Error("Local database client lost. Please refresh.");
                        }

                        // 1. Try Primary Insert
                        try {
                            const { error } = await authenticatedClient
                                .from('orders')
                                .insert(orderPayload);

                            if (error) throw error;
                        } catch (primaryError: any) {
                            console.warn("Primary insert failed, attempting fallback...", primaryError);

                            // 2. Retry without razorpay_order_id
                            const { razorpay_order_id, ...fallbackPayload } = orderPayload;
                            const { error: fallbackError } = await authenticatedClient
                                .from('orders')
                                .insert(fallbackPayload);

                            if (fallbackError) {
                                console.error("Fallback insert failed:", fallbackError);
                                throw fallbackError; // Throw to outer catch
                            }
                        }

                        // Success Logic
                        toast({ title: "Order Placed Successfully!", description: `ID: ${response.razorpay_payment_id}` });
                        clearCart();
                        setIsCartOpen(false);
                        setShowCheckout(false);
                        window.location.href = "/orders";

                    } catch (err: any) {
                        console.error("Order Saving Error:", err);
                        toast({
                            title: "Order Saved with Error",
                            description: `Payment success but DB saved failed: ${err.message || "Unknown Error"}. Please contact support with Payment ID: ${response.razorpay_payment_id}`,
                            variant: "destructive",
                            duration: 10000
                        });
                    }
                },
                prefill: {
                    name: checkoutForm.name,
                    email: checkoutForm.email,
                    contact: checkoutForm.phone
                },
                theme: {
                    color: "#000000"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                toast({ title: "Payment Failed", description: response.error.description, variant: "destructive" });
            });
            rzp1.open();

        } catch (error: any) {
            console.error("Checkout Failed:", error);
            toast({ title: "Checkout Failed", description: error.message || "Something went wrong.", variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetContent className="flex flex-col w-full sm:max-w-md">
                    <SheetHeader className="border-b pb-4">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Your Cart ({items.reduce((a, b) => a + b.quantity, 0)})
                            </SheetTitle>
                        </div>
                    </SheetHeader>

                    <ScrollArea className="flex-1 -mx-6 px-6 py-4">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground space-y-4">
                                <ShoppingBag className="w-12 h-12 opacity-20" />
                                <p>Your cart is empty.</p>
                                <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                                    Continue Shopping
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id + JSON.stringify(item.customization)} className="flex gap-4">
                                        <div className="h-20 w-20 rounded-lg bg-muted/20 p-2 flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground">{item.price}</p>
                                                {item.customization && (
                                                    <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                                                        <p>For: {item.customization.businessName}</p>
                                                        {item.customization.removeBranding === 'yes' && <p>• No Branding</p>}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2 border rounded-md p-0.5">
                                                    <span className="text-xs px-2 font-medium">Qty: {item.quantity}</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                                    onClick={() => removeFromCart(item.id, item.customization)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    {items.length > 0 && (
                        <div className="border-t pt-4 space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Shipping and taxes calculated at checkout.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Button onClick={() => setShowCheckout(true)} className="w-full bg-black text-white hover:bg-gray-800" size="lg">
                                    Checkout
                                </Button>
                                <Button variant="outline" className="w-full" onClick={() => setIsCartOpen(false)}>
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* CHECKOUT MODAL */}
            <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
                <DialogContent className="sm:max-w-lg bg-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Secure Checkout</DialogTitle>
                        <DialogDescription>
                            Complete your order.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="c-name">Full Name *</Label>
                            <Input id="c-name" value={checkoutForm.name} onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })} placeholder="John Doe" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="c-phone">Phone *</Label>
                                <Input id="c-phone" value={checkoutForm.phone} onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} placeholder="+91 9876543210" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="c-email">Email *</Label>
                                <Input id="c-email" value={checkoutForm.email} onChange={e => setCheckoutForm({ ...checkoutForm, email: e.target.value })} placeholder="john@example.com" />
                            </div>
                        </div>

                        <div className="border-t my-2 pt-2">
                            <h4 className="font-semibold mb-3 text-sm">Shipping Address</h4>
                            <div className="grid gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="c-address">Street Address *</Label>
                                    <Textarea id="c-address" value={checkoutForm.address} onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })} placeholder="123 Main St, Apt 4B" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="c-city">City</Label>
                                        <Input id="c-city" value={checkoutForm.city} onChange={e => setCheckoutForm({ ...checkoutForm, city: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="c-state">State</Label>
                                        <Input id="c-state" value={checkoutForm.state} onChange={e => setCheckoutForm({ ...checkoutForm, state: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="c-zip">ZIP Code</Label>
                                        <Input id="c-zip" value={checkoutForm.zip} onChange={e => setCheckoutForm({ ...checkoutForm, zip: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="c-coupon">Coupon Code (Optional)</Label>
                            <Input
                                id="c-coupon"
                                value={coupon}
                                onChange={e => setCoupon(e.target.value)}
                                placeholder="Enter coupon code"
                                className="border-dashed"
                            />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border mt-2">
                            <span className="font-medium">Total to Pay:</span>
                            <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCheckout(false)}>Cancel</Button>
                        <Button onClick={handleCheckout} disabled={isProcessing} className="bg-black text-white hover:bg-gray-800">
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Place Order"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
