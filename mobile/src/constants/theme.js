export const COLORS = {
    background: '#FDF9F8', // Off-white / Warm
    surface: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.9)',
    surfaceBorder: 'rgba(255, 107, 129, 0.1)',

    primary: '#FF6B81', // Vibrant Coral Pink from Stitch
    primaryGlare: '#FF8090', // Soft Pink glow
    accentPink: '#FFF5F6',

    // Insight colors from Stitch dash
    insightBlue: '#A7C7FF',
    accentBlue: '#E8F2FF',
    insightYellow: '#FFE0A3',
    accentYellow: '#FFF7E6',
    insightPurple: '#D4BFFF',
    accentPurple: '#F3E8FF',

    secondary: '#FFB6C1',

    textMain: '#333333', // Soft Black from Stitch
    textMuted: '#8A8A8F', // Warm Grey from Stitch

    success: '#10B981',
    danger: '#EF4444',

    shadow: 'rgba(0, 0, 0, 0.04)', // Exact 0.04 alpha from tailwind soft shadow
    shadowGlow: 'rgba(255, 107, 129, 0.2)',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40, // Added larger spacing option
};

export const RADIUS = {
    sm: 12,
    md: 16,
    lg: 24, // 2xl in Tailwind
    xl: 32, // 3xl in Tailwind
    xxl: 40, // Specifically for Dashboard inner card
    full: 9999,
};

export const SHADOWS = {
    soft: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 4,
    },
    glow: {
        shadowColor: COLORS.shadowGlow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 8,
    }
};
