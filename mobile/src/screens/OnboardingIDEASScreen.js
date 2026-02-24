import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { SelectGroup } from '../components/SelectGroup';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const OnboardingIDEASScreen = ({ navigation, route }) => {
    const { profileData } = route.params || {};
    const [readiness, setReadiness] = useState('');
    const [motivators, setMotivators] = useState([]);
    const [goalStyle, setGoalStyle] = useState('');

    const handleNext = () => {
        if (!readiness) {
            alert('Please specify your Readiness to Change.');
            return;
        }
        // Direct to new advanced Device Integrations screen instead of Commitment
        navigation.navigate('OnboardingIntegrations', {
            profileData: { ...profileData, readiness }
        });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <LinearGradient colors={[COLORS.accentPink, COLORS.background]} style={StyleSheet.absoluteFillObject} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <AppText variant="caption" style={styles.stepIndicator}>Step 4 of 4: IDEAS Framework</AppText>
                <AppText variant="heading1" style={styles.title}>Motivation</AppText>
                <AppText style={styles.subtitle}>We use Self-Determination Theory to understand what intrinsically rewards you. (Mandatory)</AppText>

                <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                        <AppText style={styles.label}>Readiness to Change / Motivation <AppText style={{ color: 'red' }}>*</AppText></AppText>
                        <TouchableOpacity onPress={() => Alert.alert("Readiness to Change", "Based on the Transtheoretical Model, this assesses what stage you are at regarding taking action on your health goals.")}>
                            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} style={{ marginLeft: 4, marginBottom: 4 }} />
                        </TouchableOpacity>
                    </View>
                    <SelectGroup
                        options={["Not ready", "Thinking about it", "Ready to start", "Already taking action"]}
                        selected={readiness}
                        onSelect={setReadiness}
                    />
                </View>

                {/* Optional fields */}
                <AppText variant="heading2" style={styles.optionalHeader}>Engagement Strategies (Optional)</AppText>
                <AppText style={[styles.subtitle, { fontSize: 14 }]}>What process motivators drive you?</AppText>

                <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                        <AppText style={styles.label}>Process Motivator Preferences</AppText>
                        <TouchableOpacity onPress={() => Alert.alert("Process Motivators", "Internal or external factors that make the journey of reaching a goal rewarding, rather than just the outcome itself.")}>
                            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} style={{ marginLeft: 4, marginBottom: 4 }} />
                        </TouchableOpacity>
                    </View>
                    <SelectGroup
                        multi={true}
                        options={[
                            "Competition (Leaderboards, Challenges)",
                            "Community (Forum support, Sharing)",
                            "Curiosity (Learning new science)",
                            "Self-Discovery (Learning own body triggers)",
                            "Analytics (Detailed charts and data)"
                        ]}
                        selected={motivators}
                        onSelect={setMotivators}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <AppText style={styles.label}>Goal-Setting Style</AppText>
                    <SelectGroup
                        options={["Micro-goals (Guided)", "Self-directed", "No goals, just learning"]}
                        selected={goalStyle}
                        onSelect={setGoalStyle}
                    />
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <Button title="Continue to Integrations" onPress={handleNext} style={{ width: '100%' }} />
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
