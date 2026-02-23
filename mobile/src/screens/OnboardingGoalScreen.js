import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { ScientificHint } from '../components/ScientificHint';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export const OnboardingGoalScreen = ({ navigation, route }) => {
    const { profileData } = route.params || { profileData: {} };
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.15,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [scaleAnim]);

    const handleSelect = (goal) => {
        // Navigate to next screen, passing the selected goal
        navigation.navigate('OnboardingBaseline', {
            profileData: { ...profileData, primaryGoal: goal }
        });
    };

    const goals = [
        'Track my cycle',
        'Get pregnant',
        'Track my pregnancy',
        'Manage menopause symptoms'
    ];

    return (
        <View style={styles.container}>
            <View style={styles.animationContainer}>
                <Animated.View style={[styles.circleOuter, { transform: [{ scale: scaleAnim }] }]} />
                <Animated.View style={[styles.circleInner, { transform: [{ scale: scaleAnim }] }]} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xl }}>
                <AppText variant="heading1" style={styles.title}>What is your main goal?</AppText>
                <View style={{ marginBottom: SPACING.xl }}><ScientificHint title="Goal Trajectory" rationale="Isolating your primary goal (Tracking vs Menopause Management) shifts the algorithmic weighting of symptom analysis and changes the daily curriculum provided by Lumina." /></View>
            </View>

            <View style={styles.buttonContainer}>
                {goals.map((goal, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.goalButton}
                        activeOpacity={0.8}
                        onPress={() => handleSelect(goal)}
                    >
                        <AppText variant="body" style={styles.goalText}>{goal}</AppText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    animationContainer: {
        height: 200,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl * 1.5,
    },
    circleOuter: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255, 88, 100, 0.08)', // Very light primary pink
    },
    circleInner: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(255, 88, 100, 0.15)', // Slightly darker
    },
    title: {
        textAlign: 'center',
        marginBottom: SPACING.xl,
        color: '#2D2D2D',
        paddingHorizontal: SPACING.md,
    },
    buttonContainer: {
        width: '100%',
        gap: SPACING.md,
    },
    goalButton: {
        width: '100%',
        paddingVertical: 18,
        paddingHorizontal: SPACING.lg,
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        shadowColor: 'rgba(255, 88, 100, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 2,
        alignItems: 'center',
    },
    goalText: {
        fontWeight: '600',
        color: '#4A4A4A',
        fontSize: 16,
    }
});
