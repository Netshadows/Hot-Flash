export const COLORS = {
    background: '#FFF9FA', // Warm Pink/White
    surface: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.9)',
    surfaceBorder: 'rgba(255, 88, 100, 0.1)',

    primary: '#FF5864', // Flo Pink
    primaryGlare: '#FF8090',
    secondary: '#FFB6C1', // Soft Pink

    textMain: '#2D2D2D',
    textMuted: '#757575',

    success: '#FFB6C1', // Aesthetics over strict semantic green
    danger: '#EF4444',

    shadow: 'rgba(255, 88, 100, 0.15)',
    shadowGlow: 'rgba(255, 88, 100, 0.2)',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const RADIUS = {
    sm: 12,
    md: 24,
    lg: 32,
    full: 999,
};

export const SHADOWS = {
    soft: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 4, // Android
    },
    glow: {
        shadowColor: COLORS.shadowGlow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 8,
    }
};
