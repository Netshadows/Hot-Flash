import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../components/Typography';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { Svg, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export const DashboardScreen = ({ navigation }) => {
    // 0 = Morning, 1 = Afternoon, 2 = Evening
    const [ritualState, setRitualState] = useState(0);
    const [ringProgress, setRingProgress] = useState(0.0);

    const handleRitualComplete = () => {
        // Haptic feedback placeholder
        if (ritualState < 2) {
            setRitualState(prev => prev + 1);
            setRingProgress(prev => prev + 0.33);
        } else if (ritualState === 2 && ringProgress < 1) {
            setRingProgress(1); // Complete the ring
        }
    };

    const renderRitualContent = () => {
        switch (ritualState) {
            case 0:
                return (
                    <View style={styles.ritualPrompt}>
                        <AppText variant="caption">Morning Ritual</AppText>
                        <AppText variant="heading2">30-Second Mood Pulse</AppText>
                    </View>
                );
            case 1:
                return (
                    <View style={styles.ritualPrompt}>
                        <AppText variant="caption">Afternoon Pulse</AppText>
                        <AppText variant="heading2">How is your focus right now?</AppText>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.ritualPrompt}>
                        <AppText variant="caption">Evening Wind-down</AppText>
                        <AppText variant="heading2">Sleep Prep & Reflection</AppText>
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(255, 88, 100, 0.08)', 'rgba(255, 182, 193, 0.1)']}
                style={StyleSheet.absoluteFillObject}
            />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <AppText variant="heading1">Good Morning, Eric.</AppText>
                    <AppText variant="subtitle">Your body is adapting.</AppText>
                </View>

                {/* Ritual Ring */}
                <View style={styles.resonanceContainer}>
                    <View style={styles.ringWrapper}>
                        <Svg height="260" width="260" viewBox="0 0 200 200">
                            {/* Track */}
                            <Circle
                                cx="100"
                                cy="100"
                                r="90"
                                stroke={COLORS.surfaceBorder}
                                strokeWidth="8"
                                fill="none"
                            />
                            {/* Progress */}
                            <Circle
                                cx="100"
                                cy="100"
                                r="90"
                                stroke={COLORS.primary}
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray="565"
                                strokeDashoffset={565 - (565 * ringProgress)}
                                strokeLinecap="round"
                                rotation="-90"
                                origin="100, 100"
                            />
                        </Svg>

                        <View style={styles.ritualCenter}>
                            {ringProgress >= 1 ? (
                                <View style={styles.completedState}>
                                    <AppText style={{ fontSize: 40 }}>✨</AppText>
                                    <AppText variant="heading2" style={{ color: COLORS.primary }}>All Done!</AppText>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.ritualButton}
                                    onPress={handleRitualComplete}
                                    activeOpacity={0.8}
                                >
                                    {renderRitualContent()}
                                    <View style={styles.startBadge}>
                                        <AppText variant="buttonText" style={{ color: '#FFF' }}>Start Ritual</AppText>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* The "Daily Gem" (Variable Reward) */}
                {ringProgress >= 1 && (
                    <View style={[styles.card, styles.gemCard]}>
                        <AppText variant="caption" style={styles.gemTag}>ERIC, DID YOU KNOW?</AppText>
                        <AppText variant="body" style={styles.insightText}>
                            Your joint pain often spikes 24 hours after a low-activity day. Tomorrow is a great day for a light walk.
                        </AppText>
                        <AppText variant="caption" style={styles.geminiTag}>✨ Gemini Intelligence</AppText>
                    </View>
                )}

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.lg,
        paddingTop: 80,
        paddingBottom: 40,
    },
    header: {
        marginBottom: SPACING.xl,
        alignItems: 'center',
    },
    resonanceContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
        marginTop: SPACING.md,
    },
    ringWrapper: {
        width: 260,
        height: 260,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    ritualCenter: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ritualButton: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ritualPrompt: {
        alignItems: 'center',
        paddingHorizontal: SPACING.sm,
    },
    startBadge: {
        marginTop: SPACING.md,
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 20,
    },
    completedState: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 4,
    },
    gemCard: {
        borderWidth: 2,
        borderColor: 'rgba(255, 88, 100, 0.3)',
        backgroundColor: '#FFF9FA',
    },
    gemTag: {
        color: COLORS.primary,
        fontWeight: '800',
        marginBottom: SPACING.sm,
    },
    insightText: {
        fontSize: 18,
        lineHeight: 26,
        color: COLORS.textMain,
    },
    geminiTag: {
        marginTop: SPACING.md,
        color: '#8A8A9D',
        fontWeight: '700',
        alignSelf: 'flex-end',
    },
});
