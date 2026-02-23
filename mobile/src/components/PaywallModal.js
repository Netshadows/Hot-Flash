import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { AppText } from './Typography';
import { Button } from './Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const PaywallModal = ({ visible, onClose, onUpgrade }) => {
    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <Ionicons name="close-circle" size={32} color={COLORS.textMuted} />
                </TouchableOpacity>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.header}>
                        <AppText style={styles.icon}>✨</AppText>
                        <AppText variant="heading1" style={styles.title}>Unlock Lumina Premium</AppText>
                        <AppText variant="body" style={styles.subtitle}>
                            Get deeply personalized clinical insights and advanced symptom correlation analysis powered by our AI engine.
                        </AppText>
                    </View>

                    <LinearGradient colors={['rgba(255, 182, 193, 0.4)', 'rgba(255, 127, 80, 0.2)']} style={styles.tierCard}>
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
                            <AppText variant="body" style={styles.featureText}>Advanced Symptom Correlation Graphs</AppText>
                        </View>
                        <View style={styles.featureRow}>
                            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} style={styles.check} />
                            <AppText variant="body" style={styles.featureText}>Hormone Therapy (HRT) Tracking Models</AppText>
                        </View>
                    </LinearGradient>

                    <View style={styles.pricingContainer}>
                        <AppText variant="heading1" style={styles.price}>$9.99<AppText variant="body" style={{ color: '#888' }}> / mo</AppText></AppText>
                        <AppText variant="caption" style={{ color: '#888', marginTop: 4 }}>Cancel anytime</AppText>
                    </View>

                    <View style={styles.actions}>
                        <Button title="Start 7-Day Free Trial" onPress={() => onUpgrade('premium')} />
                        <TouchableOpacity onPress={onClose} style={styles.skipBtn}>
                            <AppText variant="body" style={styles.skipText}>Maybe later</AppText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    closeBtn: {
        position: 'absolute',
        top: SPACING.xl,
        right: SPACING.lg,
        zIndex: 10,
    },
    content: {
        padding: SPACING.xl,
        paddingTop: 80,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    icon: {
        fontSize: 64,
        marginBottom: SPACING.md,
    },
    title: {
        color: COLORS.primary,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: COLORS.textMuted,
        paddingHorizontal: SPACING.md,
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
        paddingBottom: 40,
    },
    skipBtn: {
        alignItems: 'center',
        paddingVertical: SPACING.lg,
        marginTop: SPACING.sm,
    },
    skipText: {
        color: COLORS.textMuted,
        fontWeight: '600',
    }
});
