import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

export const Button = ({ title, onPress, style }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.wrapper, style]}>
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryGlare]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <Text style={styles.text}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: RADIUS.md,
        ...SHADOWS.glow,
    },
    gradient: {
        paddingVertical: 18,
        paddingHorizontal: SPACING.lg,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});
