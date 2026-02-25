import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { SelectGroup } from '../components/SelectGroup';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useUser } from '../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const OnboardingBITScreen = ({ navigation, route }) => {
    const { profileData } = route.params || {};
    const { updateNotifications } = useUser();
    const [clinicalAim, setClinicalAim] = useState('');
    const [notifications, setNotifications] = useState('');
    const [medium, setMedium] = useState([]);

    const handleNext = () => {
        if (!clinicalAim || !notifications) {
            alert('Please specify your Primary clinical aim and Notification preferences.');
            return;
        }
        updateNotifications({ workflow: notifications });
        navigation.navigate('OnboardingCBT', {
            profileData: { ...profileData, clinicalAim, notifications }
        });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <LinearGradient colors={[COLORS.accentPink, COLORS.background]} style={StyleSheet.absoluteFillObject} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <AppText variant="caption" style={styles.stepIndicator}>Step 2 of 4: Intervention Aims</AppText>
                <AppText variant="heading1" style={styles.title}>Your Why & When</AppText>
                <AppText style={styles.subtitle}>Define the intervention rules and workflow preferences (BIT Model) so we can tailor our push notifications and therapy medium.</AppText>

                <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                        <AppText style={styles.label}>Primary Clinical Aim <AppText style={{ color: 'red' }}>*</AppText></AppText>
                        <TouchableOpacity onPress={() => Alert.alert("Clinical Aim", "The primary target for our behavioral interventions. What are we trying to improve first?")}>
                            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} style={{ marginLeft: 4, marginBottom: 4 }} />
                        </TouchableOpacity>
                    </View>
                    <SelectGroup
                        options={["Anxiety Reduction", "Managing PMDD", "Hot Flash Tracking", "Sleep Improvement", "General Wellbeing"]}
                        selected={clinicalAim}
                        onSelect={setClinicalAim}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                        <AppText style={styles.label}>Notification Workflow <AppText style={{ color: 'red' }}>*</AppText></AppText>
                        <TouchableOpacity onPress={() => Alert.alert("Notification Workflow", "How we deliver Behavioral Intervention Technologies (BITs). Timing interventions to when you need them most increases their efficacy.")}>
                            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} style={{ marginLeft: 4, marginBottom: 4 }} />
                        </TouchableOpacity>
                    </View>
                    <SelectGroup
                        options={["Morning Only", "Evening Only", "Event-based", "No push notifications"]}
                        selected={notifications}
                        onSelect={setNotifications}
                    />
                </View>

                {/* Optional fields */}
                <AppText variant="heading2" style={styles.optionalHeader}>Delivery Preferences (Optional)</AppText>
                <AppText style={[styles.subtitle, { fontSize: 14 }]}>How do you prefer to receive therapy and interventions?</AppText>

                <View style={styles.inputContainer}>
                    <AppText style={styles.label}>Preferred Medium</AppText>
                    <SelectGroup
                        multi={true}
                        options={["Interactive UI", "Audio Guides", "Video", "SMS / Chat"]}
                        selected={medium}
                        onSelect={setMedium}
                    />
                </View>
                {/* Advanced Device integrations are pushed to their own upcoming screen */}
            </ScrollView>
            <View style={styles.footer}>
                <Button title="Continue" onPress={handleNext} style={{ width: '100%' }} />
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
    optionalHeader: { marginTop: SPACING.xl, marginBottom: SPACING.sm },
    inputContainer: { marginBottom: SPACING.lg },
    labelRow: { flexDirection: 'row', alignItems: 'center' },
    label: { fontWeight: '600', color: COLORS.textMain, marginBottom: 8, fontSize: 15 },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: COLORS.surfaceBorder,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        fontSize: 16,
        color: COLORS.textMain,
    },
    footer: {
        padding: SPACING.xl,
        paddingBottom: 40,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
    }
});
