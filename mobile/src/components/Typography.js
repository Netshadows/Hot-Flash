import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export const AppText = ({ children, style, variant = 'body' }) => {
    return <Text style={[styles[variant], style]}>{children}</Text>;
};

const styles = StyleSheet.create({
    body: {
        fontSize: 15,
        color: COLORS.textMain,
        lineHeight: 24,
    },
    heading1: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.textMain,
        letterSpacing: -0.5,
    },
    heading2: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textMain,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    caption: {
        fontSize: 12,
        color: COLORS.textMuted,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
