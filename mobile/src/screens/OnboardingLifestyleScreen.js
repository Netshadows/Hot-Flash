import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { ScientificHint } from '../components/ScientificHint';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export const OnboardingLifestyleScreen = ({ navigation, route }) => {
    // Accumulate profile data passed from previous screen
    const { profileData } = route.params || { profileData: {} };

    const [sleep, setSleep] = useState(null);
    const [stress, setStress] = useState(null);
    const [hrt, setHrt] = useState(null);

    const handleNext = () => {
        navigation.navigate('OnboardingInterstitial', {
            profileData: {
                ...profileData,
                lifestyle: { sleep, stress, hrt }
            }
        });
    };

    const isComplete = sleep && stress && hrt;

    const renderOptions = (state, setState, options) => (
        <View style={styles.optionsContainer}>
            {options.map((opt) => (
                <TouchableOpacity
                    key={opt}
                    style={[styles.optionBtn, state === opt && styles.optionBtnSelected]}
                    onPress={() => setState(opt)}
                >
                    <AppText style={state === opt ? styles.optionTextSelected : styles.optionText}>{opt}</AppText>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <AppText variant="heading1" style={styles.title}>Let's dive deeper</AppText>

                <AppText variant="body" style={styles.subtitle}>
                    To generate a highly personalized protocol, we need to understand your daily ecosystem.
                </AppText>

                {/* Question 1: Sleep */}
                <View style={styles.questionBlock}>
                    <View style={styles.questionHeader}>
                        <AppText variant="heading3">How is your sleep quality?</AppText>
                        <ScientificHint
                            title="Sleep Architecture & Estrogen"
                            rationale="Estrogen dominance or severe fluctuations directly destabilize REM sleep and thermoregulation. Identifying your sleep pattern helps us prescribe evening cooling routines."
                        />
                    </View>
                    {renderOptions(sleep, setSleep, ["Uninterrupted", "Frequent waking", "Insomnia / Can't sleep"])}
                </View>

                {/* Question 2: Stress */}
                <View style={styles.questionBlock}>
                    <View style={styles.questionHeader}>
                        <AppText variant="heading3">Current stress levels?</AppText>
                        <ScientificHint
                            title="The Cortisol Steal"
                            rationale="High cortisol (stress hormone) actively suppresses progesterone production, dramatically worsening brain fog and mood swings."
                        />
                    </View>
                    {renderOptions(stress, setStress, ["Low / Manageable", "Moderate", "High / Overwhelming"])}
                </View>

                {/* Question 3: HRT */}
                <View style={styles.questionBlock}>
                    <View style={styles.questionHeader}>
                        <AppText variant="heading3">Are you using HRT?</AppText>
                        <ScientificHint
                            title="Hormone Replacement Therapy"
                            rationale="Knowing if you are on synthetic or bio-identical hormones prevents counter-indicative nutritional and supplementary recommendations."
                        />
                    </View>
                    {renderOptions(hrt, setHrt, ["Yes, active HRT", "Considering it", "No / Natural transition"])}
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Continue"
                    onPress={handleNext}
                    disabled={!isComplete}
                    style={{ width: '100%' }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.lg, paddingTop: 60, paddingBottom: 40 },
    title: { color: COLORS.primary, marginBottom: SPACING.xs },
    subtitle: { color: '#666', marginBottom: SPACING.xl, lineHeight: 22 },
    questionBlock: { marginBottom: SPACING.xl },
    questionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    optionsContainer: { gap: SPACING.sm },
    optionBtn: {
        width: '100%', paddingVertical: 14, paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#E8E8E8',
        backgroundColor: COLORS.surface,
    },
    optionBtnSelected: {
        borderColor: COLORS.primary, backgroundColor: 'rgba(255, 88, 100, 0.05)',
    },
    optionText: { color: '#4A4A4A', fontWeight: '500' },
    optionTextSelected: { color: COLORS.primary, fontWeight: '700' },
    footer: { padding: SPACING.xl, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#E8E8E8', backgroundColor: COLORS.background },
});
