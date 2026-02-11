import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/data/products";

export interface CartItem extends Product {
    quantity: number;
    customization?: {
        removeBranding: string;
        businessName: string;
    };
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, customization?: CartItem['customization']) => void;
    removeFromCart: (productId: string, customization?: CartItem['customization']) => void;
    clearCart: () => void;
    cartCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("shopping_cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("shopping_cart", JSON.stringify(items));
        // Dispatch event to sync across tabs/components if needed
        window.dispatchEvent(new Event("cart-updated"));
    }, [items]);

    const addToCart = (product: Product, customization?: CartItem['customization']) => {
        setItems((prev) => {
            // Find existing item with SAME ID and SAME Customization
            const existingIndex = prev.findIndex((item) =>
                item.id === product.id &&
                JSON.stringify(item.customization) === JSON.stringify(customization)
            );

            if (existingIndex > -1) {
                const newItems = [...prev];
                newItems[existingIndex].quantity += 1;
                return newItems;
            }

            return [...prev, { ...product, quantity: 1, customization }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string, customization?: CartItem['customization']) => {
        setItems((prev) => prev.filter((item) => {
            if (item.id !== productId) return true;
            // If checking customization, compare
            if (customization) {
                return JSON.stringify(item.customization) !== JSON.stringify(customization);
            }
            // If no customization passed to remove, remove all of this product? 
            // Or maybe only remove non-customized ones? 
            // For now, if no customization passed, remove all matching ID to keep backward compatibility or simple usage.
            return false;
        }));
    };

    const clearCart = () => setItems([]);

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartCount, isCartOpen, setIsCartOpen }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
