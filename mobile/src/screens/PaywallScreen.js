import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';

export const PaywallScreen = ({ navigation, route }) => {
    const { upgradeTier } = useUser();
    const { profileData } = route.params || { profileData: {} };

    const handleUpgrade = (tier) => {
        upgradeTier(tier);
        console.log(`[PaywallScreen] Upgraded to ${tier}`);
        navigation.navigate('MainTabs');
    };

    const handleSkip = () => {
        navigation.navigate('MainTabs');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#FFFFFF', 'rgba(255, 88, 100, 0.05)']}
                style={StyleSheet.absoluteFillObject}
            />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <AppText style={styles.icon}>✨</AppText>
                    </View>
                    <AppText variant="heading1" style={styles.title}>Your Personalized Protocol Awaits.</AppText>
                    <AppText variant="body" style={styles.subtitle}>
                        Unlock deeply personalized clinical insights and advanced symptom correlation analysis powered by our AI.
                    </AppText>
                </View>

                <LinearGradient
                    colors={['rgba(255, 182, 193, 0.4)', 'rgba(255, 127, 80, 0.2)']}
                    style={styles.tierCard}
                >
                    <AppText variant="heading2" style={styles.tierTitle}>Premium Features</AppText>

                    <View style={styles.featureRow}>
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} style={styles.check} />
                        <AppText variant="body" style={styles.featureText}>Clinical Health Reports (FHIR Export)</AppText>
                    </View>
                    <View style={styles.featureRow}>
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} style={styles.check} />
                        <AppText variant="body" style={styles.featureText}>Daily Gemini 3 AI Insights</AppText>
                    </View>
                    <View style={styles.featureRow}>
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} style={styles.check} />
                        <AppText variant="body" style={styles.featureText}>Advanced Symptom correlation Graphs</AppText>
                    </View>
                    <View style={styles.featureRow}>
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} style={styles.check} />
                        <AppText variant="body" style={styles.featureText}>Hormone Therapy (HRT) Tracking Models</AppText>
                    </View>
                </LinearGradient>

                <View style={styles.pricingContainer}>
                    <AppText variant="heading1" style={styles.price}>$9.99<AppText variant="body" style={{ color: '#888' }}> / mo</AppText></AppText>
                    <AppText variant="caption" style={{ color: '#888', marginTop: 4 }}>7-day free trial. Cancel anytime.</AppText>
                </View>

                <View style={styles.actions}>
                    <Button
                        title="Start Free Trial & Unlock"
                        onPress={() => handleUpgrade('premium')}
                        style={styles.mainButton}
                    />

                    <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                        <AppText variant="body" style={styles.skipText}>Continue with basic plan</AppText>
                    </TouchableOpacity>
                </View>

                <View style={styles.guarantee}>
                    <Ionicons name="shield-checkmark-outline" size={16} color="#4A4A4A" />
                    <AppText variant="caption" style={styles.guaranteeText}>
                        Secure subscription managed via App Store
                    </AppText>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.xl,
        paddingTop: 80,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    icon: {
        fontSize: 50,
    },
    title: {
        color: COLORS.primary,
        marginBottom: SPACING.sm,
        textAlign: 'center',
        fontSize: 28,
    },
    subtitle: {
        textAlign: 'center',
        color: COLORS.textMuted,
        paddingHorizontal: SPACING.md,
        lineHeight: 22,
    },
    tierCard: {
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 127, 80, 0.3)',
    },
    tierTitle: {
        color: '#2D2D2D',
        marginBottom: SPACING.md,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    check: {
        marginRight: SPACING.sm,
        marginTop: -2,
    },
    featureText: {
        color: '#4A4A4A',
        flex: 1,
        lineHeight: 22,
    },
    pricingContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    price: {
        fontSize: 40,
        color: '#2D2D2D',
    },
    actions: {
        gap: SPACING.sm,
    },
    mainButton: {
        width: '100%',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    skipBtn: {
        alignItems: 'center',
        paddingVertical: SPACING.md,
    },
    skipText: {
        color: COLORS.textMuted,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    guarantee: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.xl,
        paddingBottom: 40,
        gap: 6,
    },
    guaranteeText: {
        color: '#757575',
    }
});
