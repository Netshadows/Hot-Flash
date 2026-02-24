import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../components/Typography';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { DynamicRadialGraph } from '../components/DynamicRadialGraph';
import { HealthKitService } from '../services/HealthKitService';
import { DataStreamType } from '../models/DeviceData';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { PaywallModal } from '../components/PaywallModal';
import { getMonthlySymptoms } from '../services/firebase';

const { width } = Dimensions.get('window');

export const DashboardScreen = ({ navigation }) => {
    // 0 = Morning, 1 = Afternoon, 2 = Evening
    const [ritualState, setRitualState] = useState(0);
    const [ringProgress, setRingProgress] = useState(0.0);
    const [healthData, setHealthData] = useState([]);
    const [monthlySymptoms, setMonthlySymptoms] = useState([]);
    const [isLoadingHealthData, setIsLoadingHealthData] = useState(true);
    const [showPaywall, setShowPaywall] = useState(false);

    const { user, tier, upgradeTier } = useUser();

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
            id: 'log',
            title: 'Log your symptoms',
            cardStyle: { backgroundColor: COLORS.surface },
            iconName: 'add',
            iconSize: 20,
            iconColor: '#FFF',
            iconBg: COLORS.primary,
            onPress: () => navigation.navigate('DailyPulse'),
        },
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
            onPress: () => navigation.navigate('DailyActivity', { activity: { title: 'Nutrition', color: '#FF7F50', icon: 'nutrition-outline', completed: false, description: 'Learn 3 foods that can help balance estrogen levels.' } }),
        },
        {
            id: 'mindfulness',
            title: 'Mindfulness',
            cardStyle: { backgroundColor: '#F0F8FF', borderColor: '#D4E6F1', borderWidth: 2, opacity: 0.7 },
            iconName: 'leaf-outline',
            iconSize: 18,
            iconColor: '#87CEFA',
            iconBg: 'rgba(255,255,255,0.8)',
            completed: true,
            onPress: () => navigation.navigate('DailyActivity', { activity: { title: 'Mindfulness', color: '#87CEFA', icon: 'leaf-outline', completed: true, description: 'A 2-minute breathing exercise to lower cortisol.' } }),
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
            onPress: () => navigation.navigate('DailyActivity', { activity: { title: 'Movement', color: '#48D1CC', icon: 'fitness-outline', completed: false, description: 'A quick 5-minute stretch routine for joint stiffness.' } }),
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

            <ScrollView contentContainerStyle={styles.content}>
                {/* Top Bar Navigation */}
                <View style={styles.topBar}>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => navigation.navigate('Preferences')}
                    >
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop' }}
                            style={styles.profileImage}
                        />
                        <AppText style={styles.profileName}>{user?.firstName || user?.displayName?.split(' ')[0] || 'Jane'}</AppText>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* Fun Duolingo-style Streak Counter */}
                        <View style={[styles.streakBadge, { marginRight: SPACING.sm }]}>
                            <AppText style={{ fontSize: 18, marginRight: 4 }}>🔥</AppText>
                            <AppText style={{ fontWeight: '800', color: '#FF7F50', fontSize: 16 }}>14</AppText>
                        </View>

                        <TouchableOpacity style={styles.calendarIcon} onPress={() => navigation.navigate('Community')}>
                            <AppText style={{ fontSize: 24 }}>💬</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.calendarIcon, { marginLeft: SPACING.sm }]}
                            onPress={() => navigation.navigate('Calendar')}
                        >
                            <AppText style={{ fontSize: 24 }}>📅</AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Status Card (Stitch Inspired) */}
                <View style={[styles.mainStatusCard, { paddingTop: SPACING.md }]}>
                    {/* Dynamic Radial Visualizer */}
                    <View style={[styles.circleContainer, { marginBottom: SPACING.lg, marginTop: SPACING.sm, height: 260 }]}>
                        <DynamicRadialGraph
                            size={240}
                            lifeStage="perimenopause"
                            progress={ringProgress}
                            symptomsData={monthlySymptoms}
                        />
                        <View style={styles.circleInner}>
                            <AppText variant="heading1" style={[styles.ringText, { fontSize: 36 }]}>78</AppText>
                            <AppText variant="caption" style={styles.stageSubtitle}>Resonance</AppText>
                        </View>
                    </View>

                    <View style={styles.phaseLabelContainer}>
                        <AppText variant="caption" style={styles.phaseLabel}>Phase</AppText>
                    </View>
                    <AppText variant="heading1" style={{ textAlign: 'center', marginBottom: 4 }}>Late Menopausal Transition</AppText>
                    <AppText style={{ textAlign: 'center', color: COLORS.textMuted, marginBottom: SPACING.xs }}>Fluctuating hormone levels expected</AppText>
                </View>

                {/* Unified Today's Plan */}
                <View style={styles.insightsHeader}>
                    <AppText variant="heading2" style={{ fontSize: 18 }}>Today's Plan</AppText>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.insightsContainer}>
                    {TODAYS_PLAN.map(item => renderActionCard(item))}
                </ScrollView>

                {/* Insight Cards */}
                <View style={[styles.card, styles.insightCard]}>
                    <AppText variant="heading2" style={styles.insightHeadline}>Why you feel tired today</AppText>
                    <AppText variant="body" style={styles.insightText}>
                        Your sleep data indicates waking up frequently between 3 AM and 4 AM, which correlates with your recent logs of Night Sweats.
                    </AppText>
                    <View style={styles.insightFooter}>
                        <AppText variant="caption" style={styles.geminiTag}>AI Clinical Insight</AppText>
                    </View>
                </View>

                <View style={[styles.card, styles.insightCard]}>
                    <AppText variant="heading2" style={styles.insightHeadline}>Movement Goal</AppText>
                    <AppText variant="body" style={styles.insightText}>
                        A 15-minute walk can help regulate your temperature today.
                    </AppText>
                    <View style={styles.insightFooter}>
                        <AppText variant="caption" style={styles.geminiTag}>Daily Tip</AppText>
                    </View>
                </View>

                <View style={{ height: SPACING.md }} />

                {/* Quizzes Button */}
                <TouchableOpacity
                    style={[styles.card, { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F8FF', marginTop: SPACING.md }]}
                    onPress={() => navigation.navigate('Quizzes')}
                    activeOpacity={0.8}
                >
                    <View style={[styles.storyRing, { borderColor: '#87CEFA', marginRight: SPACING.md, marginBottom: 0 }]}>
                        <AppText style={{ fontSize: 32 }}>📋</AppText>
                    </View>
                    <View style={{ flex: 1 }}>
                        <AppText variant="heading2" style={{ color: '#2D2D2D' }}>Health Quizzes</AppText>
                        <AppText variant="caption" style={{ color: '#4A4A4A' }}>Test your knowledge and get personalized insights.</AppText>
                    </View>
                </TouchableOpacity>

            </ScrollView>

            <PaywallModal
                visible={showPaywall}
                onClose={() => setShowPaywall(false)}
                onUpgrade={(newTier) => {
                    upgradeTier(newTier);
                    setShowPaywall(false);
                    navigation.navigate('HealthReport');
                }}
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
        padding: SPACING.lg,
        paddingTop: 80,
        paddingBottom: 40,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: 4,
        paddingRight: 16,
        borderRadius: 30,
        ...COLORS.shadowSoft,
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5EE', // Light peach
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
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
    insightsContainer: {
        gap: SPACING.sm,
        paddingBottom: SPACING.lg,
    },
    actionCard: {
        width: 140,
        height: 140,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        justifyContent: 'space-between',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 2,
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
    insightCard: {
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        backgroundColor: '#FFFFFF',
    },
    insightHeadline: {
        color: '#2D2D2D',
        marginBottom: SPACING.sm,
    },
    insightText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#4A4A4A',
        marginBottom: SPACING.md,
    },
    insightFooter: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: SPACING.sm,
        marginTop: SPACING.sm,
    },
    geminiTag: {
        color: COLORS.primary,
        fontWeight: '700',
    }
});
