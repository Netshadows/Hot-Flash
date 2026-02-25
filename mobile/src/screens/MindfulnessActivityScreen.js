import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../components/Typography';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import * as Haptics from 'expo-haptics';

export const MindfulnessActivityScreen = ({ navigation }) => {
    const [duration, setDuration] = useState('Medium'); // Short (1), Medium (3), Long (5)
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
    const [timeLeft, setTimeLeft] = useState(180); // Default 3 mins

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.7)).current;

    // Breathing cycle references
    const inhaleDuration = 4000;
    const holdDuration = 4000;
    const exhaleDuration = 6000;

    useEffect(() => {
        let timer;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            setPhase('Done');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft]);

    const animateBreath = () => {
        if (!isActive) return;

        setPhase('Inhale');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 2.5,
                duration: inhaleDuration,
                easing: Animated.Easing.inOut(Animated.Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: inhaleDuration,
                useNativeDriver: true,
            })
        ]).start(() => {
            if (!isActive) return;
            setPhase('Hold');
            setTimeout(() => {
                if (!isActive) return;
                setPhase('Exhale');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: exhaleDuration,
                        easing: Animated.Easing.inOut(Animated.Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0.7,
                        duration: exhaleDuration,
                        useNativeDriver: true,
                    })
                ]).start(() => {
                    if (isActive) animateBreath();
                });
            }, holdDuration);
        });
    };

    useEffect(() => {
        if (isActive) {
            animateBreath();
        } else {
            scaleAnim.stopAnimation();
            opacityAnim.stopAnimation();
            Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
        }
    }, [isActive]);

    const handleStart = () => {
        let seconds = 180;
        if (duration === 'Short') seconds = 60;
        if (duration === 'Long') seconds = 300;
        setTimeLeft(seconds);
        setIsActive(true);
    };

    const handleStop = () => {
        setIsActive(false);
        setPhase('Paused');
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#F0F8FF', '#D4E6F1']} style={StyleSheet.absoluteFillObject} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <AppText variant="heading2" style={{ color: COLORS.textMain }}>Mindfulness</AppText>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>

                {!isActive && phase !== 'Done' && (
                    <View style={styles.durationSelector}>
                        {['Short', 'Medium', 'Long'].map(d => (
                            <TouchableOpacity
                                key={d}
                                style={[styles.durationChip, duration === d && styles.durationChipActive]}
                                onPress={() => setDuration(d)}
                            >
                                <AppText style={[styles.durationText, duration === d && styles.durationTextActive]}>
                                    {d}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.orbContainer}>
                    <Animated.View style={[
                        styles.orb,
                        { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
                    ]}>
                        <LinearGradient
                            colors={['#87CEFA', '#4682B4']}
                            style={[StyleSheet.absoluteFillObject, styles.orbGradient]}
                        />
                    </Animated.View>
                </View>

                <View style={styles.instructionContainer}>
                    <AppText variant="heading1" style={styles.phaseText}>
                        {isActive ? phase : (phase === 'Done' ? 'Complete' : 'Ready')}
                    </AppText>
                    <AppText style={styles.timerText}>
                        {formatTime(timeLeft)}
                    </AppText>
                </View>

                {phase === 'Done' ? (
                    <TouchableOpacity style={styles.actionButton} onPress={() => navigation.goBack()}>
                        <AppText style={styles.actionButtonText}>Finish</AppText>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButton, isActive && styles.stopButton]}
                        onPress={isActive ? handleStop : handleStart}
                    >
                        <AppText style={styles.actionButtonText}>{isActive ? 'Pause' : 'Start Session'}</AppText>
                    </TouchableOpacity>
                )}

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingTop: 60,
        paddingBottom: SPACING.md,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 40,
    },
    durationSelector: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: RADIUS.full,
        padding: 4,
    },
    durationChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: RADIUS.full,
    },
    durationChipActive: {
        backgroundColor: '#FFF',
        ...COLORS.shadowSoft,
    },
    durationText: {
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    durationTextActive: {
        color: '#4682B4',
    },
    orbContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orb: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#87CEFA',
        shadowColor: '#4682B4',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    orbGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    instructionContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    phaseText: {
        color: '#4682B4',
        marginBottom: 8,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    timerText: {
        fontSize: 48,
        fontWeight: '300',
        color: COLORS.textMain,
    },
    actionButton: {
        backgroundColor: '#4682B4',
        paddingVertical: SPACING.md,
        paddingHorizontal: 40,
        borderRadius: RADIUS.full,
        ...COLORS.shadowSoft,
    },
    stopButton: {
        backgroundColor: '#A9A9A9',
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    }
});
