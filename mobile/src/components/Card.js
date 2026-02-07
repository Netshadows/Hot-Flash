import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { BlurView } from 'expo-blur'; // Assuming usage in Expo

export const Card = ({ children, style, glass = false }) => {
    if (glass && Platform.OS === 'ios') {
        return (
            <BlurView intensity={20} tint="light" style={[styles.card, styles.glass, style]}>
                {children}
            </BlurView>
        );
    }

    return (
        <View style={[styles.card, glass ? styles.glass : styles.solid, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.surfaceBorder,
    },
    solid: {
        backgroundColor: COLORS.surface,
        ...SHADOWS.soft,
    },
    glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        ...SHADOWS.glow,
    },
});
