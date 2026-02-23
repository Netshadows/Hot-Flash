import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../components/Typography';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { Svg, Circle } from 'react-native-svg';
import { HealthKitService } from '../services/HealthKitService';
import { DataStreamType } from '../models/DeviceData';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { PaywallModal } from '../components/PaywallModal';

const { width } = Dimensions.get('window');

export const DashboardScreen = ({ navigation }) => {
    // 0 = Morning, 1 = Afternoon, 2 = Evening
    const [ritualState, setRitualState] = useState(0);
    const [ringProgress, setRingProgress] = useState(0.0);
    const [healthData, setHealthData] = useState([]);
    const [isLoadingHealthData, setIsLoadingHealthData] = useState(true);
    const [showPaywall, setShowPaywall] = useState(false);

    const { tier, upgradeTier } = useUser();

    useEffect(() => {
        const loadHealthData = async () => {
            const hasPermissions = await HealthKitService.requestPermissions();
            if (hasPermissions) {
                const data = await HealthKitService.fetchLatestData();
                setHealthData(data);
            }
            setIsLoadingHealthData(false);
        }
        loadHealthData();
    }, []);

    const DAILY_ACTIVITIES = [
        { id: '1', title: 'Nutrition', color: '#FF7F50', icon: 'nutrition-outline', completed: false, description: 'Learn 3 foods that can help balance estrogen levels.' },
        { id: '2', title: 'Mindfulness', color: '#87CEFA', icon: 'leaf-outline', completed: true, description: 'A 2-minute breathing exercise to lower cortisol.' },
        { id: '3', title: 'Check-In', color: '#DDA0DD', icon: 'clipboard-outline', completed: false, description: 'Log your symptoms to refine your clinical baseline.' },
        { id: '4', title: 'Movement', color: '#48D1CC', icon: 'fitness-outline', completed: false, description: 'A quick 5-minute stretch routine for joint stiffness.' },
    ];

    const renderStory = (activity) => (
        <TouchableOpacity
            key={activity.id}
            style={[styles.storyContainer, activity.completed && { opacity: 0.6 }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DailyActivity', { activity })}
        >
            <View style={[styles.storyRing, { borderColor: activity.color }]}>
                <View style={[styles.storyImage, { backgroundColor: activity.color }]}>
                    <Ionicons name={activity.icon} size={32} color="#FFF" />
                </View>
                {activity.completed && (
                    <View style={styles.completedBadge}>
                        <Ionicons name="checkmark" size={14} color="#FFF" />
                    </View>
                )}
            </View>
            <AppText variant="caption" style={[styles.storyTitle, activity.completed && { color: '#999' }]}>
                {activity.title}
            </AppText>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(255, 88, 100, 0.08)', 'rgba(255, 182, 193, 0.1)']}
                style={StyleSheet.absoluteFillObject}
            />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Top Bar Navigation */}
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.avatarPlaceholder}>
                        <AppText style={styles.avatarText}>J</AppText>
                    </TouchableOpacity>

                    {/* Fun Duolingo-style Streak Counter */}
                    <View style={styles.streakBadge}>
                        <AppText style={{ fontSize: 18, marginRight: 4 }}>🔥</AppText>
                        <AppText style={{ fontWeight: '800', color: '#FF7F50', fontSize: 16 }}>14</AppText>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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

                {/* Center Stage State */}
                <View style={styles.centerStageContainer}>
                    <View style={styles.stageCircle}>
                        <AppText variant="heading2" style={styles.stageTitle}>Late Perimenopause</AppText>
                        <AppText variant="caption" style={styles.stageSubtitle}>Cycle Day 14</AppText>
                    </View>
                    <TouchableOpacity
                        style={styles.logSymptomsButton}
                        onPress={() => navigation.navigate('DailyPulse')}
                        activeOpacity={0.8}
                    >
                        <AppText variant="heading2" style={{ color: '#FFF' }}>Daily Pulse</AppText>
                    </TouchableOpacity>
                </View>

                {/* Daily Stories (Instagram Style -> Interactive) */}
                <View style={styles.feedHeader}>
                    <AppText variant="heading2">Daily Plan</AppText>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesWrapper} contentContainerStyle={styles.storiesContainer}>
                    {DAILY_ACTIVITIES.map(renderStory)}
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

                {/* Clinical Report Button (Gated) */}
                <TouchableOpacity
                    style={[styles.logSymptomsButton, { backgroundColor: '#FFB6C1', marginTop: SPACING.md }]}
                    onPress={() => {
                        if (tier === 'free') {
                            setShowPaywall(true);
                        } else {
                            navigation.navigate('HealthReport');
                        }
                    }}
                    activeOpacity={0.8}
                >
                    <View style={styles.logSymptomsContent}>
                        <AppText variant="heading2" style={{ color: COLORS.textMain }}>View Clinical Report</AppText>
                        <AppText variant="caption" style={{ color: COLORS.textMain }}>
                            Generate PDF for your doctor
                        </AppText>
                    </View>
                </TouchableOpacity>

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
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFB6C1', // Simple pink avatar
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
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
    calendarIcon: {
        padding: SPACING.xs,
    },
    centerStageContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    stageCircle: {
        width: 240,
        height: 240,
        borderRadius: 120,
        backgroundColor: '#FFFFFF',
        borderWidth: 8,
        borderColor: 'rgba(255, 88, 100, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: -24, // Overlap with button
        shadowColor: 'rgba(255, 88, 100, 0.15)',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 8,
        zIndex: 1,
    },
    stageTitle: {
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 4,
    },
    stageSubtitle: {
        color: '#757575',
    },
    logSymptomsButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
        zIndex: 2,
    },
    feedHeader: {
        marginBottom: SPACING.md,
    },
    storiesWrapper: {
        marginBottom: SPACING.xl,
        marginHorizontal: -SPACING.lg, // Bleed edge-to-edge
    },
    storiesContainer: {
        paddingHorizontal: SPACING.lg,
        gap: 16,
        justifyContent: 'center',
        flexGrow: 1,
    },
    storyContainer: {
        alignItems: 'center',
        width: 76,
    },
    storyRing: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    storyImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completedBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    storyTitle: {
        textAlign: 'center',
        color: '#4A4A4A',
        fontWeight: '600',
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
