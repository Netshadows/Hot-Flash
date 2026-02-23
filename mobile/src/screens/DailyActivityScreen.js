import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import * as Haptics from 'expo-haptics';

export const DailyActivityScreen = ({ navigation, route }) => {
    const { activity } = route.params;
    const [isCompleted, setIsCompleted] = useState(activity.completed);

    // Simple pulse animation for "dopamine hit"
    const pulseAnim = new Animated.Value(1);

    useEffect(() => {
        if (isCompleted && !activity.completed) {
            // Trigger animation and haptics ONLY if it was just completed
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true })
            ]).start();
        }
    }, [isCompleted]);

    const handleComplete = () => {
        setIsCompleted(true);
        // In a real app, update state/backend here to grant points/XP
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AppText style={styles.backButtonText}>← Close</AppText>
                </TouchableOpacity>
                <AppText variant="heading2" style={{ flex: 1, textAlign: 'center', color: activity.color }}>
                    {activity.title}
                </AppText>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Animated.View style={[
                    styles.iconCircle,
                    { backgroundColor: activity.color, transform: [{ scale: pulseAnim }] }
                ]}>
                    <AppText style={{ fontSize: 72 }}>{activity.icon}</AppText>
                </Animated.View>

                <AppText variant="heading1" style={styles.title}>
                    Today's {activity.title}
                </AppText>

                <AppText variant="body" style={styles.description}>
                    {activity.description}
                </AppText>

                {/* Simulated Content Block */}
                <View style={styles.lessonBlock}>
                    <AppText variant="body" style={styles.lessonText}>
                        <AppText style={{ fontWeight: 'bold' }}>Tip: </AppText>
                        Even small, consistent changes build massive resilience over your lifecycle.
                        Completing these micro-habits grants you Health XP and extends your daily streak!
                    </AppText>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                {!isCompleted ? (
                    <Button
                        title="Complete Activity (+10 XP)"
                        onPress={handleComplete}
                        style={{ backgroundColor: activity.color }}
                    />
                ) : (
                    <View style={styles.successState}>
                        <AppText variant="heading2" style={styles.successText}>🎉 Activity Complete!</AppText>
                        <AppText variant="caption" style={{ color: '#666', marginTop: 4 }}>+10 XP added to your total.</AppText>
                        <Button
                            title="Return to Dashboard"
                            onPress={() => navigation.goBack()}
                            style={{ marginTop: SPACING.lg, backgroundColor: COLORS.primary }}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: 60,
        paddingBottom: SPACING.md,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        padding: SPACING.xs,
        width: 60,
    },
    backButtonText: {
        color: '#666',
        fontWeight: '600',
    },
    content: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    iconCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xxl,
        marginTop: SPACING.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        color: '#2D2D2D',
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    description: {
        color: '#4A4A4A',
        textAlign: 'center',
        marginBottom: SPACING.xl,
        fontSize: 18,
        lineHeight: 26,
    },
    lessonBlock: {
        backgroundColor: '#F8F9FA',
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        width: '100%',
    },
    lessonText: {
        color: '#555',
        lineHeight: 24,
    },
    footer: {
        padding: SPACING.lg,
        paddingBottom: 40,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    successState: {
        alignItems: 'center',
    },
    successText: {
        color: '#2E8B57', // Sea green
    }
});
