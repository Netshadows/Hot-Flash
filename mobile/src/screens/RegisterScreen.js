import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const RegisterScreen = ({ navigation, route }) => {
    const { profileData } = route.params || { profileData: {} };

    const handleRegister = (method) => {
        console.log(`Registering via ${method}`);
        // Advance to Paywall after account creation
        navigation.navigate('Paywall', { profileData, method });
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#FFFFFF', 'rgba(255, 88, 100, 0.05)']}
                style={StyleSheet.absoluteFillObject}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.heroSection}>
                    <View style={styles.badge}>
                        <AppText variant="caption" style={styles.badgeText}>PROTOCOL READY</AppText>
                    </View>
                    <AppText variant="heading1" style={styles.title}>Unlock your plan.</AppText>
                    <AppText variant="body" style={styles.subtitle}>
                        Create your account to save your 30-day protocol and start your transformation journey.
                    </AppText>
                </View>

                <View style={styles.authSection}>
                    <TouchableOpacity
                        style={[styles.authButton, styles.appleButton]}
                        onPress={() => handleRegister('Apple')}
                        activeOpacity={0.8}
                    >
                        <AppText style={styles.buttonIcon}></AppText>
                        <AppText style={styles.appleButtonText}>Sign up with Apple</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.authButton, styles.googleButton]}
                        onPress={() => handleRegister('Google')}
                        activeOpacity={0.8}
                    >
                        <AppText style={styles.buttonIcon}>G</AppText>
                        <AppText style={styles.googleButtonText}>Sign up with Google</AppText>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <AppText style={styles.orText}>OR</AppText>
                        <View style={styles.line} />
                    </View>

                    <View style={styles.privacyCard}>
                        <View style={styles.privacyHeader}>
                            <AppText style={{ fontSize: 20, marginRight: 8 }}>🛡️</AppText>
                            <AppText variant="heading3">Privacy First</AppText>
                        </View>
                        <AppText variant="caption" style={styles.privacyText}>
                            Your health journey is sacred. We use end-to-end encryption for all wellness markers.
                        </AppText>
                        <Button
                            title="Continue Anonymously"
                            variant="secondary"
                            onPress={() => handleRegister('Anonymous')}
                            style={styles.anonymousButton}
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <AppText variant="caption" style={styles.disclaimer}>
                    By continuing, you agree to our Terms & Privacy Policy.
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
    badge: {
        backgroundColor: COLORS.accentPink,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
        marginBottom: SPACING.md,
    },
    badgeText: {
        color: COLORS.primary,
        fontWeight: '800',
        letterSpacing: 1,
    },
    title: {
        fontSize: 32,
        color: COLORS.primary,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: SPACING.lg,
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
    }
});
