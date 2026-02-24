import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { SelectGroup } from '../components/SelectGroup';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const OnboardingCBTScreen = ({ navigation, route }) => {
    const { profileData } = route.params || {};
    const [severity, setSeverity] = useState('');
    const [activity, setActivity] = useState('');
    const [distortions, setDistortions] = useState([]);
    const [coping, setCoping] = useState([]);
    const [sleepQuality, setSleepQuality] = useState('');

    const handleNext = () => {
        if (!severity || !activity) {
            alert('Please specify your Baseline Symptom Severity and Behavioral Activation Level.');
            return;
        }
        navigation.navigate('OnboardingIDEAS', {
            profileData: { ...profileData, severity, activity }
        });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <LinearGradient colors={[COLORS.accentPink, COLORS.background]} style={StyleSheet.absoluteFillObject} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <AppText variant="caption" style={styles.stepIndicator}>Step 3 of 4: CBT Baselines</AppText>
                <AppText variant="heading1" style={styles.title}>Mental Health</AppText>
                <AppText style={styles.subtitle}>To measure efficacy, we establish psychological metrics using core CBT methodologies. (Mandatory)</AppText>

                <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                        <AppText style={styles.label}>Baseline Symptom Severity <AppText style={{ color: 'red' }}>*</AppText></AppText>
                        <TouchableOpacity onPress={() => Alert.alert("Symptom Severity", "Derived from clinical scales like PHQ-2 for depression or GAD-2 for anxiety to establish a baseline.")}>
                            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} style={{ marginLeft: 4, marginBottom: 4 }} />
                        </TouchableOpacity>
                    </View>
                    <AppText style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8 }}>Based on PHQ-2/GAD-2 Equivalents</AppText>
                    <SelectGroup
                        options={["None", "Mild", "Moderate", "High", "Severe"]}
                        selected={severity}
                        onSelect={setSeverity}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                        <AppText style={styles.label}>Behavioral Activation Level <AppText style={{ color: 'red' }}>*</AppText></AppText>
                        <TouchableOpacity onPress={() => Alert.alert("Behavioral Activation", "A CBT skill focused on increasing engagement in positive, meaningful activities to improve mood.")}>
                            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} style={{ marginLeft: 4, marginBottom: 4 }} />
                        </TouchableOpacity>
                    </View>
                    <SelectGroup
                        options={["High Functioning", "Moderate", "Struggling", "Avoiding daily activities"]}
                        selected={activity}
                        onSelect={setActivity}
                    />
                </View>

                {/* Optional fields */}
                <AppText variant="heading2" style={styles.optionalHeader}>Therapeutic Context (Optional)</AppText>
                <AppText style={[styles.subtitle, { fontSize: 14 }]}>Understanding your thought patterns allows for dynamic cognitive restructuring modules.</AppText>

                <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                        <AppText style={styles.label}>Primary Cognitive Distortions</AppText>
                        <TouchableOpacity onPress={() => Alert.alert("Cognitive Distortions", "Exaggerated or irrational thought patterns that are involved in the onset or perpetuation of psychopathological states.")}>
                            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} style={{ marginLeft: 4, marginBottom: 4 }} />
                        </TouchableOpacity>
                    </View>
                    <SelectGroup
                        multi={true}
                        options={[
                            "Catastrophizing (Assuming the worst)",
                            "All-or-nothing (Black and white thinking)",
                            "Mind reading (Assuming others' thoughts)",
                            "Overgeneralization (Broad conclusions)"
                        ]}
                        selected={distortions}
                        onSelect={setDistortions}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <AppText style={styles.label}>Current Coping Mechanisms</AppText>
                    <SelectGroup
                        multi={true}
                        options={["Mindfulness", "Avoidance", "Exercise", "Socializing"]}
                        selected={coping}
                        onSelect={setCoping}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                        <AppText style={styles.label}>Average Sleep Quality (PSQI)</AppText>
                        <TouchableOpacity onPress={() => Alert.alert("PSQI", "Pittsburgh Sleep Quality Index: a self-report questionnaire that assesses sleep quality over a 1-month time interval.")}>
                            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} style={{ marginLeft: 4, marginBottom: 4 }} />
                        </TouchableOpacity>
                    </View>
                    <SelectGroup
                        options={["Excellent", "Good", "Fair", "Poor", "Waking Frequently"]}
                        selected={sleepQuality}
                        onSelect={setSleepQuality}
                    />
                </View>
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
