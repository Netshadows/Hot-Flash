import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const LoginScreen = ({ navigation }) => {
    const handleLogin = (method) => {
        console.log(`Logging in via ${method}`);
        // Advance to Onboarding flow after auth
        navigation.navigate('OnboardingGoal');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#FFFFFF', 'rgba(255, 88, 100, 0.05)']}
                style={StyleSheet.absoluteFillObject}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.heroSection}>
                    <View style={styles.logoContainer}>
                        <Image source={require('../../assets/icon.png')} style={{ width: 80, height: 80, borderRadius: 40 }} />
                    </View>
                    <AppText variant="heading1" style={styles.title}>Lumina</AppText>
                    <AppText variant="body" style={styles.subtitle}>
                        Evidence-based support for your transition.
                    </AppText>
                </View>

                <View style={styles.authSection}>
                    <TouchableOpacity
                        style={[styles.authButton, styles.appleButton]}
                        onPress={() => handleLogin('Apple')}
                        activeOpacity={0.8}
                    >
                        <AppText style={styles.buttonIcon}></AppText>
                        <AppText style={styles.appleButtonText}>Continue with Apple</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.authButton, styles.googleButton]}
                        onPress={() => handleLogin('Google')}
                        activeOpacity={0.8}
                    >
                        <AppText style={styles.buttonIcon}>G</AppText>
                        <AppText style={styles.googleButtonText}>Continue with Google</AppText>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <AppText style={styles.orText}>OR</AppText>
                        <View style={styles.line} />
                    </View>

                    <View style={styles.privacyCard}>
                        <View style={styles.privacyHeader}>
                            <AppText style={{ fontSize: 20, marginRight: 8 }}>🔒</AppText>
                            <AppText variant="heading3">Deep Privacy</AppText>
                        </View>
                        <AppText variant="caption" style={styles.privacyText}>
                            Your health data is highly sensitive. We support an Anonymous Mode that locally encrypts your data and separates it from all Personally Identifiable Information (PII).
                        </AppText>
                        <Button
                            title="Continue Anonymously"
                            variant="secondary"
                            onPress={() => handleLogin('Anonymous')}
                            style={styles.anonymousButton}
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <AppText variant="caption" style={styles.disclaimer}>
                    By continuing, you agree to our Terms of Service & Privacy Policy.
                    Lumina does not provide medical advice.
                </AppText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: {
        flexGrow: 1,
        padding: SPACING.xl,
        justifyContent: 'center',
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: SPACING.xl * 2,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 4,
    },
    logoIcon: {
        fontSize: 40,
    },
    title: {
        fontSize: 36,
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
    },
    authSection: {
        gap: SPACING.md,
    },
    authButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: RADIUS.lg,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        backgroundColor: COLORS.surface,
    },
    appleButton: {
        backgroundColor: '#000000',
        borderColor: '#000000',
    },
    appleButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    googleButton: {
        backgroundColor: '#FFFFFF',
    },
    googleButtonText: {
        color: '#4A4A4A',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    buttonIcon: {
        fontSize: 20,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.md,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    orText: {
        marginHorizontal: SPACING.md,
        color: '#999999',
        fontSize: 14,
        fontWeight: '600',
    },
    privacyCard: {
        backgroundColor: 'rgba(255, 88, 100, 0.05)',
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 88, 100, 0.2)',
        marginTop: SPACING.sm,
    },
    privacyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    privacyText: {
        color: '#4A4A4A',
        lineHeight: 20,
        marginBottom: SPACING.lg,
    },
    anonymousButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E8E8E8',
        borderWidth: 1,
    },
    footer: {
        padding: SPACING.xl,
        paddingBottom: 40,
    },
    disclaimer: {
        textAlign: 'center',
        color: '#999999',
        lineHeight: 18,
    }
});
