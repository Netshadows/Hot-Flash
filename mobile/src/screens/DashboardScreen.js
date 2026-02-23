import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../components/Typography';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { Svg, Circle } from 'react-native-svg';
import { HealthKitService } from '../services/HealthKitService';
import { DataStreamType } from '../models/DeviceData';

const { width } = Dimensions.get('window');

export const DashboardScreen = ({ navigation }) => {
    // 0 = Morning, 1 = Afternoon, 2 = Evening
    const [ritualState, setRitualState] = useState(0);
    const [ringProgress, setRingProgress] = useState(0.0);
    const [healthData, setHealthData] = useState([]);
    const [isLoadingHealthData, setIsLoadingHealthData] = useState(true);

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

    const renderStory = (title, imageColor) => (
        <TouchableOpacity style={styles.storyContainer} activeOpacity={0.8}>
            <View style={[styles.storyRing, { borderColor: imageColor }]}>
                <View style={[styles.storyImage, { backgroundColor: imageColor }]} />
            </View>
            <AppText variant="caption" style={styles.storyTitle}>{title}</AppText>
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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.calendarIcon} onPress={() => navigation.navigate('Community')}>
                            <AppText style={{ fontSize: 24 }}>💬</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.calendarIcon, { marginLeft: SPACING.sm }]}>
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
                        onPress={() => navigation.navigate('Logging')}
                        activeOpacity={0.8}
                    >
                        <AppText variant="heading2" style={{ color: '#FFF' }}>Log Symptoms</AppText>
                    </TouchableOpacity>
                </View>

                {/* Daily Stories (Instagram Style) */}
                <View style={styles.feedHeader}>
                    <AppText variant="heading2">Daily Plan</AppText>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesWrapper} contentContainerStyle={styles.storiesContainer}>
                    {renderStory('Nutrition', '#FFB6C1')}
                    {renderStory('Mindfulness', '#87CEFA')}
                    {renderStory('Sleep', '#DDA0DD')}
                    {renderStory('Movement', '#98FB98')}
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

                {/* Clinical Report Button */}
                <TouchableOpacity
                    style={[styles.logSymptomsButton, { backgroundColor: '#FFB6C1', marginTop: SPACING.md }]}
                    onPress={() => navigation.navigate('HealthReport')}
                    activeOpacity={0.8}
                >
                    <View style={styles.logSymptomsContent}>
                        <AppText variant="heading2" style={{ color: COLORS.textMain }}>View Clinical Report</AppText>
                        <AppText variant="caption" style={{ color: COLORS.textMain }}>
                            Generate PDF for your doctor
                        </AppText>
                    </View>
                </TouchableOpacity>


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
    },
    storyContainer: {
        alignItems: 'center',
        width: 70,
    },
    storyRing: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    storyImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    storyTitle: {
        textAlign: 'center',
        color: '#4A4A4A',
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
