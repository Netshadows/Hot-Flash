import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { AppText } from '../components/Typography';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { PaywallModal } from '../components/PaywallModal';

export const IntegrationsScreen = ({ navigation }) => {
    const { tier, upgradeTier } = useUser();
    const [showPaywall, setShowPaywall] = useState(false);
    const [connectedApps, setConnectedApps] = useState({
        apple_health: true,
        google_fit: false,
        oura: false,
        epic_fhir: false,
    });

    const toggleConnection = (appId, requiresPremium = false) => {
        if (requiresPremium && tier === 'free') {
            setShowPaywall(true);
            return;
        }
        setConnectedApps(prev => ({
            ...prev,
            [appId]: !prev[appId]
        }));
    };

    const integrationSections = [
        {
            title: "Core Ecosystems",
            data: [
                { id: 'apple_health', name: 'Apple Health', description: 'Sync vitals, sleep, & steps.', premium: false, icon: 'fitness' },
                { id: 'google_fit', name: 'Google Fit', description: 'Sync vitals & activity data.', premium: false, icon: 'watch' },
            ]
        },
        {
            title: "Wearables",
            data: [
                { id: 'oura', name: 'Oura Ring', description: 'Advanced sleep & temperature tracking.', premium: true, icon: 'moon' },
                { id: 'ringconn', name: 'RingConn', description: '24/7 finger-based health monitoring.', premium: true, icon: 'radio-button-off' },
                { id: 'whoop', name: 'Whoop', description: 'High-fidelity recovery and strain tracking.', premium: true, icon: 'pulse' },
                { id: 'garmin', name: 'Garmin', description: 'Performance and endurance metrics.', premium: false, icon: 'speedometer' },
                { id: 'fitbit', name: 'Fitbit', description: 'Activity, heart rate, and sleep data.', premium: false, icon: 'walk' },
                { id: 'samsung_health', name: 'Samsung Health', description: 'Comprehensive wellness tracking.', premium: false, icon: 'heart' },
                { id: 'withings', name: 'Withings', description: 'Smart scales and health hardware.', premium: false, icon: 'analytics' },
            ]
        },
        {
            title: "Diagnostic Devices",
            data: [
                { id: 'cgm', name: 'Continuous Glucose (CGM)', description: 'Glucose monitoring for metabolic health.', premium: true, icon: 'water' },
                { id: 'cpap', name: 'CPAP Machine', description: 'Sleep apnea and respiration metrics.', premium: true, icon: 'air' },
                { id: 'blood_pressure', name: 'Blood Pressure Cuff', description: 'Track hypertension and cardiovascular load.', premium: false, icon: 'thermometer' },
                { id: 'smart_scale', name: 'Smart Scale', description: 'Body composition and weight trends.', premium: false, icon: 'body' },
                { id: 'thermometer', name: 'Smart Thermometer', description: 'Core temperature tracking and cycle trends.', premium: false, icon: 'thermometer-outline' },
            ]
        },
        {
            title: "Clinical Portals",
            data: [
                { id: 'epic_fhir', name: 'Epic MyChart', description: 'Import clinical labs and hormone panels.', premium: true, icon: 'medkit' },
                { id: 'cerner', name: 'Cerner Health', description: 'Link hospital records and prescriptions.', premium: true, icon: 'document-text' },
            ]
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={28} color={COLORS.textMain} />
                </TouchableOpacity>
                <AppText variant="heading1" style={styles.title}>Integrations</AppText>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <AppText variant="body" style={styles.subtitle}>
                    Connect your wearables and clinical portals to enrich Lumina's personalized AI insights and symptom correlations.
                </AppText>

                {integrationSections.map((section, sIdx) => (
                    <View key={sIdx} style={styles.sectionContainer}>
                        <AppText variant="heading2" style={styles.sectionTitle}>{section.title}</AppText>
                        <View style={styles.listContainer}>
                            {section.data.map(app => {
                                const isConnected = connectedApps[app.id];
                                return (
                                    <View key={app.id} style={styles.integrationCard}>
                                        <View style={styles.cardHeader}>
                                            <View style={styles.iconBox}>
                                                <Ionicons name={app.icon} size={28} color={app.premium ? '#A5B4FC' : COLORS.textMuted} />
                                            </View>
                                            <View style={styles.textContainer}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <AppText variant="heading2" style={styles.appName}>{app.name}</AppText>
                                                    {app.premium && (
                                                        <View style={styles.premiumBadge}>
                                                            <AppText style={styles.premiumText}>PRO</AppText>
                                                        </View>
                                                    )}
                                                </View>
                                                <AppText variant="caption" style={styles.appDesc}>{app.description}</AppText>
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            style={[styles.connectBtn, isConnected && styles.connectBtnActive]}
                                            onPress={() => toggleConnection(app.id, app.premium)}
                                        >
                                            <AppText style={[styles.connectBtnText, isConnected && styles.connectBtnTextActive]}>
                                                {isConnected ? 'Disconnect' : 'Connect'}
                                            </AppText>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                ))}
            </ScrollView>

            <PaywallModal
                visible={showPaywall}
                onClose={() => setShowPaywall(false)}
                onUpgrade={(newTier) => {
                    upgradeTier(newTier);
                    setShowPaywall(false);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        paddingTop: 60,
        paddingBottom: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    backBtn: { marginRight: SPACING.md },
    title: { fontSize: 24, flex: 1 },
    content: { padding: SPACING.xl, paddingBottom: 100 },
    subtitle: { color: COLORS.textMuted, marginBottom: SPACING.xl, lineHeight: 22 },
    sectionContainer: { marginBottom: SPACING.xl },
    sectionTitle: { fontSize: 20, color: COLORS.textMain, marginBottom: SPACING.lg, fontWeight: '700' },
    listContainer: { gap: SPACING.lg },
    integrationCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    textContainer: { flex: 1, justifyContent: 'center' },
    appName: { fontSize: 18, color: '#2D2D2D', marginBottom: 2 },
    premiumBadge: {
        backgroundColor: '#E0E7FF',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: SPACING.sm,
    },
    premiumText: { color: '#4F46E5', fontSize: 10, fontWeight: '700' },
    appDesc: { color: COLORS.textMuted, lineHeight: 18 },
    connectBtn: {
        paddingVertical: 12,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
    },
    connectBtnActive: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    connectBtnText: { color: COLORS.surface, fontWeight: '600', fontSize: 16 },
    connectBtnTextActive: { color: '#4B5563' },
});
