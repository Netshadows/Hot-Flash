import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { SelectGroup } from '../components/SelectGroup';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const OnboardingSDOHScreen = ({ navigation }) => {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [language, setLanguage] = useState('');
    const [race, setRace] = useState([]);
    const [environment, setEnvironment] = useState('');

    const handleNext = () => {
        // Collect mandatory fields
        if (!age || !gender || !language) {
            alert('Please fill out Age, Gender, and Language to proceed.');
            return;
        }
        navigation.navigate('OnboardingBIT', {
            profileData: { age, gender, language }
        });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <LinearGradient colors={[COLORS.accentPink, COLORS.background]} style={StyleSheet.absoluteFillObject} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <AppText variant="caption" style={styles.stepIndicator}>Step 1 of 4: Demographics</AppText>
                <AppText variant="heading1" style={styles.title}>Your Baseline</AppText>
                <AppText style={styles.subtitle}>To personalize your clinical journey, we need to understand a bit about you. (Mandatory)</AppText>

                <View style={styles.inputContainer}>
                    <AppText style={styles.label}>Age / Life Stage <AppText style={{ color: 'red' }}>*</AppText></AppText>
                    <SelectGroup
                        options={["Under 35", "35 - 45", "46 - 55", "56+"]}
                        selected={age}
                        onSelect={setAge}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <AppText style={styles.label}>Sex and Gender Identity <AppText style={{ color: 'red' }}>*</AppText></AppText>
                    <SelectGroup
                        options={["Female", "Male", "Non-binary", "Prefer not to say"]}
                        selected={gender}
                        onSelect={setGender}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <AppText style={styles.label}>Primary Language <AppText style={{ color: 'red' }}>*</AppText></AppText>
                    <SelectGroup
                        options={["English", "Spanish", "French", "Other"]}
                        selected={language}
                        onSelect={setLanguage}
                    />
                </View>

                {/* Optional fields */}
                <AppText variant="heading2" style={styles.optionalHeader}>Deeper Context (Optional)</AppText>
                <AppText style={[styles.subtitle, { fontSize: 14 }]}>Providing more context helps us improve health equity and long-term analysis.</AppText>

                <View style={styles.inputContainer}>
                    <AppText style={styles.label}>Race and Ethnicity</AppText>
                    <SelectGroup
                        multi={true}
                        options={["Asian", "Black", "Hispanic/Latino", "White", "Prefer not to say"]}
                        selected={race}
                        onSelect={setRace}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <AppText style={styles.label}>Living Environment</AppText>
                    <SelectGroup
                        options={["Urban", "Suburban", "Rural"]}
                        selected={environment}
                        onSelect={setEnvironment}
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
