import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text, TouchableOpacity, Image, Modal, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../components/Typography';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { DynamicRadialGraph } from '../components/DynamicRadialGraph';
import { HealthKitService } from '../services/HealthKitService';
import { DataStreamType } from '../models/DeviceData';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useScore } from '../context/ScoreContext';
import { ProfileStudioModal } from '../components/ProfileStudioModal';
import { PaywallModal } from '../components/PaywallModal';
import { getMonthlySymptoms } from '../services/firebase';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const CLINICAL_INSIGHTS = [
    "Your sleep data indicates waking up frequently between 3 AM and 4 AM, which correlates with your recent logs of Night Sweats.",
    "Higher stress scores on Tuesdays tend to precede a spike in vasomotor symptoms on Wednesdays.",
    "We noticed a 15% reduction in hot flash intensity on days where you completed a mindfulness session.",
    "Your resting heart rate is slightly elevated this week, often a precursor to a phase transition."
];

const DAILY_TIPS = [
    "A 15-minute walk can help regulate your temperature today.",
    "Try incorporating flax seeds into your breakfast; they are rich in phytoestrogens.",
    "Keep your bedroom temperature between 60-67°F for optimal sleep quality.",
    "Remember to stay hydrated! Water intake helps manage joint stiffness."
];

const STAGE_CONFIG = {
    'Premenopause': {
        graphStage: 'menstruating',
        subtext: "Nurturing your body's natural cycle"
    },
    'Early Perimenopause': {
        graphStage: 'perimenopause',
        subtext: "Listening to the gentle shifts within"
    },
    'Late Perimenopause': {
        graphStage: 'perimenopause',
        subtext: "Navigating your season of growth and change"
    },
    'Menopause': {
        graphStage: 'menopause',
        subtext: "Honoring the wisdom of your journey"
    },
    'Postmenopause': {
        graphStage: 'menopause',
        subtext: "Embracing the freedom of your next chapter"
    }
};

const { width } = Dimensions.get('window');

