export interface Theme {
    id: string;
    name: string;
    type: 'free' | 'premium';
    colors: {
        background: string;
        cardBackground: string;
        text: string;
        primary: string; // Buttons, icons
        secondary: string; // Secondary text/elements
        accent: string;
        border: string;
    };
    font?: string; // Optional custom font class
    backgroundImage?: string; // Optional background pattern/image
}

export const themes: Theme[] = [
    // --- FREE THEMES (3) ---
    {
        id: 'classic-white',
        name: 'Classic White',
        type: 'free',
        colors: {
            background: 'bg-gray-50',
            cardBackground: '#ffffff',
            text: '#1a1a1a',
            primary: '#2563eb', // Blue-600
            secondary: '#64748b', // Slate-500
            accent: '#3b82f6',
            border: '#e2e8f0',
        },
    },
    {
        id: 'professional-slate',
        name: 'Professional Slate',
        type: 'free',
        colors: {
            background: 'bg-slate-100',
            cardBackground: '#f8fafc',
            text: '#0f172a',
            primary: '#475569',
            secondary: '#64748b',
            accent: '#cbd5e1',
            border: '#cbd5e1',
        },
    },
    {
        id: 'modern-dark',
        name: 'Modern Dark',
        type: 'free',
        colors: {
            background: 'bg-neutral-900',
            cardBackground: '#171717',
            text: '#ffffff',
            primary: '#ffffff',
            secondary: '#a3a3a3',
            accent: '#404040',
            border: '#262626',
        },
    },

    // --- PREMIUM THEMES (20+) ---
    {
        id: 'sunset-gradient',
        name: 'Sunset Bliss',
        type: 'premium',
        colors: {
            background: 'bg-gradient-to-br from-orange-100 to-rose-100',
            cardBackground: '#fff1f2',
            text: '#881337',
            primary: '#e11d48',
            secondary: '#9f1239',
            accent: '#fda4af',
            border: '#fecdd3',
        },
        backgroundImage: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    },
    {
        id: 'ocean-depths',
        name: 'Ocean Depths',
        type: 'premium',
        colors: {
            background: 'bg-cyan-950',
            cardBackground: '#083344',
            text: '#ecfeff',
            primary: '#22d3ee',
            secondary: '#67e8f9',
            accent: '#155e75',
            border: '#164e63',
        },
        backgroundImage: 'linear-gradient(to top, #09203f 0%, #537895 100%)',
    },
    {
        id: 'forest-rain',
        name: 'Forest Rain',
        type: 'premium',
        colors: {
            background: 'bg-emerald-50',
            cardBackground: '#ffffff',
            text: '#064e3b',
            primary: '#059669',
            secondary: '#34d399',
            accent: '#10b981',
            border: '#d1fae5',
        },
    },
    {
        id: 'royal-gold',
        name: 'Royal Gold',
        type: 'premium',
        colors: {
            background: 'bg-slate-900',
            cardBackground: '#1e293b',
            text: '#fbbf24',
            primary: '#f59e0b',
            secondary: '#94a3b8',
            accent: '#475569',
            border: '#fbbf24',
        },
    },
    {
        id: 'lavender-dream',
        name: 'Lavender Dream',
        type: 'premium',
        colors: {
            background: 'bg-purple-50',
            cardBackground: '#faf5ff',
            text: '#581c87',
            primary: '#9333ea',
            secondary: '#a855f7',
            accent: '#d8b4fe',
            border: '#e9d5ff',
        },
    },
    {
        id: 'cherry-blossom',
        name: 'Cherry Blossom',
        type: 'premium',
        colors: {
            background: 'bg-pink-50',
            cardBackground: '#fff1f2',
            text: '#831843',
            primary: '#db2777',
            secondary: '#f472b6',
            accent: '#fbcfe8',
            border: '#fce7f3',
        },
    },
    {
        id: 'midnight-neon',
        name: 'Midnight Neon',
        type: 'premium',
        colors: {
            background: 'bg-black',
            cardBackground: '#0a0a0a',
            text: '#00f2ff',
            primary: '#00f2ff',
            secondary: '#ff00ff',
            accent: '#1a1a1a',
            border: '#333333',
        },
    },
    {
        id: 'earthy-clay',
        name: 'Earthy Clay',
        type: 'premium',
        colors: {
            background: 'bg-stone-100',
            cardBackground: '#fafaf9',
            text: '#44403c',
            primary: '#78350f',
            secondary: '#a8a29e',
            accent: '#d6d3d1',
            border: '#e7e5e4',
        },
    },
    {
        id: 'minimal-mono',
        name: 'Minimal Mono',
        type: 'premium',
        colors: {
            background: 'bg-white',
            cardBackground: '#ffffff',
            text: '#000000',
            primary: '#000000',
            secondary: '#666666',
            accent: '#e5e5e5',
            border: '#000000',
        },
    },
    {
        id: 'tech-blueprint',
        name: 'Tech Blueprint',
        type: 'premium',
        colors: {
            background: 'bg-blue-50',
            cardBackground: '#eff6ff',
            text: '#172554',
            primary: '#2563eb',
            secondary: '#60a5fa',
            accent: '#bfdbfe',
            border: '#93c5fd',
        },
    },
    // Adding more to reach closer to 20+ total
    { id: 'mint-fresh', name: 'Mint Fresh', type: 'premium', colors: { background: 'bg-green-50', cardBackground: '#f0fdf4', text: '#14532d', primary: '#16a34a', secondary: '#4ade80', accent: '#bbf7d0', border: '#86efac' } },
    { id: 'sky-blue', name: 'Sky High', type: 'premium', colors: { background: 'bg-sky-50', cardBackground: '#f0f9ff', text: '#0c4a6e', primary: '#0ea5e9', secondary: '#38bdf8', accent: '#bae6fd', border: '#7dd3fc' } },
    { id: 'rose-gold', name: 'Rose Gold', type: 'premium', colors: { background: 'bg-stone-50', cardBackground: '#fff1f2', text: '#881337', primary: '#e11d48', secondary: '#fda4af', accent: '#ffe4e6', border: '#fecdd3' } },
    { id: 'crimson-tide', name: 'Crimson Tide', type: 'premium', colors: { background: 'bg-red-50', cardBackground: '#fef2f2', text: '#7f1d1d', primary: '#dc2626', secondary: '#f87171', accent: '#fecaca', border: '#fca5a5' } },
    { id: 'purple-haze', name: 'Purple Haze', type: 'premium', colors: { background: 'bg-purple-900', cardBackground: '#3b0764', text: '#f3e8ff', primary: '#d8b4fe', secondary: '#e9d5ff', accent: '#6b21a8', border: '#581c87' } },
    { id: 'autumn-leaves', name: 'Autumn', type: 'premium', colors: { background: 'bg-orange-50', cardBackground: '#fff7ed', text: '#7c2d12', primary: '#ea580c', secondary: '#fdba74', accent: '#ffedd5', border: '#fed7aa' } },
    { id: 'sunny-day', name: 'Sunny Day', type: 'premium', colors: { background: 'bg-yellow-50', cardBackground: '#fefce8', text: '#713f12', primary: '#eab308', secondary: '#fde047', accent: '#fef08a', border: '#fde047' } },
    { id: 'teal-waves', name: 'Teal Waves', type: 'premium', colors: { background: 'bg-teal-50', cardBackground: '#f0fdfa', text: '#134e4a', primary: '#14b8a6', secondary: '#5eead4', accent: '#99f6e4', border: '#5eead4' } },
    { id: 'indigo-night', name: 'Indigo Night', type: 'premium', colors: { background: 'bg-indigo-950', cardBackground: '#1e1b4b', text: '#e0e7ff', primary: '#818cf8', secondary: '#a5b4fc', accent: '#312e81', border: '#3730a3' } },
    { id: 'ruby-luxury', name: 'Ruby Luxury', type: 'premium', colors: { background: 'bg-rose-950', cardBackground: '#4c0519', text: '#ffe4e6', primary: '#fb7185', secondary: '#f43f5e', accent: '#881337', border: '#9f1239' } },
    { id: 'silver-fox', name: 'Silver Fox', type: 'premium', colors: { background: 'bg-gray-100', cardBackground: '#e5e7eb', text: '#374151', primary: '#6b7280', secondary: '#9ca3af', accent: '#d1d5db', border: '#9ca3af' } },
    { id: 'amber-glow', name: 'Amber Glow', type: 'premium', colors: { background: 'bg-amber-950', cardBackground: '#451a03', text: '#fef3c7', primary: '#f59e0b', secondary: '#fbbf24', accent: '#78350f', border: '#92400e' } },
];
