import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export const OnboardingHealthScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <AppText style={{ fontSize: 64 }}>❤️ 🛏️</AppText>
                </View>

                <AppText variant="heading1" style={styles.title}>Rest is data.</AppText>
                <AppText variant="body" style={styles.body}>
                    Lumina works in the background to see how your body heals while you sleep. We sync with Apple Health to track heart rate and sleep patterns automatically.
                </AppText>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.pillButton}
                    onPress={() => {
                        // Impact haptic stub
                        navigation.navigate('OnboardingProfile')
                    }}
                    activeOpacity={0.8}
                >
                    <AppText variant="buttonText" style={styles.pillButtonText}>
                        Allow Health Sync
                    </AppText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('OnboardingProfile')} style={{ marginTop: SPACING.lg }}>
                    <AppText style={{ color: COLORS.textMuted, textAlign: 'center' }}>Skip for now</AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: SPACING.xl,
        alignItems: 'center'
    },
    iconContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: 28,
        marginBottom: SPACING.md,
        color: COLORS.textMain,
    },
    body: {
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.textMuted,
    },
    footer: {
        padding: SPACING.xl,
        paddingBottom: 60,
    },
    pillButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 30, // Pill shaped
        alignItems: 'center',
    },
    pillButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    }
});
