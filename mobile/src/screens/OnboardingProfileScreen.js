import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useUser } from '../context/UserContext';

export const OnboardingProfileScreen = ({ navigation }) => {
    const { updateOnboardingData } = useUser();
    const stages = ["Perimenopause", "Menopause", "Postmenopause", "I'm not sure"];
    const [selected, setSelected] = useState(null);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <AppText variant="heading1" style={styles.title}>Where are you in your journey?</AppText>

                <View style={styles.optionsContainer}>
                    {stages.map((stage, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[
                                styles.optionCard,
                                selected === idx && styles.optionSelected
                            ]}
                            onPress={() => setSelected(idx)}
                            activeOpacity={0.8}
                        >
                            <AppText
                                variant="body"
                                style={[
                                    styles.optionText,
                                    selected === idx && styles.optionTextSelected
                                ]}
                            >
                                {stage}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>

                {selected === 3 && (
                    <View style={styles.modalSnippet}>
                        <AppText variant="body" style={styles.modalText}>
                            "No problem. We'll help you identify your stage through your daily rituals."
                        </AppText>
                        <AppText variant="caption" style={styles.geminiTag}>✨ Gemini Intelligence</AppText>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <Button
                    title="Next"
                    onPress={() => {
                        updateOnboardingData({ stage: stages[selected] });
                        navigation.navigate('OnboardingFriction');
                    }}
                    style={{ opacity: selected !== null ? 1 : 0.5 }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: {
        flex: 1,
        padding: SPACING.xl,
        paddingTop: 80,
    },
    title: {
        fontSize: 28,
        marginBottom: SPACING.xl,
        color: COLORS.textMain,
    },
    optionsContainer: {
        gap: SPACING.md,
    },
    optionCard: {
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 2,
    },
    optionSelected: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(255, 88, 100, 0.05)',
    },
    optionText: {
        fontWeight: '500',
        textAlign: 'center',
    },
    optionTextSelected: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    modalSnippet: {
        marginTop: SPACING.xl,
        padding: SPACING.lg,
        backgroundColor: 'rgba(255, 88, 100, 0.05)',
        borderRadius: RADIUS.md,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    modalText: {
        fontStyle: 'italic',
        color: COLORS.textMain,
    },
    geminiTag: {
        marginTop: SPACING.sm,
        color: COLORS.primary,
        fontWeight: '700',
    },
    footer: {
        padding: SPACING.xl,
        paddingBottom: 60,
    }
});