export const DashboardScreen = ({ navigation }) => {
    // 0 = Morning, 1 = Afternoon, 2 = Evening
    const [ritualState, setRitualState] = useState(0);
    const [ringProgress, setRingProgress] = useState(0.0);
    const [healthData, setHealthData] = useState([]);
    const [monthlySymptoms, setMonthlySymptoms] = useState([]);
    const [isLoadingHealthData, setIsLoadingHealthData] = useState(true);
    const [showPaywall, setShowPaywall] = useState(false);
    const [showLegend, setShowLegend] = useState(false);
    const [showStreakInfo, setShowStreakInfo] = useState(false);

    // Insight Modals
    const [showInsightModal, setShowInsightModal] = useState(false);
    const [showTipModal, setShowTipModal] = useState(false);
    const [currentInsightIdx, setCurrentInsightIdx] = useState(0);
    const [currentTipIdx, setCurrentTipIdx] = useState(0);
    const [studioVisible, setStudioVisible] = useState(false);

    const { user, tier, upgradeTier, onboardingData, profileImage } = useUser();
    const { streak, triggerDopamine } = useScore();

    const currentStage = onboardingData?.stage || 'Late Perimenopause';
    const stageConfig = STAGE_CONFIG[currentStage] || STAGE_CONFIG['Late Perimenopause'];

    const streakScale = useRef(new Animated.Value(1)).current;
    const streakRotation = useRef(new Animated.Value(0)).current;
    const streakShake = useRef(new Animated.Value(0)).current;

    const playSuccessSound = async () => {
        try {
            // Try local asset first
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/success.mp3'),
                { shouldPlay: true }
            );
        } catch (error) {
            // Fallback to high-quality remote chime
            try {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3' },
                    { shouldPlay: true }
                );
            } catch (e) {
                console.log("Audio fallback failed", e);
            }
        }
    };

    const handleStreakPress = () => {
        if (showStreakInfo) return; // Prevent double trigger
        setShowStreakInfo(true);

        // --- Stage 1: The Pop (0-500ms) ---
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        playSuccessSound();

        Animated.parallel([
            Animated.timing(streakScale, {
                toValue: 1.8,
                duration: 200,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true
            }),
            Animated.timing(streakRotation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            })
        ]).start();

        // --- Stage 2: The Burn (500-2500ms) ---
        // Rhythmic haptics and shaking
        const hapticInterval = setInterval(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 150);

        // Jitter animation
        const jitter = Animated.loop(
            Animated.sequence([
                Animated.timing(streakShake, { toValue: 5, duration: 50, useNativeDriver: true }),
                Animated.timing(streakShake, { toValue: -5, duration: 50, useNativeDriver: true }),
            ]),
            { iterations: 20 }
        );
        jitter.start();

        // Pulses
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(streakScale, { toValue: 2.0, duration: 250, useNativeDriver: true }),
                Animated.timing(streakScale, { toValue: 1.8, duration: 250, useNativeDriver: true }),
            ]),
            { iterations: 4 }
        );
        pulse.start();

        // --- Stage 3: The Resolve (2500-3000ms) ---
        setTimeout(() => {
            clearInterval(hapticInterval);
            jitter.stop();
            pulse.stop();

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            Animated.parallel([
                Animated.timing(streakRotation, {
                    toValue: 5, // Rapid 720+ degree spin
                    duration: 500,
                    easing: Easing.out(Easing.exp),
                    useNativeDriver: true
                }),
                Animated.spring(streakScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 50,
                    useNativeDriver: true
                }),
                Animated.timing(streakShake, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                })
            ]).start(() => {
                // Reset rotation for next time
                streakRotation.setValue(0);
                // Maybe play a final high pitch chime here if sound library allows
            });
        }, 2500);
    };

    const cycleInsight = () => {
        setCurrentInsightIdx((prev) => (prev + 1) % CLINICAL_INSIGHTS.length);
    };

    const cycleTip = () => {
        setCurrentTipIdx((prev) => (prev + 1) % DAILY_TIPS.length);
    };

    useEffect(() => {
        const loadHealthData = async () => {
            const hasPermissions = await HealthKitService.requestPermissions();
            if (hasPermissions) {
                const data = await HealthKitService.fetchLatestData();
                setHealthData(data);
            }

            // Load simulated 30 day symptom tracking
            const symptoms = await getMonthlySymptoms(user?.uid || 'anonymous');
            setMonthlySymptoms(symptoms);

            setIsLoadingHealthData(false);
        }
        loadHealthData();
    }, [user]);

    const TODAYS_PLAN = [
        {
            id: 'journal',
            title: 'Daily Journal',
            cardStyle: { backgroundColor: COLORS.insightBlue, borderColor: COLORS.accentBlue, borderWidth: 2 },
            iconName: 'book',
            iconSize: 18,
            iconColor: COLORS.primary,
            iconBg: 'rgba(255,255,255,0.8)',
            onPress: () => navigation.navigate('DailyJournal'),
        },
        {
            id: 'nutrition',
            title: 'Nutrition',
            cardStyle: { backgroundColor: '#FFF5F6', borderColor: '#FFE4E8', borderWidth: 2 },
            iconName: 'nutrition-outline',
            iconSize: 18,
            iconColor: '#FF7F50',
            iconBg: 'rgba(255,255,255,0.8)',
            completed: false,
            onPress: () => navigation.navigate('NutritionActivity', { activity: { id: 'nutrition', title: 'Nutrition', color: '#FF7F50', icon: 'nutrition-outline', completed: false, description: 'Learn 3 foods that can help balance estrogen levels.' } }),
        },
        {
            id: 'mindfulness_activity',
            title: 'Mindfulness',
            cardStyle: { backgroundColor: '#F0F8FF', borderColor: '#D4E6F1', borderWidth: 2, opacity: 0.7 },
            iconName: 'leaf-outline',
            iconSize: 18,
            iconColor: '#87CEFA',
            iconBg: 'rgba(255,255,255,0.8)',
            completed: true,
            onPress: () => navigation.navigate('MindfulnessActivity', { activity: { id: 'mindfulness_activity', title: 'Mindfulness', color: '#87CEFA', icon: 'leaf-outline', completed: true, description: 'A 2-minute breathing exercise to lower cortisol.' } }),
        },
        {
            id: 'movement',
            title: 'Movement',
            cardStyle: { backgroundColor: '#E0FFFF', borderColor: '#B0E0E6', borderWidth: 2 },
            iconName: 'fitness-outline',
            iconSize: 18,
            iconColor: '#48D1CC',
            iconBg: 'rgba(255,255,255,0.8)',
            completed: false,
            onPress: () => navigation.navigate('MovementActivity', { activity: { title: 'Movement', color: '#48D1CC', icon: 'fitness-outline', completed: false, description: 'A quick 5-minute stretch routine for joint stiffness.' } }),
        },
    ];

    const renderActionCard = (item) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.actionCard, item.cardStyle]}
            onPress={item.onPress}
            activeOpacity={0.8}
        >
            <View>
                <AppText style={styles.actionCardTitle}>{item.title}</AppText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                {item.completed ? (
                    <View style={styles.completedBadgeMinimal}>
                        <Ionicons name="checkmark" size={14} color="#FFF" />
                    </View>
                ) : (
                    <View /> /* Empty spacer */
                )}
                <View style={[styles.actionCardIconWrap, { backgroundColor: item.iconBg }]}>
                    <Ionicons name={item.iconName} size={item.iconSize} color={item.iconColor} />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.accentPink, COLORS.background]}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Sticky Top Header */}
            <View style={styles.topBar}>
                {/* Streak Counter (Top Left) */}
                <Animated.View style={{
                    transform: [
                        { scale: streakScale },
                        { translateX: streakShake },
                        {
                            rotate: streakRotation.interpolate({
                                inputRange: [0, 1, 5],
                                outputRange: ['0deg', '15deg', '720deg']
                            })
                        }
                    ]
                }}>
                    <TouchableOpacity style={styles.streakBadge} onPress={handleStreakPress} activeOpacity={0.7}>
                        <AppText style={{ fontSize: 18, marginRight: 4 }}>🔥</AppText>
                        <AppText style={{ fontWeight: '800', color: '#FF7F50', fontSize: 16 }}>{streak}</AppText>
                    </TouchableOpacity>
                </Animated.View>

                {/* Profile (Top Right) */}
                <TouchableOpacity
                    style={styles.profileButtonHeader}
                    onPress={() => navigation.navigate('Preferences')}
                >
                    <Image
                        source={{ uri: profileImage }}
                        style={styles.profileImageHeader}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Phase Info Header */}
                <View style={{ marginBottom: SPACING.md }}>
                    <AppText variant="caption" style={{ color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                        Phase
                    </AppText>
                    <AppText variant="heading1" style={{ textAlign: 'left', marginBottom: 4 }}>{currentStage}</AppText>
                    <AppText style={{ textAlign: 'left', color: COLORS.textMuted }}>{stageConfig.subtext}</AppText>
                </View>

                {/* Main Status Card (Stitch Inspired) */}
                <View style={[styles.mainStatusCard, { paddingTop: SPACING.md, paddingHorizontal: SPACING.sm }]}>
                    {/* Dynamic Radial Visualizer */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[styles.circleContainer, { marginBottom: SPACING.md, marginTop: SPACING.sm, height: 280 }]}
                        onPress={() => setShowLegend(true)}
                    >
                        <DynamicRadialGraph
                            size={280}
                            lifeStage={stageConfig.graphStage}
                            progress={ringProgress}
                            symptomsData={monthlySymptoms}
                        />
                        <View style={styles.circleInner}>
                            <AppText variant="heading1" style={[styles.ringText, { fontSize: 36 }]}>78</AppText>
                            <AppText variant="caption" style={styles.stageSubtitle}>Resonance</AppText>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Interactive Insights (Top area below graph) */}
                <View style={styles.insightsHeaderRow}>
                    <TouchableOpacity
                        style={[styles.smallInsightCard, { backgroundColor: '#F0F4FF', borderColor: '#D0DCFF', borderWidth: 1 }]}
                        onPress={() => setShowInsightModal(true)}
                    >
                        <Ionicons name="sparkles" size={20} color={COLORS.primary} style={{ marginBottom: 4 }} />
                        <AppText style={styles.smallInsightHeadline}>Clinical Insight</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.smallInsightCard, { backgroundColor: '#FFF9E6', borderColor: '#FFE4B5', borderWidth: 1 }]}
                        onPress={() => setShowTipModal(true)}
                    >
                        <Ionicons name="bulb-outline" size={20} color="#FFA500" style={{ marginBottom: 4 }} />
                        <AppText style={styles.smallInsightHeadline}>Daily Tip</AppText>
                    </TouchableOpacity>
                </View>

                {/* Unified Daily Activities (Grid Layout) */}
                <View style={styles.insightsHeader}>
                    <AppText variant="heading2" style={{ fontSize: 18 }}>Daily Activities</AppText>
                </View>
                <View style={styles.todaysPlanGrid}>
                    {TODAYS_PLAN.map(item => renderActionCard(item))}
                </View>

            </ScrollView>

            {/* Sticky Bottom Navigation Bar */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Community')}>
                    <Ionicons name="chatbubbles-outline" size={24} color={COLORS.textMuted} />
                    <AppText style={styles.bottomNavText}>Forum</AppText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomNavItem} onPress={() => setShowPaywall(true)}>
                    <Ionicons name="bar-chart-outline" size={24} color={COLORS.textMuted} />
                    <AppText style={styles.bottomNavText}>Data</AppText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.fabButton}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('DailyPulse')}
                >
                    <Ionicons name="add" size={32} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Calendar')}>
                    <Ionicons name="calendar-outline" size={24} color={COLORS.textMuted} />
                    <AppText style={styles.bottomNavText}>Calendar</AppText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Quizzes')}>
                    <Ionicons name="list-outline" size={24} color={COLORS.textMuted} />
                    <AppText style={styles.bottomNavText}>Quizzes</AppText>
                </TouchableOpacity>
            </View>

            <PaywallModal
                visible={showPaywall}
                onClose={() => setShowPaywall(false)}
                onUpgrade={(newTier) => {
                    upgradeTier(newTier);
                    setShowPaywall(false);
                    navigation.navigate('HealthReport');
                }}
            />

            {/* Legend Modal */}
            <Modal visible={showLegend} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.legendModalContent}>
                        <View style={styles.legendHeader}>
                            <AppText variant="heading2" style={{ fontSize: 20 }}>Graph Legend</AppText>
                            <TouchableOpacity onPress={() => setShowLegend(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textMain} />
                            </TouchableOpacity>
                        </View>
                        <AppText style={{ marginBottom: SPACING.lg, color: COLORS.textMuted }}>
                            Tap the graph anytime to view this guide to your monthly data.
                        </AppText>

                        <View style={styles.legendItem}>
                            <View style={[styles.legendIcon, { borderColor: '#A5B4FC', borderWidth: 2, borderStyle: 'dashed' }]} />
                            <View style={{ flex: 1 }}>
                                <AppText style={styles.legendTitle}>Inner Track</AppText>
                                <AppText style={styles.legendDesc}>Your 30-day baseline timeline. Dashes represent individual days in your cycle.</AppText>
                            </View>
                        </View>

                        <View style={styles.legendItem}>
                            <View style={[styles.legendIcon, { backgroundColor: '#FFB6C1', borderColor: '#FFF', borderWidth: 1, borderRadius: 4 }]} />
                            <View style={{ flex: 1 }}>
                                <AppText style={styles.legendTitle}>Stacked Bars</AppText>
                                <AppText style={styles.legendDesc}>The daily severity of your different symptom categories (e.g. Vasomotor, Somatic). The taller the stack, the more intense the symptoms that day.</AppText>
                            </View>
                        </View>

                        <View style={styles.legendItem}>
                            <View style={[styles.legendIcon, { backgroundColor: COLORS.insightBlue, borderColor: '#FFF', borderWidth: 2, borderRadius: 12 }]} />
                            <View style={{ flex: 1 }}>
                                <AppText style={styles.legendTitle}>Outer Dots</AppText>
                                <AppText style={styles.legendDesc}>The primary or dominant symptom you experienced on a specific day.</AppText>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Streak Modal */}
            <Modal visible={showStreakInfo} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.legendModalContent}>
                        <View style={styles.legendHeader}>
                            <AppText variant="heading2" style={{ fontSize: 20 }}>Streak Focus</AppText>
                            <TouchableOpacity onPress={() => setShowStreakInfo(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textMain} />
                            </TouchableOpacity>
                        </View>
                        <AppText style={{ marginBottom: SPACING.md, color: COLORS.textMuted }}>
                            You are on a 14 day streak! By checking in daily, you are building consistent data that helps us identify your unique symptom triggers.
                        </AppText>
                        <AppText style={{ color: COLORS.textMuted }}>
                            Keep logging your symptoms and reading your educational insights to maintain your streak.
                        </AppText>
                    </View>
                </View>
            </Modal>
            {/* Insight Popups */}
            <Modal visible={showInsightModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.legendModalContent, { paddingBottom: SPACING.md }]}>
                        <View style={styles.legendHeader}>
                            <AppText variant="heading2" style={{ fontSize: 20 }}>Clinical Insight</AppText>
                            <TouchableOpacity onPress={() => setShowInsightModal(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textMain} />
                            </TouchableOpacity>
                        </View>
                        <AppText style={{ marginBottom: SPACING.xl, color: COLORS.textMuted, fontSize: 16, lineHeight: 24 }}>
                            {CLINICAL_INSIGHTS[currentInsightIdx]}
                        </AppText>
                        <TouchableOpacity style={styles.cycleButton} onPress={cycleInsight}>
                            <Ionicons name="refresh" size={18} color={COLORS.primary} />
                            <AppText style={{ color: COLORS.primary, fontWeight: '600', marginLeft: 6 }}>Next Insight</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={showTipModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.legendModalContent, { paddingBottom: SPACING.md }]}>
                        <View style={styles.legendHeader}>
                            <AppText variant="heading2" style={{ fontSize: 20 }}>Daily Tip</AppText>
                            <TouchableOpacity onPress={() => setShowTipModal(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textMain} />
                            </TouchableOpacity>
                        </View>
                        <AppText style={{ marginBottom: SPACING.xl, color: COLORS.textMuted, fontSize: 16, lineHeight: 24 }}>
                            {DAILY_TIPS[currentTipIdx]}
                        </AppText>
                        <TouchableOpacity style={styles.cycleButton} onPress={cycleTip}>
                            <Ionicons name="refresh" size={18} color={'#FFA500'} />
                            <AppText style={{ color: '#FFA500', fontWeight: '600', marginLeft: 6 }}>Next Tip</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ProfileStudioModal
                visible={studioVisible}
                onClose={() => setStudioVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flexGrow: 1,
        padding: SPACING.lg,
        paddingTop: SPACING.sm, // Reduced top padding since header is extracted
        paddingBottom: 120, // Add padding to not be obscured by bottom nav
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: 60, // Safe area roughly
        paddingBottom: SPACING.md,
        zIndex: 10,
    },
    profileButtonHeader: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: RADIUS.full,
        ...COLORS.shadowSoft,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    profileImageHeader: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    profileNameHeader: {
        marginRight: SPACING.sm,
        fontWeight: '700',
        color: COLORS.primary,
        fontSize: 16,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5EE',
        paddingHorizontal: SPACING.md,
        paddingVertical: 8,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: '#FFDAB9',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    calendarIcon: {
        padding: SPACING.xs,
        marginRight: SPACING.sm,
    },
    settingsIcon: {
        padding: SPACING.xs,
    },
    circleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.lg,
        height: 220,
    },
    circleInner: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ringText: {
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 4,
    },
    stageSubtitle: {
        color: '#757575',
    },
    mainStatusCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xxl,
        padding: SPACING.xl,
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 4,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.surfaceBorder,
    },
    phaseLabelContainer: {
        marginBottom: SPACING.sm,
    },
    phaseLabel: {
        color: COLORS.textMain,
    },
    insightsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    todaysPlanGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    actionCard: {
        width: '48%',
        height: 140,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        justifyContent: 'space-between',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: SPACING.md,
    },
    actionCardTitle: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 18,
        color: COLORS.textMain,
    },
    actionCardIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    completedBadgeMinimal: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    // Bottom Nav Styles
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingBottom: 30, // iOS home indicator padding
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderColor: COLORS.surfaceBorder,
        ...COLORS.shadowSoft,
        shadowOffset: { width: 0, height: -4 },
    },
    bottomNavItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    bottomNavText: {
        fontSize: 10,
        color: COLORS.textMuted,
        marginTop: 4,
        fontWeight: '500',
    },
    fabButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -30, // Raise the button up
        ...COLORS.shadowSoft,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    // Small Insight Cards
    insightsHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
        gap: SPACING.md,
    },
    smallInsightCard: {
        flex: 1,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
    },
    smallInsightHeadline: {
        fontWeight: '700',
        color: COLORS.textMain,
        marginTop: 4,
    },
    cycleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: RADIUS.md,
    },
    // Legend Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    legendModalContent: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        padding: SPACING.xl,
        ...COLORS.shadowSoft,
    },
    legendHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: SPACING.lg,
    },
    legendIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: SPACING.md,
        marginTop: 2,
    },
    legendWaveIcon: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
        marginTop: 2,
    },
    legendTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textMain,
        marginBottom: 2,
    },
    legendDesc: {
        fontSize: 14,
        color: COLORS.textMuted,
        lineHeight: 20,
    }
});
