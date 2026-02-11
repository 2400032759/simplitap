export interface Product {
    id: string;
    name: string;
    image: string;
    price: string;
    originalPrice?: string;
    tag?: string;
    rating?: number;
    categories: string[];
    description?: string;
    features?: string[];
    images?: string[];
}

export const products: Product[] = [
    {
        id: "black-metal",
        name: "Black NFC Metal Card",
        image: "https://image2url.com/r2/bucket1/images/1767839723885-dfeb2379-1a25-4b6b-9dad-0d8e43288b39.png",
        price: "₹1,999.50",
        originalPrice: "₹3,999.00",
        tag: "Bestseller",
        rating: 5,
        categories: ["Premium Metal & PVC Business Cards", "Social Cards"],
        description: "Metal NFC Cards. Elevate Your Networking with Premium Metal NFC Cards. Experience the perfect blend of sophistication and technology with our Metal NFC Cards. Crafted from high-quality metal, these cards offer a sleek and durable design that stands out in any professional setting. With a simple tap, share your digital content seamlessly—whether it’s your social media profiles, contact details, or portfolio. Our Metal NFC Cards not only facilitate instant connection but also leave a lasting impression of elegance and innovation.",
        features: [
            "Premium Build: Made from high-grade metal for durability and a luxurious feel.",
            "Effortless Sharing: Tap to share your information instantly with any compatible device.",
            "Customizable: Tailor the design to reflect your personal brand or business identity.",
            "Impressive Design: Stand out with a card that’s as functional as it is stylish."
        ],
        images: [
            "https://image2url.com/r2/bucket1/images/1767839723885-dfeb2379-1a25-4b6b-9dad-0d8e43288b39.png",
            "https://static.wixstatic.com/media/319071_550e60e3039044daa3944ef319cfbf83~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/319071_550e60e3039044daa3944ef319cfbf83~mv2.jpg",
            "https://static.wixstatic.com/media/319071_aa834f5715bd4e5a812175076742d305~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/319071_aa834f5715bd4e5a812175076742d305~mv2.jpg"
        ]
    },
    {
        id: "google-review-card",
        name: "Google Review Card",
        image: "https://static.wixstatic.com/media/319071_c30739b6d70f49569c815b81b4cea1af~mv2.jpg",
        price: "₹749.50",
        originalPrice: "₹1,499.00",
        rating: 4.8,
        categories: ["Review Cards", "Social Cards"],
        description: "Designed for businesses seeking to boost their online reputation, these cards provide a hassle-free way for clients to access your review pages on Google Reviews. By tapping the card, customers can quickly leave reviews.",
        features: [
            "Simplify review process: Direct link to your Google Review page.",
            "Boost online engagement: Encourage more customers to leave feedback.",
            "Premium NFC technology: Fast and reliable tapping experience."
        ],
        images: [
            "https://static.wixstatic.com/media/319071_c30739b6d70f49569c815b81b4cea1af~mv2.jpg",
            "https://static.wixstatic.com/media/319071_e878d2f749bd457c9be13ed628f659e9~mv2.jpg",
            "https://static.wixstatic.com/media/319071_d11cc947eac04631ab2932e8722519f4~mv2.jpg",
            "https://static.wixstatic.com/media/319071_75b0ca74094b4468a6be827b39947fccf002.jpg"
        ]
    },
    {
        id: "trust-pilot-card",
        name: "Trust Pilot Review Card",
        image: "https://static.wixstatic.com/media/319071_b9a2a81131764008b80fbbede521ff72~mv2.jpg",
        price: "₹749.50",
        originalPrice: "₹1,499.00",
        rating: 4.8,
        categories: ["Review Cards", "Social Cards"],
        description: "Direct others to your Trust Pilot review page with just a tap. Perfect for building credibility and trust.",
        features: [
            "Direct link: Instant access to Trust Pilot review page.",
            "Build Trust: Showcase your credibility effortlessly.",
            "NFC Enabled: Simple tap to connect."
        ],
        images: [
            "https://static.wixstatic.com/media/319071_b9a2a81131764008b80fbbede521ff72~mv2.jpg",
            "https://static.wixstatic.com/media/319071_e878d2f749bd457c9be13ed628f659e9~mv2.jpg",
            "https://static.wixstatic.com/media/319071_d11cc947eac04631ab2932e8722519f4~mv2.jpg"
        ]
    },
    {
        id: "linkedin-card",
        name: "LinkedIn NFC Card",
        image: "https://static.wixstatic.com/media/319071_299aef10424643cab88a2e80607531ec~mv2.jpg",
        price: "₹749.50",
        originalPrice: "₹1,499.00",
        rating: 4.9,
        categories: ["Social Cards"],
        description: "Amplify your online presence. These cards are specifically designed to share your LinkedIn profile with ease. Perfect for influencers, marketers, and professionals.",
        features: [
            "Professional Networking: Instant LinkedIn connection.",
            "Effortless Sharing: No more typing names, just tap.",
            "Sleek Design: Professional look matching the platform."
        ],
        images: [
            "https://static.wixstatic.com/media/319071_299aef10424643cab88a2e80607531ec~mv2.jpg",
            "https://static.wixstatic.com/media/319071_e878d2f749bd457c9be13ed628f659e9~mv2.jpg",
            "https://static.wixstatic.com/media/319071_d11cc947eac04631ab2932e8722519f4~mv2.jpg",
            "https://static.wixstatic.com/media/319071_2c93f20022e1457d8c944c3670af8d7ff002.jpg"
        ]
    },
    {
        id: "instagram-card",
        name: "Instagram Card",
        image: "https://static.wixstatic.com/media/319071_20f2d098d85d4b1fbbc247078901f393~mv2.jpg",
        price: "₹749.50",
        originalPrice: "₹1,499.00",
        categories: ["Social Cards"],
        description: "Direct others to your Instagram profile with just a tap. Grow your audience and boost engagement effortlessly.",
        features: [
            "Grow Audience: Instant follow with a tap.",
            "Engagement Boost: Quick access to your content.",
            "Social Ready: Perfect for influencers and brands."
        ],
        images: [
            "https://static.wixstatic.com/media/319071_20f2d098d85d4b1fbbc247078901f393~mv2.jpg",
            "https://static.wixstatic.com/media/319071_e878d2f749bd457c9be13ed628f659e9~mv2.jpg",
            "https://static.wixstatic.com/media/319071_d11cc947eac04631ab2932e8722519f4~mv2.jpg",
            "https://static.wixstatic.com/media/319071_babfdb870b40479db1cd5ea446baa068f002.jpg"
        ]
    },
    {
        id: "whatsapp-card",
        name: "WhatsApp Card",
        image: "https://static.wixstatic.com/media/319071_790ffa76d3424dfe9c0b7babcd1babb4~mv2.jpg",
        price: "₹749.50",
        originalPrice: "₹1,499.00",
        categories: ["Social Cards"],
        description: "Connect instantly on WhatsApp with a simple tap. Ideal for business inquiries and quick networking.",
        features: [
            "Instant Chat: Start a WhatsApp conversation immediately.",
            "Business Ready: streamline customer communication.",
            "Tap & Chat: No need to save numbers first."
        ],
        images: [
            "https://static.wixstatic.com/media/319071_790ffa76d3424dfe9c0b7babcd1babb4~mv2.jpg",
            "https://static.wixstatic.com/media/319071_e878d2f749bd457c9be13ed628f659e9~mv2.jpg",
            "https://static.wixstatic.com/media/319071_d11cc947eac04631ab2932e8722519f4~mv2.jpg"
        ]
    },
    {
        id: "youtube-card",
        name: "YouTube Card",
        image: "https://static.wixstatic.com/media/319071_d6d261a2a0c74c81bff7ee7f6b389477~mv2.jpg",
        price: "₹749.50",
        originalPrice: "₹1,499.00",
        categories: ["Social Cards"],
        description: "Share your YouTube channel link instantly. Tap to subscribe or watch videos.",
        features: [
            "Gain Subscribers: Easy access to channel.",
            "Video Sharing: Share content instantly.",
            "Creator Friendly: Perfect for YouTubers."
        ],
        images: [
            "https://static.wixstatic.com/media/319071_d6d261a2a0c74c81bff7ee7f6b389477~mv2.jpg",
            "https://static.wixstatic.com/media/319071_e878d2f749bd457c9be13ed628f659e9~mv2.jpg",
            "https://static.wixstatic.com/media/319071_d11cc947eac04631ab2932e8722519f4~mv2.jpg",
            "https://static.wixstatic.com/media/319071_fe3a32d43f43422a8d7f2fbbcb53c4e4f002.jpg"
        ]
    },
    {
        id: "facebook-card",
        name: "Facebook Card",
        image: "https://static.wixstatic.com/media/319071_ee0d986f49694fe69b42672b515389fa~mv2.jpg",
        price: "₹749.50",
        originalPrice: "₹1,499.00",
        categories: ["Social Cards"],
        description: "Direct others to your Facebook profile or page with just a tap.",
        features: [
            "Page Growth: Get more likes and follows.",
            "Easy Connection: Find on Facebook instantly.",
            "Networking: Perfect for personal or business pages."
        ],
        images: [
            "https://static.wixstatic.com/media/319071_ee0d986f49694fe69b42672b515389fa~mv2.jpg",
            "https://static.wixstatic.com/media/319071_e878d2f749bd457c9be13ed628f659e9~mv2.jpg",
            "https://static.wixstatic.com/media/319071_d11cc947eac04631ab2932e8722519f4~mv2.jpg"
        ]
    },
    {
        id: "smart-standee",
        name: "Smart Standee",
        image: "https://image2url.com/r2/bucket1/images/1767839793603-02a5447b-5629-4086-9810-5cf5170b3a1e.png",
        price: "₹1,499.50",
        originalPrice: "₹2,999.00",
        tag: "Bestseller",
        rating: 5,
        categories: ["Smart Standees"],
        description: "Smart NFC Standees. Transform Your Business Engagement with Smart NFC Standees. Introduce a modern touch to your business interactions with our Smart NFC Standees. Designed for seamless integration into your business environment, these standees provide an interactive and engaging way to share information with customers. Perfect for retail stores, restaurants, events, and more, our NFC standees allow customers to tap their devices to access menus, promotional content, social media pages, and more, enhancing their experience and your brand’s reach.",
        features: [
            "Interactive Engagement: Allow customers to access information with a simple tap.",
            "Versatile Use: Ideal for a variety of settings, including retail, hospitality, and events.",
            "Customizable Design: Tailor the standees to match your brand’s aesthetics and messaging.",
            "Enhance Customer Experience: Provide instant access to digital content, improving customer satisfaction and engagement."
        ],
        images: [
            "https://image2url.com/r2/bucket1/images/1767839793603-02a5447b-5629-4086-9810-5cf5170b3a1e.png",
            "https://static.wixstatic.com/media/319071_3188af9bdbe64399a5817b91d7e5d4ff~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/3188af9bdbe64399a5817b91d7e5d4ff~mv2.jpg"
        ]
    },
    {
        id: "silver-metal",
        name: "Silver NFC Metal Card",
        image: "https://image2url.com/r2/bucket1/images/1767839839185-cec5a3c1-4048-4fa9-9fae-22cb607e0d14.png",
        price: "₹1,999.50",
        originalPrice: "₹3,999.00",
        rating: 4.8,
        categories: ["Premium Metal & PVC Business Cards", "Social Cards"],
        description: "Metal NFC Cards. Elevate Your Networking with Premium Metal NFC Cards. Experience the perfect blend of sophistication and technology with our Metal NFC Cards. Crafted from high-quality metal, these cards offer a sleek and durable design that stands out in any professional setting. With a simple tap, share your digital content seamlessly—whether it’s your social media profiles, contact details, or portfolio. Our Metal NFC Cards not only facilitate instant connection but also leave a lasting impression of elegance and innovation.",
        features: [
            "Premium Build: Made from high-grade metal for durability and a luxurious feel.",
            "Effortless Sharing: Tap to share your information instantly with any compatible device.",
            "Customizable: Tailor the design to reflect your personal brand or business identity.",
            "Impressive Design: Stand out with a card that’s as functional as it is stylish."
        ],
        images: [
            "https://image2url.com/r2/bucket1/images/1767839839185-cec5a3c1-4048-4fa9-9fae-22cb607e0d14.png",
            "https://static.wixstatic.com/media/319071_942cc775f7144ea387dcd8cc1620ff13~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/942cc775f7144ea387dcd8cc1620ff13~mv2.jpg"
        ]
    },
    {
        id: "review-standee",
        name: "Review Standee",
        image: "https://image2url.com/r2/bucket3/images/1767839941567-052ca73d-97f7-4d5a-abf7-c36cc26f31ad.png",
        price: "₹999.50",
        originalPrice: "₹1,999.00",
        tag: "Bestseller",
        rating: 5,
        categories: ["Review Cards", "Smart Standees"],
        description: "Smart NFC Standees. Transform Your Business Engagement with Smart NFC Standees. Introduce a modern touch to your business interactions with our Smart NFC Standees. Designed for seamless integration into your business environment, these standees provide an interactive and engaging way to share information with customers. Perfect for retail stores, restaurants, events, and more, our NFC standees allow customers to tap their devices to access menus, promotional content, social media pages, and more, enhancing their experience and your brand’s reach.",
        features: [
            "Interactive Engagement: Allow customers to access information with a simple tap.",
            "Versatile Use: Ideal for a variety of settings, including retail, hospitality, and events.",
            "Customizable Design: Tailor the standees to match your brand’s aesthetics and messaging.",
            "Enhance Customer Experience: Provide instant access to digital content, improving customer satisfaction and engagement."
        ],
        images: [
            "https://image2url.com/r2/bucket3/images/1767839941567-052ca73d-97f7-4d5a-abf7-c36cc26f31ad.png",
            "https://static.wixstatic.com/media/319071_e10e4bd7ac7d4e33a9b0ee1ad8e5401f~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/e10e4bd7ac7d4e33a9b0ee1ad8e5401f~mv2.jpg"
        ]
    },
    {
        id: "pvc-card",
        name: "Smart Business Card (PVC)",
        image: "https://image2url.com/r2/bucket1/images/1767840003817-d7e72ad0-4025-47ad-8b5d-855ac5fb9f6f.png",
        price: "₹1,249.50",
        originalPrice: "₹2,499.00",
        rating: 4.9,
        categories: ["Premium Metal & PVC Business Cards", "Social Cards"],
        description: "Smart NFC Business Card. Transform Your Business Engagement with Smart NFC Business Card. Introduce a modern touch to your business interactions with our Smart NFC Business Card. Designed for seamless integration into your business environment, these cards provide an interactive and engaging way to share information with customers. Perfect for business owners, our NFC Business Card allows for enhancing customer experience and your brand’s reach.",
        features: [
            "Interactive Engagement: Allow customers to access information with a simple tap.",
            "Versatile Use: Ideal for a variety of settings, including retail, hospitality, and events.",
            "Customizable Design: Tailor the cards to match your brand’s aesthetics and messaging.",
            "Enhance Customer Experience: Provide instant access to digital content, improving customer satisfaction and engagement."
        ],
        images: [
            "https://image2url.com/r2/bucket1/images/1767840003817-d7e72ad0-4025-47ad-8b5d-855ac5fb9f6f.png",
            "https://static.wixstatic.com/media/319071_300ec076bf1144d4b02ddd8309c1d9bf~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/300ec076bf1144d4b02ddd8309c1d9bf~mv2.jpg",
            "https://static.wixstatic.com/media/319071_278f78b5f2df4ed78a4e56e6e69ed1ce~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/278f78b5f2df4ed78a4e56e6e69ed1ce~mv2.jpg"
        ]
    },
    {
        id: "google-review-nfc-card",
        name: "Google Review NFC Card",
        image: "https://static.wixstatic.com/media/319071_c30739b6d70f49569c815b81b4cea1af~mv2.jpg",
        price: "₹1.00",
        originalPrice: "₹1,499.00",
        tag: "Special Offer",
        rating: 5,
        categories: ["Review Cards"],
        description: "Get more Google Reviews with a simple tap. Special introductory offer: First year free, then ₹199/year renewal.",
        features: [
            "365 Days Free Validity: Try it risk-free for a year.",
            "Low Renewal Cost: Only ₹199/year after trial.",
            "Direct link: Instant access to Google Review page.",
            "Boost online engagement: Encourage more customers to leave feedback."
        ],
        images: [
            "https://static.wixstatic.com/media/319071_c30739b6d70f49569c815b81b4cea1af~mv2.jpg"
        ]
    }
];
