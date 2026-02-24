import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { SelectGroup } from '../components/SelectGroup';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const OnboardingIntegrationsScreen = ({ navigation, route }) => {
    const { profileData } = route.params || {};

    // Multi-select wearable ecosystems
    const [wearables, setWearables] = useState([]);

    // Specific diagnostic tools
    const [diagnostics, setDiagnostics] = useState([]);

    // Consent toggles
    const [syncHealthKit, setSyncHealthKit] = useState(false);
    const [syncEMR, setSyncEMR] = useState(false);

    const handleNext = () => {
        navigation.navigate('OnboardingCommitment', {
            profileData: {
                ...profileData,
                integrations: { wearables, diagnostics, syncHealthKit, syncEMR }
            }
        });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <LinearGradient colors={[COLORS.accentPink, COLORS.background]} style={StyleSheet.absoluteFillObject} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <AppText variant="caption" style={styles.stepIndicator}>Step 5 of 5: Ecosystem</AppText>
                <AppText variant="heading1" style={styles.title}>Data Connections</AppText>
                <AppText style={styles.subtitle}>Connecting external health sources allows us to correlate your physiological data with your logged symptoms for precise clinical insights.</AppText>

                <View style={styles.inputContainer}>
                    <AppText style={styles.label}>Select Your Wearables & Trackers</AppText>
                    <SelectGroup
                        multi={true}
                        options={["Apple Watch", "Oura Ring", "RingConn", "Garmin", "Fitbit", "Whoop", "Samsung Galaxy Watch", "Withings"]}
                        selected={wearables}
                        onSelect={setWearables}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <AppText style={styles.label}>Advanced Diagnostic Tools</AppText>
                    <SelectGroup
                        multi={true}
                        options={["Continuous Glucose Monitor (CGM)", "CPAP Machine", "Blood Pressure Cuff", "Smart Scale", "Digital Thermometer"]}
                        selected={diagnostics}
                        onSelect={setDiagnostics}
                    />
                </View>

                <AppText variant="heading2" style={styles.optionalHeader}>Data Sync Permissions</AppText>
                <AppText style={[styles.subtitle, { fontSize: 14 }]}>You can change these at any time in your Settings.</AppText>

                <View style={styles.switchContainer}>
                    <View style={{ flex: 1, paddingRight: SPACING.md }}>
                        <AppText style={styles.label}>Apple HealthKit / Google Fit</AppText>
                        <AppText style={{ fontSize: 13, color: COLORS.textMuted }}>Sync sleep, steps, and heart rate variability (HRV) automatically.</AppText>
                    </View>
                    <Switch
                        trackColor={{ false: "#767577", true: COLORS.primary }}
                        thumbColor={"#f4f3f4"}
                        onValueChange={setSyncHealthKit}
                        value={syncHealthKit}
                    />
                </View>

                <View style={styles.switchContainer}>
                    <View style={{ flex: 1, paddingRight: SPACING.md }}>
                        <AppText style={styles.label}>Electronic Medical Record (EMR)</AppText>
                        <AppText style={{ fontSize: 13, color: COLORS.textMuted }}>Permit HotFlash to securely pull lab results and hormone panels.</AppText>
                    </View>
                    <Switch
                        trackColor={{ false: "#767577", true: COLORS.primary }}
                        thumbColor={"#f4f3f4"}
                        onValueChange={setSyncEMR}
                        value={syncEMR}
                    />
                </View>

            </ScrollView>
            <View style={styles.footer}>
                <Button title="Complete Setup" onPress={handleNext} style={{ width: '100%' }} />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.xl, paddingTop: 100, paddingBottom: 40 },
    stepIndicator: { color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
    title: { color: COLORS.textMain, marginBottom: 8 },
    subtitle: { fontSize: 16, color: COLORS.textMuted, lineHeight: 24, marginBottom: SPACING.xl },
    optionalHeader: { marginTop: SPACING.lg, marginBottom: SPACING.sm },
    inputContainer: { marginBottom: SPACING.xl },
    label: { fontWeight: '600', color: COLORS.textMain, marginBottom: 8, fontSize: 15 },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.surfaceBorder,
        marginBottom: SPACING.md,
    },
    footer: {
        padding: SPACING.xl,
        paddingBottom: 40,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
    }
});
