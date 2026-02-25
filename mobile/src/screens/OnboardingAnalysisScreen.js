import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useUser } from '../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { PanResponder } from 'react-native';

const STAGES = [
    {
        id: 'pre',
        label: 'Premenopause',
        desc: "Regular cycles and consistent hormonal patterns. No symptoms yet.",
        icon: 'reload-outline',
        color: '#818CF8'
    },
    {
        id: 'early_peri',
        label: 'Early Perimenopause',
        desc: "Subtle changes in cycle length or flow. Early hormonal shifts begin.",
        icon: 'hourglass-outline',
        color: '#F472B6'
    },
    {
        id: 'late_peri',
        label: 'Late Perimenopause',
        desc: "Significant gaps between periods. Common symptoms like hot flashes.",
        icon: 'time-outline',
        color: '#E11D48'
    },
    {
        id: 'menopause',
        label: 'Menopause',
        desc: "The milestone of 12 consecutive months without a period.",
        icon: 'sunny-outline',
        color: '#F59E0B'
    },
    {
        id: 'post',
        label: 'Postmenopause',
        desc: "Living with stabilized hormones and a new focus on long-term health.",
        icon: 'sync-outline',
        color: '#EA580C'
    }
];

export const OnboardingAnalysisScreen = ({ navigation, route }) => {
    const { profileData } = route.params || { profileData: {} };
    const { updateOnboardingData, updateNotifications } = useUser();

    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(0);

    // AI Prediction Logic
    const predictedIndex = useMemo(() => {
        const age = profileData?.baseline?.age || 45;
        const lastPeriod = profileData?.baseline?.lastPeriod?.value;

        if (lastPeriod === 'over_a_year') return 4; // Post
        if (age < 35) return 0; // Pre
        if (age < 45) return 1; // Early Peri
        if (age < 52) return 2; // Late Peri
        return 3; // Menopause/Transition
    }, [profileData]);

    const [selectedIndex, setSelectedIndex] = useState(predictedIndex);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const arcLayout = useRef({ x: 0, y: 0, width: 0, height: 0 });

    const steps = [
        "Analyzing your profile...",
        "Comparing to clinical datasets...",
        "Projecting your lifecycle trajectory..."
    ];

    useEffect(() => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 4;
            if (currentProgress > 100) currentProgress = 100;
            setProgress(currentProgress);

            if (currentProgress > 33 && currentProgress <= 66) setStep(1);
            if (currentProgress > 66) setStep(2);

            if (currentProgress >= 100) {
                clearInterval(interval);
                // Set the predicted stage in global context initially
                updateOnboardingData({ stage: STAGES[predictedIndex].label });
            }
        }, 120);

        return () => clearInterval(interval);
    }, [predictedIndex]);

    // Pulsing Animation for AI Predictor
    useEffect(() => {
        if (progress >= 100) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.3,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [progress]);

    const handleStageSelection = (index) => {
        setSelectedIndex(index);
        updateOnboardingData({ stage: STAGES[index].label });
    };

    const handleFinish = () => {
        updateNotifications({ enabled: true });
        navigation.navigate('OnboardingReveal', { profileData: { ...profileData, stage: STAGES[selectedIndex].label } });
    };

    // Arc constants for positioning and drag logic
    const ARC_RADIUS = 130;
    const TOTAL_STAGES = STAGES.length;
    const START_ANGLE = 200;
    const END_ANGLE = -20;
    const ANGLE_RANGE = START_ANGLE - END_ANGLE;
    const ANGLE_STEP = ANGLE_RANGE / (TOTAL_STAGES - 1);

    const getStageProps = (idx) => {
        const angle = START_ANGLE - (idx * ANGLE_STEP);
        const rad = (angle * Math.PI) / 180;
        return {
            x: ARC_RADIUS * Math.cos(rad),
            y: -ARC_RADIUS * Math.sin(rad),
            angle
        };
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                // Calculate angle relative to arc center
                const centerX = arcLayout.current.x + arcLayout.current.width / 2;
                const centerY = arcLayout.current.y + arcLayout.current.height / 2;

                const relativeX = gestureState.moveX - centerX;
                const relativeY = gestureState.moveY - centerY;

                let angleRad = Math.atan2(-relativeY, relativeX);
                let angleDeg = (angleRad * 180) / Math.PI;

                // Normalize angle to match our 200 to -20 range
                if (angleDeg < -90) angleDeg += 360;

                let closestIdx = 0;
                let minDiff = 1000;

                for (let i = 0; i < TOTAL_STAGES; i++) {
                    const targetAngle = START_ANGLE - (i * ANGLE_STEP);
                    const diff = Math.abs(angleDeg - targetAngle);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestIdx = i;
                    }
                }

                if (closestIdx !== selectedIndex) {
                    handleStageSelection(closestIdx);
                }
            },
        })
    ).current;

    return (
        <View style={styles.container}>
            <LinearGradient colors={[COLORS.accentPink + '20', COLORS.background]} style={StyleSheet.absoluteFillObject} />

            {progress < 100 ? (
                <View style={styles.loadingContainer}>
                    <AppText variant="heading2" style={styles.title}>{steps[step]}</AppText>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                    </View>
                    <AppText style={styles.progressSub}>{progress}% calibrated</AppText>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    <AppText variant="heading1" style={styles.resultTitle}>Your Menopause Journey</AppText>
                    <AppText style={styles.resultSub}>We've projected your current position. Adjust the marker if this feels different.</AppText>

                    <View
                        style={styles.continuumCard}
                        {...panResponder.panHandlers}
                    >
                        {/* The Draggable SVG Journey Arc */}
                        <View
                            style={styles.arcContainer}
                            onLayout={(e) => {
                                // Use measure to get absolute screen position
                                e.target.measure((x, y, width, height, pageX, pageY) => {
                                    arcLayout.current = { x: pageX, y: pageY, width, height };
                                });
                            }}
                        >
                            <Svg width="320" height="300" viewBox="-160 -150 320 300">
                                <Defs>
                                    <SvgLinearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <Stop offset="0%" stopColor="#F59E0B" />
                                        <Stop offset="50%" stopColor="#E11D48" />
                                        <Stop offset="100%" stopColor="#818CF8" />
                                    </SvgLinearGradient>
                                </Defs>
                                <Path
                                    d={`M ${ARC_RADIUS * Math.cos(200 * Math.PI / 180)} ${-ARC_RADIUS * Math.sin(200 * Math.PI / 180)} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${ARC_RADIUS * Math.cos(-20 * Math.PI / 180)} ${-ARC_RADIUS * Math.sin(-20 * Math.PI / 180)}`}
                                    fill="none"
                                    stroke="url(#arcGradient)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                />

                                {STAGES.map((s, idx) => {
                                    const { x, y } = getStageProps(idx);
                                    const isPredicted = idx === predictedIndex;
                                    const isSelected = idx === selectedIndex;

                                    return (
                                        <React.Fragment key={s.id}>
                                            {isPredicted && (
                                                <Animated.View style={[
                                                    styles.nodePulse,
                                                    {
                                                        transform: [
                                                            { translateX: x },
                                                            { translateY: y },
                                                            { scale: pulseAnim }
                                                        ],
                                                        opacity: pulseAnim.interpolate({
                                                            inputRange: [1, 1.3],
                                                            outputRange: [0.3, 0.1]
                                                        })
                                                    }
                                                ]} />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </Svg>

                            {/* Overlay interactive nodes for better touch targets */}
                            {STAGES.map((s, idx) => {
                                const { x, y } = getStageProps(idx);
                                const isPredicted = idx === predictedIndex;
                                const isSelected = idx === selectedIndex;

                                return (
                                    <View
                                        key={s.id}
                                        style={[
                                            styles.nodeAbsolute,
                                            { transform: [{ translateX: x }, { translateY: y }] }
                                        ]}
                                    >
                                        <View style={[
                                            styles.node,
                                            idx <= selectedIndex && styles.nodeActive,
                                            isSelected && styles.nodeSelected,
                                            isPredicted && styles.nodePredicted
                                        ]} />

                                        <AppText style={[
                                            styles.nodeLabel,
                                            isSelected && styles.nodeLabelSelected,
                                            { top: idx % 2 === 0 ? 12 : -55 }
                                        ]} numberOfLines={2}>
                                            {idx === 0 || idx === TOTAL_STAGES - 1 ? s.label.split(' ')[0] : ''}
                                        </AppText>
                                    </View>
                                );
                            })}

                            <Animated.View style={[
                                styles.indicatorRingArc,
                                {
                                    transform: [
                                        { translateX: getStageProps(selectedIndex).x },
                                        { translateY: getStageProps(selectedIndex).y }
                                    ]
                                }
                            ]} />
                        </View>
                    </View>

                    <View style={styles.cardList}>
                        {STAGES.map((s, idx) => (
                            <TouchableOpacity
                                key={s.id}
                                style={[styles.stageCard, idx === selectedIndex && styles.stageCardActive]}
                                onPress={() => handleStageSelection(idx)}
                            >
                                <View style={[styles.cardIconBox, { backgroundColor: s.color + '15' }]}>
                                    <Ionicons name={s.icon} size={24} color={s.color} />
                                </View>
                                <View style={styles.cardMain}>
                                    <View style={styles.cardHeader}>
                                        <AppText style={styles.cardTitle}>{s.label}</AppText>
                                        {idx === predictedIndex && (
                                            <View style={styles.predictedBadge}>
                                                <AppText style={styles.predictedBadgeText}>PREDICTED</AppText>
                                            </View>
                                        )}
                                    </View>
                                    <AppText style={styles.cardDesc}>{s.desc}</AppText>
                                </View>
                                {idx === selectedIndex && (
                                    <View style={[styles.checkCircle, { backgroundColor: COLORS.primary }]}>
                                        <Ionicons name="checkmark" size={16} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Button
                        title="Lock in Profile & Continue"
                        onPress={handleFinish}
                        style={styles.button}
                    />
                    <View style={styles.footerSpacing} />
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    title: {
        textAlign: 'center',
        marginBottom: SPACING.xl,
        color: COLORS.primary,
    },
    progressBarBg: {
        width: '100%',
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: SPACING.md,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    progressSub: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
    resultContainer: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: 40,
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 12,
    },
    resultSub: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    continuumCard: {
        width: '100%',
        alignItems: 'center',
    },
    arcContainer: {
        height: 300,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    arcPath: {
        position: 'absolute',
        width: 260,
        height: 130, // Semi-circle
        borderTopLeftRadius: 130,
        borderTopRightRadius: 130,
        borderWidth: 8,
        borderColor: '#F3F4F6',
        borderBottomWidth: 0,
        top: 25,
    },
    arcPathGradient: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        top: '50%',
        marginTop: -130,
    },
    arcPathOverlay: {
        position: 'absolute',
        width: 252,
        height: 252,
        borderRadius: 126,
        backgroundColor: COLORS.background,
        top: '50%',
        marginTop: -126,
    },
    nodeAbsolute: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        left: '50%',
        top: '50%',
    },
    nodeWrapper: {
        alignItems: 'center',
    },
    node: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#D1D5DB',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    nodeActive: {
        backgroundColor: COLORS.primary,
    },
    nodeSelected: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: COLORS.primary,
        borderWidth: 3,
        zIndex: 20,
    },
    nodePredicted: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    nodeLabel: {
        fontSize: 10,
        color: COLORS.textMuted,
        fontWeight: '600',
        textTransform: 'uppercase',
        textAlign: 'center',
        width: 80,
        position: 'absolute',
    },
    nodeLabelSelected: {
        color: COLORS.primary,
        fontWeight: '800',
    },
    nodePulse: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
    },
    indicatorRingArc: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(255,255,255,0.4)',
        left: '50%',
        top: '50%',
        marginLeft: -25,
        marginTop: -25,
        zIndex: 15,
    },
    indicatorPulseArc: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: COLORS.primary,
        opacity: 0.5,
    },
    miniIconNode: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    indicatorRing: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 4,
        zIndex: 5,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    stageDetails: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.xl,
        padding: SPACING.xl,
        ...COLORS.shadowSoft,
        marginBottom: SPACING.xl,
    },
    stageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    stageTitle: {
        color: COLORS.text,
    },
    stageDesc: {
        color: COLORS.textMuted,
        lineHeight: 22,
    },
    aiBadge: {
        backgroundColor: COLORS.primary + '15',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    aiBadgeText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '700',
    },
    cardList: {
        width: '100%',
        gap: 12,
        marginBottom: 40,
    },
    stageCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F9FAFB',
        ...COLORS.shadowSoft,
    },
    stageCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#FFF',
        shadowColor: COLORS.primary,
        shadowRadius: 10,
        shadowOpacity: 0.1,
    },
    cardIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardMain: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    predictedBadge: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
    },
    predictedBadgeText: {
        color: '#E11D48',
        fontSize: 9,
        fontWeight: '800',
    },
    cardDesc: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    buttonContainer: {
        width: '100%',
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        ...COLORS.shadowMain,
    },
    gradientButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    footerSpacing: {
        height: 40,
    },
    button: {
        marginTop: SPACING.md,
        width: '100%',
    }
});
