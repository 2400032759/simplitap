import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/simplify-tap/Navbar";
import { Footer } from "@/components/simplify-tap/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Heart, Minus, Plus } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [product, setProduct] = useState(products[0]);
    const [mainImage, setMainImage] = useState("");
    const [removeBranding, setRemoveBranding] = useState<string>("");
    const [businessName, setBusinessName] = useState<string>("");

    useEffect(() => {
        const found = products.find(p => p.id === id);
        if (found) {
            setProduct(found);
            setMainImage(found.image);
        }
    }, [id]);

    const handleAddToCart = () => {
        if (!removeBranding) {
            toast({ title: "Selection Required", description: "Please select whether to remove branding.", variant: "destructive" });
            return;
        }
        if (!businessName.trim()) {
            toast({ title: "Input Required", description: "Please enter your business name.", variant: "destructive" });
            return;
        }
        if (businessName.length > 100) {
            toast({ title: "Limit Exceeded", description: "Business name must be under 100 characters.", variant: "destructive" });
            return;
        }

        addToCart(product, {
            removeBranding,
            businessName
        });

        toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
        });
    };

    const handleBuyNow = () => {
        // For now, Buy Now acts like Add to Cart + Open Cart/Checkout
        // Assuming adding to cart opens the sidebar, user can then proceed.
        handleAddToCart();
    };

    if (!product) return <div>Product not found</div>;

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />

            <main className="pt-24 pb-16 container mx-auto px-4">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-muted-foreground mb-8">
                    <Link to="/" className="hover:text-foreground">Home</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <Link to="/nfc" className="hover:text-foreground">Shop Now</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-foreground font-medium">{product.name}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                    {/* Images Section */}
                    <div className="space-y-6">
                        <div className="aspect-square bg-muted/20 rounded-xl overflow-hidden p-8 flex items-center justify-center">
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {[product.image, ...(product.images || [])].map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`w-20 h-20 rounded-lg border-2 flex-shrink-0 p-2 ${mainImage === img ? 'border-primary' : 'border-transparent hover:border-gray-200'} bg-muted/10`}
                                >
                                    <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-normal text-foreground mb-4">{product.name}</h1>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-medium">{product.price}</span>
                                {product.originalPrice && (
                                    <span className="text-xl text-muted-foreground line-through decoration-muted-foreground/50">{product.originalPrice}</span>
                                )}
                            </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                            {product.description || "Experience the future of networking with this premium NFC product. Share your contact info, social media, and more with just a tap."}
                        </p>

                        {/* Customization Form */}
                        <div className="space-y-6 pt-4 border-t">

                            <div className="space-y-3">
                                <Label>Remove Simplify Tap Branding *</Label>
                                <Select onValueChange={setRemoveBranding} value={removeBranding}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label>Your Business Name *</Label>
                                    <span className={`text-xs ${businessName.length > 100 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                        {businessName.length}/100
                                    </span>
                                </div>
                                <Input
                                    placeholder="Enter your business name"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    maxLength={100}
                                />
                            </div>

                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-6">
                            <div className="flex gap-4">
                                <Button
                                    onClick={handleAddToCart}
                                    className="flex-1 h-14 text-base bg-black hover:bg-gray-800 text-white rounded-md"
                                >
                                    Add to Cart
                                </Button>
                                <Button variant="outline" size="icon" className="h-14 w-14 rounded-md">
                                    <Heart className="w-6 h-6" />
                                </Button>
                            </div>
                            <Button
                                onClick={handleBuyNow}
                                variant="outline"
                                className="w-full h-14 text-base rounded-md border-black hover:bg-gray-50"
                            >
                                Buy Now
                            </Button>
                        </div>

                        {/* Additional Info */}
                        <div className="border-t pt-6 space-y-4 text-sm font-medium">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-base">Key Features</h3>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground font-normal">
                                    {product.features?.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    )) || <li>Premium quality NFC product.</li>}
                                </ul>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-base">Shipping & Returns</h3>
                                    <div className="space-y-2 text-muted-foreground font-normal">
                                        <p>
                                            <strong>Shipping:</strong> We process orders within 1-2 business days.
                                            For customized products, please allow an additional 2-3 days for encoding and printing.
                                            Standard shipping across India takes 5-7 business days.
                                        </p>
                                        <p>
                                            <strong>Returns:</strong> Non-customized items can be returned within 30 days of delivery in their original condition.
                                            Customized products (with Names/Logos) are non-refundable unless there is a defect in manufacturing or NFC functionality.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetails;
