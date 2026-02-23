import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export const OnboardingAnalysisScreen = ({ navigation, route }) => {
    const { profileData } = route.params || { profileData: {} };
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(0);

    const steps = [
        "Analyzing your profile...",
        "Comparing to 440M users...",
        "Creating your personalized plan..."
    ];

    useEffect(() => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 5;
            setProgress(currentProgress);

            if (currentProgress > 33 && currentProgress <= 66) setStep(1);
            if (currentProgress > 66) setStep(2);

            if (currentProgress >= 100) {
                clearInterval(interval);
            }
        }, 150);

        return () => clearInterval(interval);
    }, []);

    const handleFinish = () => {
        navigation.navigate('OnboardingReveal', { profileData });
    };

    return (
        <View style={styles.container}>
            {progress < 100 ? (
                <View style={styles.loadingContainer}>
                    <AppText variant="heading2" style={styles.title}>{steps[step]}</AppText>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                    </View>
                </View>
            ) : (
                <View style={styles.resultContainer}>
                    <AppText variant="heading1" style={styles.title}>Your Lifecycle Projection</AppText>

                    <View style={styles.scoreCard}>
                        <AppText variant="heading2" style={{ color: COLORS.primary, marginBottom: 8 }}>Perimenopause</AppText>
                        <AppText variant="body" style={{ textAlign: 'center' }}>
                            Based on your symptoms and age, you are likely in the early stages of Perimenopause.
                        </AppText>
                    </View>

                    <Button
                        title="Enable Notifications to Continue"
                        onPress={handleFinish}
                        style={styles.button}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.lg,
        justifyContent: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
    },
    title: {
        marginBottom: SPACING.xl,
        color: '#2D2D2D',
        textAlign: 'center',
    },
    progressBarBg: {
        height: 8,
        width: '100%',
        backgroundColor: '#E8E8E8',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    resultContainer: {
        alignItems: 'center',
    },
    scoreCard: {
        backgroundColor: '#FFFFFF',
        padding: SPACING.xl,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        shadowColor: 'rgba(255, 88, 100, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 2,
        width: '100%',
        marginBottom: SPACING.xl * 2,
    },
    button: {
        width: '100%',
    }
});
